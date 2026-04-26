import { AppStore } from './appStore';

// Selectors to prevent unnecessary re-renders in React components
export const selectActiveProgramStartDate = (state: AppStore) => state.activeProgramStartDate;
export const selectCurrentDayPointer = (state: AppStore) => state.currentDayPointer;
export const selectAppSettings = (state: AppStore) => state.appSettings;
export const selectConfidenceBank = (state: AppStore) => state.confidenceBank;

export const selectTaskResponse = (dayNumber: number, taskId: string) => (state: AppStore) => 
  state.taskResponses[dayNumber]?.[taskId];

export const selectTaskCompletion = (dayNumber: number, taskId: string) => (state: AppStore) => 
  state.taskCompletions[dayNumber]?.[taskId] ?? false;

export const selectDayCompletion = (dayNumber: number) => (state: AppStore) => 
  state.dayCompletions[dayNumber] ?? false;

export const selectHabitHistory = (habitId: string) => (state: AppStore) => 
  state.habitHistory[habitId] ?? {};

export const selectDailyNote = (dayNumber: number) => (state: AppStore) => 
  state.dailyNotes[dayNumber] ?? '';
