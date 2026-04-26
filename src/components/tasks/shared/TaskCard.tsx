import { ReactNode } from 'react';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  taskId: string;
  title: string;
  description?: string;
  isComplete: boolean;
  isRequired?: boolean;
  children: ReactNode;
}

export function TaskCard({ taskId, title, description, isComplete, isRequired, children }: TaskCardProps) {
  return (
    <div
      id={'taskcard-' + taskId}
      className={`${styles.card} ${isComplete ? styles.cardDone : ''}`}
      role="group"
      aria-label={title}
    >
      {/* Card header */}
      <div className={styles.header}>
        <div className={styles.statusOrb + (isComplete ? ' ' + styles.orbDone : '')}>
          {isComplete && <span className={styles.orbCheck}>✓</span>}
        </div>
        <div className={styles.meta}>
          <span className={styles.title}>{title}</span>
          {description && <span className={styles.description}>{description}</span>}
        </div>
        {isRequired && !isComplete && (
          <span className={styles.requiredBadge} aria-label="Required">●</span>
        )}
      </div>

      {/* Card body */}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
