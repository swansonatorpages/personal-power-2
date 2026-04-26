import { ShortTextTask as ShortTextTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import { AutosaveIndicator } from './shared/AutosaveIndicator';
import shared from './shared/taskInputs.module.css';

interface Props {
  task: ShortTextTaskType;
  isComplete: boolean;
  savedResponse: string;
  onResponse: (value: string) => void;
  onComplete: (done: boolean) => void;
}

export function ShortTextTask({ task, isComplete, savedResponse, onResponse, onComplete }: Props) {
  const value = savedResponse ?? '';

  const handleChange = (v: string) => {
    onResponse(v);
    onComplete(v.trim().length > 0);
  };

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      <input
        id={task.id + '-input'}
        className={shared.textInput}
        type="text"
        placeholder={task.placeholder ?? 'Your answer…'}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        aria-label={task.title}
      />
      <div className={shared.saveRow}>
        <AutosaveIndicator saveKey={value} />
      </div>
    </TaskCard>
  );
}
