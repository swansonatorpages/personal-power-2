import styles from './TodayHeader.module.css';

interface TodayHeaderProps {
  dayNumber: number;
  title: string;
  dayType: string;
  startDate: string | null;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(d: Date): string {
  return DAY_NAMES[d.getDay()] + ', ' + MONTH_NAMES[d.getMonth()] + ' ' + d.getDate();
}

function getProgramPercent(dayNumber: number): number {
  return Math.round(((dayNumber - 1) / 30) * 100);
}

export function TodayHeader({ dayNumber, title, dayType, startDate }: TodayHeaderProps) {
  const today = new Date();
  const pct = getProgramPercent(dayNumber);

  return (
    <div className={styles.header}>
      {/* Top row: date + day type pill */}
      <div className={styles.metaRow}>
        <span className={styles.date}>{formatDate(today)}</span>
        <span className={`${styles.typePill} ${styles['type_' + dayType]}`}>
          {dayType}
        </span>
      </div>

      {/* Hero day number */}
      <div className={styles.heroRow}>
        <div className={styles.dayStamp}>
          <span className={styles.dayWord}>DAY</span>
          <span className={styles.dayNum}>{dayNumber}</span>
          <span className={styles.dayTotal}>/30</span>
        </div>
      </div>

      {/* Title */}
      <p className={styles.title}>{title}</p>

      {/* Progress strip */}
      <div className={styles.progressRow}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: pct + '%' }} />
        </div>
        <span className={styles.progressLabel}>{pct}%</span>
      </div>

      {!startDate && (
        <div className={styles.warningBadge}>
          ⚠ Program not started — tap to begin
        </div>
      )}
    </div>
  );
}
