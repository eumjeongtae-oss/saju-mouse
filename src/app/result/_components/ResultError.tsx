import { Mascot } from '@/components/Mascot';
import * as styles from '../page.css';

interface Props {
  onRestart: () => void;
}

export function ResultError({ onRestart }: Props) {
  return (
    <div className={styles.loadingContainer}>
      <Mascot pose="wealth" size={150} />
      <div className={styles.errorBox}>
        앗! 명식을 풀다가 돋보기가 깨졌어요<br />
        네트워크 기운이 원활하지 않아요 찍.<br />
        <span className={styles.errorBoxNote}>(다시 시도해 보세요)</span>
      </div>
      <button className={styles.restartButton} onClick={onRestart}>
        다시 운세 보러 가기
      </button>
    </div>
  );
}
