import { useState, useRef } from 'react';
import {
  TaskDefinition, ChecklistTask, ConfirmActionTask,
  HabitCounterTask, MultiEntryListTask, PromptGroupTask,
  ReflectionNoteTask, GuidedSequenceTask,
} from '../../types/program';
import styles from './TaskRow.module.css';

interface TaskRowProps {
  task: TaskDefinition;
  dayNumber: number;
  isComplete: boolean;
  savedResponse: unknown;
  onComplete: (taskId: string, completed: boolean) => void;
  onResponse: (taskId: string, value: unknown) => void;
}

function ConfirmButton({ task, isComplete, onComplete }: { task: ConfirmActionTask; isComplete: boolean; onComplete: (d: boolean) => void }) {
  return (
    <button id={task.id + '-confirm'} className={`${styles.confirmBtn} ${isComplete ? styles.confirmDone : ''}`} onClick={() => onComplete(!isComplete)}>
      {isComplete ? '✓ ' + task.actionText : task.actionText}
    </button>
  );
}

function HabitCounter({ task, value, onResponse, onComplete }: { task: HabitCounterTask; value: number; onResponse: (v: number) => void; onComplete: (d: boolean) => void }) {
  const update = (n: number) => { const c = Math.max(0, n); onResponse(c); onComplete(c >= task.targetCount); };
  return (
    <div className={styles.counter}>
      <button id={task.id + '-dec'} className={styles.counterBtn} onClick={() => update(value - 1)}>−</button>
      <div className={styles.counterDisplay}>
        <span className={styles.counterValue}>{value}</span>
        <span className={styles.counterUnit}>/ {task.targetCount} {task.unit}</span>
      </div>
      <button id={task.id + '-inc'} className={styles.counterBtn} onClick={() => update(value + 1)}>+</button>
    </div>
  );
}

function ChecklistInput({ task, value, onResponse, onComplete }: { task: ChecklistTask; value: Record<string, boolean>; onResponse: (v: Record<string, boolean>) => void; onComplete: (d: boolean) => void }) {
  const toggle = (item: string) => { const n = { ...value, [item]: !value[item] }; onResponse(n); onComplete(task.items.every(it => n[it])); };
  return (
    <div className={styles.checklist}>
      {task.items.map((item) => (
        <button key={item} className={`${styles.checkItem} ${value[item] ? styles.checkItemDone : ''}`} onClick={() => toggle(item)} role="checkbox" aria-checked={value[item] ?? false}>
          <span className={`${styles.checkCircle} ${value[item] ? styles.checkCircleDone : ''}`}>{value[item] && <span className={styles.checkMark}>✓</span>}</span>
          <span className={styles.checkLabel}>{item}</span>
        </button>
      ))}
    </div>
  );
}

function MultiEntryList({ task, value, onResponse, onComplete }: { task: MultiEntryListTask; value: string[]; onResponse: (v: string[]) => void; onComplete: (d: boolean) => void }) {
  const [draft, setDraft] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const min = task.completionRule.minItems ?? 1;
  const add = () => {
    const t = draft.trim(); if (!t) return;
    const n = [...value, t]; setDraft(''); onResponse(n); onComplete(n.length >= min); ref.current?.focus();
  };
  const remove = (i: number) => { const n = value.filter((_, idx) => idx !== i); onResponse(n); onComplete(n.length >= min); };
  return (
    <div className={styles.multiEntry}>
      {value.map((item, i) => (
        <div key={i} className={styles.entryItem}>
          <span className={styles.entryBullet}>{i + 1}.</span>
          <span className={styles.entryText}>{item}</span>
          <button className={styles.entryRemove} onClick={() => remove(i)}>×</button>
        </div>
      ))}
      <div className={styles.entryInputRow}>
        <input ref={ref} id={task.id + '-entry'} className={styles.entryInput} type="text" placeholder={task.itemLabel + '…'} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button id={task.id + '-add'} className={styles.addBtn} onClick={add}>Add</button>
      </div>
      <p className={styles.minNote}>{value.length} / {min} required</p>
    </div>
  );
}

function PromptGroup({ task, value, onResponse, onComplete }: { task: PromptGroupTask; value: Record<number, string>; onResponse: (v: Record<number, string>) => void; onComplete: (d: boolean) => void }) {
  const update = (i: number, v: string) => { const n = { ...value, [i]: v }; onResponse(n); onComplete(task.prompts.every((_, idx) => (n[idx] ?? '').trim().length > 0)); };
  return (
    <div className={styles.promptGroup}>
      {task.prompts.map((prompt, i) => (
        <div key={i} className={styles.promptItem}>
          <p className={styles.promptText}>{prompt}</p>
          <textarea id={task.id + '-p' + i} className={styles.promptTextarea} rows={3} placeholder="Your answer…" value={value[i] ?? ''} onChange={e => update(i, e.target.value)} />
        </div>
      ))}
    </div>
  );
}

