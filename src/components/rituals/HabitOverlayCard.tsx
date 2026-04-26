import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import type { RitualInfo } from '../../lib/ritualEngine';
import styles from './HabitOverlayCard.module.css';

interface HabitOverlayCardProps {
  ritualInfo: RitualInfo;
  currentDay: number;
}

const HABIT_CONFIG: Record<string, { icon: string; color: string; shortLabel: string }> = {
  morning_questions: { icon: '☀️', color: '#f5c842', shortLabel: 'Morning Qs' },
  water_rich_diet:   { icon: '💧', color: '#6495ed', shortLabel: 'Breathe + Eat' },
  income_ideas:      { icon: '💡', color: '#20d4b8', shortLabel: 'Income Ideas' },
};

export function HabitOverlayCard({ ritualInfo, currentDay }: HabitOverlayCardProps) {
  const { habit, doneToday, daysActive, completionRate } = ritualInfo;
  const navigate = useNavigate();
  const recordHabitCheck = useAppStore(s => s.recordHabitCheck);
  const habitHistory = useAppStore(s => s.habitHistory);

  const cfg = HABIT_CONFIG[habit.id] ?? { icon: '⚡', color: '#f5c842', shortLabel: habit.title };

  const handleQuickComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const current = habitHistory[habit.id]?.[currentDay];
    recordHabitCheck(habit.id, currentDay, current ? null : true);
  };

  return (
    <div
      className={`${styles.card} ${doneToday ? styles.cardDone : ''}`}
      style={{ borderColor: doneToday ? 'rgba(72,199,116,0.3)' : cfg.color + '33' }}
      onClick={() => navigate('/rituals')}
      role="button"
      tabIndex={0}
      aria-label={`${habit.title} ritual — tap to open`}
    >
      <div className={styles.top}>
        <span className={styles.icon}>{cfg.icon}</span>
        <div className={styles.info}>
          <span className={styles.name} style={{ color: doneToday ? '#48c774' : cfg.color }}>
            {cfg.shortLabel}
          </span>
          <span className={styles.sub}>Day {daysActive} · {completionRate}% rate</span>
        </div>
        <button
          id={`habit-quick-${habit.id}`}
          className={`${styles.checkBtn} ${doneToday ? styles.checkBtnDone : ''}`}
          style={doneToday ? undefined : { borderColor: cfg.color + '66', color: cfg.color }}
          onClick={handleQuickComplete}
          aria-label={doneToday ? 'Mark incomplete' : 'Quick complete'}
        >
          {doneToday ? '✓' : '○'}
        </button>
      </div>
    </div>
  );
}
