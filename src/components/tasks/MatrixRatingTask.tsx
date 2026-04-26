import { MatrixRatingTask as MatrixRatingTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import { AutosaveIndicator } from './shared/AutosaveIndicator';
import styles from './MatrixRatingTask.module.css';

export interface MatrixRowValue {
  yesNo: boolean | null;
  score: number | null;
  note: string;
}

export type MatrixRatingValue = Record<string, MatrixRowValue>;

interface Props {
  task: MatrixRatingTaskType;
  isComplete: boolean;
  savedResponse: MatrixRatingValue;
  onResponse: (value: MatrixRatingValue) => void;
  onComplete: (done: boolean) => void;
}

const SCORE_OPTIONS = [0,1,2,3,4,5,6,7,8,9,10];

function isRowFilled(r: MatrixRowValue | undefined) {
  if (!r) return false;
  return r.yesNo !== null && r.score !== null;
}

export function MatrixRatingTask({ task, isComplete, savedResponse, onResponse, onComplete }: Props) {
  const values: MatrixRatingValue = savedResponse ?? {};

  const update = (row: string, patch: Partial<MatrixRowValue>) => {
    const current = values[row] ?? { yesNo: null, score: null, note: '' };
    const next: MatrixRatingValue = { ...values, [row]: { ...current, ...patch } };
    onResponse(next);
    onComplete(task.rows.every(r => isRowFilled(next[r])));
  };

  const filledCount = task.rows.filter(r => isRowFilled(values[r])).length;

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      <div className={styles.legend}>
        <span>Need</span>
        <span>Met?</span>
        <span>Score (0–10)</span>
      </div>

      <p className={styles.progress}>{filledCount} of {task.rows.length} rated</p>

      <div className={styles.matrix}>
        {task.rows.map((row) => {
          const val = values[row] ?? { yesNo: null, score: null, note: '' };
          return (
            <div key={row} className={`${styles.row} ${isRowFilled(val) ? styles.rowFilled : ''}`}>
              {/* Need label */}
              <div className={styles.rowHeader}>
                <span className={styles.rowLabel}>{row}</span>
              </div>

              {/* Yes / No */}
              <div className={styles.yesNoRow}>
                <button
                  id={task.id + '-' + row + '-yes'}
                  className={`${styles.ynBtn} ${val.yesNo === true ? styles.ynYes : ''}`}
                  onClick={() => update(row, { yesNo: true })}
                  aria-pressed={val.yesNo === true}
                >Yes</button>
                <button
                  id={task.id + '-' + row + '-no'}
                  className={`${styles.ynBtn} ${val.yesNo === false ? styles.ynNo : ''}`}
                  onClick={() => update(row, { yesNo: false })}
                  aria-pressed={val.yesNo === false}
                >No</button>
              </div>

              {/* Score slider */}
              <div className={styles.scoreRow}>
                <span className={styles.scoreLabel}>Score</span>
                <div className={styles.scorePips}>
                  {SCORE_OPTIONS.map(s => (
                    <button
                      key={s}
                      className={`${styles.pip} ${val.score === s ? styles.pipActive : ''}`}
                      onClick={() => update(row, { score: s })}
                      aria-label={'Score ' + s}
                    >{s}</button>
                  ))}
                </div>
              </div>

              {/* Optional note */}
              <textarea
                id={task.id + '-' + row + '-note'}
                className={styles.noteInput}
                placeholder="Optional note…"
                value={val.note}
                rows={2}
                onChange={(e) => update(row, { note: e.target.value })}
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
