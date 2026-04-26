import { ReactNode } from 'react';
import type { ProgramDay, BonusSession } from '../../types/program';
import { TaskRenderer } from '../tasks/TaskRenderer';
import { TaskSectionHeading } from '../tasks/shared/TaskSectionHeading';
import { DaySummaryCard } from './DaySummaryCard';
import { GuidedAssignmentIntro } from './GuidedAssignmentIntro';
import { ExamplesDrawer } from './ExamplesDrawer';
import { DayProgressPill } from './DayProgressPill';
import { HumanNeedsMatrix } from './HumanNeedsMatrix';
import { WeekendModeCard } from '../weekend/WeekendModeCard';
import { BonusSessionCard } from '../weekend/BonusSessionCard';
import { BONUS_SESSIONS } from '../../data/bonusSessions';
import {
  PROGRAM_DAYS,
  MORNING_POWER_QUESTIONS,
  EXAMPLE_LISTS,
} from '../../data/rawProgramContent';
import styles from './DayScreen.module.css';

interface DayScreenProps {
  dayData: ProgramDay;
  bonusSession: BonusSession | undefined;
  taskCompletions: Record<string, boolean>;
  isDayComplete: boolean;
}

/* ── Per-day contextual overlay config ───────────────────────── */
interface DayOverlay {
  assignmentIntro?: { sectionTitle: string; body: string; stepNumber?: number; totalSteps?: number };
  examplesAfterTask?: Record<string, ReactNode>;
  sectionBreaks?: Record<string, string>;
  tipBefore?: Record<string, string>;
  /** Extra JSX rendered before the task list */
  extraBefore?: ReactNode;
}

const RAW = PROGRAM_DAYS;

