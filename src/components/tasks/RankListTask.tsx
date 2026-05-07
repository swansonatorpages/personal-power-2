import { useState } from 'react';
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
  const [draft, setDraft] = useState('');

  const add = () => {
    const t = draft.trim();
    if (!t || items.includes(t)) return;
    const next = [...items, t];
    setDraft('');
    onResponse({ orderedItems: next });
    onComplete(next.length >= (task.completionRule.minItems || 1));
  };

  const remove = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onResponse({ orderedItems: next });
    onComplete(next.length >= (task.completionRule.minItems || 1));
  };

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
              <button
                id={task.id + '-rm-' + i}
                className={styles.removeBtn}
                onClick={() => remove(i)}
                aria-label={'Remove ' + item}
              >×</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.addRow}>
        <input
          id={task.id + '-entry'}
          className={styles.textInput}
          type="text"
          placeholder="Add an item to rank..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button id={task.id + '-add'} className={styles.addBtn} onClick={add}>Add</button>
      </div>
    </TaskCard>
  );
}
