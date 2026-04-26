import styles from './NotesPanel.module.css';

interface NotesPanelProps {
  dayNumber: number;
  value: string;
  onChange: (note: string) => void;
}

export function NotesPanel({ dayNumber: _dn, value, onChange }: NotesPanelProps) {
  return (
    <div className={styles.panel}>
      <label className={styles.label} htmlFor="daily-notes-ta">
        Daily Notes
      </label>
      <p className={styles.hint}>Freeform thoughts, breakthroughs, or observations for today.</p>
      <textarea
        id="daily-notes-ta"
        className={styles.textarea}
        rows={5}
        placeholder="What's on your mind today…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
