import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { getActiveRitualsForToday } from '../../lib/ritualEngine';
import { MorningQuestionsPanel } from '../rituals/MorningQuestionsPanel';
import { HabitOverlayCard } from '../rituals/HabitOverlayCard';
import styles from './CarryForwardStrip.module.css';

interface CarryForwardStripProps {
  dayNumber: number;
}

export function CarryForwardStrip({ dayNumber }: CarryForwardStripProps) {
  const state    = useAppStore(s => s);
  const navigate = useNavigate();

  const activeRituals = getActiveRitualsForToday(dayNumber, state);
  if (activeRituals.length === 0) return null;

  // Morning Questions gets its own full panel; others get compact overlay cards
  const morningRitual = activeRituals.find(r => r.habit.id === 'morning_questions');
  const otherRituals  = activeRituals.filter(r => r.habit.id !== 'morning_questions');

  return (
    <div className={styles.strip}>
      <div className={styles.stripHeader}>
        <span className={styles.label}>Active Rituals</span>
        <button
          id="rituals-link-btn"
          className={styles.viewAll}
          onClick={() => navigate('/rituals')}
        >
          View all →
        </button>
      </div>

      {/* Morning Questions gets a dedicated panel */}
      {morningRitual && (
        <MorningQuestionsPanel dayNumber={dayNumber} />
      )}

      {/* Other active habits as compact cards */}
      {otherRituals.length > 0 && (
        <div className={styles.cardsRow}>
          {otherRituals.map(r => (
            <HabitOverlayCard key={r.habit.id} ritualInfo={r} currentDay={dayNumber} />
          ))}
        </div>
      )}
    </div>
  );
}
