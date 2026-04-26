import { RankListTask as RankListTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import styles from './RankListTask.module.css';

export interface RankListValue {
  orderedItems: string[];
}

interface Props {
  task: RankListTaskType;
  isComplete: boolean;
  savedResponse: RankListValue;
  onResponse: (value: RankListValue) => void;
  onComplete: (done: boolean) => void;
}

export function RankListTask({ task, isComplete, savedResponse, onResponse, onComplete }: Props) {
  // Initialize from task.items if no saved order yet
  const items = savedResponse?.orderedItems?.length ? savedResponse.orderedItems : [...task.items];

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onResponse({ orderedItems: next });
    onComplete(true); // Any reordering counts as engaged
  };

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      <p className={styles.hint}>Drag the items into your personal priority order using the ↑ ↓ controls.</p>
      <div className={styles.list} role="listbox" aria-label={task.title}>
        {items.map((item, i) => (
          <div
            key={item}
            className={styles.item}
            role="option"
            aria-selected={false}
            aria-setsize={items.length}
            aria-posinset={i + 1}
          >
            <span className={styles.rank}>{i + 1}</span>
            <span className={styles.label}>{item}</span>
            <div className={styles.controls}>
              <button
                id={task.id + '-up-' + i}
                className={styles.moveBtn}
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                aria-label={'Move ' + item + ' up'}
              >↑</button>
              <button
                id={task.id + '-dn-' + i}
                className={styles.moveBtn}
                onClick={() => move(i, i + 1)}
                disabled={i === items.length - 1}
                aria-label={'Move ' + item + ' down'}
              >↓</button>
            </div>
          </div>
        ))}
      </div>
    </TaskCard>
  );
}
