import { useState, useEffect } from 'react';
import { canShowInstallPrompt, triggerInstallPrompt, isRunningStandalone } from '../../lib/pwa';
import styles from './InstallPromptCard.module.css';

export function InstallPromptCard() {
  const [visible, setVisible] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);

  useEffect(() => {
    // Show after a brief delay — don't interrupt first render
    const t = setTimeout(() => {
      if (!isRunningStandalone() && canShowInstallPrompt()) {
        setVisible(true);
      }
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  if (!visible || outcome) return null;

  const handleInstall = async () => {
    const result = await triggerInstallPrompt();
    setOutcome(result);
    if (result === 'accepted') setVisible(false);
  };

  return (
    <div className={styles.card} role="complementary" aria-label="Install app prompt">
      <div className={styles.content}>
        <span className={styles.icon}>📲</span>
        <div>
          <p className={styles.title}>Add to Home Screen</p>
          <p className={styles.sub}>Works fully offline — no app store needed.</p>
        </div>
      </div>
      <div className={styles.actions}>
        <button id="install-prompt-btn" className={styles.installBtn} onClick={handleInstall}>
          Install
        </button>
        <button id="install-dismiss-btn" className={styles.dismissBtn} onClick={() => setVisible(false)}>
          Not now
        </button>
      </div>
    </div>
  );
}
