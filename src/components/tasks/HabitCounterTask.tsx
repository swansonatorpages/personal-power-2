import { HabitCounterTask as HabitCounterTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import styles from './HabitCounterTask.module.css';

interface Props {
  task: HabitCounterTaskType;
  isComplete: boolean;
  savedResponse: number;
  onResponse: (value: number) => void;
  onComplete: (done: boolean) => void;
}

export function HabitCounterTask({ task, isComplete, savedResponse, onResponse, onComplete }: Props) {
  const value = savedResponse ?? 0;
  const pct = Math.min(100, Math.round((value / task.targetCount) * 100));

  const update = (next: number) => {
    const clamped = Math.max(0, next);
    onResponse(clamped);
    onComplete(clamped >= task.targetCount);
  };

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      {/* Arc progress */}
      <div className={styles.arcRow}>
        <div className={styles.arcBg}>
          <div className={styles.arcFill} style={{ width: pct + '%' }} />
        </div>
        <span className={styles.arcPct}>{pct}%</span>
      </div>

      {/* Counter */}
      <div className={styles.counter}>
        <button
          id={task.id + '-dec'}
          className={styles.btn}
          onClick={() => update(value - 1)}
          aria-label="Decrease"
          disabled={value <= 0}
        >−</button>

        <div className={styles.display}>
          <span className={styles.value}>{value}</span>
          <span className={styles.target}>/ {task.targetCount} {task.unit}</span>
        </div>

        <button
          id={task.id + '-inc'}
          className={`${styles.btn} ${styles.btnAdd}`}
          onClick={() => update(value + 1)}
          aria-label="Increase"
        >+</button>
      </div>
    </TaskCard>
  );
}
