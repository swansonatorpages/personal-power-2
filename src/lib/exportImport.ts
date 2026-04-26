import { useAppStore } from '../store/appStore';
import { AppState } from '../types/state';

/**
 * Serializes the current Zustand app state (which excludes functions) to a JSON blob
 * and triggers a download in the browser.
 */
export function exportAppState() {
  const state = useAppStore.getState();
  
  // Create a copy of the state without the functions
  const {
    initializeProgram,
    updateTaskResponse,
    markTaskComplete,
    markDayComplete,
    addDailyNote,
    setDayEndCutoff,
    recordHabitCheck,
    addConfidenceEntry,
    setProgramMode,
    setCurrentDayPointer,
    importState,
    ...pureState
  } = state as any;

  const dataStr = JSON.stringify(pureState, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'personal-power-backup-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses a JSON string, validates it minimally, and imports it into the global state.
 */
export function importAppState(jsonPayload: string): boolean {
  try {
    const parsed: Partial<AppState> = JSON.parse(jsonPayload);
    
    // Minimal validation to ensure it looks like our state payload
    if (parsed && typeof parsed === 'object') {
      useAppStore.getState().importState(parsed);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to parse state payload for import', err);
    return false;
  }
}
