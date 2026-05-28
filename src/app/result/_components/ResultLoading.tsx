import { Mascot } from '@/components/Mascot';
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
        <span className={styles.adEmoji}>🐹🧀</span>
        <span className={styles.adText}>찍쥐에게 치즈를 후원하는 광고 협찬 영역이에요</span>
        <span className={styles.adNote}>(실제 구글 애드센스 Google AdSense 가 렌더링될 영역)</span>
      </div>
    </div>
  );
}
