import type { ProgressStats } from '../../lib/progressEngine';
import { MILESTONES, getMomentumMessage } from '../../lib/progressEngine';
import styles from './MomentumBanner.module.css';

interface MomentumBannerProps {
  stats: ProgressStats;
  currentDay: number;
}

export function MomentumBanner({ stats, currentDay }: MomentumBannerProps) {
  const message = getMomentumMessage(stats, currentDay);

  // Find the next upcoming milestone
  const nextMilestone = [7, 14, 21, 30].find(m => m > currentDay && !stats.totalComplete);
  const nextM = nextMilestone ? MILESTONES[nextMilestone] : null;
  const daysToNext = nextMilestone ? nextMilestone - currentDay : 0;

  // Tier determines banner intensity
  const tier = stats.currentStreak >= 7
    ? 'fire'
    : stats.currentStreak >= 3
      ? 'hot'
      : stats.totalComplete > 0
        ? 'active'
        : 'idle';

  return (
    <div className={`${styles.banner} ${styles['tier_' + tier]}`}>
      <div className={styles.main}>
        <span className={styles.glyph}>
          {tier === 'fire' ? '🔥' : tier === 'hot' ? '⚡' : tier === 'active' ? '💪' : '🌱'}
        </span>
        <p className={styles.message}>{message}</p>
      </div>

      {nextM && daysToNext <= 7 && (
        <div className={styles.nextMilestone}>
          <span className={styles.nextEmoji}>{nextM.emoji}</span>
          <div>
            <span className={styles.nextLabel}>Next milestone</span>
            <span className={styles.nextName}>{nextM.label} · {daysToNext}d away</span>
          </div>
        </div>
      )}
    </div>
  );
}
