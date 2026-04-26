import { useState } from 'react';
import styles from './AffirmationSession.module.css';

interface AffirmationSessionProps {
  title: string;
  affirmations: string[];
  sessionId: string;
  onComplete: () => void;
  isComplete: boolean;
}

export function AffirmationSession({ title, affirmations, sessionId, onComplete, isComplete }: AffirmationSessionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [confirmed, setConfirmed] = useState(isComplete);
  const total = affirmations.length;
  const pct = Math.round(((currentIdx + 1) / total) * 100);

  const next = () => {
    if (currentIdx < total - 1) setCurrentIdx(i => i + 1);
  };
  const prev = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onComplete();
  };

  const atEnd = currentIdx === total - 1;

  return (
    <div className={`${styles.card} ${confirmed ? styles.cardDone : ''}`}>
      <div className={styles.header}>
        <span className={styles.tag}>AFFIRMATION SESSION</span>
        <h3 className={styles.title}>{title}</h3>
      </div>

      {/* Progress track */}
      <div className={styles.track}>
        <div className={styles.trackFill} style={{ width: pct + '%' }} />
      </div>
      <div className={styles.counters}>
        <span className={styles.idx}>{currentIdx + 1} of {total}</span>
        <span className={styles.pct}>{pct}%</span>
      </div>

      {/* Affirmation card */}
      <div className={styles.affirmCard} key={sessionId + '-' + currentIdx}>
        <p className={styles.affirmText}>{affirmations[currentIdx]}</p>
      </div>

      {/* Navigation */}
      <div className={styles.nav}>
        <button
          id={sessionId + '-prev'}
          className={styles.navBtn}
          onClick={prev}
          disabled={currentIdx === 0}
          aria-label="Previous affirmation"
        >←</button>
        <button
          id={sessionId + '-next'}
          className={`${styles.navBtn} ${styles.navBtnNext}`}
          onClick={next}
          disabled={atEnd}
          aria-label="Next affirmation"
        >{atEnd ? '✓ Done' : 'Next →'}</button>
      </div>

      {/* Confirm read */}
      {!confirmed ? (
        <button
          id={sessionId + '-confirm'}
          className={styles.confirmBtn}
          onClick={handleConfirm}
          aria-label="Mark affirmations complete"
        >
          ✓ I've read all affirmations
        </button>
      ) : (
        <div className={styles.completeBanner}>
          ✓ Affirmations complete
        </div>
      )}
    </div>
  );
}
