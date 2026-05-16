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
    title: '4-7-8 Breathing & Nutrition',
    description: 'Do 2 sets of 5 rounds of 4-7-8 breathing daily. Eat sub-2700 calories with at least 140g protein.',
    frequency: 'daily',
    durationDays: 10,
    tasks: [
      {
        id: 'breathing_reps',
        type: 'habit_counter',
        title: '4-7-8 Breathing (5 rounds per set)',
        completionRule: { required: true, minItems: 2 },
        targetCount: 2,
        unit: 'sets'
      },
      {
        id: 'diet_check',
        type: 'checklist',
        title: 'Daily Nutrition Targets',
        completionRule: { required: true },
        items: [
          'Sub-2700 calories today',
          'At least 140g protein today'
        ]
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
