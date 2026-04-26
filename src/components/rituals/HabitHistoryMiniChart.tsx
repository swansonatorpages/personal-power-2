import styles from './HabitHistoryMiniChart.module.css';

interface HabitHistoryMiniChartProps {
  records: Array<{ day: number; done: boolean }>;
  completionRate: number;
  color?: string;
}

export function HabitHistoryMiniChart({ records, completionRate, color = '#f5c842' }: HabitHistoryMiniChartProps) {
  if (records.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyText}>No history yet</span>
      </div>
    );
  }

  return (
    <div className={styles.chart}>
      {/* Dot row */}
      <div className={styles.dots}>
        {records.map(r => (
          <div
            key={r.day}
            className={`${styles.dot} ${r.done ? styles.dotDone : styles.dotMiss}`}
            style={r.done ? { background: color, boxShadow: `0 0 4px ${color}80` } : undefined}
            title={`Day ${r.day}: ${r.done ? 'Done' : 'Missed'}`}
          />
        ))}
      </div>

      {/* Rate */}
      <div className={styles.rateRow}>
        <div className={styles.rateBar}>
          <div
            className={styles.rateFill}
            style={{ width: completionRate + '%', background: color }}
          />
        </div>
        <span className={styles.rateLabel}>{completionRate}%</span>
      </div>
    </div>
  );
}
