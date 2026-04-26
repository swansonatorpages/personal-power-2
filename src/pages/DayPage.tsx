import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DayScreen } from '../components/day/DayScreen';
import { CompletionFooter } from '../components/today/CompletionFooter';
import { getDayByNumber, getWeekendModeContent } from '../lib/programEngine';
import { useAppStore } from '../store/appStore';
import styles from './DayPage.module.css';

const DAY_TYPE_LABELS: Record<string, string> = {
  weekday: 'Exercise Day',
  weekend: 'Bonus Day',
  review: 'Review Day',
  bonus: 'Bonus Day',
};

export function DayPage() {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const dayNum = parseInt(dayNumber ?? '1', 10);

  const dayData     = getDayByNumber(dayNum);
  const bonusSession = getWeekendModeContent(dayNum);

  const taskCompletions = useAppStore((s) => s.taskCompletions[dayNum] ?? {});
  const isDayComplete   = useAppStore((s) => s.dayCompletions[dayNum] ?? false);
  const markDayComplete = useAppStore((s) => s.markDayComplete);

  const handleFinishDay = useCallback(() => {
    markDayComplete(dayNum, true);
  }, [dayNum, markDayComplete]);

  if (!dayData) {
    return (
      <AppShell headerTitle="Not Found">
        <div className={styles.notFound}>
          <span className={styles.notFoundIcon}>🤔</span>
          <p className={styles.notFoundText}>Day {dayNum} doesn't exist in this program.</p>
          <button id="go-back-btn" className={styles.backBtn} onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </AppShell>
    );
  }

  const requiredTasks = dayData.tasks.filter(t => t.completionRule.required);
  const completedRequired = requiredTasks.filter(t => taskCompletions[t.id]).length;

  return (
    <AppShell
      headerTitle={'Day ' + dayNum}
      headerSubtitle={dayData.title}
    >
      {/* ── Hero strip ── */}
      <div className={styles.hero}>
        <div className={styles.dayStamp}>
          <span className={styles.dayWord}>DAY</span>
          <span className={styles.dayNum}>{dayNum}</span>
          <span className={styles.daySlash}>/30</span>
        </div>
        <div className={styles.heroRight}>
          <span className={`${styles.typePill} ${styles['type_' + dayData.type]}`}>
            {DAY_TYPE_LABELS[dayData.type] ?? dayData.type}
          </span>
          <h2 className={styles.heroTitle}>{dayData.title}</h2>
        </div>
      </div>

      {/* ── Day content ── */}
      <DayScreen
        dayData={dayData}
        bonusSession={bonusSession}
        taskCompletions={taskCompletions}
        isDayComplete={isDayComplete}
      />

      {/* Spacer so content clears the sticky footer */}
      <div style={{ height: 90 }} aria-hidden />

      {/* ── Completion footer ── */}
      <CompletionFooter
        dayNumber={dayNum}
        completedCount={completedRequired}
        totalRequired={requiredTasks.length}
        isDayComplete={isDayComplete}
        onFinishDay={handleFinishDay}
      />
    </AppShell>
  );
}
