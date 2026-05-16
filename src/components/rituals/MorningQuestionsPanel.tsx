import { useAppStore } from '../../store/appStore';
import { MORNING_POWER_QUESTIONS } from '../../data/rawProgramContent';
import styles from './MorningQuestionsPanel.module.css';

interface MorningQuestionsPanelProps {
  dayNumber: number;
}

const STORAGE_KEY_PREFIX = 'mpq_';

export function MorningQuestionsPanel({ dayNumber }: MorningQuestionsPanelProps) {
  const taskResponses      = useAppStore(s => s.taskResponses);
  const updateTaskResponse = useAppStore(s => s.updateTaskResponse);
  const markTaskComplete   = useAppStore(s => s.markTaskComplete);

  const responses: Record<string, unknown> = taskResponses[dayNumber] ?? {};
  
  // Pull custom questions from Day 8 if they exist
  const day8Qs = taskResponses[8]?.['day8_morning_qs'] as string[] | undefined;
  const customQuestions = Array.isArray(day8Qs) && day8Qs.length > 0 
    ? day8Qs 
    : MORNING_POWER_QUESTIONS;

  const toggle = (idx: number) => {
    const taskId = STORAGE_KEY_PREFIX + idx;
    const current = !!responses[taskId];
    const next = !current;
    updateTaskResponse(dayNumber, taskId, next);

    // Recalculate completion: all questions checked = complete
    const allResponses = { ...responses, [taskId]: next };
    const checkedCount = customQuestions.filter((_, i) =>
      !!allResponses[STORAGE_KEY_PREFIX + i]
    ).length;
    markTaskComplete(dayNumber, 'morning_questions_panel', checkedCount >= customQuestions.length);
  };

  const checkedCount = customQuestions.filter((_, i) =>
    !!responses[STORAGE_KEY_PREFIX + i]
  ).length;
  const isComplete = checkedCount >= customQuestions.length;

  return (
    <div className={`${styles.panel} ${isComplete ? styles.panelDone : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.icon}>☀️</span>
          <div>
            <h3 className={styles.title}>Morning Power Questions</h3>
            <p className={styles.sub}>{checkedCount} of {customQuestions.length} answered today</p>
          </div>
        </div>
        {isComplete && <span className={styles.completeBadge}>✓ Done</span>}
      </div>

      {/* Progress dots */}
      <div className={styles.dots}>
        {customQuestions.map((_, i) => {
          const checked = !!responses[STORAGE_KEY_PREFIX + i];
          return (
            <span
              key={i}
              className={`${styles.dot} ${checked ? styles.dotDone : ''}`}
              onClick={() => toggle(i)}
            />
          );
        })}
      </div>

      {/* Question checklist */}
      <div className={styles.questions}>
        {customQuestions.map((q, i) => {
          const checked = !!responses[STORAGE_KEY_PREFIX + i];

          return (
            <button
              key={i}
              id={`mpq-toggle-${dayNumber}-${i}`}
              className={`${styles.question} ${checked ? styles.questionDone : ''}`}
              onClick={() => toggle(i)}
              role="checkbox"
              aria-checked={checked}
            >
              <span className={`${styles.qNum} ${checked ? styles.qNumDone : ''}`}>
                {checked ? '✓' : i + 1}
              </span>
              <span className={styles.qText}>{q.replace(/^\d+\.\s*/, '')}</span>
            </button>
          );
        })}
      </div>

      {!isComplete && (
        <p className={styles.hint}>Ask yourself each question and check it off</p>
      )}
    </div>
  );
}
