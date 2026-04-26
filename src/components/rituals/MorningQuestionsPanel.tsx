import { useState } from 'react';
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

  // Each question gets its own response, stored under morning_q_{i} in taskResponses[dayNumber]
  const responses: Record<string, string> = taskResponses[dayNumber] ?? {};

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleAnswer = (idx: number, value: string) => {
    const taskId = STORAGE_KEY_PREFIX + idx;
    updateTaskResponse(dayNumber, taskId, value);
    // Consider complete when at least 3 questions have non-empty answers
    const allResponses = { ...responses, [taskId]: value };
    const answeredCount = Object.entries(allResponses)
      .filter(([k, v]) => k.startsWith(STORAGE_KEY_PREFIX) && String(v).trim().length > 0)
      .length;
    markTaskComplete(dayNumber, 'morning_questions_panel', answeredCount >= 3);
  };

  const answeredCount = Object.entries(responses)
    .filter(([k, v]) => k.startsWith(STORAGE_KEY_PREFIX) && String(v).trim().length > 0)
    .length;
  const isComplete = answeredCount >= 3;

  return (
    <div className={`${styles.panel} ${isComplete ? styles.panelDone : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.icon}>☀️</span>
          <div>
            <h3 className={styles.title}>Morning Power Questions</h3>
            <p className={styles.sub}>{answeredCount} of {MORNING_POWER_QUESTIONS.length} answered today</p>
          </div>
        </div>
        {isComplete && <span className={styles.completeBadge}>✓ Done</span>}
      </div>

      {/* Progress dots */}
      <div className={styles.dots}>
        {MORNING_POWER_QUESTIONS.map((_, i) => {
          const taskId = STORAGE_KEY_PREFIX + i;
          const answered = String(responses[taskId] ?? '').trim().length > 0;
          return (
            <span
              key={i}
              className={`${styles.dot} ${answered ? styles.dotDone : ''} ${activeIdx === i ? styles.dotActive : ''}`}
              onClick={() => setActiveIdx(activeIdx === i ? null : i)}
            />
          );
        })}
      </div>

      {/* Question list */}
      <div className={styles.questions}>
        {MORNING_POWER_QUESTIONS.map((q, i) => {
          const taskId = STORAGE_KEY_PREFIX + i;
          const value = String(responses[taskId] ?? '');
          const isOpen = activeIdx === i;
          const answered = value.trim().length > 0;

          return (
            <div key={i} className={`${styles.question} ${answered ? styles.questionDone : ''}`}>
              <button
                id={`mpq-toggle-${dayNumber}-${i}`}
                className={styles.questionHeader}
                onClick={() => setActiveIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className={`${styles.qNum} ${answered ? styles.qNumDone : ''}`}>
                  {answered ? '✓' : i + 1}
                </span>
                <span className={styles.qText}>{q.replace(/^\d+\.\s*/, '')}</span>
                <span className={styles.qChevron}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className={styles.answerBox}>
                  <textarea
                    id={`mpq-answer-${dayNumber}-${i}`}
                    className={styles.answerInput}
                    placeholder="What about that makes you feel this way?"
                    value={value}
                    rows={3}
                    onChange={e => handleAnswer(i, e.target.value)}
                    autoFocus
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isComplete && (
        <p className={styles.hint}>Answer at least 3 questions to complete today's ritual</p>
      )}
    </div>
  );
}
