import { GoalBuilderTask as GoalBuilderTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import { AutosaveIndicator } from './shared/AutosaveIndicator';
import styles from './GoalBuilderTask.module.css';
import shared from './shared/taskInputs.module.css';

export type GoalBuilderValue = Record<string, { goal: string; deadline: string; whyImportant: string }>;

interface Props {
  task: GoalBuilderTaskType;
  isComplete: boolean;
  savedResponse: GoalBuilderValue;
  onResponse: (value: GoalBuilderValue) => void;
  onComplete: (done: boolean) => void;
}

function isCategoryFilled(v: { goal: string; deadline: string; whyImportant: string } | undefined): boolean {
  return Boolean(v?.goal?.trim());
}

export function GoalBuilderTask({ task, isComplete, savedResponse, onResponse, onComplete }: Props) {
  const values: GoalBuilderValue = savedResponse ?? {};

  const update = (catId: string, field: 'goal' | 'deadline' | 'whyImportant', val: string) => {
    const current = values[catId] ?? { goal: '', deadline: '', whyImportant: '' };
    const next = { ...values, [catId]: { ...current, [field]: val } };
    onResponse(next);
    onComplete(task.categories.every(c => isCategoryFilled(next[c.id])));
  };

  const filledCount = task.categories.filter(c => isCategoryFilled(values[c.id])).length;

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      <p className={styles.progress}>{filledCount} of {task.categories.length} goals set</p>

      <div className={styles.cards}>
        {task.categories.map((cat) => {
          const val = values[cat.id] ?? { goal: '', deadline: '', whyImportant: '' };
          const filled = isCategoryFilled(val);
          return (
            <div key={cat.id} className={`${styles.card} ${filled ? styles.cardFilled : ''}`}>
              <div className={styles.cardHeader}>
                <span className={`${styles.cardDot} ${filled ? styles.cardDotFilled : ''}`} />
                <div className={styles.cardTitle}>{cat.title}</div>
              </div>
              <p className={styles.cardDesc}>{cat.description}</p>

              <label className={styles.fieldLabel} htmlFor={task.id + '-' + cat.id + '-goal'}>Goal</label>
              <textarea
                id={task.id + '-' + cat.id + '-goal'}
                className={shared.textarea}
                placeholder="What specifically do you want to achieve?"
                value={val.goal}
                onChange={(e) => update(cat.id, 'goal', e.target.value)}
                style={{ minHeight: 80 }}
              />

              <label className={styles.fieldLabel} htmlFor={task.id + '-' + cat.id + '-deadline'}>Target Date</label>
              <input
                id={task.id + '-' + cat.id + '-deadline'}
                className={shared.textInput}
                type="date"
                value={val.deadline}
                onChange={(e) => update(cat.id, 'deadline', e.target.value)}
              />

              <label className={styles.fieldLabel} htmlFor={task.id + '-' + cat.id + '-why'}>Why does this matter?</label>
              <textarea
                id={task.id + '-' + cat.id + '-why'}
                className={shared.textarea}
                placeholder="What will achieving this give you?"
                value={val.whyImportant}
                onChange={(e) => update(cat.id, 'whyImportant', e.target.value)}
                style={{ minHeight: 80 }}
              />

              <div className={styles.saveRow}>
                <AutosaveIndicator saveKey={val} />
              </div>
            </div>
          );
        })}
      </div>
    </TaskCard>
  );
}
