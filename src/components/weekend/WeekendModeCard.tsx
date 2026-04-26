import styles from './WeekendModeCard.module.css';

interface WeekendModeCardProps {
  type: 'weekend' | 'review' | 'bonus';
  title: string;
  message?: string;
}

const TYPE_CONFIG = {
  weekend: { icon: '🌅', color: 'blue', label: 'Weekend Mode', bg: 'blue' },
  review: { icon: '📋', color: 'green', label: 'Review Day', bg: 'green' },
  bonus: { icon: '⭐', color: 'purple', label: 'Bonus Day', bg: 'purple' },
} as const;

export function WeekendModeCard({ type, title: _title, message }: WeekendModeCardProps) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.weekend;
  return (
    <div className={`${styles.card} ${styles['bg_' + cfg.bg]}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{cfg.icon}</span>
        <div>
          <span className={styles.label}>{cfg.label}</span>
          <p className={styles.message}>
            {message ?? 'Lower-friction day. Keep the streak alive — complete the session below.'}
          </p>
        </div>
      </div>
      <div className={styles.streakRow}>
        <span className={styles.streakDot} />
        <span className={styles.streakDot} />
        <span className={styles.streakDot} />
        <span className={styles.streakText}>Keep your streak alive</span>
      </div>
    </div>
  );
}
