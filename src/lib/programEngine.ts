import { ProgramDay, RecurringHabit, BonusSession } from '../types/program';
import { programDays } from '../data/programDays';
import { RECURRING_RITUALS } from '../data/recurringRituals';
import { BONUS_SESSIONS } from '../data/bonusSessions';
import { PROGRAM_META } from '../data/programMeta';

/**
 * Returns the full data object for a specific day number.
 */
export function getDayByNumber(dayNumber: number): ProgramDay | undefined {
  return programDays.find(day => day.dayNumber === dayNumber);
}

/**
 * Returns a window of days relative to the current day for UI pagination.
 */
export function getCurrentProgramWindow(currentDay: number) {
  const previous = programDays.filter(d => d.dayNumber < currentDay).slice(-3); // up to 3 previous
  const today = getDayByNumber(currentDay);
  const upcoming = programDays.filter(d => d.dayNumber > currentDay).slice(0, 3); // up to 3 upcoming
  
  return {
    previous,
    today,
    upcoming
  };
}

/**
 * Calculates which recurring habits are active on a given day number.
 * Assumes a habit is active if currentDay >= habitStartDay and currentDay < habitStartDay + durationDays.
 * The raw structure records when a habit is triggered in `carryForwardHabits`.
 */
export function getCarryForwardHabitsForDay(currentDay: number): RecurringHabit[] {
  const activeHabits: RecurringHabit[] = [];

  // Iterate over all days up to the current day to find triggered habits
  for (let i = 1; i <= currentDay; i++) {
    const dayData = getDayByNumber(i);
    if (dayData && dayData.carryForwardHabits.length > 0) {
      for (const habitId of dayData.carryForwardHabits) {
        const habit = RECURRING_RITUALS[habitId];
        if (habit) {
          const daysActive = currentDay - i;
          // If durationDays is specified, check if it's still active. If not specified, it runs forever.
          if (habit.durationDays === undefined || daysActive < habit.durationDays) {
            // Ensure we don't add duplicates if a habit is triggered multiple times (shouldn't happen with our data)
            if (!activeHabits.some(h => h.id === habit.id)) {
              activeHabits.push(habit);
            }
          }
        }
      }
    }
  }

  return activeHabits;
}

/**
 * Retrieves the bonus session content attached to a specific day, if any.
 */
export function getWeekendModeContent(dayNumber: number): BonusSession | undefined {
  const dayData = getDayByNumber(dayNumber);
  if (dayData && dayData.bonusSessionId) {
    return BONUS_SESSIONS[dayData.bonusSessionId];
  }
  return undefined;
}

/**
 * Retrieves general program metadata.
 */
export function getProgramMeta() {
  return PROGRAM_META;
}
