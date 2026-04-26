import type { ProgressStats } from '../../lib/progressEngine';
import styles from './CompletionStats.module.css';

interface CompletionStatsProps {
  stats: ProgressStats;
  currentDay: number;
}

export function CompletionStats({ stats, currentDay }: CompletionStatsProps) {
  const { totalComplete, totalPartial, totalMissed, completionPct, totalTasksComplete } = stats;
  const remaining = 30 - currentDay;

  const items = [
    { label: 'Complete',    value: totalComplete,      color: '#48c774', icon: '✓' },
    { label: 'In Progress', value: totalPartial,        color: '#f5c842', icon: '◐' },
    { label: 'Missed',      value: totalMissed,         color: '#ff6b6b', icon: '✗' },
    { label: 'Remaining',   value: Math.max(0, remaining), color: 'rgba(255,255,255,0.3)', icon: '·' },
  ];

  return (
    <div className={styles.wrap}>
      {/* Arc-style progress */}
      <div className={styles.arcWrap}>
        <svg viewBox="0 0 100 56" className={styles.arcSvg}>
          {/* Background arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(completionPct / 100) * 125.7} 125.7`}
          />
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5c842" />
              <stop offset="100%" stopColor="#48c774" />
            </linearGradient>
          </defs>
        </svg>
        <div className={styles.arcCenter}>
          <span className={styles.arcPct}>{completionPct}%</span>
          <span className={styles.arcLabel}>complete</span>
        </div>
      </div>

      {/* Stat pills */}
      <div className={styles.pills}>
        {items.map(item => (
          <div key={item.label} className={styles.pill}>
            <span className={styles.pillIcon} style={{ color: item.color }}>{item.icon}</span>
            <span className={styles.pillVal} style={{ color: item.color }}>{item.value}</span>
            <span className={styles.pillLabel}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Tasks completed */}
      <div className={styles.tasksRow}>
        <span className={styles.tasksLabel}>Total tasks completed</span>
        <span className={styles.tasksVal}>{totalTasksComplete}</span>
      </div>
    </div>
  );
}
