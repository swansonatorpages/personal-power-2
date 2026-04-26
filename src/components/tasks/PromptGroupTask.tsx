import { PromptGroupTask as PromptGroupTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import { AutosaveIndicator } from './shared/AutosaveIndicator';
import styles from './PromptGroupTask.module.css';
import shared from './shared/taskInputs.module.css';

interface Props {
  task: PromptGroupTaskType;
  isComplete: boolean;
  savedResponse: Record<number, string>;
  onResponse: (value: Record<number, string>) => void;
  onComplete: (done: boolean) => void;
}

export function PromptGroupTask({ task, isComplete, savedResponse, onResponse, onComplete }: Props) {
  const values = savedResponse ?? {};

  const update = (i: number, v: string) => {
    const next = { ...values, [i]: v };
    onResponse(next);
    onComplete(task.prompts.every((_, idx) => (next[idx] ?? '').trim().length > 0));
  };

  const answeredCount = task.prompts.filter((_, i) => (values[i] ?? '').trim().length > 0).length;

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      <p className={styles.progress}>{answeredCount} of {task.prompts.length} answered</p>
      <div className={styles.list}>
        {task.prompts.map((prompt, i) => {
          const answered = (values[i] ?? '').trim().length > 0;
          return (
            <div key={i} className={`${styles.item} ${answered ? styles.itemAnswered : ''}`}>
              <div className={styles.promptRow}>
                <span className={styles.promptNum}>{i + 1}</span>
                <p className={styles.promptText}>{prompt}</p>
              </div>
              <textarea
                id={task.id + '-p' + i}
                className={shared.textarea}
                placeholder="Your answer…"
                value={values[i] ?? ''}
                onChange={(e) => update(i, e.target.value)}
                aria-label={'Prompt ' + (i + 1)}
              />
              <div className={shared.saveRow}>
                <AutosaveIndicator saveKey={values[i]} />
              </div>
            </div>
          );
        })}
      </div>
    </TaskCard>
  );
}
