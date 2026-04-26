import { AppState } from '../types/state';

// We start at version 0
export const CURRENT_STATE_VERSION = 0;

/**
 * Migration function for Zustand persist middleware.
 * @param persistedState The state object loaded from IndexedDB
 * @param version The version number of the loaded state
 */
export const migrateAppState = (persistedState: any, version: number): AppState | Promise<AppState> => {
  let state = persistedState as AppState;

  if (version === 0) {
    // If we ever upgrade to version 1, we would do:
    // state.newField = 'defaultValue';
    // version = 1;
  }

  // Fallback to ensuring defaults if fields are missing due to early versions
  return {
    ...state,
    appSettings: {
      dayCutoffTime: state.appSettings?.dayCutoffTime ?? '03:00',
      theme: state.appSettings?.theme ?? 'dark',
      isProgramDayTrueMode: state.appSettings?.isProgramDayTrueMode ?? true,
    },
    taskResponses: state.taskResponses ?? {},
    taskCompletions: state.taskCompletions ?? {},
    dayCompletions: state.dayCompletions ?? {},
    habitHistory: state.habitHistory ?? {},
    dailyNotes: state.dailyNotes ?? {},
    recoveryFlags: state.recoveryFlags ?? {},
    confidenceBank: state.confidenceBank ?? [],
    milestones: state.milestones ?? [],
  };
};
