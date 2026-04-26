import { ReflectionNoteTask as ReflectionNoteTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import styles from './ReflectionNoteTask.module.css';
import shared from './shared/taskInputs.module.css';

interface Props {
  task: ReflectionNoteTaskType;
  isComplete: boolean;
  savedResponse: boolean;
  onResponse: (value: boolean) => void;
  onComplete: (done: boolean) => void;
}

export function ReflectionNoteTask({ task, isComplete, onResponse, onComplete }: Props) {
  const toggle = () => {
    const next = !isComplete;
    onResponse(next);
    onComplete(next);
  };

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      {/* Read the content */}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <p className={styles.contentText}>{task.content}</p>
        </div>
      </div>

      <button
        id={task.id + '-ack'}
        className={`${shared.confirmBtn} ${isComplete ? shared.confirmDone : ''}`}
        onClick={toggle}
        aria-pressed={isComplete}
        style={{ marginTop: 12 }}
      >
        {isComplete ? '✓ Read & acknowledged' : 'Mark as read'}
      </button>
    </TaskCard>
  );
}
