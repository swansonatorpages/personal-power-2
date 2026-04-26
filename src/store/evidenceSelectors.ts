/**
 * evidenceSelectors.ts
 *
 * Derives the evidence/memory layer entirely from existing store data.
 * No duplicate storage — these are pure computed views.
 */

import type { AppStore } from './appStore';
import type { EvidenceEntry, ConfidenceBankEntry } from '../types/evidence';
import { programDays } from '../data/programDays';

/* ── Helpers ──────────────────────────────────────────────────── */

function dayTitle(dayNum: number): string {
  return programDays.find(d => d.dayNumber === dayNum)?.title ?? 'Day ' + dayNum;
}

function nonEmpty(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function listEntries(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter(nonEmpty);
  return [];
}

/* ── Greatest Successes (Day 22: day22_successes) ─────────────── */
export function selectGreatestSuccesses(state: AppStore): EvidenceEntry[] {
  const raw = state.taskResponses[22]?.['day22_successes'];
  return listEntries(raw).map((text, i) => ({
    id: 'success-' + i,
    category: 'success' as const,
    text,
    dayNumber: 22,
    dayTitle: 'Day 22: Greatest Successes',
  }));
}

/* ── Saved Beliefs (Day 10 & Day 11) ─────────────────────────── */
export function selectSavedBeliefs(state: AppStore): EvidenceEntry[] {
  const entries: EvidenceEntry[] = [];

  // Day 10: new beliefs
  const d10 = state.taskResponses[10]?.['day10_new_beliefs'];
  if (nonEmpty(d10)) {
    entries.push({ id: 'belief-10', category: 'belief', text: d10, dayNumber: 10, dayTitle: dayTitle(10) });
  }

  // Day 11: transform beliefs
  const d11t = state.taskResponses[11]?.['day11_beliefs_transform'];
  if (nonEmpty(d11t)) {
    entries.push({ id: 'belief-11t', category: 'belief', text: d11t, dayNumber: 11, dayTitle: dayTitle(11) });
  }

  // Day 11: achieve beliefs
  const d11a = state.taskResponses[11]?.['day11_beliefs_achieve'];
  if (nonEmpty(d11a)) {
    entries.push({ id: 'belief-11a', category: 'belief', text: d11a, dayNumber: 11, dayTitle: dayTitle(11) });
  }

  return entries;
}

/* ── Saved Rules Changed (Day 9) ─────────────────────────────── */
export function selectRulesChanged(state: AppStore): EvidenceEntry[] {
  const raw = state.taskResponses[9]?.['day9_rules_change'];
  if (!nonEmpty(raw)) return [];
  return [{
    id: 'rules-9',
    category: 'identity' as const,
    text: raw,
    dayNumber: 9,
    dayTitle: dayTitle(9),
  }];
}

/* ── Top Goals (Days 12–14 + Day 26) ─────────────────────────── */
export function selectTopGoals(state: AppStore): EvidenceEntry[] {
  const entries: EvidenceEntry[] = [];

  const goalDays: [number, string][] = [
    [12, 'day12_personal_goals'],
    [13, 'day13_things_goals'],
    [14, 'day14_financial_goals'],
  ];

  for (const [dayNum, taskId] of goalDays) {
    const raw = state.taskResponses[dayNum]?.[taskId];
    listEntries(raw).forEach((text, i) => {
      entries.push({
        id: `goal-${dayNum}-${i}`,
        category: 'goal',
        text,
        dayNumber: dayNum,
        dayTitle: dayTitle(dayNum),
      });
    });
  }

  // Day 26 goal builder
  const d26 = state.taskResponses[26]?.['day26_goals_commit'];
  if (d26 && typeof d26 === 'object') {
    Object.entries(d26 as Record<string, { goal?: string; whyImportant?: string }>).forEach(([catId, val]) => {
      if (nonEmpty(val?.goal)) {
        entries.push({
          id: 'goal-26-' + catId,
          category: 'goal',
          text: val.goal!,
          dayNumber: 26,
          dayTitle: dayTitle(26),
        });
      }
    });
  }

  return entries;
}

/* ── Key Decisions (Day 1 + Day 11 why) ──────────────────────── */
export function selectKeyDecisions(state: AppStore): EvidenceEntry[] {
  const entries: EvidenceEntry[] = [];

  const d1 = state.taskResponses[1]?.['day1_decisions'];
  if (nonEmpty(d1)) {
    entries.push({ id: 'decision-1', category: 'decision', text: d1, dayNumber: 1, dayTitle: dayTitle(1) });
  }

  const d11w = state.taskResponses[11]?.['day11_why_change'];
  if (nonEmpty(d11w)) {
    entries.push({ id: 'decision-11w', category: 'decision', text: d11w, dayNumber: 11, dayTitle: dayTitle(11) });
  }

  return entries;
}

/* ── Problem Solutions (Day 25) ──────────────────────────────── */
export function selectProblemSolutions(state: AppStore): EvidenceEntry[] {
  const entries: EvidenceEntry[] = [];
  const fields: [string, string][] = [
    ['day25_prob_great', 'What\'s great about this problem'],
    ['day25_prob_not_perfect', 'What\'s not perfect yet'],
    ['day25_prob_willing', 'What I\'m willing to do'],
    ['day25_prob_no_longer', 'What I\'m no longer willing to do'],
    ['day25_prob_enjoy', 'How I\'ll enjoy the process'],
  ];
  fields.forEach(([taskId, label], i) => {
    const val = state.taskResponses[25]?.[taskId];
    if (nonEmpty(val)) {
      entries.push({ id: 'problem-25-' + i, category: 'problem', text: `${label}: ${val}`, dayNumber: 25, dayTitle: dayTitle(25) });
    }
  });
  return entries;
}

/* ── Daily Notes History ─────────────────────────────────────── */
export function selectDailyNotesHistory(state: AppStore): EvidenceEntry[] {
  return Object.entries(state.dailyNotes)
    .filter(([, v]) => nonEmpty(v))
    .sort(([a], [b]) => Number(b) - Number(a)) // newest first
    .map(([dayNum, text]) => ({
      id: 'note-' + dayNum,
      category: 'note' as const,
      text,
      dayNumber: Number(dayNum),
      dayTitle: 'Day ' + dayNum + ' Notes',
    }));
}

/* ── Confidence Bank (manual + auto-aggregated) ───────────────── */
export function selectConfidenceBankEntries(state: AppStore): ConfidenceBankEntry[] {
  const entries: ConfidenceBankEntry[] = [];

  // Manual entries from the store's confidenceBank array
  state.confidenceBank.forEach(text => {
    entries.push({ text, source: 'manual' });
  });

  // Auto: greatest successes
  selectGreatestSuccesses(state).forEach(e => {
    entries.push({ text: e.text, source: 'auto-success', dayNumber: e.dayNumber });
  });

  // Auto: decisions
  selectKeyDecisions(state).forEach(e => {
    entries.push({ text: e.text, source: 'auto-decision', dayNumber: e.dayNumber });
  });

  // Auto: beliefs
  selectSavedBeliefs(state).slice(0, 2).forEach(e => {
    entries.push({ text: e.text.slice(0, 180) + (e.text.length > 180 ? '…' : ''), source: 'auto-belief', dayNumber: e.dayNumber });
  });

  // Auto: top goals (Day 26)
  const d26Goals = selectTopGoals(state).filter(e => e.dayNumber === 26);
  d26Goals.forEach(e => {
    entries.push({ text: e.text, source: 'auto-goal', dayNumber: e.dayNumber });
  });

  return entries;
}

/* ── Random motivation card ──────────────────────────────────── */
export function selectRandomMotivationEntry(state: AppStore): EvidenceEntry | null {
  const pool: EvidenceEntry[] = [
    ...selectGreatestSuccesses(state),
    ...selectSavedBeliefs(state),
    ...selectTopGoals(state),
    ...selectKeyDecisions(state),
  ];
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ── All evidence combined (for timeline) ────────────────────── */
export function selectAllEvidence(state: AppStore): EvidenceEntry[] {
  return [
    ...selectGreatestSuccesses(state),
    ...selectSavedBeliefs(state),
    ...selectRulesChanged(state),
    ...selectTopGoals(state),
    ...selectKeyDecisions(state),
    ...selectProblemSolutions(state),
    ...selectDailyNotesHistory(state),
  ].sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0));
}
