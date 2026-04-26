import { useState, useEffect } from 'react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  scheduleLocalReminder,
  getScheduledReminderTime,
  clearScheduledReminder,
} from '../../lib/pwa';
import { getReminderSuggestion } from '../../lib/engagementEngine';
import { computeProgressStats } from '../../lib/progressEngine';
import { useAppStore } from '../../store/appStore';
import styles from './ReminderSettings.module.css';

const REMINDER_TIMES = [
  { label: '7:00 AM', value: '07:00' },
  { label: '8:00 AM', value: '08:00' },
  { label: '9:00 AM', value: '09:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '5:00 PM', value: '17:00' },
  { label: '7:00 PM', value: '19:00' },
  { label: '9:00 PM', value: '21:00' },
];

export function ReminderSettings() {
  const state = useAppStore(s => s);
  const stats = computeProgressStats(state);

  const [permission, setPermission] = useState(getNotificationPermission());
  const [savedTime, setSavedTime]   = useState(getScheduledReminderTime());
  const [selected, setSelected]     = useState(savedTime ?? '08:00');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    setSavedTime(getScheduledReminderTime());
  }, []);

  const handleRequest = async () => {
    setRequesting(true);
    const result = await requestNotificationPermission();
    setPermission(result);
    setRequesting(false);
  };

  const handleSave = () => {
    scheduleLocalReminder(selected);
    setSavedTime(selected);
  };

  const handleClear = () => {
    clearScheduledReminder();
    setSavedTime(null);
  };

  const suggestion = getReminderSuggestion(stats.completionPct);

  return (
    <div className={styles.wrap}>
      {/* Context tip */}
      <p className={styles.tip}>{suggestion}</p>

      {/* Permission banner */}
      {permission === 'default' && (
        <div className={styles.permBanner}>
          <span className={styles.permIcon}>🔔</span>
          <div className={styles.permBody}>
            <span className={styles.permLabel}>Enable Notifications</span>
            <span className={styles.permSub}>Allow reminders to keep your streak alive.</span>
          </div>
          <button
            id="notif-permission-btn"
            className={styles.permBtn}
            onClick={handleRequest}
            disabled={requesting}
          >
            {requesting ? '...' : 'Allow'}
          </button>
        </div>
      )}

      {permission === 'denied' && (
        <div className={styles.deniedBanner}>
          <span>🚫</span>
          <p className={styles.deniedText}>
            Notifications are blocked. Enable them in your browser settings, then return here.
          </p>
        </div>
      )}

      {permission === 'unsupported' && (
        <div className={styles.deniedBanner}>
          <span>ℹ️</span>
          <p className={styles.deniedText}>
            Your browser doesn't support notifications. The reminder preference is saved locally and can be used by a future native integration.
          </p>
        </div>
      )}

      {/* Time picker */}
      <div className={styles.timeSection}>
        <span className={styles.sectionLabel}>Daily reminder time</span>
        <div className={styles.timeGrid}>
          {REMINDER_TIMES.map(t => (
            <button
              key={t.value}
              id={'reminder-time-' + t.value.replace(':', '-')}
              className={`${styles.timeBtn} ${selected === t.value ? styles.timeBtnActive : ''}`}
              onClick={() => setSelected(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Save / clear */}
      <div className={styles.saveRow}>
        <button
          id="reminder-save-btn"
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={permission === 'denied'}
        >
          {savedTime ? 'Update Reminder' : 'Set Reminder'}
        </button>
        {savedTime && (
          <button id="reminder-clear-btn" className={styles.clearBtn} onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      {savedTime && (
        <p className={styles.savedLabel}>✓ Reminder set for {savedTime}</p>
      )}

      <p className={styles.disclaimer}>
        Reminders are stored locally and sent via browser notifications when the app is open or installed as a PWA.
      </p>
    </div>
  );
}
