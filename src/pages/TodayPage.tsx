import { useCallback, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { TodayHeader } from '../components/today/TodayHeader';
import { CarryForwardStrip } from '../components/today/CarryForwardStrip';
import { TaskList } from '../components/today/TaskList';
import { NotesPanel } from '../components/today/NotesPanel';
import { CompletionFooter } from '../components/today/CompletionFooter';
import { CelebrationLayer } from '../components/engagement/CelebrationLayer';
import { RecoveryDialog } from '../components/engagement/RecoveryDialog';
import { InstallPromptCard } from '../components/system/InstallPromptCard';
import { useAppStore } from '../store/appStore';
import { getDayByNumber } from '../lib/programEngine';
import { getEffectiveProgramDay } from '../lib/dateLogic';
import { selectRandomMotivationEntry } from '../store/evidenceSelectors';
import { buildCelebrationEvent, computeRecoveryState } from '../lib/engagementEngine';
import type { CelebrationEvent } from '../lib/engagementEngine';
import type { EvidenceEntry } from '../types/evidence';
import styles from './TodayPage.module.css';

/* ── Onboarding screen when program hasn't started ── */
function OnboardingScreen() {
  const initializeProgram = useAppStore((s) => s.initializeProgram);
  return (
    <AppShell headerTitle="Personal Power II" headerSubtitle="Ready to begin?">
      <div className={styles.onboarding}>
        <div className={styles.onboardingGlyph}>⚡</div>
        <h2 className={styles.onboardingTitle}>Start Your 30-Day Journey</h2>
        <p className={styles.onboardingBody}>
          Build unstoppable momentum through daily exercises, morning rituals,
          and deliberate action. One day at a time.
        </p>
        <div className={styles.onboardingMeta}>
          <span>📅 30 days</span>
          <span>⏱ 15–30 min/day</span>
          <span>📵 Offline first</span>
        </div>
        <button
          id="start-program-btn"
          className={styles.startBtn}
          onClick={() => initializeProgram(new Date().toISOString().split('T')[0])}
        >
          Start Day 1 Today
        </button>
      </div>
    </AppShell>
  );
}

/* ── Motivation card ── */
const CATEGORY_ICONS: Record<string, string> = {
  success: '🏆', decision: '⚡', belief: '💡', goal: '🎯',
  problem: '🔧', note: '📝', confidence: '⚡', identity: '🌿',
};

function MotivationCard({ state }: { state: ReturnType<typeof useAppStore.getState> }) {
  const [entry, setEntry] = useState<EvidenceEntry | null>(() => selectRandomMotivationEntry(state));
  const draw = () => setEntry(selectRandomMotivationEntry(state));
  if (!entry) return null;

  return (
    <div className={styles.motivCard}>
      <div className={styles.motivHeader}>
        <span className={styles.motivIcon}>{CATEGORY_ICONS[entry.category] ?? '✨'}</span>
        <span className={styles.motivTag}>Evidence of Your Capability</span>
        <button id="motivation-refresh" className={styles.motivRefresh} onClick={draw} aria-label="Draw another">
          ↻
        </button>
      </div>
      <p className={styles.motivText}>{entry.text}</p>
      {entry.dayTitle && <span className={styles.motivSource}>{entry.dayTitle}</span>}
    </div>
  );
}

/* ── Main Today page ── */
export function TodayPage() {
  const fullState       = useAppStore(s => s);
  const startDate       = useAppStore((s) => s.activeProgramStartDate);
  const cutoff          = useAppStore((s) => s.appSettings.dayCutoffTime);
  const isProgramStrict = useAppStore((s) => s.appSettings.isProgramDayTrueMode);
  const manualPointer   = useAppStore((s) => s.currentDayPointer);
  const taskCompletions = useAppStore((s) => s.taskCompletions);
  const dayCompletions  = useAppStore((s) => s.dayCompletions);
  const dailyNotes      = useAppStore((s) => s.dailyNotes);

  const markDayComplete = useAppStore((s) => s.markDayComplete);
  const addDailyNote    = useAppStore((s) => s.addDailyNote);

  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);

  // Determine effective day
  const effectiveDay = !startDate 
    ? 1 
    : isProgramStrict
      ? Math.min(30, Math.max(1, getEffectiveProgramDay(new Date(), cutoff, startDate)))
      : manualPointer;

  const dayData   = getDayByNumber(effectiveDay);
  const isDayDone = dayCompletions[effectiveDay] ?? false;

  // Per-day slices
  const dayTaskCompletions = taskCompletions[effectiveDay] ?? {};
  const todayNote          = dailyNotes[effectiveDay] ?? '';

  // Required task gating
  const requiredTasks     = dayData?.tasks.filter(t => t.completionRule.required) ?? [];
  const completedRequired = requiredTasks.filter(t => dayTaskCompletions[t.id]).length;

  // Recovery detection
  const recovery = computeRecoveryState(fullState);

  // Stable callbacks (MOVED UP)
  const handleNoteChange = useCallback((note: string) => {
    addDailyNote(effectiveDay, note);
  }, [effectiveDay, addDailyNote]);

  const handleFinishDay = useCallback(() => {
    markDayComplete(effectiveDay, true);
    const event = buildCelebrationEvent('day', effectiveDay, { ...dayCompletions, [effectiveDay]: true });
    if (event) setCelebration(event);
  }, [effectiveDay, markDayComplete, dayCompletions]);

  const handleDismissCelebration = useCallback(() => setCelebration(null), []);

  // Gate 1: no start date yet (AFTER HOOKS)
  if (!startDate) return <OnboardingScreen />;

  // Gate 2: Invalid day or program complete (AFTER HOOKS)
  if (!dayData) {
    return (
      <AppShell headerTitle="Program Complete">
        <div className={styles.complete}>
          <p className={styles.completeGlyph}>🏆</p>
          <h2 className={styles.completeTitle}>30 Days Done!</h2>
          <p className={styles.completeBody}>You've completed the Personal Power II program.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell headerTitle="Today" headerSubtitle={dayData.title}>
      {/* Celebration overlay */}
      <CelebrationLayer event={celebration} onDismiss={handleDismissCelebration} />

      {/* Recovery dialog */}
      {showRecovery && <RecoveryDialog onClose={() => setShowRecovery(false)} />}

      <div className={styles.page}>
        {/* Install nudge */}
        <InstallPromptCard />

        {/* Recovery nudge banner */}
        {recovery.isInRecovery && !showRecovery && (
          <button
            id="recovery-nudge-btn"
            className={styles.recoveryNudge}
            onClick={() => setShowRecovery(true)}
          >
            <span>🧭</span>
            <span className={styles.recoveryNudgeText}>
              {recovery.missedDays.length} missed day{recovery.missedDays.length !== 1 ? 's' : ''} — tap to review options
            </span>
            <span className={styles.recoveryNudgeArrow}>→</span>
          </button>
        )}

        <TodayHeader
          dayNumber={effectiveDay}
          title={dayData.title}
          dayType={dayData.type}
          startDate={startDate}
        />

        <CarryForwardStrip dayNumber={effectiveDay} />

        {/* Prior evidence motivation card */}
        <MotivationCard state={fullState} />

        <TaskList
          tasks={dayData.tasks}
          dayNumber={effectiveDay}
          taskCompletions={dayTaskCompletions}
        />

        <NotesPanel
          dayNumber={effectiveDay}
          value={todayNote}
          onChange={handleNoteChange}
        />

        {/* Spacer so content clears the sticky CompletionFooter */}
        <div style={{ height: 80 }} aria-hidden />
      </div>

      <CompletionFooter
        dayNumber={effectiveDay}
        completedCount={completedRequired}
        totalRequired={requiredTasks.length}
        isDayComplete={isDayDone}
        onFinishDay={handleFinishDay}
      />
    </AppShell>
  );
}
