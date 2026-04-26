import { RecurringHabit } from '../types/program';
import { MORNING_POWER_QUESTIONS } from './rawProgramContent';

export const RECURRING_RITUALS: Record<string, RecurringHabit> = {
  morning_questions: {
    id: 'morning_questions',
    title: 'Morning Power Questions',
    description: 'Ask yourself these questions every morning to direct your focus.',
    frequency: 'daily',
    durationDays: 23, // Starts Day 8 to 30
    tasks: [
      {
        id: 'morning_questions_prompt',
        type: 'prompt_group',
        title: 'Morning Power Questions',
        completionRule: { required: true },
        prompts: MORNING_POWER_QUESTIONS
      }
    ]
  },
  water_rich_diet: {
    id: 'water_rich_diet',
    title: 'Water-Rich Diet & Breathing',
    description: 'Eat 70% water-rich foods and do 10 repetitions of deep breathing 3 times a day.',
    frequency: 'daily',
    durationDays: 10,
    tasks: [
      {
        id: 'breathing_reps',
        type: 'habit_counter',
        title: 'Deep Breathing Repetitions (10 reps per session)',
        completionRule: { required: true, minItems: 3 },
        targetCount: 3,
        unit: 'sessions'
      },
      {
        id: 'diet_check',
        type: 'confirm_action',
        title: 'Did you maintain a 70% water-rich diet today?',
        actionText: 'Confirm diet',
        completionRule: { required: true }
      }
    ]
  },
  income_ideas: {
    id: 'income_ideas',
    title: 'Income Generation Ideas',
    description: 'Write down 3 ideas daily to increase your income.',
    frequency: 'daily',
    durationDays: 10,
    tasks: [
      {
        id: 'income_idea_list',
        type: 'multi_entry_list',
        title: 'Today\'s 3 Income Ideas',
        itemLabel: 'Idea',
        completionRule: { required: true, minItems: 3 }
      }
    ]
  }
};
