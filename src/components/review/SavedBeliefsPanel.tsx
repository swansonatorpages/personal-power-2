import { useAppStore } from '../../store/appStore';
import { selectSavedBeliefs, selectRulesChanged } from '../../store/evidenceSelectors';
import styles from './SavedBeliefsPanel.module.css';

export function SavedBeliefsPanel() {
  const state = useAppStore(s => s);
  const beliefs = selectSavedBeliefs(state);
  const rules = selectRulesChanged(state);
  const hasContent = beliefs.length > 0 || rules.length > 0;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.icon}>💡</span>
        <div>
          <h3 className={styles.title}>Beliefs & Rules</h3>
          <p className={styles.sub}>Captured from Days 9, 10 & 11</p>
        </div>
      </div>

      {!hasContent ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            Complete the beliefs exercises in Days 9–11 and your saved beliefs and changed rules will appear here.
          </p>
        </div>
      ) : (
        <div className={styles.sections}>
          {beliefs.length > 0 && (
            <div className={styles.section}>
              <span className={styles.sectionTag}>Empowering Beliefs</span>
              {beliefs.map(b => (
                <div key={b.id} className={`${styles.entry} ${styles.belief}`}>
                  <span className={styles.bullet}>💡</span>
                  <div>
                    <p className={styles.text}>{b.text}</p>
                    <span className={styles.source}>{b.dayTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {rules.length > 0 && (
            <div className={styles.section}>
              <span className={styles.sectionTag}>Rules You Changed</span>
              {rules.map(r => (
                <div key={r.id} className={`${styles.entry} ${styles.rule}`}>
                  <span className={styles.bullet}>🌿</span>
                  <div>
                    <p className={styles.text}>{r.text}</p>
                    <span className={styles.source}>{r.dayTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
