import { useAppStore } from '../../store/appStore';
import { selectTopGoals } from '../../store/evidenceSelectors';
import styles from './TopGoalsPanel.module.css';

const GOAL_DAY_LABELS: Record<number, string> = {
  12: 'Personal Development',
  13: 'Things',
  14: 'Financial',
  26: 'Committed Goals',
};

export function TopGoalsPanel() {
  const state = useAppStore(s => s);
  const goals = selectTopGoals(state);

  const grouped = goals.reduce<Record<string, typeof goals>>((acc, g) => {
    const key = String(g.dayNumber);
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.icon}>🎯</span>
        <div>
          <h3 className={styles.title}>Top Goals</h3>
          <p className={styles.sub}>From Days 12–14 &amp; 26 · {goals.length} goals</p>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            Complete the Goal Setting Workshop (Days 12–14) and your top goals will appear here automatically.
          </p>
        </div>
      ) : (
        <div className={styles.groups}>
          {Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b)).map(([dayNum, dayGoals]) => (
            <div key={dayNum} className={styles.group}>
              <span className={styles.groupLabel}>{GOAL_DAY_LABELS[Number(dayNum)] ?? 'Day ' + dayNum}</span>
              <div className={styles.goalList}>
                {dayGoals.map((g, i) => (
                  <div key={g.id} className={styles.goal}>
                    <span className={styles.goalNum}>{i + 1}</span>
                    <p className={styles.goalText}>{g.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
