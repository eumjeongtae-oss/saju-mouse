'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFortuneStore } from '@/stores/fortuneStore';
import { useSajuMutation } from '@/hooks/mutations/useSajuMutation';
import { Mascot } from '@/components/Mascot';
import { SajuChart } from '@/types/api';
import { decodeResultParams } from '@/utils/resultParams';
import * as styles from './page.css';

// 프로젝트 정식 타입 SajuChart와 100% 부합하는 Fallback 계산 헬퍼 함수
const getFallbackSajuChart = (
  year: number,
  month: number,
  day: number,
  hour: number | null
): SajuChart => {
  // 천간 10간
  const heaven = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  // 지지 12지
  const earth = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  const yIndexH = (year - 4) % 10;
  const yIndexE = (year - 4) % 12;
  const mIndexH = (month + 2) % 10;
  const mIndexE = (month + 10) % 12;
  const dIndexH = (day + 7) % 10;
  const dIndexE = (day + 4) % 12;
  const hIndexH = hour !== null ? (hour + 1) % 10 : 4;
  const hIndexE = hour !== null ? Math.floor((hour + 1) / 2) % 12 : 0;

  return {
    yearPillar: {
      stem: heaven[yIndexH >= 0 ? yIndexH : 0],
      branch: earth[yIndexE >= 0 ? yIndexE : 0],
    },
    monthPillar: {
      stem: heaven[mIndexH >= 0 ? mIndexH : 0],
      branch: earth[mIndexE >= 0 ? mIndexE : 0],
    },
    dayPillar: {
      stem: heaven[dIndexH >= 0 ? dIndexH : 0],
      branch: earth[dIndexE >= 0 ? dIndexE : 0],
    },
    hourPillar:
      hour !== null
        ? {
          stem: heaven[hIndexH >= 0 ? hIndexH : 0],
          branch: earth[hIndexE >= 0 ? hIndexE : 0],
        }
        : null,
  };
};

function ResultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedTheme, sajuInput, setTheme, setSajuInput, reset } = useFortuneStore();
  const { mutate, data, isPending, isError } = useSajuMutation();

  const [showToast, setShowToast] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const captureRef = useRef<HTMLDivElement>(null);

  // 마운트 시 한 번만 실행: Zustand 스토어 우선, 없으면 URL 파라미터에서 복원
  const initialThemeRef = useRef(selectedTheme);
  const initialInputRef = useRef(sajuInput);

  useEffect(() => {
    const theme = initialThemeRef.current;
    const input = initialInputRef.current;

    if (theme && input) {
      mutate({ theme, input });
      return;
    }

    // 새로고침 또는 공유 링크 진입: URL 파라미터에서 복원
    const decoded = decodeResultParams(searchParams);
    if (!decoded) {
      router.replace('/');
      return;
    }

    setTheme(decoded.theme);
    setSajuInput(decoded.input);
    mutate({ theme: decoded.theme, input: decoded.input });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 링크 복사하기 핸들러
  const handleCopyLink = () => {
    const url = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  // 카카오톡 공유하기 핸들러
  const handleKakaoShare = async () => {
    if (typeof window === 'undefined') return;

    if (!window.Kakao) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'; // 최신 v2 SDK 적용
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Kakao SDK 로드 실패'));
        document.head.appendChild(script);
      }).catch(() => {
        alert('카카오톡 SDK 로드에 실패했어요. 잠시 후 다시 시도해 보세요.');
        return;
      });
    }

    if (!window.Kakao) return;

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? '');
    }

    const siteUrl = window.location.origin;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '찍쥐 - AI 사주 운세',
        description: '찍쥐가 당신의 사주팔자와 운세를 명쾌하게 풀어드려요!',
        // 로컬 환경에서는 카카오 서버가 접근할 수 없으므로 기본 로고 노출, 실서버에서는 og-image 사용
        imageUrl: siteUrl.includes('localhost')
          ? 'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png'
          : `${siteUrl}/og-image.png`,
        link: {
          mobileWebUrl: siteUrl,
          webUrl: siteUrl,
        },
      },
      buttons: [
        {
          title: '운세 보러 가기',
          link: {
            mobileWebUrl: siteUrl,
            webUrl: siteUrl,
          },
        },
      ],
    });
  };

  // 화면 캡처 핸들러
  const handleCapture = async () => {
    if (!captureRef.current) return;
    setIsCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#F9FAFB',
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      });
      const link = document.createElement('a');
      link.download = '찍쥐-사주풀이.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRestart = () => {
    reset();
    router.push('/');
  };

  // 1. 분석 중 로딩 화면
  if (isPending) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingMascotWrapper}>
          <Mascot pose="general" size={150} />
          <span className={styles.sweat}>💦</span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2.5px solid #1F2937',
            borderRadius: '16px',
            padding: '16px 20px',
            fontSize: '13px',
            fontWeight: 800,
            boxShadow: '4px 4px 0px #1F2937',
            lineHeight: '1.5',
            maxWidth: '90%',
          }}
        >
          🔍 찍쥐가 돋보기로 생년월일 명식을<br />
          열심히 대조하며 땀 흘려 해독하고 있어요<br />
          <span style={{ color: '#7C3AED' }}>인생의 비결</span>이 곧 도출됩니다
        </div>

        <div className={styles.loadingText}>
          천간 지지의 기운을 쥐어짜는 중...<br />
          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>평균 5~10초 정도 소요됩니다</span>
        </div>

        <div className={styles.adBanner}>
          <span className={styles.adLabel}>AD</span>
          <span style={{ fontSize: '24px', marginBottom: '4px' }}>🐹🧀</span>
          <span className={styles.adText}>찍쥐에게 치즈를 후원하는 광고 협찬 영역이에요</span>
          <span style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '2px' }}>
            (실제 구글 애드센스 Google AdSense 가 렌더링될 영역)
          </span>
        </div>
      </div>
    );
  }

  // 2. 오류 발생 시 예외 처리
  if (isError) {
    return (
      <div className={styles.loadingContainer}>
        <Mascot pose="wealth" size={150} />
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '2.5px solid #1F2937',
            borderRadius: '16px',
            padding: '20px',
            color: '#DC2626',
            fontWeight: 800,
            boxShadow: '4px 4px 0px #1F2937',
            maxWidth: '90%',
          }}
        >
          앗! 명식을 풀다가 돋보기가 깨졌어요<br />
          네트워크 기운이 원활하지 않아요 찍.<br />
          <span style={{ fontSize: '12px', display: 'block', marginTop: '8px', color: '#6B7280' }}>
            (다시 시도해 보세요)
          </span>
        </div>
        <button className={styles.restartButton} onClick={handleRestart}>
          다시 운세 보러 가기
        </button>
      </div>
    );
  }

  // sajuInput이 null이 아님을 확실하게 타입 좁히기
  if (!sajuInput) return null;

  const chart: SajuChart =
    data?.chart ||
    getFallbackSajuChart(
      sajuInput.birthYear,
      sajuInput.birthMonth,
      sajuInput.birthDay,
      sajuInput.birthHour
    );

  const pillarKeys = [
    { key: 'yearPillar' as const, label: '년주', name: '년' },
    { key: 'monthPillar' as const, label: '월주', name: '월' },
    { key: 'dayPillar' as const, label: '일주', name: '일' },
    { key: 'hourPillar' as const, label: '시주', name: '시' },
  ];

  return (
    <div className={styles.resultContainer} ref={captureRef}>
      {/* 1. 상단 타이틀 & 쥐 마스코트 */}
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <Mascot
          pose={
            selectedTheme === 'general'
              ? 'general'
              : selectedTheme === 'yearly'
                ? 'yearly'
                : selectedTheme === 'wealth'
                  ? 'wealth'
                  : 'love'
          }
          size={130}
        />
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 900,
            color: '#1F2937',
            marginTop: '12px',
          }}
        >
          찍쥐가 밝혀낸 운세 처방전 📜
        </h2>
      </div>

      {/* 2. 만세력 사주팔자 4주 한자 칩 */}
      <div className={styles.pillarsGrid}>
        {pillarKeys.map((item) => {
          const pillar = chart[item.key];
          return (
            <div key={item.key} className={styles.pillarCard}>
              <span className={styles.pillarLabel}>{item.label}</span>
              <div className={styles.kanjiBlock}>
                <span className={styles.kanjiCheon}>{pillar?.stem || '—'}</span>
                <span className={styles.kanjiJi}>{pillar?.branch || '—'}</span>
              </div>
              <span className={styles.pillarKo}>{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* 3. 대형 한줄 요약 말풍선 */}
      <div className={styles.summaryBubble}>
        📢 한줄 요약 <br />
        <span style={{ color: '#7C3AED', display: 'block', marginTop: '6px' }}>
          "{data?.summary || '올해는 뜻밖의 횡재수와 치즈가 굴러들어오는 대운의 해예요'}"
        </span>
      </div>

      {/* 3-1. 핵심 기질 키워드 칩 */}
      {data?.keywords && data.keywords.length > 0 && (
        <div className={styles.keywordsRow}>
          {data.keywords.map((kw, i) => (
            <span key={i} className={styles.keywordChip}>#{kw}</span>
          ))}
        </div>
      )}

      {/* 4. 구글 배너 광고 영역 */}
      <div className={styles.adBanner}>
        <span className={styles.adLabel}>AD</span>
        <span style={{ fontSize: '24px', marginBottom: '4px' }}>🐹🧀</span>
        <span className={styles.adText}>찍쥐에게 치즈를 후원하는 광고 협찬 영역이에요</span>
        <span style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '2px' }}>
          (여기에 애드센스 인피드/디스플레이 배너를 탑재할 수 있어요 찍)
        </span>
      </div>

      {/* 5. 상세 사주 풀이 텍스트 박스 */}
      <div className={styles.detailBox}>
        <h3 className={styles.detailTitle}>📖 찍쥐의 상세 풀이 서신</h3>
        {data?.sections && data.sections.length > 0 ? (
          <div className={styles.sectionsWrapper}>
            {data.sections.map((sec, idx) => (
              <div key={idx} className={styles.sectionBlock}>
                <h4 className={styles.sectionTitle}>{sec.title}</h4>
                <p className={styles.sectionContent}>{sec.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#4B5563', fontSize: '13px', fontWeight: 500, whiteSpace: 'pre-wrap' }}>
            {data?.detail ||
              `태어나신 날의 하늘과 땅 기운을 분석해 보니 대단히 매력적인 천궁의 수호가 깃들어 있어요.

특히 일주와 년주의 균형이 뛰어나서 어려운 상황이 와도 쥐구멍을 파헤쳐 결국 기회를 잡아내는 영리함이 돋보입니다.

올해는 준비하신 씨앗들이 황금 벼 이삭으로 거듭나 곳간에 쌓이는 흐름이니 너무 조급해하지 마시고 하루하루 즐겁게 치즈를 맛보듯 나아가세요`}
          </p>
        )}
      </div>

      {/* 6. 테마별 핵심 요약 카드 (extras) */}
      {data?.extras && (
        <div className={styles.extrasContainer}>
          <h3 className={styles.extrasTitle}>
            {selectedTheme === 'general' && '🔮 나에게 딱 맞는 것들'}
            {selectedTheme === 'yearly' && '📅 이달의 주목 포인트'}
            {selectedTheme === 'wealth' && '💎 재물 핵심 요약'}
            {selectedTheme === 'love' && '💝 연애 핵심 요약'}
          </h3>

          {selectedTheme === 'general' && (
            <>
              {data.extras.birthElement && (
                <div>
                  <div className={styles.extrasInfoLabel}>✨ 타고난 일간 기운</div>
                  <div className={styles.extrasInfoValue}>{data.extras.birthElement}</div>
                </div>
              )}
              {data.extras.careers && data.extras.careers.length > 0 && (
                <div>
                  <div className={styles.extrasInfoLabel}>💼 천직 직업 TOP 3</div>
                  <div className={styles.careerCardsGrid}>
                    {data.extras.careers.map((c, i) => (
                      <div key={i} className={styles.careerCard}>
                        <span className={styles.careerCardName}>{c.name}</span>
                        <span className={styles.careerCardReason}>{c.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(data.extras.compatibleType || data.extras.incompatibleType) && (
                <div className={styles.traitsRow}>
                  {data.extras.compatibleType && (
                    <div className={styles.traitsBlock}>
                      <div className={styles.traitsBlockTitle}>✅ 잘 맞는 사람</div>
                      <div className={styles.traitItem}>{data.extras.compatibleType}</div>
                    </div>
                  )}
                  {data.extras.incompatibleType && (
                    <div className={styles.traitsBlock}>
                      <div className={styles.traitsBlockTitle}>❌ 피해야 할 사람</div>
                      <div className={styles.traitItem}>{data.extras.incompatibleType}</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {selectedTheme === 'yearly' && (
            <>
              {(data.extras.bestMonth || data.extras.worstMonth) && (
                <div className={styles.monthHighlightRow}>
                  <div className={styles.monthHighlightBest}>
                    <span className={styles.monthHighlightLabel}>🍀 행운의 달</span>
                    <span className={styles.monthHighlightValue}>{data.extras.bestMonth ?? '—'}</span>
                  </div>
                  <div className={styles.monthHighlightWorst}>
                    <span className={styles.monthHighlightLabel}>⚠️ 조심할 달</span>
                    <span className={styles.monthHighlightValue}>{data.extras.worstMonth ?? '—'}</span>
                  </div>
                </div>
              )}
              {data.extras.keyAction && (
                <div>
                  <div className={styles.extrasInfoLabel}>🎯 핵심 행동 지침</div>
                  <div className={styles.extrasInfoValue}>{data.extras.keyAction}</div>
                </div>
              )}
            </>
          )}

          {selectedTheme === 'wealth' && (
            <>
              {data.extras.moneyType && (
                <div>
                  <div className={styles.extrasInfoLabel}>💰 나의 재물 유형</div>
                  <div className={styles.extrasInfoValue}>{data.extras.moneyType}</div>
                </div>
              )}
              {data.extras.topFields && data.extras.topFields.length > 0 && (
                <div>
                  <div className={styles.extrasInfoLabel}>🏆 추천 직업 · 부업 분야</div>
                  <div className={styles.wealthFieldsRow}>
                    {data.extras.topFields.map((f, i) => (
                      <span key={i} className={styles.wealthFieldBadge}>{f}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.extras.warningHabit && (
                <div>
                  <div className={styles.extrasInfoLabel}>⚠️ 돈 새는 패턴</div>
                  <div className={styles.extrasInfoValue}>{data.extras.warningHabit}</div>
                </div>
              )}
            </>
          )}

          {selectedTheme === 'love' && (
            <>
              {data.extras.loveStyle && (
                <div>
                  <div className={styles.extrasInfoLabel}>💘 나의 연애 스타일</div>
                  <div className={styles.extrasInfoValue}>{data.extras.loveStyle}</div>
                </div>
              )}
              {(data.extras.compatibleTraits || data.extras.incompatibleTraits) && (
                <div className={styles.traitsRow}>
                  {data.extras.compatibleTraits && (
                    <div className={styles.traitsBlock}>
                      <div className={styles.traitsBlockTitle}>✅ 잘 맞는 이성</div>
                      {data.extras.compatibleTraits.map((t, i) => (
                        <div key={i} className={styles.traitItem}>{t}</div>
                      ))}
                    </div>
                  )}
                  {data.extras.incompatibleTraits && (
                    <div className={styles.traitsBlock}>
                      <div className={styles.traitsBlockTitle}>❌ 피해야 할 이성</div>
                      {data.extras.incompatibleTraits.map((t, i) => (
                        <div key={i} className={styles.traitItem}>{t}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {data.extras.bestPeriod && (
                <div>
                  <div className={styles.extrasInfoLabel}>📅 인연이 찾아오는 시기</div>
                  <div className={styles.extrasInfoValue}>{data.extras.bestPeriod}</div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 7. 행운의 처방전 영역 */}
      <div className={styles.luckyContainer}>
        <h3
          style={{
            fontSize: '13px',
            fontWeight: 900,
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            margin: '0',
          }}
        >
          🍀 찍쥐의 행운 비책 아이템
        </h3>

        <div className={styles.luckyRow}>
          <div className={styles.luckyItem}>
            <span className={styles.luckyLabel}>행운의 컬러</span>
            <span className={styles.luckyValue}>{data?.extras?.luckyColor ?? '보라색 (Purple) 💜'}</span>
          </div>
          <div className={styles.luckyItem}>
            <span className={styles.luckyLabel}>행운의 아이템</span>
            <span className={styles.luckyValue}>{data?.extras?.luckyItem ?? '노란 스위스 에멘탈 치즈 🧀'}</span>
          </div>
        </div>
      </div>

      {/* 8. SNS 카카오톡 및 링크 공유하기 */}
      <div className={styles.shareSection}>
        <h4 className={styles.shareTitle}>📢 이 좋은 운세를 친구들에게 널리 공유해 보세요</h4>
        <div className={styles.shareButtonGroup}>
          <button className={styles.shareKakao} onClick={handleKakaoShare}>
            💛 카카오톡 공유
          </button>
          <button className={styles.shareLink} onClick={handleCopyLink}>
            🔗 링크 주소 복사
          </button>
        </div>
        <button
          className={styles.captureButton}
          onClick={handleCapture}
          disabled={isCapturing}
        >
          {isCapturing ? '📸 캡처 중...' : '📸 결과 이미지로 저장'}
        </button>
      </div>

      {/* 9. 다시 운세 보기 버튼 */}
      <button className={styles.restartButton} onClick={handleRestart}>
        🔄 다른 운세도 보러 가기
      </button>

      {/* 클립보드 복사 성공 시 애니메이션 토스트 */}
      {showToast && (
        <div className={styles.toast}>
          📋 클립보드에 주소가 복사되었어요 🐭
        </div>
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultPageContent />
    </Suspense>
  );
}
