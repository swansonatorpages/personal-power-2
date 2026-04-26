import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useAppStore } from '../store/appStore';
import { exportAppState, importAppState } from '../lib/exportImport';
import { ReminderSettings } from '../components/settings/ReminderSettings';
import { MilestoneCard } from '../components/engagement/MilestoneCard';
import styles from './SettingsPage.module.css';

const CUTOFF_OPTIONS = [
  { label: '10:00 PM', value: '22:00' },
  { label: '11:00 PM', value: '23:00' },
  { label: 'Midnight', value: '00:00' },
  { label: '1:00 AM',  value: '01:00' },
  { label: '2:00 AM',  value: '02:00' },
  { label: '3:00 AM (default)', value: '03:00' },
];

export function SettingsPage() {
  const appSettings        = useAppStore((s) => s.appSettings);
  const startDate          = useAppStore((s) => s.activeProgramStartDate);
  const currentDay         = useAppStore((s) => s.currentDayPointer);
  const dayCompletions     = useAppStore((s) => s.dayCompletions);
  const setDayEndCutoff    = useAppStore((s) => s.setDayEndCutoff);
  const setProgramMode     = useAppStore((s) => s.setProgramMode);
  const setCurrentDayPointer = useAppStore((s) => s.setCurrentDayPointer);
  const initializeProgram  = useAppStore((s) => s.initializeProgram);

  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const ok = importAppState(text);
      setImportStatus(ok ? 'success' : 'error');
      setTimeout(() => setImportStatus('idle'), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <AppShell headerTitle="Settings" headerSubtitle="Program configuration">
      <div className={styles.page}>

        {/* ── Program Status ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Program</h3>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Start Date</span>
              <span className={styles.rowValue}>{startDate ?? 'Not started'}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Current Day</span>
              <span className={styles.rowValue}>{currentDay} / 30</span>
            </div>
            {!startDate && (
              <button
                id="settings-start-btn"
                className={styles.actionBtn}
                onClick={() => initializeProgram(new Date().toISOString().split('T')[0])}
              >
                Start Program Today
              </button>
            )}
          </div>
        </div>

        {/* ── Milestones ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Milestones</h3>
          <div className={styles.milestoneStack}>
            {[7, 14, 21, 30].map(m => (
              <MilestoneCard
                key={m}
                dayNumber={m}
                achieved={dayCompletions[m] ?? false}
                currentDay={currentDay}
              />
            ))}
          </div>
        </div>

        {/* ── Reminders ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Reminders</h3>
          <div className={styles.card}>
            <ReminderSettings />
          </div>
        </div>

        {/* ── Day Cutoff ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Day Ends At</h3>
          <p className={styles.sectionDesc}>
            If you complete tasks after midnight, this setting attributes them to the previous day.
          </p>
          <div className={styles.optionGroup}>
            {CUTOFF_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                id={'cutoff-' + opt.value.replace(':', '-')}
                className={`${styles.optionBtn} ${appSettings.dayCutoffTime === opt.value ? styles.optionActive : ''}`}
                onClick={() => setDayEndCutoff(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Program Mode ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Program Day Mode</h3>
          <div className={styles.card}>
            <label className={styles.toggle} htmlFor="strict-mode-toggle">
              <span className={styles.toggleLabel}>Strict Calendar Mode</span>
              <div className={`${styles.toggleTrack} ${appSettings.isProgramDayTrueMode ? styles.toggleOn : ''}`}>
                <input
                  id="strict-mode-toggle"
                  type="checkbox"
                  className={styles.toggleInput}
                  checked={appSettings.isProgramDayTrueMode}
                  onChange={(e) => setProgramMode(e.target.checked)}
                />
                <div className={styles.toggleThumb} />
              </div>
            </label>
            <p className={styles.toggleDesc}>
              When <strong>on</strong>: program day is tied to your calendar start date.<br />
              When <strong>off</strong>: you advance days manually at your own pace.
            </p>
          </div>
        </div>

        {/* ── Manual Day Pointer (only if not strict) ── */}
        {!appSettings.isProgramDayTrueMode && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Manual Day Pointer</h3>
            <div className={styles.card}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Current Day</span>
                <div className={styles.stepper}>
                  <button
                    id="day-decrement-btn"
                    className={styles.stepBtn}
                    onClick={() => setCurrentDayPointer(Math.max(1, currentDay - 1))}
                  >−</button>
                  <span className={styles.stepValue}>{currentDay}</span>
                  <button
                    id="day-increment-btn"
                    className={styles.stepBtn}
                    onClick={() => setCurrentDayPointer(Math.min(30, currentDay + 1))}
                  >+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Data ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Data</h3>
          <div className={styles.card}>
            <button id="export-btn" className={styles.actionBtn} onClick={exportAppState}>
              Export Backup (JSON)
            </button>
            <label
              id="import-label"
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              htmlFor="import-file-input"
              style={{ textAlign: 'center' }}
            >
              Import Backup
            </label>
            <input
              id="import-file-input"
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
            {importStatus === 'success' && <p className={styles.importSuccess}>✓ Import successful</p>}
            {importStatus === 'error'   && <p className={styles.importError}>✗ Invalid backup file</p>}
          </div>
        </div>

        {/* ── About ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>About</h3>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>App</span>
              <span className={styles.rowValue}>Personal Power II Journal</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Version</span>
              <span className={styles.rowValue}>1.0.0</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Storage</span>
              <span className={styles.rowValue}>IndexedDB · Offline-first</span>
            </div>
          </div>
        </div>

        <div style={{ height: 24 }} aria-hidden />
      </div>
    </AppShell>
  );
}
