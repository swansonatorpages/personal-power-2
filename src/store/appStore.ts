import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, AppStore } from '../types/state';
import { idbStorage } from '../lib/db';
import { CURRENT_STATE_VERSION, migrateAppState } from '../lib/migrations';

export type { AppStore };

const initialState: AppState = {
  activeProgramStartDate: null,
  appSettings: {
    dayCutoffTime: '03:00', // Default 3 AM cutoff
    theme: 'dark',
    isProgramDayTrueMode: true,
  },
  currentDayPointer: 1,
  taskResponses: {},
  taskCompletions: {},
  dayCompletions: {},
  habitHistory: {},
  dailyNotes: {},
  recoveryFlags: {},
  confidenceBank: [],
  milestones: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,

      initializeProgram: (startDate: string) => 
        set({ activeProgramStartDate: startDate, currentDayPointer: 1 }),

      updateTaskResponse: (dayNumber, taskId, value) => 
        set((state) => ({
          taskResponses: {
            ...state.taskResponses,
            [dayNumber]: {
              ...state.taskResponses[dayNumber],
              [taskId]: value
            }
          }
        })),

      markTaskComplete: (dayNumber, taskId, completed = true) => 
        set((state) => ({
          taskCompletions: {
            ...state.taskCompletions,
            [dayNumber]: {
              ...state.taskCompletions[dayNumber],
              [taskId]: completed
            }
          }
        })),

      markDayComplete: (dayNumber, completed = true) => 
        set((state) => ({
          dayCompletions: {
            ...state.dayCompletions,
            [dayNumber]: completed
          }
        })),

      addDailyNote: (dayNumber, note) => 
        set((state) => ({
          dailyNotes: {
            ...state.dailyNotes,
            [dayNumber]: note
          }
        })),

      setDayEndCutoff: (time) => 
        set((state) => ({
          appSettings: { ...state.appSettings, dayCutoffTime: time }
        })),

      recordHabitCheck: (habitId, dayNumber, value) => 
        set((state) => ({
          habitHistory: {
            ...state.habitHistory,
            [habitId]: {
              ...state.habitHistory[habitId],
              [dayNumber]: value
            }
          }
        })),

      addConfidenceEntry: (entry) => 
        set((state) => ({
          confidenceBank: [...state.confidenceBank, entry]
        })),

      setProgramMode: (isStrict) => 
        set((state) => ({
          appSettings: { ...state.appSettings, isProgramDayTrueMode: isStrict }
        })),

      setCurrentDayPointer: (day) => 
        set({ currentDayPointer: day }),

      setStartDate: (date) => 
        set({ activeProgramStartDate: date }),

      importState: (newState) => 
        set((state) => ({ ...state, ...newState })),
    }),
    {
      name: 'personal-power-storage', // unique name for the IndexedDB key
      storage: createJSONStorage(() => idbStorage),
      version: CURRENT_STATE_VERSION,
      migrate: migrateAppState,
    }
  )
);
