import { BonusSession } from '../types/program';
import { SUBLIMINAL_SESSIONS, MEETINGS_WITH_MASTERS, SIX_HUMAN_NEEDS } from './rawProgramContent';

export const BONUS_SESSIONS: Record<string, BonusSession> = {
  subliminal_confidence: {
    id: 'subliminal_confidence',
    title: 'Subliminal: Total Self-Confidence & Vibrant Health',
    description: 'Listen to the subliminal session to embed these beliefs into your nervous system.',
    type: 'subliminal',
    contentSummary: 'Total Self-Confidence and Vibrant Health affirmations.',
    tasks: [
      {
        id: 'read_confidence_affirmations',
        type: 'prompt_group',
        title: 'Total Self-Confidence Affirmations',
        completionRule: { required: true },
        prompts: SUBLIMINAL_SESSIONS.TotalSelfConfidence
      },
      {
        id: 'read_health_affirmations',
        type: 'prompt_group',
        title: 'Vibrant Health Affirmations',
        completionRule: { required: true },
        prompts: SUBLIMINAL_SESSIONS.VibrantHealth
      },
      {
        id: 'confirm_listen_confidence',
        type: 'confirm_action',
        title: 'Listen to Subliminal Audio',
        actionText: 'I have listened to the session',
        completionRule: { required: true }
      }
    ]
  },
  subliminal_financial: {
    id: 'subliminal_financial',
    title: 'Subliminal: Unlimited Financial Success & Action',
    description: 'Listen to the subliminal session for financial success and taking action.',
    type: 'subliminal',
    contentSummary: 'Unlimited Financial Success and Getting into Action affirmations.',
    tasks: [
      {
        id: 'read_financial_affirmations',
        type: 'prompt_group',
        title: 'Unlimited Financial Success Affirmations',
        completionRule: { required: true },
        prompts: SUBLIMINAL_SESSIONS.UnlimitedFinancialSuccess
      },
      {
        id: 'read_action_affirmations',
        type: 'prompt_group',
        title: 'Getting Into Action Affirmations',
        completionRule: { required: true },
        prompts: SUBLIMINAL_SESSIONS.GettingIntoAction
      },
      {
        id: 'confirm_listen_financial',
        type: 'confirm_action',
        title: 'Listen to Subliminal Audio',
        actionText: 'I have listened to the session',
        completionRule: { required: true }
      }
    ]
  },
  six_human_needs: {
    id: 'six_human_needs',
    title: 'Bonus: The Six Human Needs',
    description: 'Understand the six human needs that drive all behavior.',
    type: 'review',
    contentSummary: 'Analysis of certainty, uncertainty, significance, connection, growth, and contribution.',
    tasks: [
      {
        id: 'review_needs',
        type: 'checklist',
        title: 'The Six Human Needs',
        completionRule: { required: true },
        items: SIX_HUMAN_NEEDS
      },
      {
        id: 'need_analysis_love',
        type: 'long_text',
        title: 'What is something you love to do? Describe how it meets your 6 human needs.',
        completionRule: { required: true }
      },
      {
        id: 'need_analysis_hate',
        type: 'long_text',
        title: 'What is something you hate to do? How does it fail to meet your needs?',
        completionRule: { required: true }
      }
    ]
  },
  meetings_with_masters: {
    id: 'meetings_with_masters',
    title: 'Bonus: Meetings With Masters',
    description: 'Review the insights from Stephen Covey, Deepak Chopra, Barbara DeAngelis, and John Gray.',
    type: 'masters',
    contentSummary: 'Wisdom from the masters of relationships, health, and personal development.',
    tasks: [
      {
        id: 'review_covey',
        type: 'reflection_note',
        title: 'Stephen Covey Insights',
        content: MEETINGS_WITH_MASTERS.StephenCovey,
        completionRule: { required: true }
      },
      {
        id: 'review_chopra',
        type: 'reflection_note',
        title: 'Deepak Chopra Insights',
        content: MEETINGS_WITH_MASTERS.DeepakChopra,
        completionRule: { required: true }
      },
      {
        id: 'review_deangelis',
        type: 'reflection_note',
        title: 'Barbara DeAngelis Insights',
        content: MEETINGS_WITH_MASTERS.BarbaraDeAngelis,
        completionRule: { required: true }
      },
      {
        id: 'review_gray',
        type: 'reflection_note',
        title: 'John Gray Insights',
        content: MEETINGS_WITH_MASTERS.JohnGray,
        completionRule: { required: true }
      }
    ]
  }
};
