import { useEffect, useRef } from 'react';
import type { CelebrationEvent } from '../../lib/engagementEngine';
import styles from './CelebrationLayer.module.css';

interface CelebrationLayerProps {
  event: CelebrationEvent | null;
  onDismiss: () => void;
}

export function CelebrationLayer({ event, onDismiss }: CelebrationLayerProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!event) return;
    // Auto-dismiss: task=1.5s, day=3s, milestone/program=5s
    const dur = event.level === 'task' ? 1500 : event.level === 'day' ? 3000 : 5000;
    timerRef.current = setTimeout(onDismiss, dur);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [event, onDismiss]);

  if (!event) return null;

  const isMajor = event.level === 'milestone' || event.level === 'program';

  return (
    <div
      className={`${styles.layer} ${isMajor ? styles.layerMajor : styles.layerMinor}`}
      onClick={onDismiss}
      role="alertdialog"
      aria-live="polite"
      aria-label={event.title}
    >
      <div className={`${styles.card} ${isMajor ? styles.cardMajor : styles.cardMinor}`}>
        {/* Minimal particle ring for major events only */}
        {isMajor && (
          <div className={styles.particleRing} aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className={styles.particle} style={{ '--i': i } as React.CSSProperties} />
            ))}
          </div>
        )}

        <span className={styles.emoji}>{event.emoji}</span>
        <h2 className={styles.title}>{event.title}</h2>
        {event.subtitle && <p className={styles.subtitle}>{event.subtitle}</p>}

        <button
          id="celebration-dismiss"
          className={styles.dismissBtn}
          onClick={onDismiss}
        >
          {isMajor ? 'Continue →' : 'Got it'}
        </button>
      </div>
    </div>
  );
}

/* ── Micro animation: task completion ring ── */

interface TaskCompleteMicroProps {
  show: boolean;
}

export function TaskCompleteMicro({ show }: TaskCompleteMicroProps) {
  if (!show) return null;
  return <span className={styles.micro} aria-hidden />;
}
