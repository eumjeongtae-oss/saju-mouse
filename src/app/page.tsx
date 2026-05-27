'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFortuneStore } from '@/stores/fortuneStore';
import { Mascot, MascotPose } from '@/components/Mascot';
import { FortuneTheme } from '@/types/api';
import { getGanzhiYear } from '@/utils/format';
import * as styles from './page.css';

interface ThemeCardData {
  id: FortuneTheme;
  pose: MascotPose;
  emoji: string;
  title: string;
  description: string;
  styleClass: string;
}

export default function HomePage() {
  const router = useRouter();
  const { setTheme } = useFortuneStore();
  const [activePose, setActivePose] = useState<MascotPose>('idle');

  const currentYear = new Date().getFullYear();
  const ganzhiYear = getGanzhiYear(currentYear);

  // 운세 테마 카드 정보 데이터 정의
  const cards: ThemeCardData[] = [
    {
      id: 'general',
      pose: 'general',
      emoji: '🔮',
      title: '종합 사주',
      description: '내 타고난 운명의 지도와 성향 완벽 분석',
      styleClass: styles.cardGeneral,
    },
    {
      id: 'yearly',
      pose: 'yearly',
      emoji: '🌅',
      title: '올해 운세',
      description: `${currentYear}년 ${ganzhiYear}의 특별한 비법`,
      styleClass: styles.cardYearly,
    },
    {
      id: 'wealth',
      pose: 'wealth',
      emoji: '🪙',
      title: '재물 · 직장운',
      description: '커리어 성공과 황금 동전이 쏟아지는 기운',
      styleClass: styles.cardWealth,
    },
    {
      id: 'love',
      pose: 'love',
      emoji: '💖',
      title: '연애 · 대인관계',
      description: '내 인연의 타이밍과 관계 해결법',
      styleClass: styles.cardLove,
    },
  ];

  // 포즈별 하찮은 말풍선 대사 정의
  const getSpeechText = (pose: MascotPose): React.ReactNode => {
    switch (pose) {
      case 'general':
        return (
          <>
            평생 명식을 돋보기로 다 뜯어볼게요 <br />
            <span className={styles.speechBubbleHighlight}>종합 사주</span> 풀 준비 완료
          </>
        );
      case 'yearly':
        return (
          <>
            {currentYear}년 운세를 다 쥐어짜드릴게요 <br />
            <span className={styles.speechBubbleHighlight}>올해 운세</span> 확인하러 가요
          </>
        );
      case 'wealth':
        return (
          <>
            부자 쥐의 기운을 가득 담아 팍팍!<br />
            <span className={styles.speechBubbleHighlight}>재물·직장운</span> 대박 내봐요
          </>
        );
      case 'love':
        return (
          <>
            양 볼이 발개지도록 설레는 기운 <br />
            <span className={styles.speechBubbleHighlight}>연애·대인관계</span>의 신비
          </>
        );
      case 'idle':
      default:
        return (
          <>
            안녕하세요! 저는 사주를 공부한 <span className={styles.speechBubbleHighlight}>찍쥐</span>예요 <br />
            오늘의 운세 테마를 선택해 주세요
          </>
        );
    }
  };

  const handleCardClick = (theme: FortuneTheme) => {
    setTheme(theme);
    router.push('/input');
  };

  return (
    <div className={styles.mainSection}>
      {/* 찍쥐 캐릭터 & 말풍선 메인 쇼케이스 */}
      <div className={styles.showcase}>
        {/* 하찮은 말풍선 */}
        <div className={styles.speechBubble}>
          {getSpeechText(activePose)}
        </div>

        {/* 역동적인 찍쥐 SVG 마스코트 */}
        <Mascot pose={activePose} size={160} />
      </div>

      {/* 운세 테마 선택 카드 그리드 */}
      <div className={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.card} ${card.styleClass}`}
            onMouseEnter={() => setActivePose(card.pose)}
            onMouseLeave={() => setActivePose('idle')}
            onClick={() => handleCardClick(card.id)}
          >
            <div className={styles.cardIcon}>{card.emoji}</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.description}</p>
            </div>
            {/* <div className={styles.cardArrow}>→</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
