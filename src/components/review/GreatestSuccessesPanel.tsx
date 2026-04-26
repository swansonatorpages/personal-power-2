import { useAppStore } from '../../store/appStore';
import { selectGreatestSuccesses } from '../../store/evidenceSelectors';
import styles from './GreatestSuccessesPanel.module.css';

export function GreatestSuccessesPanel() {
  const state = useAppStore(s => s);
  const successes = selectGreatestSuccesses(state);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.icon}>🏆</span>
        <div>
          <h3 className={styles.title}>Greatest Successes</h3>
          <p className={styles.sub}>From Day 22 · {successes.length} captured</p>
        </div>
      </div>

      {successes.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            Complete Day 22's "Five Greatest Successes" exercise and they will appear here automatically.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {successes.map((s, i) => (
            <div key={s.id} className={styles.entry}>
              <span className={styles.num}>{i + 1}</span>
              <p className={styles.text}>{s.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
