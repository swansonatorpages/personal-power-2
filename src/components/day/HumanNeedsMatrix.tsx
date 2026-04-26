import { useAppStore } from '../../store/appStore';
import styles from './HumanNeedsMatrix.module.css';

const NEEDS = [
  {
    id: 'certainty',
    label: 'Certainty / Comfort',
    emoji: '🛡️',
    desc: 'Need for safety, stability, and predictability',
    color: '#6495ed',
  },
  {
    id: 'variety',
    label: 'Uncertainty / Variety',
    emoji: '⚡',
    desc: 'Need for change, challenge, and stimulation',
    color: '#f5c842',
  },
  {
    id: 'significance',
    label: 'Significance',
    emoji: '⭐',
    desc: 'Need to feel unique, important, special',
    color: '#ba55d3',
  },
  {
    id: 'connection',
    label: 'Connection / Love',
    emoji: '❤️',
    desc: 'Need for intimacy, togetherness, and love',
    color: '#ff6b6b',
  },
  {
    id: 'growth',
    label: 'Growth',
    emoji: '🌱',
    desc: 'Need to expand capacity, skills, and understanding',
    color: '#48c774',
  },
  {
    id: 'contribution',
    label: 'Contribution',
    emoji: '🌍',
    desc: 'Need to give beyond yourself and make a difference',
    color: '#20d4b8',
  },
];

type NeedRow = { score: number; met: boolean | null; note: string };
type MatrixState = Record<string, NeedRow>;

const SCORE_PIPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface HumanNeedsMatrixProps {
  /** Unique key in the store — e.g. 'day21_needs_matrix' */
  taskId: string;
  dayNumber: number;
}

export function HumanNeedsMatrix({ taskId, dayNumber }: HumanNeedsMatrixProps) {
  const savedResponse  = useAppStore(s => s.taskResponses[dayNumber]?.[taskId]) as MatrixState | undefined;
  const updateTaskResponse = useAppStore(s => s.updateTaskResponse);
  const markTaskComplete   = useAppStore(s => s.markTaskComplete);

  const matrix: MatrixState = savedResponse ?? {};

  const update = (needId: string, patch: Partial<NeedRow>) => {
    const current = matrix[needId] ?? { score: 0, met: null, note: '' };
    const next: MatrixState = { ...matrix, [needId]: { ...current, ...patch } };
    updateTaskResponse(dayNumber, taskId, next);
    const allRated = NEEDS.every(n => (next[n.id]?.score ?? 0) > 0);
    markTaskComplete(dayNumber, taskId, allRated);
  };

  return (
    <div className={styles.matrix}>
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>The Six Human Needs</h3>
        <p className={styles.headerSub}>Rate how well each need is being met in your life right now</p>
      </div>

      <div className={styles.grid}>
        {NEEDS.map(need => {
          const row = matrix[need.id] ?? { score: 0, met: null, note: '' };
          const isMet = row.score >= 6;
          return (
            <div
              key={need.id}
              className={styles.needCard}
              style={{ borderColor: row.score > 0 ? need.color + '44' : undefined }}
            >
              {/* Need header */}
              <div className={styles.needHeader}>
                <span className={styles.needEmoji}>{need.emoji}</span>
                <div>
                  <p className={styles.needLabel}>{need.label}</p>
                  <p className={styles.needDesc}>{need.desc}</p>
                </div>
              </div>

              {/* Score pips */}
              <div className={styles.pipsRow} role="group" aria-label={'Score for ' + need.label}>
                {SCORE_PIPS.map(s => {
                  const active = s <= row.score;
                  return (
                    <button
                      key={s}
                      id={taskId + '-' + need.id + '-' + s}
                      className={`${styles.pip} ${active ? styles.pipActive : ''}`}
                      style={active ? { background: need.color, borderColor: need.color } : undefined}
                      onClick={() => update(need.id, { score: s })}
                      aria-label={need.label + ' score ' + s}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Met indicator */}
              <div className={styles.metRow}>
                <span className={`${styles.metBadge} ${isMet ? styles.metBadgeYes : styles.metBadgeNo}`}>
                  {row.score === 0 ? '—' : isMet ? '✓ Being met' : '✗ Needs attention'}
                </span>
                {row.score > 0 && (
                  <span className={styles.scoreLabel} style={{ color: need.color }}>
                    {row.score}/10
                  </span>
                )}
              </div>

              {/* Note */}
              <textarea
                id={taskId + '-' + need.id + '-note'}
                className={styles.noteInput}
                placeholder="Optional: how is this need showing up for you?"
                value={row.note}
                rows={2}
                onChange={e => update(need.id, { note: e.target.value })}
              />
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      <div className={styles.summary}>
        {NEEDS.map(need => {
          const score = matrix[need.id]?.score ?? 0;
          return (
            <div key={need.id} className={styles.summaryItem}>
              <span className={styles.summaryEmoji}>{need.emoji}</span>
              <div
                className={styles.summaryBar}
                style={{ background: score > 0 ? need.color + '30' : undefined }}
              >
                <div
                  className={styles.summaryFill}
                  style={{ height: (score / 10 * 100) + '%', background: need.color }}
                />
              </div>
              <span className={styles.summaryScore}>{score || '–'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
