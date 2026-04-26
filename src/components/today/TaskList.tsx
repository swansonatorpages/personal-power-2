import { TaskDefinition } from '../../types/program';
import { TaskRenderer } from '../tasks/TaskRenderer';
import { TaskSectionHeading } from '../tasks/shared/TaskSectionHeading';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: TaskDefinition[];
  dayNumber: number;
  taskCompletions: Record<string, boolean>;
}

export function TaskList({ tasks, dayNumber, taskCompletions }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🎧</span>
        <p className={styles.emptyText}>No exercises for today. Use your bonus session.</p>
      </div>
    );
  }

  const required = tasks.filter(t => t.completionRule.required);
  const optional = tasks.filter(t => !t.completionRule.required);
  const reqDone  = required.filter(t => taskCompletions[t.id]).length;
  const optDone  = optional.filter(t => taskCompletions[t.id]).length;

  return (
    <div className={styles.list}>
      {required.length > 0 && (
        <div className={styles.section}>
          <TaskSectionHeading title="Required" count={required.length} completed={reqDone} />
          <div className={styles.stack}>
            {required.map(task => (
              <TaskRenderer key={task.id} task={task} dayNumber={dayNumber} />
            ))}
          </div>
        </div>
      )}
      {optional.length > 0 && (
        <div className={styles.section}>
          <TaskSectionHeading title="Optional" count={optional.length} completed={optDone} />
          <div className={styles.stack}>
            {optional.map(task => (
              <TaskRenderer key={task.id} task={task} dayNumber={dayNumber} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
