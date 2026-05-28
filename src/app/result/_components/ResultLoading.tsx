import { Mascot } from '@/components/Mascot';
import { AdBanner } from '@/components/AdBanner';
import * as styles from '../page.css';

export function ResultLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingMascotWrapper}>
        <Mascot pose="general" size={150} />
        <span className={styles.sweat}>💦</span>
      </div>

      <div className={styles.loadingSpeechBubble}>
        🔍 찍쥐가 돋보기로 생년월일 명식을<br />
        열심히 대조하며 땀 흘려 해독하고 있어요<br />
        <span className={styles.loadingSpeechHighlight}>인생의 비결</span>이 곧 도출됩니다
      </div>

      <div className={styles.loadingText}>
        천간 지지의 기운을 쥐어짜는 중...<br />
        <span className={styles.loadingSubText}>평균 5~10초 정도 소요됩니다</span>
      </div>

      <div className={styles.adBanner}>
        <span className={styles.adLabel}>AD</span>
        <AdBanner />
      </div>
    </div>
  );
}
