/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppStore } from '../../store/appStore';
import type { TaskDefinition } from '../../types/program';
import { ShortTextTask } from './ShortTextTask';
import { LongTextTask } from './LongTextTask';
import { ChecklistTask } from './ChecklistTask';
import { ConfirmActionTask } from './ConfirmActionTask';
import { RankListTask } from './RankListTask';
import { MultiEntryListTask } from './MultiEntryListTask';
import { PromptGroupTask } from './PromptGroupTask';
import { HabitCounterTask } from './HabitCounterTask';
import { MatrixRatingTask } from './MatrixRatingTask';
import { GoalBuilderTask } from './GoalBuilderTask';
import { ReflectionNoteTask } from './ReflectionNoteTask';
import { GuidedSequenceTask } from './GuidedSequenceTask';
import { TaskCard } from './shared/TaskCard';

interface TaskRendererProps {
  task: TaskDefinition;
  dayNumber: number;
}

/**
 * TaskRenderer auto-connects any TaskDefinition to Zustand.
 * All task primitives receive only strongly-typed props via `as any` casts here —
 * the individual components then enforce their own prop types.
 */
export function TaskRenderer({ task, dayNumber }: TaskRendererProps) {
  const t = task as any; // narrowed per case by each child component

  const savedResponse      = useAppStore((s) => s.taskResponses[dayNumber]?.[t.id]);
  const isComplete         = useAppStore((s) => s.taskCompletions[dayNumber]?.[t.id] ?? false);
  const markTaskComplete   = useAppStore((s) => s.markTaskComplete);
  const updateTaskResponse = useAppStore((s) => s.updateTaskResponse);

  const onComplete = (done: boolean)   => markTaskComplete(dayNumber, t.id, done);
  const onResponse = (value: unknown)  => updateTaskResponse(dayNumber, t.id, value);

  switch (t.type as TaskDefinition['type']) {
    case 'short_text':
      return <ShortTextTask task={t} isComplete={isComplete} savedResponse={(savedResponse as string) ?? ''} onResponse={onResponse} onComplete={onComplete} />;
    case 'long_text':
      return <LongTextTask task={t} isComplete={isComplete} savedResponse={(savedResponse as string) ?? ''} onResponse={onResponse} onComplete={onComplete} />;
    case 'checklist':
      return <ChecklistTask task={t} isComplete={isComplete} savedResponse={(savedResponse as Record<string, boolean>) ?? {}} onResponse={onResponse} onComplete={onComplete} />;
    case 'confirm_action':
      return <ConfirmActionTask task={t} isComplete={isComplete} savedResponse={(savedResponse as boolean) ?? false} onResponse={onResponse} onComplete={onComplete} />;
    case 'rank_list':
      return <RankListTask task={t} isComplete={isComplete} savedResponse={(savedResponse as any) ?? { orderedItems: [] }} onResponse={onResponse} onComplete={onComplete} />;
    case 'multi_entry_list':
      return <MultiEntryListTask task={t} isComplete={isComplete} savedResponse={(savedResponse as string[]) ?? []} onResponse={onResponse} onComplete={onComplete} />;
    case 'prompt_group':
      return <PromptGroupTask task={t} isComplete={isComplete} savedResponse={(savedResponse as Record<number, string>) ?? {}} onResponse={onResponse} onComplete={onComplete} />;
    case 'habit_counter':
      return <HabitCounterTask task={t} isComplete={isComplete} savedResponse={(savedResponse as number) ?? 0} onResponse={onResponse} onComplete={onComplete} />;
    case 'matrix_rating':
      return <MatrixRatingTask task={t} isComplete={isComplete} savedResponse={(savedResponse as any) ?? {}} onResponse={onResponse} onComplete={onComplete} />;
    case 'goal_builder':
      return <GoalBuilderTask task={t} isComplete={isComplete} savedResponse={(savedResponse as any) ?? {}} onResponse={onResponse} onComplete={onComplete} />;
    case 'reflection_note':
      return <ReflectionNoteTask task={t} isComplete={isComplete} savedResponse={(savedResponse as boolean) ?? false} onResponse={onResponse} onComplete={onComplete} />;
    case 'guided_sequence':
      return <GuidedSequenceTask task={t} isComplete={isComplete} savedResponse={(savedResponse as any) ?? { currentStep: 0, stepNotes: {} }} onResponse={onResponse} onComplete={onComplete} />;
    default:
      return (
        <TaskCard taskId={t.id} title={t.title} description={t.description} isComplete={false} isRequired={t.completionRule?.required}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
            Unsupported task type: <strong>{t.type}</strong>
          </p>
        </TaskCard>
      );
  }
}
