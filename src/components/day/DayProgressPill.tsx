import styles from './DayProgressPill.module.css';

interface DayProgressPillProps {
  completedCount: number;
  totalCount: number;
  isDayComplete: boolean;
}

export function DayProgressPill({ completedCount, totalCount, isDayComplete }: DayProgressPillProps) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={`${styles.pill} ${isDayComplete ? styles.pillDone : ''}`}>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${isDayComplete ? styles.fillDone : ''}`}
          style={{ width: (isDayComplete ? 100 : pct) + '%' }}
        />
      </div>
      <span className={styles.label}>
        {isDayComplete ? '✓ Complete' : completedCount + ' / ' + totalCount + ' tasks'}
      </span>
    </div>
  );
}
