/**
 * engagementEngine.ts
 * Pure engagement logic — no side effects.
 * Computes what engagement UI to surface based on current state.
 */

import type { AppStore } from '../store/appStore';
import { MILESTONES } from './progressEngine';
import { computeProgressStats } from './progressEngine';

/* ── Types ─────────────────────────────────────────────────────── */

export type CelebrationLevel = 'task' | 'day' | 'milestone' | 'program';

export interface CelebrationEvent {
  level: CelebrationLevel;
  title: string;
  subtitle?: string;
  emoji: string;
  dayNumber?: number;
}

export interface RecoveryState {
  missedDays: number[];
  daysBehindCalendar: number;
  isInRecovery: boolean;
  canRecover: boolean;
}

/* ── Milestone detection ─────────────────────────────────────────── */

export function getMilestoneForDay(dayNumber: number, dayCompletions: Record<number, boolean>): {
  label: string;
  emoji: string;
  isNewlyReached: boolean;
} | null {
  if (!(dayNumber in MILESTONES)) return null;
  if (!dayCompletions[dayNumber]) return null;

  const m = MILESTONES[dayNumber];
  return { label: m.label, emoji: m.emoji, isNewlyReached: true };
}

/* ── Celebration event builder ──────────────────────────────────── */

export function buildCelebrationEvent(
  type: 'task' | 'day',
  dayNumber: number,
  dayCompletions: Record<number, boolean>
): CelebrationEvent | null {
  if (type === 'day') {
    const milestone = getMilestoneForDay(dayNumber, dayCompletions);
    if (milestone) {
      return {
        level: 'milestone',
        title: milestone.label + ' Milestone!',
        subtitle: `Day ${dayNumber} complete. You proved you can do it.`,
        emoji: milestone.emoji,
        dayNumber,
      };
    }
    if (dayNumber === 30) {
      return {
        level: 'program',
        title: 'Program Complete',
        subtitle: 'You\'ve completed all 30 days. Mastery achieved.',
        emoji: '🏆',
        dayNumber: 30,
      };
    }
    return {
      level: 'day',
      title: 'Day ' + dayNumber + ' Complete',
      subtitle: 'One more day of proof. Keep the momentum.',
      emoji: '⚡',
      dayNumber,
    };
  }
  return null; // task completions are handled with a micro-animation only
}

/* ── Recovery state ─────────────────────────────────────────────── */

export function computeRecoveryState(state: AppStore): RecoveryState {
  const { dayCompletions, currentDayPointer, activeProgramStartDate, appSettings } = state;

  if (!activeProgramStartDate || !appSettings.isProgramDayTrueMode) {
    return { missedDays: [], daysBehindCalendar: 0, isInRecovery: false, canRecover: false };
  }

  const missedDays: number[] = [];
  for (let d = 1; d < currentDayPointer; d++) {
    if (!dayCompletions[d]) missedDays.push(d);
  }

  const isInRecovery = missedDays.length > 0;
  const daysBehindCalendar = missedDays.length;

  return {
    missedDays,
    daysBehindCalendar,
    isInRecovery,
    canRecover: isInRecovery && daysBehindCalendar <= 3, // allow catch-up if ≤3 days
  };
}

/* ── Reminder timing suggestion ────────────────────────────────── */

export function getReminderSuggestion(completionPct: number): string {
  if (completionPct < 30) return 'Morning check-ins work best early in the program.';
  if (completionPct < 70) return 'You\'re building momentum. Keep your reminder consistent.';
  return 'You\'re almost there. A reminder at your usual time keeps the streak alive.';
}

/* ── Engagement score (simple, readable) ────────────────────────── */

export function computeEngagementScore(state: AppStore): number {
  const stats = computeProgressStats(state);
  let score = 0;
  score += stats.totalComplete * 3;
  score += stats.currentStreak * 5;
  score += stats.totalTasksComplete;
  return score;
}
