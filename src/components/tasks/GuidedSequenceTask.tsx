import { useState } from 'react';
import { GuidedSequenceTask as GuidedSequenceTaskType } from '../../types/program';
import { TaskCard } from './shared/TaskCard';
import { AutosaveIndicator } from './shared/AutosaveIndicator';
import styles from './GuidedSequenceTask.module.css';
import shared from './shared/taskInputs.module.css';

export interface GuidedSequenceValue {
  currentStep: number;
  stepNotes: Record<number, string>;
}

interface Props {
  task: GuidedSequenceTaskType;
  isComplete: boolean;
  savedResponse: GuidedSequenceValue;
  onResponse: (value: GuidedSequenceValue) => void;
  onComplete: (done: boolean) => void;
}

export function GuidedSequenceTask({ task, isComplete, savedResponse, onResponse, onComplete }: Props) {
  const current = savedResponse?.currentStep ?? 0;
  const stepNotes = savedResponse?.stepNotes ?? {};
  const [expanded, setExpanded] = useState(!isComplete);

  const totalSteps = task.steps.length;
  const isLastStep = current === totalSteps - 1;
  const isDone = current >= totalSteps;

  const updateNote = (note: string) => {
    onResponse({ currentStep: current, stepNotes: { ...stepNotes, [current]: note } });
  };

  const advance = () => {
    const next = current + 1;
    onResponse({ currentStep: next, stepNotes });
    if (next >= totalSteps) {
      onComplete(true);
    }
  };

  const back = () => {
    const prev = Math.max(0, current - 1);
    onResponse({ currentStep: prev, stepNotes });
    onComplete(false);
  };

  return (
    <TaskCard taskId={task.id} title={task.title} description={task.description} isComplete={isComplete} isRequired={task.completionRule.required}>
      {/* Step overview dots */}
      <div className={styles.dots}>
        {task.steps.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i < current ? styles.dotDone : ''} ${i === current ? styles.dotActive : ''}`}
          />
        ))}
      </div>
      <p className={styles.progress}>Step {Math.min(current + 1, totalSteps)} of {totalSteps}</p>

      {/* Toggle full-screen step view */}
      {!isDone && (
        <button className={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲ Collapse exercise' : '▼ Open exercise'}
        </button>
      )}

      {/* Full-screen step */}
      {expanded && !isDone && (
        <div className={styles.stepView}>
          {/* Step content */}
          <div className={styles.stepContent}>
            <div className={styles.stepNum}>Step {current + 1}</div>
            <p className={styles.stepText}>{task.steps[current]}</p>
          </div>

          {/* Step reflection note */}
          <label className={styles.noteLabel} htmlFor={task.id + '-note-' + current}>
            Your reflection for this step
          </label>
          <textarea
            id={task.id + '-note-' + current}
            className={shared.textarea}
            placeholder="What came up for you in this step?"
            value={stepNotes[current] ?? ''}
            onChange={(e) => updateNote(e.target.value)}
          />
          <div className={styles.saveRow}><AutosaveIndicator saveKey={stepNotes[current]} /></div>

          {/* Navigation */}
          <div className={styles.navRow}>
            {current > 0 && (
              <button id={task.id + '-back'} className={styles.backBtn} onClick={back}>
                ← Back
              </button>
            )}
            <button
              id={task.id + '-next'}
              className={`${styles.nextBtn} ${isLastStep ? styles.nextBtnFinish : ''}`}
              onClick={advance}
            >
              {isLastStep ? '✓ Complete Exercise' : 'Next Step →'}
            </button>
          </div>
        </div>
      )}

      {/* Done state */}
      {isDone && (
        <div className={styles.doneState}>
          <span className={styles.doneIcon}>⚡</span>
          <p className={styles.doneText}>Exercise complete. All {totalSteps} steps done.</p>
        </div>
      )}
    </TaskCard>
  );
}