function ReflectionNote({ task, isComplete, onComplete }: { task: ReflectionNoteTask; isComplete: boolean; onComplete: (d: boolean) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={styles.reflection}>
      <button id={task.id + '-expand'} className={styles.reflectionToggle} onClick={() => setExpanded(!expanded)}>{expanded ? '▲ Collapse' : '▼ Read passage'}</button>
      {expanded && <div className={styles.reflectionContent}><p>{task.content}</p></div>}
      <button id={task.id + '-ack'} className={`${styles.confirmBtn} ${isComplete ? styles.confirmDone : ''}`} onClick={() => onComplete(!isComplete)}>{isComplete ? '✓ Read & acknowledged' : 'Mark as read'}</button>
    </div>
  );
}

function GuidedSequence({ task, value, onResponse, onComplete }: { task: GuidedSequenceTask; value: number; onResponse: (v: number) => void; onComplete: (d: boolean) => void }) {
  const advance = () => { const n = value + 1; onResponse(n); onComplete(n >= task.steps.length); };
  return (
    <div className={styles.sequence}>
      {task.steps.map((step, i) => (
        <div key={i} className={`${styles.seqStep} ${i < value ? styles.seqDone : ''} ${i === value ? styles.seqActive : ''}`}>
          <span className={styles.seqNum}>{i < value ? '✓' : i + 1}</span>
          <span className={styles.seqText}>{step}</span>
        </div>
      ))}
      {value < task.steps.length && <button id={task.id + '-next'} className={styles.confirmBtn} onClick={advance}>Next Step ({value + 1}/{task.steps.length})</button>}
    </div>
  );
}

function Placeholder({ task }: { task: TaskDefinition }) {
  return (
    <div className={styles.placeholder}>
      <span className={styles.placeholderTag}>{task.type.replace(/_/g, ' ')}</span>
      <span className={styles.placeholderNote}>Full editor coming soon</span>
    </div>
  );
}

export function TaskRow({ task, dayNumber: _dn, isComplete, savedResponse, onComplete, onResponse }: TaskRowProps) {
  const [expanded, setExpanded] = useState(false);
  const str = (savedResponse as string) ?? '';
  const num = (savedResponse as number) ?? 0;
  const rec = (savedResponse as Record<string, boolean>) ?? {};
  const arr = (savedResponse as string[]) ?? [];
  const numRec = (savedResponse as Record<number, string>) ?? {};

  const isCollapsible = ['long_text','prompt_group','reflection_note','guided_sequence','multi_entry_list','checklist'].includes(task.type);

  const renderBody = () => {
    switch (task.type) {
      case 'short_text': return (
        <div className={styles.inputGroup}>
          <input id={task.id + '-input'} className={styles.textInput} type="text" placeholder={(task as { placeholder?: string }).placeholder ?? 'Your answer…'} value={str} onChange={e => { onResponse(task.id, e.target.value); onComplete(task.id, e.target.value.trim().length > 0); }} />
        </div>
      );
      case 'long_text': return (
        <div className={styles.inputGroup}>
          <textarea id={task.id + '-ta'} className={styles.textarea} placeholder={(task as { placeholder?: string }).placeholder ?? 'Write your thoughts…'} value={str} rows={5} onChange={e => { onResponse(task.id, e.target.value); onComplete(task.id, e.target.value.trim().length > 0); }} />
        </div>
      );
      case 'checklist': return <ChecklistInput task={task as ChecklistTask} value={rec} onResponse={v => onResponse(task.id, v)} onComplete={d => onComplete(task.id, d)} />;
      case 'confirm_action': return <ConfirmButton task={task as ConfirmActionTask} isComplete={isComplete} onComplete={d => onComplete(task.id, d)} />;
      case 'habit_counter': return <HabitCounter task={task as HabitCounterTask} value={num} onResponse={v => onResponse(task.id, v)} onComplete={d => onComplete(task.id, d)} />;
      case 'multi_entry_list': return <MultiEntryList task={task as MultiEntryListTask} value={arr} onResponse={v => onResponse(task.id, v)} onComplete={d => onComplete(task.id, d)} />;
      case 'prompt_group': return <PromptGroup task={task as PromptGroupTask} value={numRec} onResponse={v => onResponse(task.id, v)} onComplete={d => onComplete(task.id, d)} />;
      case 'reflection_note': return <ReflectionNote task={task as ReflectionNoteTask} isComplete={isComplete} onComplete={d => onComplete(task.id, d)} />;
      case 'guided_sequence': return <GuidedSequence task={task as GuidedSequenceTask} value={num} onResponse={v => onResponse(task.id, v)} onComplete={d => onComplete(task.id, d)} />;
      default: return <Placeholder task={task} />;
    }
  };

  return (
    <div className={`${styles.row} ${isComplete ? styles.rowDone : ''}`} id={'task-row-' + task.id}>
      <button className={styles.rowHeader} onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        <span className={`${styles.orb} ${isComplete ? styles.orbDone : ''}`}>{isComplete && <span className={styles.orbCheck}>✓</span>}</span>
        <div className={styles.rowMeta}>
          <span className={styles.rowTitle}>{task.title}</span>
          {task.description && <span className={styles.rowSubtitle}>{task.description}</span>}
        </div>
        {isCollapsible && <span className={`${styles.chevron} ${expanded ? styles.chevronUp : ''}`}>›</span>}
      </button>
      {(!isCollapsible || expanded) && <div className={styles.rowBody}>{renderBody()}</div>}
    </div>
  );
}
