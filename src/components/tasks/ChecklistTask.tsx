import { ChecklistTask as ChecklistTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import styles from './ChecklistTask.module.css';

interface Props {
  task: ChecklistTaskType;
  isComplete: boolean;
  savedResponse: Record<string, boolean>;
  onResponse: (value: Record<string, boolean>) => void;
  onComplete: (done: boolean) => void;
}

export function ChecklistTask({ task, isComplete, savedResponse, onResponse, onComplete }: Props) {
  const value = savedResponse ?? {};
  const doneCount = task.items.filter(item => value[item]).length;

  const toggle = (item: string) => {
    const next = { ...value, [item]: !value[item] };
    onResponse(next);
    onComplete(task.items.every(it => next[it]));
  };

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      <p className={styles.progress}>{doneCount} of {task.items.length} checked</p>
      <div className={styles.list} role="group" aria-label={task.title}>
        {task.items.map((item) => {
          const done = value[item] ?? false;
          return (
            <button
              key={item}
              id={task.id + '-' + item.slice(0, 20).replace(/\W+/g, '-')}
              className={`${styles.item} ${done ? styles.itemDone : ''}`}
              onClick={() => toggle(item)}
              role="checkbox"
              aria-checked={done}
            >
              <span className={`${styles.circle} ${done ? styles.circleDone : ''}`}>
                {done && <span className={styles.check}>✓</span>}
              </span>
              <span className={styles.label}>{item}</span>
            </button>
          );
        })}
      </div>
    </TaskCard>
  );
}
