import { useState, useRef } from 'react';
import { MultiEntryListTask as MultiEntryListTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import styles from './MultiEntryListTask.module.css';
import shared from './shared/taskInputs.module.css';

interface Props {
  task: MultiEntryListTaskType;
  isComplete: boolean;
  savedResponse: string[];
  onResponse: (value: string[]) => void;
  onComplete: (done: boolean) => void;
}

export function MultiEntryListTask({ task, isComplete, savedResponse, onResponse, onComplete }: Props) {
  const items = savedResponse ?? [];
  const [draft, setDraft] = useState('');
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const min = task.completionRule.minItems ?? 1;

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    const next = [...items, t];
    setDraft('');
    onResponse(next);
    onComplete(next.length >= min);
    inputRef.current?.focus();
  };

  const remove = (i: number) => {
    if (confirmRemove !== i) { setConfirmRemove(i); return; }
    const next = items.filter((_, idx) => idx !== i);
    onResponse(next);
    onComplete(next.length >= min);
    setConfirmRemove(null);
  };

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      <div className={styles.list}>
        {items.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.bullet}>{i + 1}.</span>
            <span className={styles.text}>{item}</span>
            <button
              className={`${styles.removeBtn} ${confirmRemove === i ? styles.removeBtnConfirm : ''}`}
              onClick={() => remove(i)}
              aria-label={confirmRemove === i ? 'Confirm remove' : 'Remove ' + item}
            >
              {confirmRemove === i ? '✓ Remove?' : '×'}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.addRow}>
        <input
          ref={inputRef}
          id={task.id + '-entry'}
          className={shared.textInput}
          type="text"
          placeholder={task.itemLabel + '…'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button id={task.id + '-add'} className={styles.addBtn} onClick={add}>Add</button>
      </div>

      <p className={shared.minNote}>{items.length} / {min} required</p>
    </TaskCard>
  );
}