function getOverlay(dayNumber: number): DayOverlay {
  switch (dayNumber) {
    /* ── Days 1–15 ──────────────────────────────────────────── */
    case 1:
      return {
        assignmentIntro: {
          sectionTitle: 'Make the Decision. Take the Action.',
          body: RAW[0].assignmentText.slice(0, 240) + '…',
        },
      };
    case 2:
      return {
        assignmentIntro: {
          sectionTitle: 'Pain vs. Pleasure: The Controlling Force',
          body: 'To take control of your life, you must take control of the force of decision. Work through each question below to create genuine leverage.',
        },
      };
    case 3:
      return {
        assignmentIntro: {
          sectionTitle: 'Neuro-Associations: What Drives Your Destiny',
          body: 'Simple awareness can be curative. Identifying what you have unconsciously linked pain or pleasure to begins to break the pattern.',
        },
        tipBefore: {
          day3_neg_neuro: 'Decide right now that you will change these disempowering associations today.',
        },
      };
    case 4:
      return {
        assignmentIntro: {
          sectionTitle: 'The 3 Fundamentals of NAC',
          body: 'Neuro-Associative Conditioning requires three steps: (1) Get leverage, (2) Interrupt your pattern, (3) Condition a new association.',
        },
      };
    case 8:
      return {
        assignmentIntro: {
          sectionTitle: 'The Power of Focus',
          body: 'The quality of your life is the quality of your questions. Write five morning questions that cause you to access positive, powerful states every single day.',
        },
        examplesAfterTask: {
          day8_morning_qs: (
            <ExamplesDrawer
              label="Morning Power Questions (workbook examples)"
              items={MORNING_POWER_QUESTIONS}
              accent="gold"
            />
          ),
        },
      };
    case 9:
      return {
        assignmentIntro: {
          sectionTitle: 'Values, Rules & The Source of Your Decisions',
          body: 'Values are the emotional states you move toward or away from. They guide every decision you make. Take your time — this is one of the most powerful exercises in the program.',
        },
        examplesAfterTask: {
          day9_toward_values: (
            <ExamplesDrawer
              label="Moving-Toward Values examples"
              items={EXAMPLE_LISTS.movingTowardValues}
              accent="gold"
            />
          ),
          day9_away_values: (
            <ExamplesDrawer
              label="Moving-Away-From Values examples"
              items={EXAMPLE_LISTS.movingAwayFromValues}
              accent="blue"
            />
          ),
          day9_rules_change: (
            <ExamplesDrawer
              label="Rules that should be changed (examples)"
              items={EXAMPLE_LISTS.rulesThatShouldBeChanged}
              accent="green"
            />
          ),
        },
        sectionBreaks: {
          day9_toward_values: 'Moving-Toward Values',
          day9_away_values: 'Moving-Away-From Values',
          day9_rules_change: 'Your Rules',
        },
      };
    case 10:
      return {
        assignmentIntro: {
          sectionTitle: 'Taking Complete Control of Your Beliefs',
          body: 'First write what your old beliefs were and what they cost you. Then write your new empowering beliefs and how they will enhance your life.',
        },
      };
    case 11:
      return {
        assignmentIntro: {
          sectionTitle: 'The Power of "Why"',
          body: 'Purpose is stronger than outcome. We must have a big enough "why" to succeed — enough compelling reasons to do whatever it takes to achieve our goals.',
        },
        sectionBreaks: {
          day11_areas: 'Current Reality',
          day11_beliefs_transform: 'Empowering Beliefs',
          day11_why_change: 'Your Why',
        },
      };
    case 12:
      return {
        assignmentIntro: { stepNumber: 1, totalSteps: 3, sectionTitle: 'Goal Setting Workshop: Personal Development', body: 'List your top three personal development goals. For each one, also write one action you can take today toward its attainment.' },
      };
    case 13:
      return {
        assignmentIntro: { stepNumber: 2, totalSteps: 3, sectionTitle: 'Goal Setting Workshop: Things', body: 'List your top three "things" goals — experiences, possessions, or environments you want to create. Include one immediate action for each.' },
      };
    case 14:
      return {
        assignmentIntro: { stepNumber: 3, totalSteps: 3, sectionTitle: 'Goal Setting Workshop: Financial', body: 'Complete the workshop with your top three economic or financial goals. Commit to one action you can take today for each.' },
      };
    case 15:
      return {
        assignmentIntro: {
          sectionTitle: 'Success Conditioning: The Power of Rituals',
          body: 'Your consistent emotions shape your character and destiny. Review your emotional patterns and design deliberate interrupts and triggers.',
        },
        sectionBreaks: {
          day15_neg_interrupts: 'Negative Emotion Interrupts',
          day15_pos_triggers: 'Positive Emotion Triggers',
          day15_procrastination: 'Breaking the Procrastination Ritual',
        },
      };

    /* ── Days 16–30 ─────────────────────────────────────────── */
    case 16:
      return {
        assignmentIntro: {
          sectionTitle: 'Anchoring Yourself to Success',
          body: 'Whenever you\'re in an intense emotional state, anything consistently happening around you gets associated to it. Create a positive anchor you can fire on demand, then condition it with 15 swish patterns.',
        },
        sectionBreaks: {
          day16_create_anchor: 'Create Your Anchor',
          day16_swish: 'Swish Patterns',
        },
      };
    case 17:
      return {
        assignmentIntro: {
          sectionTitle: 'Conditioning Yourself for Wealth',
          body: 'Money is a means to measure the exchange of value. Give yourself a financial checkup to discover your "wealth wounds" and heal them through leverage, plan, and commitment.',
        },
        sectionBreaks: {
          day17_limiting_beliefs: 'Wealth Wounds',
          day17_amount: 'Your Abundance Number',
          day17_plan_action: 'Today\'s Financial Action',
          day17_terms: 'Knowledge Gaps to Fill',
          day17_commitment: 'Your Commitment',
          day17_past_success: 'Evidence of Resilience',
        },
      };
    case 18:
      return {
        assignmentIntro: {
          sectionTitle: 'Ending Financial Self-Sabotage',
          body: 'If you are sabotaging yourself financially, it\'s because you believe on some level that the accumulation of money leads to more pain than pleasure. Starting today, write 3 income ideas every day for 10 days.',
        },
      };
    case 19:
      return {
        assignmentIntro: {
          sectionTitle: 'Overcoming the Fear of Failure',
          body: 'Turn the fear of pain on itself. Write what you\'ll lose by NOT removing the fear of success — then write what you\'ll gain by using your inner courage right now.',
        },
        sectionBreaks: {
          day19_fear_cost: 'The Cost of Fear',
          day19_courage_gain: 'The Gain of Courage',
        },
      };
    case 20:
      return {
        assignmentIntro: {
          sectionTitle: 'Overcoming the Fear of Rejection',
          body: 'Write down experiences of failure and rejection. Use the erasure technique to interrupt the old pattern once and for all — then see each as a benefit.',
        },
        sectionBreaks: {
          day20_failure_exp: 'Experiences of Failure',
          day20_rejection_exp: 'Experiences of Rejection',
        },
      };
    case 21:
      return {
        extraBefore: (
          <HumanNeedsMatrix taskId="day21_needs_matrix" dayNumber={21} />
        ),
      };
    case 22:
      return {
        assignmentIntro: {
          sectionTitle: 'Eliminating Self-Sabotage',
          body: 'Anything we do — including self-sabotage — we do with positive intent. Your brain is trying to help you avoid pain. Get leverage, interrupt the pattern, and rehearse succeeding. Then recall five of your greatest successes to anchor unstoppable confidence.',
        },
      };
    case 23:
      return {
        assignmentIntro: {
          sectionTitle: 'The Two Keys to Vibrant Energy',
          body: 'Key 1: Master the power of breath — 10 reps of deep breathing, 3 times a day. Key 2: Eat 70% water-rich foods. Do this for the next 10 days and notice the dramatic shift.',
        },
      };
    case 24:
      return {
        assignmentIntro: {
          sectionTitle: 'The Power of Successful Relationships',
          body: 'The biggest obstacle to great relationships is looking for a relationship to solve your problems. Clarify what you want, what you need to be your best self within it, and how you\'ll grow it together.',
        },
        sectionBreaks: {
          day24_rel_want: 'What I Want',
          day24_rel_dont_want: 'What I Don\'t Want',
          day24_rel_needs: 'What the Relationship Must Be',
          day24_rel_together: 'Activities We\'ll Do Together',
        },
      };
    case 25:
      return {
        assignmentIntro: {
          sectionTitle: 'The Five Problem-Solving Questions',
          body: 'To solve problems effectively, first manage your emotional state. Then move through these five questions — they transform problems into opportunities.',
        },
        sectionBreaks: {
          day25_prob_great: 'What\'s Great About This Problem?',
          day25_prob_not_perfect: 'What\'s Not Perfect Yet?',
          day25_prob_willing: 'What Will I Do?',
          day25_prob_no_longer: 'What Won\'t I Do Anymore?',
          day25_prob_enjoy: 'How Can I Enjoy the Process?',
        },
      };
    case 26:
      return {
        assignmentIntro: {
          sectionTitle: 'My Personal Challenge: Top 4 Goals',
          body: 'Pick your top four goals. For each one write why you are committed to achieving it — and what you will lose by not achieving it. This is your final contract with yourself.',
        },
      };
    case 27:
      return {
        assignmentIntro: {
          sectionTitle: 'Catch-Up & Reinforce',
          body: 'Review the past 25 days. Do any assignments you have not yet completed. The goal is completeness — not perfection.',
        },
      };
    case 28:
      return {
        assignmentIntro: {
          sectionTitle: 'Meetings With Masters',
          body: 'Review the insights from Stephen Covey, Deepak Chopra, Barbara DeAngelis, and John Gray. Read each one and acknowledge when you have absorbed it.',
        },
      };
    case 29:
      return {
        assignmentIntro: {
          sectionTitle: 'Execute Your Plan',
          body: 'Continue executing the 4-day plan toward your top four goals. Do something today for each goal — even a small step creates momentum.',
        },
      };
    case 30:
      return {
        assignmentIntro: {
          sectionTitle: 'Day 30: Mastery',
          body: '"I challenge you to make your life a masterpiece. I challenge you to join the ranks of those people who live what they teach, who walk their talk." — Tony Robbins',
        },
      };
    default:
      return {};
  }
}

