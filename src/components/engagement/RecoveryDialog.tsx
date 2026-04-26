import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { computeRecoveryState } from '../../lib/engagementEngine';
import styles from './RecoveryDialog.module.css';

interface RecoveryDialogProps {
  onClose: () => void;
}

export function RecoveryDialog({ onClose }: RecoveryDialogProps) {
  const state              = useAppStore(s => s);
  const setCurrentDayPointer = useAppStore(s => s.setCurrentDayPointer);
  const setProgramMode     = useAppStore(s => s.setProgramMode);
  const recovery           = computeRecoveryState(state);
  const [mode, setMode]    = useState<'explain' | 'choose'>('explain');

  if (!recovery.isInRecovery) return null;

  const handleKeepCalendar = () => {
    // Stay true-mode — no change needed, just close
    onClose();
  };

  const handleSwitchManual = () => {
    // Switch to manual mode so they can catch up at their own pace
    setProgramMode(false);
    setCurrentDayPointer(state.currentDayPointer);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.icon}>🧭</span>
          <div>
            <h2 className={styles.title}>Missed Days Detected</h2>
            <p className={styles.sub}>{recovery.missedDays.length} day{recovery.missedDays.length !== 1 ? 's' : ''} incomplete</p>
          </div>
          <button id="recovery-close" className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {mode === 'explain' ? (
          <>
            <div className={styles.body}>
              <p className={styles.intro}>
                You have incomplete days. Here's what each mode means:
              </p>

              <div className={styles.optionCard}>
                <div className={styles.optionTop}>
                  <span className={styles.optionIcon}>📅</span>
                  <span className={styles.optionLabel}>Calendar Mode (current)</span>
                </div>
                <p className={styles.optionDesc}>
                  Your program day matches the real calendar. Day 1 is always the date you started. If you miss a day, it stays missed. This is the strictest, most honest approach — like 75 Hard.
                </p>
              </div>

              <div className={styles.optionCard}>
                <div className={styles.optionTop}>
                  <span className={styles.optionIcon}>🔄</span>
                  <span className={styles.optionLabel}>Manual Mode</span>
                </div>
                <p className={styles.optionDesc}>
                  You control which day you're on. If life happens, you pause the clock. The program takes longer, but you complete every day fully. Better for irregular schedules.
                </p>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                id="recovery-explain-next"
                className={styles.primaryBtn}
                onClick={() => setMode('choose')}
              >
                Choose How to Continue
              </button>
              <button className={styles.ghostBtn} onClick={onClose}>
                Not now
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.body}>
              <p className={styles.chooseIntro}>
                Missed days: {recovery.missedDays.slice(0, 5).map(d => 'Day ' + d).join(', ')}
                {recovery.missedDays.length > 5 ? ` +${recovery.missedDays.length - 5} more` : ''}
              </p>

              <div className={styles.choiceRow}>
                <button
                  id="recovery-keep-calendar"
                  className={styles.choiceBtn}
                  onClick={handleKeepCalendar}
                >
                  <span className={styles.choiceBtnIcon}>📅</span>
                  <span className={styles.choiceBtnLabel}>Stay Calendar Mode</span>
                  <span className={styles.choiceBtnSub}>Missed days stay missed. Continue from today.</span>
                </button>

                <button
                  id="recovery-switch-manual"
                  className={`${styles.choiceBtn} ${styles.choiceBtnHighlight}`}
                  onClick={handleSwitchManual}
                >
                  <span className={styles.choiceBtnIcon}>🔄</span>
                  <span className={styles.choiceBtnLabel}>Switch to Manual Mode</span>
                  <span className={styles.choiceBtnSub}>Pause the clock. Catch up at your pace.</span>
                </button>
              </div>
            </div>

            <button className={styles.ghostBtn} onClick={() => setMode('explain')}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
