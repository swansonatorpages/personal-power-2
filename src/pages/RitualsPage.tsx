import { useAppStore } from '../store/appStore';
import { AppShell } from '../components/layout/AppShell';
import { RitualCard } from '../components/rituals/RitualCard';
import { MorningQuestionsPanel } from '../components/rituals/MorningQuestionsPanel';
import { computeRitualInfos } from '../lib/ritualEngine';
import styles from './RitualsPage.module.css';

const ACCENT_COLORS: Record<string, string> = {
  morning_questions: '#f5c842',
  water_rich_diet:   '#6495ed',
  income_ideas:      '#20d4b8',
};

export function RitualsPage() {
  const state      = useAppStore(s => s);
  const currentDay = useAppStore(s => s.currentDayPointer);
  const startDate  = useAppStore(s => s.activeProgramStartDate);

  const allRituals = computeRitualInfos(currentDay, state);
  const active     = allRituals.filter(r => r.status === 'active');
  const upcoming   = allRituals.filter(r => r.status === 'upcoming');
  const completed  = allRituals.filter(r => r.status === 'completed');

  const hasMorningActive = active.some(r => r.habit.id === 'morning_questions');

  return (
    <AppShell headerTitle="Rituals" headerSubtitle={`Day ${currentDay} · ${active.length} active`}>
      <div className={styles.page}>

        {/* ── Not started ── */}
        {!startDate && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🌅</span>
            <h2 className={styles.emptyTitle}>Rituals Unlock as You Progress</h2>
            <p className={styles.emptyText}>
              Start the program from the Today tab to begin activating recurring practices.
            </p>
          </div>
        )}

        {/* ── Active rituals ── */}
        {active.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} style={{ background: '#48c774' }} />
              <h2 className={styles.sectionTitle}>Active Now</h2>
              <span className={styles.sectionCount}>{active.length}</span>
            </div>

            {/* Morning Questions gets dedicated panel */}
            {hasMorningActive && (
              <MorningQuestionsPanel dayNumber={currentDay} />
            )}

            {/* Other active rituals */}
            {active
              .filter(r => r.habit.id !== 'morning_questions')
              .map(r => (
                <RitualCard
                  key={r.habit.id}
                  ritualInfo={r}
                  currentDay={currentDay}
                  accentColor={ACCENT_COLORS[r.habit.id]}
                />
              ))}
          </section>
        )}

        {/* ── No active rituals yet ── */}
        {active.length === 0 && startDate && (
          <div className={styles.noActive}>
            <span className={styles.noActiveIcon}>⏳</span>
            <p className={styles.noActiveText}>
              No rituals active yet on Day {currentDay}.
              Morning Power Questions unlock on Day 8, Income Ideas on Day 18, and Breathing & Diet on Day 23.
            </p>
          </div>
        )}

        {/* ── Upcoming rituals ── */}
        {upcoming.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} style={{ background: '#f5c842' }} />
              <h2 className={styles.sectionTitle}>Upcoming</h2>
              <span className={styles.sectionCount}>{upcoming.length}</span>
            </div>
            {upcoming.map(r => (
              <RitualCard
                key={r.habit.id}
                ritualInfo={r}
                currentDay={currentDay}
                accentColor={ACCENT_COLORS[r.habit.id]}
              />
            ))}
          </section>
        )}

        {/* ── Completed rituals ── */}
        {completed.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} style={{ background: '#6495ed' }} />
              <h2 className={styles.sectionTitle}>Completed</h2>
              <span className={styles.sectionCount}>{completed.length}</span>
            </div>
            {completed.map(r => (
              <RitualCard
                key={r.habit.id}
                ritualInfo={r}
                currentDay={currentDay}
                accentColor={ACCENT_COLORS[r.habit.id]}
              />
            ))}
          </section>
        )}

        {/* ── What are rituals? info block ── */}
        <div className={styles.infoBlock}>
          <h3 className={styles.infoTitle}>Why Rituals Matter</h3>
          <p className={styles.infoText}>
            Rituals are the bridge between knowledge and transformation. Done consistently, they condition your nervous system to operate at a higher level automatically — reducing the effort required to stay in peak state.
          </p>
          <div className={styles.infoGrid}>
            {[
              { icon: '☀️', label: 'Morning Qs', sub: 'Day 8–30 · Directs your focus daily' },
              { icon: '💡', label: 'Income Ideas', sub: 'Day 18–27 · 3 ideas per day' },
              { icon: '💧', label: 'Breathe & Eat', sub: 'Day 23–30 · 10 breaths, 70% water-rich' },
            ].map(item => (
              <div key={item.label} className={styles.infoItem}>
                <span className={styles.infoIcon}>{item.icon}</span>
                <span className={styles.infoLabel}>{item.label}</span>
                <span className={styles.infoSub}>{item.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 24 }} aria-hidden />
      </div>
    </AppShell>
  );
}
