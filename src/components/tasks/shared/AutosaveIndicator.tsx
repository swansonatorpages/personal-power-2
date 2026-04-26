import { useEffect, useRef, useState } from 'react';
import styles from './AutosaveIndicator.module.css';

interface AutosaveIndicatorProps {
  /** Pass a value that changes on every save — the indicator fires on each change */
  saveKey: unknown;
}

export function AutosaveIndicator({ saveKey }: AutosaveIndicatorProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 1800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [saveKey]);

  return (
    <div
      className={`${styles.indicator} ${visible ? styles.visible : ''}`}
      aria-live="polite"
      aria-label="Saved"
    >
      <span className={styles.dot} />
      Saved
    </div>
  );
}
