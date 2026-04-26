/**
 * Evidence types — the emotional memory layer.
 * All evidence is derived from existing taskResponses in the store.
 * EvidenceEntry is used for display only; nothing is stored redundantly.
 */

export type EvidenceCategory =
  | 'success'      // Day 22 five greatest successes
  | 'decision'     // Day 1 decisions, Day 11 why-change
  | 'belief'       // Day 10 new beliefs, Day 11 beliefs-transform
  | 'goal'         // Day 12-14 goals, Day 26 top goals
  | 'problem'      // Day 25 problem-solving answers
  | 'note'         // dailyNotes entries
  | 'confidence'   // manually added confidence bank entries
  | 'identity';    // Day 11 areas + what they would have to believe

export interface EvidenceEntry {
  id: string;
  category: EvidenceCategory;
  text: string;
  dayNumber?: number;
  dayTitle?: string;
  /** ISO date-like string for ordering — uses startDate + day offset */
  dateLabel?: string;
}

export interface ConfidenceBankEntry {
  text: string;
  source: 'manual' | 'auto-success' | 'auto-decision' | 'auto-belief' | 'auto-goal';
  dayNumber?: number;
}
