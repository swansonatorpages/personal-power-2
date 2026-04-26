import styles from './DaySummaryCard.module.css';

interface DaySummaryCardProps {
  conceptSummary: string;
  quote?: string;
  assignmentIntro?: string;
}

export function DaySummaryCard({ conceptSummary, quote, assignmentIntro }: DaySummaryCardProps) {
  return (
    <div className={styles.card}>
      {/* Concept */}
      <div className={styles.concept}>
        <span className={styles.conceptTag}>Today's Focus</span>
        <p className={styles.conceptText}>{conceptSummary}</p>
      </div>

      {/* Assignment intro — the "why" before the tasks */}
      {assignmentIntro && (
        <div className={styles.intro}>
          <p className={styles.introText}>{assignmentIntro}</p>
        </div>
      )}

      {/* Quote */}
      {quote && (
        <div className={styles.quote}>
          <span className={styles.quoteGlyph}>"</span>
          <p className={styles.quoteText}>{quote}</p>
        </div>
      )}
    </div>
  );
}
