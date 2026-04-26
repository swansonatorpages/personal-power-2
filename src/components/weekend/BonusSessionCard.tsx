import type { BonusSession } from '../../types/program';
import { TaskRenderer } from '../tasks/TaskRenderer';
import { TaskSectionHeading } from '../tasks/shared/TaskSectionHeading';
import styles from './BonusSessionCard.module.css';

interface BonusSessionCardProps {
  session: BonusSession;
  /** Fake day number used as namespace in the store — e.g. the actual dayNumber of the day */
  dayNumber: number;
  taskCompletions: Record<string, boolean>;
}

const SESSION_ICONS: Record<string, string> = {
  subliminal: '🎧',
  masters: '🎓',
  review: '📖',
};

export function BonusSessionCard({ session, dayNumber, taskCompletions }: BonusSessionCardProps) {
  const completedCount = session.tasks.filter(t => taskCompletions[t.id]).length;
  const pct = session.tasks.length > 0 ? Math.round((completedCount / session.tasks.length) * 100) : 0;
  const icon = SESSION_ICONS[session.type] ?? '⭐';

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <div className={styles.meta}>
          <span className={styles.tag}>{session.type.toUpperCase()} SESSION</span>
          <h3 className={styles.title}>{session.title}</h3>
          <p className={styles.desc}>{session.description}</p>
        </div>
      </div>

      {/* Progress */}
      {session.tasks.length > 0 && (
        <div className={styles.progressRow}>
          <div className={styles.bar}><div className={styles.fill} style={{ width: pct + '%' }} /></div>
          <span className={styles.pct}>{completedCount}/{session.tasks.length}</span>
        </div>
      )}

      {/* Tasks */}
      {session.tasks.length > 0 && (
        <div className={styles.tasks}>
          <TaskSectionHeading
            title="Session Tasks"
            count={session.tasks.length}
            completed={completedCount}
          />
          <div className={styles.stack}>
            {session.tasks.map(task => (
              <TaskRenderer key={task.id} task={task} dayNumber={dayNumber} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