/* ── Tip strip ───────────────────────────────────────────────── */
function TipStrip({ text }: { text: string }) {
  return (
    <div className={styles.tip}>
      <span className={styles.tipIcon}>⚡</span>
      <p className={styles.tipText}>{text}</p>
    </div>
  );
}

/* ── Day type guard ─────────────────────────────────────────── */
function isWeekendType(type: string): type is 'weekend' | 'review' | 'bonus' {
  return type === 'weekend' || type === 'review' || type === 'bonus';
}

/* ── Main DayScreen ─────────────────────────────────────────── */
export function DayScreen({ dayData, bonusSession, taskCompletions, isDayComplete }: DayScreenProps) {
  const rawDay = RAW.find(r => r.title === dayData.title || r.day.includes(String(dayData.dayNumber)));
  const quote = rawDay?.quotes?.[0];
  const overlay = getOverlay(dayData.dayNumber);
  const isWeekend = isWeekendType(dayData.type);

  const allTasks = dayData.tasks;
  const requiredTasks = allTasks.filter(t => t.completionRule.required);
  const completedRequired = requiredTasks.filter(t => taskCompletions[t.id]).length;
  const completedAll = allTasks.filter(t => taskCompletions[t.id]).length;

  // Resolve bonus session from bonusSessionId if not provided directly
  const resolvedBonus = bonusSession ?? (dayData.bonusSessionId ? BONUS_SESSIONS[dayData.bonusSessionId] : undefined);

  return (
    <div className={styles.screen}>
      {/* Weekend mode banner */}
      {isWeekend && (
        <WeekendModeCard
          type={dayData.type as 'weekend' | 'review' | 'bonus'}
          title={dayData.title}
        />
      )}

      {/* Summary card */}
      <DaySummaryCard
        conceptSummary={dayData.conceptSummary}
        quote={quote}
      />

      {/* Progress pill */}
      {(allTasks.length > 0 || resolvedBonus?.tasks?.length) && (
        <DayProgressPill
          completedCount={completedAll}
          totalCount={allTasks.length + (resolvedBonus?.tasks?.length ?? 0)}
          isDayComplete={isDayComplete}
        />
      )}

      {/* Extra before-tasks JSX (e.g. HumanNeedsMatrix for Day 21) */}
      {overlay.extraBefore}

      {/* Bonus session card with tasks (replaces old simple BonusCard) */}
      {resolvedBonus && (
        <BonusSessionCard
          session={resolvedBonus}
          dayNumber={dayData.dayNumber}
          taskCompletions={taskCompletions}
        />
      )}

      {/* Regular task list */}
      {allTasks.length > 0 && (
        <div className={styles.tasks}>
          {overlay.assignmentIntro && (
            <GuidedAssignmentIntro
              stepNumber={overlay.assignmentIntro.stepNumber}
              totalSteps={overlay.assignmentIntro.totalSteps}
              sectionTitle={overlay.assignmentIntro.sectionTitle}
              body={overlay.assignmentIntro.body}
            />
          )}

          {requiredTasks.length > 0 && (
            <div className={styles.taskSection}>
              {!overlay.sectionBreaks && (
                <TaskSectionHeading
                  title="Your Assignment"
                  count={requiredTasks.length}
                  completed={completedRequired}
                />
              )}
              <div className={styles.taskStack}>
                {allTasks.map(task => (
                  <div key={task.id}>
                    {overlay.sectionBreaks?.[task.id] && (
                      <TaskSectionHeading title={overlay.sectionBreaks[task.id]} />
                    )}
                    {overlay.tipBefore?.[task.id] && (
                      <TipStrip text={overlay.tipBefore[task.id]} />
                    )}
                    <TaskRenderer task={task} dayNumber={dayData.dayNumber} />
                    {overlay.examplesAfterTask?.[task.id] && (
                      <div className={styles.examplesSlot}>
                        {overlay.examplesAfterTask[task.id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* True rest day */}
      {allTasks.length === 0 && !resolvedBonus && !overlay.extraBefore && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🌿</span>
          <p className={styles.emptyText}>Rest day — review, reinforce, and recover.</p>
        </div>
      )}
    </div>
  );
}
