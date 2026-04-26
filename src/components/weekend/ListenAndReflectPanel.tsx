import styles from './ListenAndReflectPanel.module.css';

interface ListenAndReflectPanelProps {
  sessionTitle: string;
  instructions: string;
  confirmId: string;
  isConfirmed: boolean;
  onConfirm: () => void;
  reflection?: string;
  onReflectionChange?: (v: string) => void;
}

export function ListenAndReflectPanel({
  sessionTitle, instructions, confirmId, isConfirmed, onConfirm, reflection, onReflectionChange
}: ListenAndReflectPanelProps) {
  return (
    <div className={`${styles.panel} ${isConfirmed ? styles.panelDone : ''}`}>
      <div className={styles.header}>
        <span className={styles.headIcon}>🎧</span>
        <div>
          <span className={styles.headTag}>Listen Session</span>
          <h3 className={styles.headTitle}>{sessionTitle}</h3>
        </div>
      </div>

      <div className={styles.instructions}>
        <p className={styles.instructText}>{instructions}</p>
      </div>

      {onReflectionChange && (
        <div className={styles.reflectSection}>
          <label className={styles.reflectLabel} htmlFor={confirmId + '-reflect'}>
            Your reflection after listening
          </label>
          <textarea
            id={confirmId + '-reflect'}
            className={styles.reflectInput}
            placeholder="What came up for you? What shifted?"
            value={reflection ?? ''}
            onChange={e => onReflectionChange(e.target.value)}
          />
        </div>
      )}

      {!isConfirmed ? (
        <button id={confirmId} className={styles.confirmBtn} onClick={onConfirm}>
          ✓ I've listened to this session
        </button>
      ) : (
        <div className={styles.doneBanner}>✓ Session complete</div>
      )}
    </div>
  );
}
