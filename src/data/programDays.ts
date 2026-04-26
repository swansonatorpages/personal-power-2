import { ProgramDay } from '../types/program';
import { PROGRAM_DAYS as RAW_DAYS } from './rawProgramContent';

export const programDays: ProgramDay[] = [
  {
    dayNumber: 1,
    title: RAW_DAYS[0].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[0].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day1_decisions',
        type: 'short_text',
        title: 'Two decisions I\'ve been putting off which, when I make them now, will change my life:',
        completionRule: { required: true }
      },
      {
        id: 'day1_actions',
        type: 'multi_entry_list',
        title: 'Three simple things I can do immediately that will be consistent with my two new decisions:',
        itemLabel: 'Action',
        completionRule: { required: true, minItems: 3 }
      }
    ]
  },
  {
    dayNumber: 2,
    title: RAW_DAYS[1].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[1].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day2_new_actions',
        type: 'multi_entry_list',
        title: 'Four new actions I know I should take now:',
        itemLabel: 'Action',
        completionRule: { required: true, minItems: 4 }
      },
      {
        id: 'day2_pain',
        type: 'long_text',
        title: 'The pain I\'ve associated with these actions in the past:',
        completionRule: { required: true }
      },
      {
        id: 'day2_pleasure',
        type: 'long_text',
        title: 'The pleasure I took from not following through in the past:',
        completionRule: { required: true }
      },
      {
        id: 'day2_cost',
        type: 'long_text',
        title: 'What it will cost me if I don\'t follow through now:',
        completionRule: { required: true }
      },
      {
        id: 'day2_benefits',
        type: 'long_text',
        title: 'The benefits I\'ll gain by taking action in each of these areas now:',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 3,
    title: RAW_DAYS[2].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[2].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day3_pos_neuro',
        type: 'multi_entry_list',
        title: 'Three neuro-associations I\'ve made in the past that have shaped my destiny positively:',
        itemLabel: 'Association',
        completionRule: { required: true, minItems: 3 }
      },
      {
        id: 'day3_neg_neuro',
        type: 'multi_entry_list',
        title: 'Three neuro-associations that have disempowered me until now:',
        itemLabel: 'Association',
        completionRule: { required: true, minItems: 3 }
      }
    ]
  },
  {
    dayNumber: 4,
    title: RAW_DAYS[3].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[3].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day4_leverage',
        type: 'long_text',
        title: 'Ten reasons why I must change now, and why I know I can do it:',
        completionRule: { required: true }
      },
      {
        id: 'day4_pattern_interrupts',
        type: 'multi_entry_list',
        title: 'Four or five ways to get myself out of the limiting associations:',
        itemLabel: 'Interrupt',
        completionRule: { required: true, minItems: 4 }
      }
    ]
  },
  {
    dayNumber: 5,
    title: 'Weekend Bonus: Total Self-Confidence',
    type: 'weekend',
    conceptSummary: 'Use this time to reinforce your learning and condition your nervous system.',
    carryForwardHabits: [],
    bonusSessionId: 'subliminal_confidence',
    tasks: []
  },
  {
    dayNumber: 6,
    title: 'Weekend Bonus: Unlimited Financial Success',
    type: 'weekend',
    conceptSummary: 'Condition your mind for financial success and taking massive action.',
    carryForwardHabits: [],
    bonusSessionId: 'subliminal_financial',
    tasks: []
  },
  {
    dayNumber: 7,
    title: 'Weekend Review',
    type: 'review',
    conceptSummary: 'Review the past week of exercises and ensure you are taking action on your decisions.',
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day7_review',
        type: 'checklist',
        title: 'Weekly Review',
        completionRule: { required: true },
        items: [
          'Reviewed Day 1 decisions',
          'Completed all outstanding assignments',
          'Prepared for the upcoming week'
        ]
      }
    ]
  },
  {
    dayNumber: 8,
    title: RAW_DAYS[5].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[5].conceptSummary,
    carryForwardHabits: ['morning_questions'],
    tasks: [
      {
        id: 'day8_morning_qs',
        type: 'multi_entry_list',
        title: 'Five questions I\'m going to ask myself every morning:',
        itemLabel: 'Question',
        completionRule: { required: true, minItems: 5 }
      }
    ]
  },
  {
    dayNumber: 9,
    title: RAW_DAYS[6].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[6].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day9_toward_values',
        type: 'rank_list',
        title: 'My moving-toward values in order of importance:',
        completionRule: { required: true },
        items: []
      },
      {
        id: 'day9_away_values',
        type: 'rank_list',
        title: 'My moving-away-from values in order of importance:',
        completionRule: { required: true },
        items: []
      },
      {
        id: 'day9_rules_change',
        type: 'long_text',
        title: 'The rules I\'m willing to change now to improve my life forever:',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 10,
    title: RAW_DAYS[7].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[7].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day10_new_beliefs',
        type: 'long_text',
        title: 'What my new beliefs are and how they will increase the quality of my life:',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 11,
    title: RAW_DAYS[8].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[8].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day11_areas',
        type: 'multi_entry_list',
        title: 'The specific areas of my life that are not what I want them to be:',
        itemLabel: 'Area',
        completionRule: { required: true }
      },
      {
        id: 'day11_beliefs_transform',
        type: 'long_text',
        title: 'What I would have to believe to consistently follow through on the transformation of my life:',
        completionRule: { required: true }
      },
      {
        id: 'day11_beliefs_achieve',
        type: 'long_text',
        title: 'What I would have to believe to not only set my goals but really achieve them:',
        completionRule: { required: true }
      },
      {
        id: 'day11_why_change',
        type: 'long_text',
        title: 'Why I must change these situations now and why I know I can:',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 12,
    title: 'Goal Setting Workshop: Personal Development',
    type: 'weekday',
    conceptSummary: RAW_DAYS[9].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day12_personal_goals',
        type: 'multi_entry_list',
        title: 'My top three goals for personal development and one action I can take today toward their attainment:',
        itemLabel: 'Goal & Action',
        completionRule: { required: true, minItems: 3 }
      }
    ]
  },
  {
    dayNumber: 13,
    title: 'Goal Setting Workshop: Things',
    type: 'weekend',
    conceptSummary: 'Continue the Goal Setting Workshop with your material goals.',
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day13_things_goals',
        type: 'multi_entry_list',
        title: 'My top three things goals and one action I can take today toward their attainment:',
        itemLabel: 'Goal & Action',
        completionRule: { required: true, minItems: 3 }
      }
    ]
  },
  {
    dayNumber: 14,
    title: 'Goal Setting Workshop: Financial',
    type: 'weekend',
    conceptSummary: 'Complete the Goal Setting Workshop with your economic goals.',
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day14_financial_goals',
        type: 'multi_entry_list',
        title: 'My top three economic or financial goals and one action I can take today toward their attainment:',
        itemLabel: 'Goal & Action',
        completionRule: { required: true, minItems: 3 }
      }
    ]
  },
  {
    dayNumber: 15,
    title: RAW_DAYS[10].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[10].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day15_neg_interrupts',
        type: 'multi_entry_list',
        title: 'A pattern interrupt for each of my five negative emotions would be:',
        itemLabel: 'Pattern Interrupt',
        completionRule: { required: true, minItems: 5 }
      },
      {
        id: 'day15_pos_triggers',
        type: 'multi_entry_list',
        title: 'A trigger for my positive emotions would be:',
        itemLabel: 'Trigger',
        completionRule: { required: true }
      },
      {
        id: 'day15_procrastination',
        type: 'long_text',
        title: 'What I do to get into a ritual of procrastination and how I can break out of it:',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 16,
    title: RAW_DAYS[11].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[11].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day16_create_anchor',
        type: 'checklist',
        title: 'Create a positive anchor',
        completionRule: { required: true },
        items: [
          'Chose an emotion',
          'Went back to a time I felt it',
          'Linked the feeling to a gesture'
        ]
      },
      {
        id: 'day16_swish',
        type: 'habit_counter',
        title: 'Swish Patterns',
        completionRule: { required: true, minItems: 15 },
        targetCount: 15,
        unit: 'swishes'
      }
    ]
  },
  {
    dayNumber: 17,
    title: RAW_DAYS[12].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[12].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day17_limiting_beliefs',
        type: 'multi_entry_list',
        title: 'My most limiting beliefs about having absolute financial abundance:',
        itemLabel: 'Limiting Belief',
        completionRule: { required: true }
      },
      {
        id: 'day17_amount',
        type: 'short_text',
        title: 'What specific amount of money represents financial abundance to me?',
        completionRule: { required: true }
      },
      {
        id: 'day17_plan_action',
        type: 'short_text',
        title: 'What I will do today toward developing a financial plan:',
        completionRule: { required: true }
      },
      {
        id: 'day17_terms',
        type: 'long_text',
        title: 'Financial terms and aspects of personal finance I don\'t currently understand fully:',
        completionRule: { required: true }
      },
      {
        id: 'day17_commitment',
        type: 'long_text',
        title: 'Why I\'m committed to follow through:',
        completionRule: { required: true }
      },
      {
        id: 'day17_past_success',
        type: 'long_text',
        title: 'One or two situations from the past when I pulled through despite difficulty:',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 18,
    title: RAW_DAYS[13].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[13].conceptSummary,
    carryForwardHabits: ['income_ideas'],
    tasks: [
      {
        id: 'day18_recognize_wealth',
        type: 'checklist',
        title: 'Attracting Wealth',
        completionRule: { required: true },
        items: [
          'I recognize I am already wealthy',
          'I believe I am creating a way for others to fulfill their dreams'
        ]
      }
    ]
  },
  {
    dayNumber: 19,
    title: 'Overcoming Fear of Failure',
    type: 'weekday',
    conceptSummary: RAW_DAYS[14].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day19_fear_cost',
        type: 'long_text',
        title: 'What will the fear of success cost me:',
        completionRule: { required: true }
      },
      {
        id: 'day19_courage_gain',
        type: 'long_text',
        title: 'What will I gain by using my inner courage to overcome this fear of success?',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 20,
    title: 'Overcoming Fear of Rejection',
    type: 'weekend',
    conceptSummary: 'Review your past feelings of rejection and apply the erasure technique.',
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day20_failure_exp',
        type: 'multi_entry_list',
        title: 'Two experiences that made me feel I failed:',
        itemLabel: 'Experience',
        completionRule: { required: true, minItems: 2 }
      },
      {
        id: 'day20_rejection_exp',
        type: 'multi_entry_list',
        title: 'Two that made me feel rejected:',
        itemLabel: 'Experience',
        completionRule: { required: true, minItems: 2 }
      }
    ]
  },
  {
    dayNumber: 21,
    title: 'Weekend Bonus: Six Human Needs',
    type: 'weekend',
    conceptSummary: 'Dive deep into the Six Human Needs that drive all human behavior.',
    carryForwardHabits: [],
    bonusSessionId: 'six_human_needs',
    tasks: []
  },
  {
    dayNumber: 22,
    title: RAW_DAYS[15].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[15].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day22_successes',
        type: 'multi_entry_list',
        title: 'My five greatest successes:',
        itemLabel: 'Success',
        completionRule: { required: true, minItems: 5 }
      }
    ]
  },
  {
    dayNumber: 23,
    title: RAW_DAYS[16].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[16].conceptSummary,
    carryForwardHabits: ['water_rich_diet'],
    tasks: [
      {
        id: 'day23_checklist',
        type: 'checklist',
        title: 'Commit to the 10-day health challenge',
        completionRule: { required: true },
        items: [
          'Read the power of breath',
          'Read about water-rich foods'
        ]
      }
    ]
  },
  {
    dayNumber: 24,
    title: RAW_DAYS[17].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[17].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day24_rel_want',
        type: 'long_text',
        title: 'What I want in a relationship:',
        completionRule: { required: true }
      },
      {
        id: 'day24_rel_dont_want',
        type: 'long_text',
        title: 'What I don\'t want in a relationship:',
        completionRule: { required: true }
      },
      {
        id: 'day24_rel_needs',
        type: 'long_text',
        title: 'Description of what my relationship needs to be:',
        completionRule: { required: true }
      },
      {
        id: 'day24_rel_together',
        type: 'multi_entry_list',
        title: 'Unique things we can do together to enhance our relationship:',
        itemLabel: 'Activity',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 25,
    title: RAW_DAYS[18].title,
    type: 'weekday',
    conceptSummary: RAW_DAYS[18].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day25_prob_great',
        type: 'long_text',
        title: 'What is great about this problem?',
        completionRule: { required: true }
      },
      {
        id: 'day25_prob_not_perfect',
        type: 'long_text',
        title: 'What is not perfect yet?',
        completionRule: { required: true }
      },
      {
        id: 'day25_prob_willing',
        type: 'long_text',
        title: 'What am I willing to do to make it the way I want it?',
        completionRule: { required: true }
      },
      {
        id: 'day25_prob_no_longer',
        type: 'long_text',
        title: 'What am I willing to no longer do in order to make it the way I want it?',
        completionRule: { required: true }
      },
      {
        id: 'day25_prob_enjoy',
        type: 'long_text',
        title: 'How can I enjoy the process while I do what is necessary to make it the way I want it?',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 26,
    title: 'My Personal Challenge to You: Part 1',
    type: 'weekday',
    conceptSummary: RAW_DAYS[19].conceptSummary,
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day26_goals_commit',
        type: 'goal_builder',
        title: 'Top 4 Goals Commitment',
        completionRule: { required: true },
        categories: [
          { id: 'g1', title: 'Goal 1', description: 'Why I\'m committed and what I\'ll lose by not achieving it' },
          { id: 'g2', title: 'Goal 2', description: 'Why I\'m committed and what I\'ll lose by not achieving it' },
          { id: 'g3', title: 'Goal 3', description: 'Why I\'m committed and what I\'ll lose by not achieving it' },
          { id: 'g4', title: 'Goal 4', description: 'Why I\'m committed and what I\'ll lose by not achieving it' }
        ]
      }
    ]
  },
  {
    dayNumber: 27,
    title: 'My Personal Challenge to You: Part 2',
    type: 'weekend',
    conceptSummary: 'Review the past 25 days and complete unfinished assignments.',
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day27_catchup',
        type: 'confirm_action',
        title: 'Review Unfinished Work',
        actionText: 'I have reviewed and worked on missing assignments.',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 28,
    title: 'My Personal Challenge to You: Part 3',
    type: 'weekend',
    conceptSummary: 'Bonus: Meetings With Masters',
    carryForwardHabits: [],
    bonusSessionId: 'meetings_with_masters',
    tasks: []
  },
  {
    dayNumber: 29,
    title: 'My Personal Challenge to You: Part 4',
    type: 'weekend',
    conceptSummary: 'Continue executing the 4-day plan for your top goals.',
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day29_goal_execution',
        type: 'confirm_action',
        title: 'Goal Execution',
        actionText: 'I took action on my top 4 goals today.',
        completionRule: { required: true }
      }
    ]
  },
  {
    dayNumber: 30,
    title: 'The Final Day: Mastery',
    type: 'review',
    conceptSummary: 'I challenge you to make your life a masterpiece. Join the ranks of those who live what they teach.',
    carryForwardHabits: [],
    tasks: [
      {
        id: 'day30_final_review',
        type: 'long_text',
        title: 'Reflection on the 30-Day Journey',
        placeholder: 'What was your biggest breakthrough?',
        completionRule: { required: true }
      }
    ]
  }
];
