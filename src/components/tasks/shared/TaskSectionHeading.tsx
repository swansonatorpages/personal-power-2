import styles from './TaskSectionHeading.module.css';

interface TaskSectionHeadingProps {
  title: string;
  count?: number;
  completed?: number;
}

export function TaskSectionHeading({ title, count, completed }: TaskSectionHeadingProps) {
  return (
    <div className={styles.heading}>
      <span className={styles.title}>{title}</span>
      {count !== undefined && (
        <span className={styles.badge}>
          {completed ?? 0} / {count}
        </span>
      )}
    </div>
  );
}
