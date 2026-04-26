import styles from './MilestoneCard.module.css';
import { MILESTONES } from '../../lib/progressEngine';
import { useNavigate } from 'react-router-dom';

interface MilestoneCardProps {
  dayNumber: number;
  achieved: boolean;
  currentDay: number;
}

const MILESTONE_COPY: Record<number, { headline: string; body: string }> = {
  7:  {
    headline: 'One week of Personal Power.',
    body: 'Most people quit before now. You didn\'t. Seven days of proof that you follow through.',
  },
  14: {
    headline: 'Halfway through the program.',
    body: 'You\'ve built an identity around action. The back half is where transformation compounds.',
  },
  21: {
    headline: 'Momentum unlocked.',
    body: 'Three weeks of consistent conditioning. Your nervous system is rewiring. Keep going.',
  },
  30: {
    headline: 'Mastery achieved.',
    body: 'Thirty days. The person who finishes this program is not the same person who started it.',
  },
};

export function MilestoneCard({ dayNumber, achieved, currentDay }: MilestoneCardProps) {
  const navigate = useNavigate();
  const milestone = MILESTONES[dayNumber];
  const copy = MILESTONE_COPY[dayNumber];
  if (!milestone || !copy) return null;

  const isPast    = dayNumber < currentDay;
  const isNext    = dayNumber > currentDay;
  const daysAway  = Math.max(0, dayNumber - currentDay);

  return (
    <div
      className={`${styles.card} ${achieved ? styles.cardAchieved : isNext ? styles.cardUpcoming : styles.cardMissed}`}
      onClick={() => navigate('/day/' + dayNumber)}
      role="button"
      tabIndex={0}
      id={'milestone-card-' + dayNumber}
      aria-label={'Day ' + dayNumber + ' milestone: ' + milestone.label}
    >
      <div className={styles.top}>
        <span className={styles.emoji}>{achieved ? milestone.emoji : isNext ? '🔒' : '⬜'}</span>
        <div className={styles.topRight}>
          <span className={styles.tag}>Day {dayNumber} Milestone</span>
          <h3 className={styles.name}>{milestone.label}</h3>
        </div>
        {achieved && <span className={styles.achievedBadge}>✓</span>}
      </div>

      {achieved && <p className={styles.body}>{copy.headline}</p>}
      {achieved && <p className={styles.bodySmall}>{copy.body}</p>}

      {isNext && (
        <p className={styles.upcoming}>
          {daysAway === 1 ? 'Tomorrow!' : daysAway + ' days away'}
        </p>
      )}

      {isPast && !achieved && (
        <p className={styles.missed}>Missed — but tomorrow is a new day.</p>
      )}
    </div>
  );
}
