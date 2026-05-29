'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFortuneStore } from '@/stores/fortuneStore';
import { useSajuMutation } from '@/hooks/mutations/useSajuMutation';
import { useResultActions } from './_hooks/useResultActions';
import { Mascot } from '@/components/Mascot';
import { AdBanner } from '@/components/AdBanner';
import { ResultLoading } from './_components/ResultLoading';
import { ResultError } from './_components/ResultError';
import { ResultExtras } from './_components/ResultExtras';
import type { SajuChart } from '@/types/api';
import { getFallbackSajuChart } from '@/utils/saju';
import { decodeResultParams } from '@/utils/resultParams';
import * as styles from './page.css';

const PILLAR_KEYS = [
  { key: 'yearPillar' as const, label: '년주', name: '년' },
  { key: 'monthPillar' as const, label: '월주', name: '월' },
  { key: 'dayPillar' as const, label: '일주', name: '일' },
  { key: 'hourPillar' as const, label: '시주', name: '시' },
] as const;

function ResultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedTheme, sajuInput, partnerInput, setTheme, setSajuInput, setPartnerInput, reset } = useFortuneStore();
  const { mutate, data, isPending, isError } = useSajuMutation();
  const {
    showToast,
    showCoffeeToast,
    isCapturing,
    captureRef,
    handleCopyLink,
    handleKakaoShare,
    handleCapture,
    handleCopyCoffeeAccount,
  } = useResultActions();

  const initialThemeRef = useRef(selectedTheme);
  const initialInputRef = useRef(sajuInput);
  const initialPartnerInputRef = useRef(partnerInput);

  useEffect(() => {
    const theme = initialThemeRef.current;
    const input = initialInputRef.current;
    const pInput = initialPartnerInputRef.current;

    if (theme && input) {
      mutate({ theme, input, partnerInput: pInput || undefined });
      return;
    }

    const decoded = decodeResultParams(searchParams);
    if (!decoded) {
      router.replace('/');
      return;
    }

    setTheme(decoded.theme);
    setSajuInput(decoded.input);
    if (decoded.partnerInput) {
      setPartnerInput(decoded.partnerInput);
    }
    mutate({ theme: decoded.theme, input: decoded.input, partnerInput: decoded.partnerInput });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestart = () => {
    reset();
    router.push('/');
  };

  if (isPending) return <ResultLoading />;
  if (isError) return <ResultError onRestart={handleRestart} />;
  if (!sajuInput) return null;

  const chart: SajuChart =
    data?.chart ??
    getFallbackSajuChart(sajuInput.birthYear, sajuInput.birthMonth, sajuInput.birthDay, sajuInput.birthHour);

  return (
    <div className={styles.resultContainer} ref={captureRef}>
      {/* 상단 타이틀 & 마스코트 */}
      <div className={styles.resultHeader}>
        <Mascot pose={selectedTheme ?? 'general'} size={130} />
        <h2 className={styles.resultTitle}>찍쥐가 밝혀낸 운세 처방전 📜</h2>
      </div>

      {/* 만세력 사주팔자 4주 */}
      <div className={styles.pillarsGrid}>
        {PILLAR_KEYS.map((item) => {
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

      {/* 한줄 요약 말풍선 */}
      <div className={styles.summaryBubble}>
        📢 한줄 요약
        <span className={styles.summaryHighlight}>
          &ldquo;{data?.summary || '올해는 뜻밖의 횡재수와 치즈가 굴러들어오는 대운의 해예요'}&rdquo;
        </span>
      </div>

      {/* 핵심 기질 키워드 칩 */}
      {data?.keywords && data.keywords.length > 0 && (
        <div className={styles.keywordsRow}>
          {data.keywords.map((kw, i) => (
            <span key={i} className={styles.keywordChip}>#{kw}</span>
          ))}
        </div>
      )}

      {/* SNS 공유 */}
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
        <button className={styles.captureButton} onClick={handleCapture} disabled={isCapturing}>
          {isCapturing ? '📸 캡처 중...' : '📸 결과 이미지로 저장'}
        </button>
      </div>

      {/* 상세 풀이 */}
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
          <p className={styles.sectionContent}>
            {data?.detail ||
              `태어나신 날의 하늘과 땅 기운을 분석해 보니 대단히 매력적인 천궁의 수호가 깃들어 있어요.\n\n특히 일주와 년주의 균형이 뛰어나서 어려운 상황이 와도 쥐구멍을 파헤쳐 결국 기회를 잡아내는 영리함이 돋보입니다.\n\n올해는 준비하신 씨앗들이 황금 벼 이삭으로 거듭나 곳간에 쌓이는 흐름이니 너무 조급해하지 마시고 하루하루 즐겁게 치즈를 맛보듯 나아가세요`}
          </p>
        )}
      </div>

      {/* 테마별 extras */}
      {data?.extras && selectedTheme && (
        <ResultExtras theme={selectedTheme} extras={data.extras} />
      )}

      {/* 행운 처방전 */}
      <div className={styles.luckyContainer}>
        <h3 className={styles.luckyTitle}>🍀 찍쥐의 행운 비책 아이템</h3>
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

      {/* 커피 후원 */}
      <div className={styles.coffeeSection}>
        <p className={styles.coffeeTitle}>☕ 찍쥐에게 커피 한 잔 사줄래요?</p>
        <p className={styles.coffeeDesc}>
          무료로 운세를 즐기셨다면, 개발자에게 커피 한 잔 후원해 주세요 🙏<br />
          찍쥐가 더 열심히 명식을 파헤칠게요!
        </p>
        <div className={styles.coffeeAccountRow}>
          <span className={styles.coffeeBank}>케이뱅크</span>
          <span className={styles.coffeeAccountText}>100206753204</span>
          <button className={styles.coffeeCopyButton} onClick={handleCopyCoffeeAccount}>
            복사
          </button>
        </div>
      </div>

      {/* 배너 광고 영역 */}
      <div className={styles.adBanner}>
        <span className={styles.adLabel}>AD</span>
        <AdBanner />
      </div>

      {/* 다시 운세 보기 */}
      <button className={styles.restartButton} onClick={handleRestart}>
        🔄 다른 운세도 보러 가기
      </button>

      {showToast && <div className={styles.toast}>📋 클립보드에 주소가 복사되었어요 🐭</div>}
      {showCoffeeToast && <div className={styles.toast}>☕ 계좌번호가 복사되었어요! 감사해요 🐭</div>}
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
