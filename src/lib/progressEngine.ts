/**
 * progressEngine.ts
 * Pure functions that derive all progress metrics from the store.
 * No side effects, no storage — just computed values.
 */

import { programDays } from '../data/programDays';
import type { AppStore } from '../store/appStore';

/* ── Types ─────────────────────────────────────────────────────── */

export type TileStatus = 'complete' | 'partial' | 'missed' | 'today' | 'future' | 'weekend';

export interface TileData {
  dayNumber: number;
  title: string;
  type: string;
  status: TileStatus;
  /** True if this day number has a milestone marker */
  isMilestone: boolean;
  /** 0–100: proportion of required tasks completed */
  completionPct: number;
}

export interface ProgressStats {
  totalComplete: number;
  totalPartial: number;
  totalMissed: number;
  /** Consecutive days completed counting back from today */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  completionPct: number;
  /** Current phase label, e.g. "Foundation", "Identity Shift", "Mastery" */
  currentPhase: string;
  /** Milestone day crossed if today IS a milestone */
  reachedMilestone: number | null;
  /** Total tasks completed across all days */
  totalTasksComplete: number;
}

/* ── Constants ──────────────────────────────────────────────────── */

export const MILESTONES: Record<number, { label: string; emoji: string }> = {
  7:  { label: 'One Week',     emoji: '🔥' },
  14: { label: 'Halfway',      emoji: '⚡' },
  21: { label: 'Momentum',     emoji: '🚀' },
  30: { label: 'Mastery',      emoji: '🏆' },
};

const PHASES: Array<{ from: number; to: number; label: string }> = [
  { from: 1,  to: 7,  label: 'Foundation' },
  { from: 8,  to: 14, label: 'Identity Shift' },
  { from: 15, to: 21, label: 'Momentum' },
  { from: 22, to: 30, label: 'Mastery' },
];

/* ── Helpers ────────────────────────────────────────────────────── */

function getPhase(dayNumber: number): string {
  return PHASES.find(p => dayNumber >= p.from && dayNumber <= p.to)?.label ?? 'Complete';
}

function getDayCompletionPct(
  dayNumber: number,
  taskCompletions: Record<number, Record<string, boolean>>
): number {
  const day = programDays.find(d => d.dayNumber === dayNumber);
  if (!day || day.tasks.length === 0) return 0;
  const required = day.tasks.filter(t => t.completionRule.required);
  if (required.length === 0) return 0;
  const done = required.filter(t => taskCompletions[dayNumber]?.[t.id]).length;
  return Math.round((done / required.length) * 100);
}

/* ── Tile builder ───────────────────────────────────────────────── */

export function buildTiles(
  dayCompletions: Record<number, boolean>,
  taskCompletions: Record<number, Record<string, boolean>>,
  currentDay: number,
  hasStarted: boolean
): TileData[] {
  return programDays.map(day => {
    const n = day.dayNumber;
    const isComplete  = dayCompletions[n] === true;
    const pct         = getDayCompletionPct(n, taskCompletions);
    const isPartial   = !isComplete && pct > 0;
    const isToday     = n === currentDay;
    const isPast      = n < currentDay;
    const isWeekend   = day.type === 'weekend' || day.type === 'bonus' || day.type === 'review';

    let status: TileStatus;
    if (isComplete) {
      status = 'complete';
    } else if (isToday) {
      status = 'today';
    } else if (isPartial) {
      status = 'partial';
    } else if (isPast && hasStarted) {
      status = isWeekend ? 'weekend' : 'missed';
    } else if (isWeekend && !isComplete) {
      status = 'weekend';
    } else {
      status = 'future';
    }

    return {
      dayNumber: n,
      title: day.title,
      type: day.type,
      status,
      isMilestone: n in MILESTONES,
      completionPct: pct,
    };
  });
}

/* ── Streak calculation ─────────────────────────────────────────── */

export function calcStreaks(
  dayCompletions: Record<number, boolean>,
  currentDay: number
): { current: number; longest: number } {
  // Current streak: count backwards from (currentDay - 1)
  let current = 0;
  for (let d = currentDay - 1; d >= 1; d--) {
    if (dayCompletions[d]) current++;
    else break;
  }

  // Longest streak: scan full range
  let longest = 0;
  let running = 0;
  for (let d = 1; d <= 30; d++) {
    if (dayCompletions[d]) {
      running++;
      if (running > longest) longest = running;
    } else {
      running = 0;
    }
  }

  return { current, longest };
}

/* ── Main stats selector ────────────────────────────────────────── */

export function computeProgressStats(state: AppStore): ProgressStats {
  const { dayCompletions, taskCompletions, currentDayPointer } = state;
  const hasStarted = !!state.activeProgramStartDate;

  const tiles = buildTiles(dayCompletions, taskCompletions, currentDayPointer, hasStarted);
  const complete = tiles.filter(t => t.status === 'complete').length;
  const partial  = tiles.filter(t => t.status === 'partial').length;
  const missed   = tiles.filter(t => t.status === 'missed').length;

  const { current, longest } = calcStreaks(dayCompletions, currentDayPointer);

  const totalTasksComplete = programDays.reduce((sum, day) => {
    const comps = taskCompletions[day.dayNumber] ?? {};
    return sum + Object.values(comps).filter(Boolean).length;
  }, 0);

  const completionPct = Math.round((complete / 30) * 100);
  const currentPhase = getPhase(currentDayPointer);
  const reachedMilestone = currentDayPointer in MILESTONES && dayCompletions[currentDayPointer]
    ? currentDayPointer
    : null;

  return {
    totalComplete: complete,
    totalPartial: partial,
    totalMissed: missed,
    currentStreak: current,
    longestStreak: longest,
    completionPct,
    currentPhase,
    reachedMilestone,
    totalTasksComplete,
  };
}

/* ── Momentum language ──────────────────────────────────────────── */

export function getMomentumMessage(stats: ProgressStats, currentDay: number): string {
  if (!stats.totalComplete && !stats.totalPartial) {
    return 'Your journey starts with a single decision. Make it today.';
  }
  if (stats.currentStreak >= 7) {
    return `${stats.currentStreak} days of proof. Personal Power is compounding.`;
  }
  if (stats.currentStreak >= 3) {
    return `${stats.currentStreak}-day streak. Follow-through is becoming your identity.`;
  }
  if (stats.reachedMilestone) {
    const m = MILESTONES[stats.reachedMilestone];
    return `${m.emoji} ${m.label} milestone reached. You proved you can.`;
  }
  if (stats.completionPct >= 90) {
    return 'You are in the final stretch. Mastery is within reach.';
  }
  if (stats.completionPct >= 50) {
    return `${stats.completionPct}% complete. Momentum is everything from here.`;
  }
  if (stats.totalComplete >= 1) {
    return `Day ${currentDay} in progress. Every completed day is proof.`;
  }
  return 'Your journey starts with a single decision. Make it today.';
}
