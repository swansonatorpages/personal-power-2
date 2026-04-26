import { ConfirmActionTask as ConfirmActionTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import shared from './shared/taskInputs.module.css';

interface Props {
  task: ConfirmActionTaskType;
  isComplete: boolean;
  savedResponse: boolean;
  onResponse: (value: boolean) => void;
  onComplete: (done: boolean) => void;
}

export function ConfirmActionTask({ task, isComplete, onResponse, onComplete }: Props) {
  const toggle = () => {
    const next = !isComplete;
    onResponse(next);
    onComplete(next);
  };

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      <button
        id={task.id + '-confirm'}
        className={`${shared.confirmBtn} ${isComplete ? shared.confirmDone : ''}`}
        onClick={toggle}
        aria-pressed={isComplete}
      >
        {isComplete ? '✓ ' + task.actionText : task.actionText}
      </button>
    </TaskCard>
  );
}
