export type DayType = 'weekday' | 'weekend' | 'bonus' | 'review';

export type TaskType = 
  | 'short_text'
  | 'long_text'
  | 'checklist'
  | 'confirm_action'
  | 'rank_list'
  | 'multi_entry_list'
  | 'prompt_group'
  | 'habit_counter'
  | 'matrix_rating'
  | 'goal_builder'
  | 'reflection_note'
  | 'guided_sequence';

export interface CompletionRule {
  required: boolean;
  minItems?: number; 
}

export interface BaseTaskDefinition {
  id: string;
  type: TaskType;
  title: string;
  description?: string;
  completionRule: CompletionRule;
}

export interface ShortTextTask extends BaseTaskDefinition {
  type: 'short_text';
  placeholder?: string;
}

export interface LongTextTask extends BaseTaskDefinition {
  type: 'long_text';
  placeholder?: string;
}

export interface ChecklistTask extends BaseTaskDefinition {
  type: 'checklist';
  items: string[];
}

export interface ConfirmActionTask extends BaseTaskDefinition {
  type: 'confirm_action';
  actionText: string;
}

export interface RankListTask extends BaseTaskDefinition {
  type: 'rank_list';
  items: string[];
}

export interface MultiEntryListTask extends BaseTaskDefinition {
  type: 'multi_entry_list';
  itemLabel: string;
}

export interface PromptGroupTask extends BaseTaskDefinition {
  type: 'prompt_group';
  prompts: string[];
}

export interface HabitCounterTask extends BaseTaskDefinition {
  type: 'habit_counter';
  targetCount: number;
  unit: string;
}

export interface MatrixRatingTask extends BaseTaskDefinition {
  type: 'matrix_rating';
  rows: string[];
  columns: string[];
}

export interface GoalCategory {
  id: string;
  title: string;
  description: string;
}

export interface GoalBuilderTask extends BaseTaskDefinition {
  type: 'goal_builder';
  categories: GoalCategory[];
}

export interface ReflectionNoteTask extends BaseTaskDefinition {
  type: 'reflection_note';
  content: string; // The reflection text to read
}

export interface GuidedSequenceTask extends BaseTaskDefinition {
  type: 'guided_sequence';
  steps: string[];
}

export type TaskDefinition = 
  | ShortTextTask
  | LongTextTask
  | ChecklistTask
  | ConfirmActionTask
  | RankListTask
  | MultiEntryListTask
  | PromptGroupTask
  | HabitCounterTask
  | MatrixRatingTask
  | GoalBuilderTask
  | ReflectionNoteTask
  | GuidedSequenceTask;

export interface RecurringHabit {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  durationDays?: number;
  tasks: TaskDefinition[];
}

export interface BonusSession {
  id: string;
  title: string;
  description: string;
  type: 'subliminal' | 'masters' | 'review';
  contentSummary: string;
  tasks: TaskDefinition[];
}

export interface ProgramDay {
  dayNumber: number;
  title: string;
  type: DayType;
  conceptSummary: string;
  tasks: TaskDefinition[];
  carryForwardHabits: string[]; // IDs of recurring habits triggered for today
  bonusSessionId?: string; // ID of the bonus session for weekends
}
