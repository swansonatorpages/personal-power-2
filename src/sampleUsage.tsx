import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import { exportAppState } from './lib/exportImport';

/**
 * Minimal sample component demonstrating how to consume the Zustand store
 * in a React component for the offline-first persistence layer.
 */
export function PersistenceTestHarness() {
  const activeProgramStartDate = useAppStore((state) => state.activeProgramStartDate);
  const currentDayPointer = useAppStore((state) => state.currentDayPointer);
  const initializeProgram = useAppStore((state) => state.initializeProgram);
  const updateTaskResponse = useAppStore((state) => state.updateTaskResponse);
  const addDailyNote = useAppStore((state) => state.addDailyNote);
  const dailyNotes = useAppStore((state) => state.dailyNotes);

  useEffect(() => {
    // This will automatically save to IndexedDB due to the persist middleware
    if (!activeProgramStartDate) {
      console.log('Initializing program start date...');
      initializeProgram(new Date().toISOString().split('T')[0]);
    }
  }, [activeProgramStartDate, initializeProgram]);

  const handleTestSave = () => {
    updateTaskResponse(1, 'day1_decisions', 'I will finish this app!');
    addDailyNote(1, 'This is a test note for Day 1');
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: '#1a1a1a', borderRadius: '8px' }}>
      <h2>Persistence Test Harness</h2>
      <p><strong>Start Date:</strong> {activeProgramStartDate || 'Not started'}</p>
      <p><strong>Current Day Pointer:</strong> {currentDayPointer}</p>
      <p><strong>Day 1 Note:</strong> {dailyNotes[1] || 'No note yet'}</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={handleTestSave} style={{ padding: '10px', cursor: 'pointer' }}>
          Simulate Field Change (Autosaves)
        </button>
        <button onClick={exportAppState} style={{ padding: '10px', cursor: 'pointer' }}>
          Export App State Backup
        </button>
      </div>
    </div>
  );
}
