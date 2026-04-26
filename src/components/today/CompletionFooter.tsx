import styles from './CompletionFooter.module.css';

interface CompletionFooterProps {
  dayNumber: number;
  completedCount: number;
  totalRequired: number;
  isDayComplete: boolean;
  onFinishDay: () => void;
}

export function CompletionFooter({
  dayNumber,
  completedCount,
  totalRequired,
  isDayComplete,
  onFinishDay,
}: CompletionFooterProps) {
  const canFinish = completedCount >= totalRequired;
  const pct = totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 100;

  return (
    <div className={styles.footer}>
      {/* Mini progress bar */}
      <div className={styles.progressRow}>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${canFinish ? styles.progressFillComplete : ''}`}
            style={{ width: pct + '%' }}
          />
        </div>
        <span className={styles.progressText}>
          {completedCount} / {totalRequired}
        </span>
      </div>

      {/* CTA */}
      {isDayComplete ? (
        <div className={styles.completeBanner} aria-live="polite">
          <span className={styles.completeIcon}>⚡</span>
          <span>Day {dayNumber} Complete!</span>
        </div>
      ) : (
        <button
          id="finish-day-btn"
          className={`${styles.btn} ${canFinish ? styles.btnReady : styles.btnLocked}`}
          onClick={canFinish ? onFinishDay : undefined}
          disabled={!canFinish}
          aria-disabled={!canFinish}
        >
          {canFinish
            ? 'Finish Day ' + dayNumber
            : completedCount + '/' + totalRequired + ' to unlock'}
        </button>
      )}
    </div>
  );
}
