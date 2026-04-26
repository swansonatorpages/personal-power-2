import type { ProgressStats } from '../../lib/progressEngine';
import styles from './StreakCard.module.css';

interface StreakCardProps {
  stats: ProgressStats;
  currentDay: number;
}

export function StreakCard({ stats, currentDay }: StreakCardProps) {
  const { currentStreak, longestStreak, currentPhase } = stats;

  // Build last-7-days indicators
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const day = currentDay - 6 + i;
    return { day, valid: day >= 1 };
  });

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        {/* Streak flame */}
        <div className={styles.flameBlock}>
          <span className={styles.flameEmoji}>{currentStreak >= 3 ? '🔥' : '⚡'}</span>
          <div>
            <span className={styles.streakNum}>{currentStreak}</span>
            <span className={styles.streakUnit}>day streak</span>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Phase + longest */}
        <div className={styles.metaBlock}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Phase</span>
            <span className={styles.metaValue}>{currentPhase}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Best streak</span>
            <span className={styles.metaValue}>{longestStreak}d</span>
          </div>
        </div>
      </div>

      {/* Last 7 day dots */}
      <div className={styles.dotRow}>
        {last7.map(({ day, valid }) => (
          <div key={day} className={styles.dotWrap}>
            <div
              className={`${styles.dot} ${!valid ? styles.dotEmpty : ''}`}
              title={valid ? 'Day ' + day : ''}
            />
            {valid && <span className={styles.dotLabel}>{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
