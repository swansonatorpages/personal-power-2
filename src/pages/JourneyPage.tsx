import { useAppStore } from '../store/appStore';
import { AppShell } from '../components/layout/AppShell';
import { JourneyGrid } from '../components/journey/JourneyGrid';
import { StreakCard } from '../components/journey/StreakCard';
import { CompletionStats } from '../components/journey/CompletionStats';
import { MomentumBanner } from '../components/journey/MomentumBanner';
import { buildTiles, computeProgressStats } from '../lib/progressEngine';
import styles from './JourneyPage.module.css';

/* ── Status legend ── */
const LEGEND = [
  { status: 'complete', color: '#48c774', label: 'Complete' },
  { status: 'partial',  color: '#f5c842', label: 'Partial' },
  { status: 'today',    color: '#f5c842', label: 'Today', border: true },
  { status: 'missed',   color: '#ff6b6b', label: 'Missed' },
  { status: 'weekend',  color: '#6495ed', label: 'Bonus' },
  { status: 'future',   color: 'rgba(255,255,255,0.2)', label: 'Upcoming' },
];

export function JourneyPage() {
  const state           = useAppStore(s => s);
  const dayCompletions  = useAppStore(s => s.dayCompletions);
  const taskCompletions = useAppStore(s => s.taskCompletions);
  const currentDay      = useAppStore(s => s.currentDayPointer);
  const startDate       = useAppStore(s => s.activeProgramStartDate);

  const hasStarted = !!startDate;
  const tiles = buildTiles(dayCompletions, taskCompletions, currentDay, hasStarted);
  const stats = computeProgressStats(state);

  return (
    <AppShell headerTitle="Journey" headerSubtitle={stats.currentPhase + ' Phase · Day ' + currentDay}>
      <div className={styles.page}>

        {/* Momentum banner */}
        <MomentumBanner stats={stats} currentDay={currentDay} />

        {/* Streak + phase */}
        <StreakCard stats={stats} currentDay={currentDay} />

        {/* 30-day board */}
        <section className={styles.boardSection}>
          <div className={styles.boardHeader}>
            <h2 className={styles.boardTitle}>30-Day Board</h2>
            <span className={styles.boardSub}>{stats.totalComplete} of 30 days complete</span>
          </div>

          <JourneyGrid tiles={tiles} currentDay={currentDay} />

          {/* Legend */}
          <div className={styles.legend}>
            {LEGEND.map(l => (
              <div key={l.status} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{
                    background: l.color,
                    boxShadow: l.border ? `0 0 0 2px ${l.color}55` : undefined,
                  }}
                />
                <span className={styles.legendLabel}>{l.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Completion stats */}
        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Progress Stats</h2>
          <CompletionStats stats={stats} currentDay={currentDay} />
        </section>

        {/* Milestone markers */}
        <section className={styles.milestonesSection}>
          <h2 className={styles.sectionTitle}>Milestone Markers</h2>
          <div className={styles.milestoneList}>
            {[7, 14, 21, 30].map(m => {
              const done = dayCompletions[m] ?? false;
              const isCurrent = m === currentDay;
              const passed = m < currentDay;
              return (
                <div
                  key={m}
                  className={`${styles.milestoneRow} ${done ? styles.milestoneDone : ''} ${isCurrent ? styles.milestoneCurrent : ''}`}
                >
                  <span className={styles.milestoneEmoji}>
                    {done ? '✅' : isCurrent ? '🎯' : passed ? '⬜' : '🔒'}
                  </span>
                  <div className={styles.milestoneInfo}>
                    <span className={styles.milestoneName}>
                      {m === 7 ? 'One Week · Day 7' :
                       m === 14 ? 'Halfway · Day 14' :
                       m === 21 ? 'Momentum · Day 21' :
                       'Mastery · Day 30'}
                    </span>
                    <span className={styles.milestoneStatus}>
                      {done ? 'Achieved' : isCurrent ? 'Today!' : passed ? 'Missed' : `${m - currentDay} days away`}
                    </span>
                  </div>
                  {done && <span className={styles.milestoneBadge}>✓</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom spacer */}
        <div style={{ height: 24 }} aria-hidden />
      </div>
    </AppShell>
  );
}
