import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useAppStore } from '../store/appStore';
import { programDays } from '../data/programDays';
import { ConfidenceBankCard } from '../components/review/ConfidenceBankCard';
import { EvidenceTimeline } from '../components/review/EvidenceTimeline';
import { QuickCaptureSheet } from '../components/review/QuickCaptureSheet';
import { GreatestSuccessesPanel } from '../components/review/GreatestSuccessesPanel';
import { SavedBeliefsPanel } from '../components/review/SavedBeliefsPanel';
import { TopGoalsPanel } from '../components/review/TopGoalsPanel';
import styles from './ReviewPage.module.css';

type Tab = 'overview' | 'memory' | 'notes';

export function ReviewPage() {
  const dayCompletions = useAppStore(s => s.dayCompletions);
  const dailyNotes     = useAppStore(s => s.dailyNotes);
  const startDate      = useAppStore(s => s.activeProgramStartDate);
  const currentDay     = useAppStore(s => s.currentDayPointer);

  const [tab, setTab] = useState<Tab>('overview');

  const completedCount = Object.values(dayCompletions).filter(Boolean).length;
  const pct = Math.round((completedCount / 30) * 100);
  const notesCount = Object.values(dailyNotes).filter(n => n?.trim()).length;

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview',  icon: '📊' },
    { id: 'memory',   label: 'Memory',    icon: '🧠' },
    { id: 'notes',    label: 'Notes',     icon: '📝' },
  ];

  return (
    <AppShell headerTitle="Review" headerSubtitle="Reflection & memory">
      <div className={styles.page}>
        {/* ── Tab strip ── */}
        <div className={styles.tabs} role="tablist">
          {TABS.map(t => (
            <button
              key={t.id}
              id={'review-tab-' + t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {tab === 'overview' && (
          <div className={styles.content}>
            {!startDate && (
              <div className={styles.notice}>
                Start the program from the Today tab to track your progress.
              </div>
            )}

            {/* Stats */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{completedCount}</span>
                <span className={styles.statLabel}>Days Done</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{30 - completedCount}</span>
                <span className={styles.statLabel}>Remaining</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue} style={{ color: 'var(--color-gold)' }}>{pct}%</span>
                <span className={styles.statLabel}>Complete</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{notesCount}</span>
                <span className={styles.statLabel}>Notes</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: pct + '%' }} />
              </div>
              <span className={styles.progressLabel}>{completedCount} of 30 days complete</span>
            </div>

            {/* 30-day calendar */}
            <div className={styles.calSection}>
              <h3 className={styles.sectionTitle}>30-Day Map</h3>
              <div className={styles.calendar}>
                {programDays.map(day => {
                  const done = dayCompletions[day.dayNumber] ?? false;
                  const isToday = day.dayNumber === currentDay;
                  return (
                    <div
                      key={day.dayNumber}
                      className={`${styles.calCell} ${done ? styles.calDone : ''} ${isToday ? styles.calToday : ''}`}
                      title={`Day ${day.dayNumber}: ${day.title}`}
                    >
                      {day.dayNumber}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick capture */}
            <QuickCaptureSheet />
          </div>
        )}

        {/* ── Memory tab ── */}
        {tab === 'memory' && (
          <div className={styles.content}>
            <GreatestSuccessesPanel />
            <SavedBeliefsPanel />
            <TopGoalsPanel />
            <ConfidenceBankCard />
            <EvidenceTimeline />
          </div>
        )}

        {/* ── Notes tab ── */}
        {tab === 'notes' && (
          <div className={styles.content}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Daily Notes History</h2>
              <p className={styles.sectionSub}>{notesCount} days with notes</p>
            </div>
            {notesCount === 0 ? (
              <div className={styles.emptyNotes}>
                <span className={styles.emptyIcon}>📓</span>
                <p className={styles.emptyTitle}>No notes yet</p>
                <p className={styles.emptyText}>
                  Add notes at the bottom of each day's page. They'll all appear here in reverse chronological order.
                </p>
              </div>
            ) : (
              <div className={styles.notesList}>
                {Object.entries(dailyNotes)
                  .filter(([, v]) => v?.trim())
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([dayNum, note]) => (
                    <div key={dayNum} className={styles.noteCard}>
                      <div className={styles.noteHeader}>
                        <span className={styles.noteDayBadge}>Day {dayNum}</span>
                        <span className={styles.noteDayTitle}>
                          {programDays.find(d => d.dayNumber === Number(dayNum))?.title ?? ''}
                        </span>
                      </div>
                      <p className={styles.noteText}>{note}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
