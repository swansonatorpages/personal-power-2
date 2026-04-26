export interface AppSettings {
  dayCutoffTime: string; // e.g., '23:00', or '03:00' for a 3am cutoff
  theme: 'dark' | 'light' | 'system';
  isProgramDayTrueMode: boolean; // If true, ties strictly to calendar dates. If false, manual advance.
}

export interface AppState {
  // Config & Status
  activeProgramStartDate: string | null; // ISO Date string (YYYY-MM-DD)
  appSettings: AppSettings;
  currentDayPointer: number; // 1 to 30

  // State Dictionaries
  taskResponses: Record<number, Record<string, any>>; // { dayNumber: { taskId: responseValue } }
  taskCompletions: Record<number, Record<string, boolean>>; // { dayNumber: { taskId: isComplete } }
  dayCompletions: Record<number, boolean>; // { dayNumber: isComplete }
  habitHistory: Record<string, Record<number, any>>; // { habitId: { dayNumber: recordValue } }
  dailyNotes: Record<number, string>; // { dayNumber: "note" }
  recoveryFlags: Record<number, boolean>; // { dayNumber: wasRecovered }

  // Global Tracking
  confidenceBank: string[];
  milestones: string[];
}

// These are the actions we'll expose in our store, separated from state
export interface AppActions {
  initializeProgram: (startDate: string) => void;
  updateTaskResponse: (dayNumber: number, taskId: string, value: any) => void;
  markTaskComplete: (dayNumber: number, taskId: string, completed?: boolean) => void;
  markDayComplete: (dayNumber: number, completed?: boolean) => void;
  addDailyNote: (dayNumber: number, note: string) => void;
  setDayEndCutoff: (time: string) => void;
  recordHabitCheck: (habitId: string, dayNumber: number, value: any) => void;
  addConfidenceEntry: (entry: string) => void;
  setProgramMode: (isStrict: boolean) => void;
  setCurrentDayPointer: (day: number) => void;
  importState: (newState: Partial<AppState>) => void;
}

export type AppStore = AppState & AppActions;
