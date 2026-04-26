import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import type { RitualInfo } from '../../lib/ritualEngine';
import { getHabitHistoryWindow } from '../../lib/ritualEngine';
import { TaskRenderer } from '../tasks/TaskRenderer';
import { HabitHistoryMiniChart } from './HabitHistoryMiniChart';
import styles from './RitualCard.module.css';

interface RitualCardProps {
  ritualInfo: RitualInfo;
  currentDay: number;
  accentColor?: string;
}

const STATUS_CONFIG = {
  active:    { badge: 'Active',     badgeColor: '#48c774' },
  upcoming:  { badge: 'Upcoming',   badgeColor: '#f5c842' },
  completed: { badge: 'Completed',  badgeColor: '#6495ed' },
  locked:    { badge: 'Locked',     badgeColor: '#555'    },
};

export function RitualCard({ ritualInfo, currentDay, accentColor = '#f5c842' }: RitualCardProps) {
  const { habit, status, startDay, endDay, daysActive, completionRate, doneToday } = ritualInfo;
  const state = useAppStore(s => s);
  const cfg = STATUS_CONFIG[status];

  const [expanded, setExpanded] = useState(status === 'active');
  const history = getHabitHistoryWindow(habit.id, currentDay, 10, state);

  const totalDays  = habit.durationDays ?? (endDay ? endDay - startDay + 1 : null);
  const daysLabel  = totalDays ? `${daysActive} of ${totalDays} days` : `Day ${startDay}+`;

  return (
    <div
      className={`${styles.card} ${status === 'active' ? styles.cardActive : ''} ${doneToday ? styles.cardDone : ''}`}
      style={status === 'active' ? { borderColor: accentColor + '33' } : undefined}
    >
      {/* Header row */}
      <button
        id={'ritual-card-' + habit.id}
        className={styles.header}
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <div className={styles.headerLeft}>
          <span className={styles.badge} style={{ background: cfg.badgeColor + '22', color: cfg.badgeColor }}>
            {cfg.badge}
          </span>
          <h3 className={styles.title}>{habit.title}</h3>
          <p className={styles.desc}>{habit.description}</p>
        </div>
        <div className={styles.headerRight}>
          {doneToday && <span className={styles.todayCheck}>✓</span>}
          <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Progress strip */}
      <div className={styles.progressStrip}>
        <span className={styles.daysLabel}>{daysLabel}</span>
        {status === 'active' && (
          <HabitHistoryMiniChart records={history} completionRate={completionRate} color={accentColor} />
        )}
        {status === 'upcoming' && (
          <span className={styles.upcomingLabel}>Unlocks Day {startDay}</span>
        )}
        {status === 'completed' && (
          <span className={styles.completedLabel}>{completionRate}% completion rate</span>
        )}
      </div>

      {/* Task list — expanded only when active */}
      {expanded && status === 'active' && habit.tasks.length > 0 && (
        <div className={styles.tasks}>
          {habit.tasks.map(task => (
            <TaskRenderer key={task.id} task={task} dayNumber={currentDay} />
          ))}
        </div>
      )}
    </div>
  );
}
