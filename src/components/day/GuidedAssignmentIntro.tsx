import styles from './GuidedAssignmentIntro.module.css';

interface GuidedAssignmentIntroProps {
  stepNumber?: number;
  totalSteps?: number;
  sectionTitle: string;
  body: string;
}

export function GuidedAssignmentIntro({ stepNumber, totalSteps, sectionTitle, body }: GuidedAssignmentIntroProps) {
  return (
    <div className={styles.intro}>
      {stepNumber !== undefined && (
        <div className={styles.stepRow}>
          <span className={styles.stepBadge}>Part {stepNumber}{totalSteps ? ' of ' + totalSteps : ''}</span>
        </div>
      )}
      <h3 className={styles.title}>{sectionTitle}</h3>
      <p className={styles.body}>{body}</p>
    </div>
  );
}
