import type { FortuneTheme, SajuReadingExtras } from '@/types/api';
import * as styles from '../page.css';

interface Props {
  theme: FortuneTheme;
  extras: SajuReadingExtras;
}

const EXTRAS_TITLE: Record<FortuneTheme, string> = {
  general: '🔮 나에게 딱 맞는 것들',
  yearly: '📅 이달의 주목 포인트',
  wealth: '💎 재물 핵심 요약',
  love: '💝 연애 핵심 요약',
  compatibility: '💞 두 사람의 궁합 요약',
};

export function ResultExtras({ theme, extras }: Props) {
  return (
    <div className={styles.extrasContainer}>
      <h3 className={styles.extrasTitle}>{EXTRAS_TITLE[theme]}</h3>

      {theme === 'general' && (
        <>
          {extras.birthElement && (
            <div>
              <div className={styles.extrasInfoLabel}>✨ 타고난 일간 기운</div>
              <div className={styles.extrasInfoValue}>{extras.birthElement}</div>
            </div>
          )}
          {extras.careers && extras.careers.length > 0 && (
            <div>
              <div className={styles.extrasInfoLabel}>💼 천직 직업 TOP 3</div>
              <div className={styles.careerCardsGrid}>
                {extras.careers.map((c, i) => (
                  <div key={i} className={styles.careerCard}>
                    <span className={styles.careerCardName}>{c.name}</span>
                    <span className={styles.careerCardReason}>{c.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(extras.compatibleType || extras.incompatibleType) && (
            <div className={styles.traitsRow}>
              {extras.compatibleType && (
                <div className={styles.traitsBlock}>
                  <div className={styles.traitsBlockTitle}>✅ 잘 맞는 사람</div>
                  <div className={styles.traitItem}>{extras.compatibleType}</div>
                </div>
              )}
              {extras.incompatibleType && (
                <div className={styles.traitsBlock}>
                  <div className={styles.traitsBlockTitle}>❌ 피해야 할 사람</div>
                  <div className={styles.traitItem}>{extras.incompatibleType}</div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {theme === 'yearly' && (
        <>
          {(extras.bestMonth || extras.worstMonth) && (
            <div className={styles.monthHighlightRow}>
              <div className={styles.monthHighlightBest}>
                <span className={styles.monthHighlightLabel}>🍀 행운의 달</span>
                <span className={styles.monthHighlightValue}>{extras.bestMonth ?? '—'}</span>
              </div>
              <div className={styles.monthHighlightWorst}>
                <span className={styles.monthHighlightLabel}>⚠️ 조심할 달</span>
                <span className={styles.monthHighlightValue}>{extras.worstMonth ?? '—'}</span>
              </div>
            </div>
          )}
          {extras.keyAction && (
            <div>
              <div className={styles.extrasInfoLabel}>🎯 핵심 행동 지침</div>
              <div className={styles.extrasInfoValue}>{extras.keyAction}</div>
            </div>
          )}
        </>
      )}

      {theme === 'wealth' && (
        <>
          {extras.moneyType && (
            <div>
              <div className={styles.extrasInfoLabel}>💰 나의 재물 유형</div>
              <div className={styles.extrasInfoValue}>{extras.moneyType}</div>
            </div>
          )}
          {extras.topFields && extras.topFields.length > 0 && (
            <div>
              <div className={styles.extrasInfoLabel}>🏆 추천 직업 · 부업 분야</div>
              <div className={styles.wealthFieldsRow}>
                {extras.topFields.map((f, i) => (
                  <span key={i} className={styles.wealthFieldBadge}>{f}</span>
                ))}
              </div>
            </div>
          )}
          {extras.warningHabit && (
            <div>
              <div className={styles.extrasInfoLabel}>⚠️ 돈 새는 패턴</div>
              <div className={styles.extrasInfoValue}>{extras.warningHabit}</div>
            </div>
          )}
        </>
      )}

      {theme === 'love' && (
        <>
          {extras.loveStyle && (
            <div>
              <div className={styles.extrasInfoLabel}>💘 나의 연애 스타일</div>
              <div className={styles.extrasInfoValue}>{extras.loveStyle}</div>
            </div>
          )}
          {(extras.compatibleTraits || extras.incompatibleTraits) && (
            <div className={styles.traitsRow}>
              {extras.compatibleTraits && (
                <div className={styles.traitsBlock}>
                  <div className={styles.traitsBlockTitle}>✅ 잘 맞는 이성</div>
                  {extras.compatibleTraits.map((t, i) => (
                    <div key={i} className={styles.traitItem}>{t}</div>
                  ))}
                </div>
              )}
              {extras.incompatibleTraits && (
                <div className={styles.traitsBlock}>
                  <div className={styles.traitsBlockTitle}>❌ 피해야 할 이성</div>
                  {extras.incompatibleTraits.map((t, i) => (
                    <div key={i} className={styles.traitItem}>{t}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          {extras.bestPeriod && (
            <div>
              <div className={styles.extrasInfoLabel}>📅 인연이 찾아오는 시기</div>
              <div className={styles.extrasInfoValue}>{extras.bestPeriod}</div>
            </div>
          )}
        </>
      )}
      {theme === 'compatibility' && (
        <>
          {extras.coupleType && (
            <div>
              <div className={styles.extrasInfoLabel}>👩‍❤️‍👨 우리 커플의 유형은?</div>
              <div className={styles.extrasInfoValue}>{extras.coupleType}</div>
            </div>
          )}
          {extras.compatibilityScore !== undefined && (
            <div>
              <div className={styles.extrasInfoLabel}>💯 궁합 점수</div>
              <div className={styles.extrasInfoValue}>{extras.compatibilityScore}점</div>
            </div>
          )}
          {extras.synergyPoint && (
            <div>
              <div className={styles.extrasInfoLabel}>✨ 두 사람이 만났을 때 생기는 시너지</div>
              <div className={styles.extrasInfoValue}>{extras.synergyPoint}</div>
            </div>
          )}
          {extras.advice && (
            <div>
              <div className={styles.extrasInfoLabel}>💡 예쁜 사랑을 위한 조언</div>
              <div className={styles.extrasInfoValue}>{extras.advice}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
