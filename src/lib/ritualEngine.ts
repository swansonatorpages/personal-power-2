/**
 * ritualEngine.ts
 * Pure derived logic for the ritual/habit overlay system.
 * No storage — computes ritual state from the existing program engine + store.
 */

import { getCarryForwardHabitsForDay } from './programEngine';
import { RECURRING_RITUALS } from '../data/recurringRituals';
import type { RecurringHabit } from '../types/program';
import type { AppStore } from '../store/appStore';

/* ── Types ─────────────────────────────────────────────────────── */

export type RitualStatus = 'active' | 'upcoming' | 'completed' | 'locked';

export interface RitualInfo {
  habit: RecurringHabit;
  status: RitualStatus;
  /** Day the ritual was first triggered (start day) */
  startDay: number;
  /** Last day the ritual is active (inclusive) — undefined = forever */
  endDay: number | undefined;
  /** How many days this habit has been active up to currentDay */
  daysActive: number;
  /** 0–100 completion rate across active days */
  completionRate: number;
  /** True if completed today (any task done) */
  doneToday: boolean;
}

/* ── Ritual config: when each habit first activates ─────────────── */

const HABIT_TRIGGER_DAY: Record<string, number> = {
  morning_questions: 8,
  income_ideas:      18,
  water_rich_diet:   23,
};

/* ── Main ritual engine ─────────────────────────────────────────── */

export function computeRitualInfos(
  currentDay: number,
  state: AppStore
): RitualInfo[] {
  return Object.values(RECURRING_RITUALS).map(habit => {
    const triggerDay = HABIT_TRIGGER_DAY[habit.id] ?? 1;
    const endDay = habit.durationDays !== undefined
      ? triggerDay + habit.durationDays - 1
      : undefined;

    const isStarted  = currentDay >= triggerDay;
    const isExpired  = endDay !== undefined && currentDay > endDay;
    const daysActive = isStarted ? Math.min(currentDay - triggerDay + 1, habit.durationDays ?? Infinity) : 0;

    let status: RitualStatus;
    if (!isStarted) {
      status = 'upcoming';
    } else if (isExpired) {
      status = 'completed';
    } else {
      status = 'active';
    }

    // Completion rate: how many of the active days had any task done
    let completedDays = 0;
    const activeDayCount = isStarted ? Math.min(currentDay - triggerDay + 1, endDay ? endDay - triggerDay + 1 : currentDay) : 0;

    if (isStarted && activeDayCount > 0) {
      for (let d = triggerDay; d <= Math.min(currentDay, endDay ?? currentDay); d++) {
        const habitDayCompletions = state.habitHistory[habit.id]?.[d];
        if (habitDayCompletions) completedDays++;
        else {
          // Also check if any of the habit's tasks were completed in taskCompletions
          const anyTaskDone = habit.tasks.some(t => state.taskCompletions[d]?.[t.id]);
          if (anyTaskDone) completedDays++;
        }
      }
    }

    const completionRate = activeDayCount > 0 ? Math.round((completedDays / activeDayCount) * 100) : 0;

    // Done today: check habitHistory or any task completion for today
    const doneToday = Boolean(state.habitHistory[habit.id]?.[currentDay]) ||
      habit.tasks.some(t => state.taskCompletions[currentDay]?.[t.id]);

    return {
      habit,
      status,
      startDay: triggerDay,
      endDay,
      daysActive,
      completionRate,
      doneToday,
    };
  });
}

/* ── Active habits for today (for CarryForwardStrip) ─────────────── */

export function getActiveRitualsForToday(currentDay: number, state: AppStore): RitualInfo[] {
  return computeRitualInfos(currentDay, state).filter(r => r.status === 'active');
}

/* ── Habit history for mini chart (last N days) ─────────────────── */

export interface HabitDayRecord {
  day: number;
  done: boolean;
}

export function getHabitHistoryWindow(
  habitId: string,
  currentDay: number,
  windowSize: number,
  state: AppStore
): HabitDayRecord[] {
  const habit = RECURRING_RITUALS[habitId];
  if (!habit) return [];

  const result: HabitDayRecord[] = [];
  const triggerDay = HABIT_TRIGGER_DAY[habitId] ?? 1;

  for (let d = Math.max(triggerDay, currentDay - windowSize + 1); d <= currentDay; d++) {
    const done = Boolean(state.habitHistory[habit.id]?.[d]) ||
      habit.tasks.some(t => state.taskCompletions[d]?.[t.id]);
    result.push({ day: d, done });
  }

  return result;
}

/* ── Days until next ritual unlocks ─────────────────────────────── */

export function getDaysUntilRitual(habitId: string, currentDay: number): number {
  const triggerDay = HABIT_TRIGGER_DAY[habitId] ?? 1;
  return Math.max(0, triggerDay - currentDay);
}

/* ── Re-export for convenience ─────────────────────────────────── */
export { getCarryForwardHabitsForDay, HABIT_TRIGGER_DAY };
