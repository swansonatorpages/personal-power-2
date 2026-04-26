import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import styles from './QuickCaptureSheet.module.css';

interface QuickCaptureSheetProps {
  /** When true the sheet is rendered expanded inline */
  inline?: boolean;
}

export function QuickCaptureSheet({ inline = false }: QuickCaptureSheetProps) {
  const addConfidenceEntry = useAppStore(s => s.addConfidenceEntry);
  const [open, setOpen] = useState(inline);
  const [type, setType] = useState<'win' | 'belief' | 'note'>('win');
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const TYPES = [
    { id: 'win' as const,    label: '🏆 Win',    placeholder: 'Something I accomplished, overcame, or proved to myself…' },
    { id: 'belief' as const, label: '💡 Belief',  placeholder: 'An empowering belief I want to remember…' },
    { id: 'note' as const,   label: '📝 Note',    placeholder: 'A thought, insight, or reflection I want to keep…' },
  ];

  const selected = TYPES.find(t => t.id === type)!;

  const handleSave = () => {
    const t = text.trim();
    if (!t) return;
    addConfidenceEntry(`[${type.toUpperCase()}] ${t}`);
    setText('');
    setSaved(true);
    setTimeout(() => { setSaved(false); if (!inline) setOpen(false); }, 1600);
  };

  if (!open && !inline) {
    return (
      <button id="quick-capture-open" className={styles.trigger} onClick={() => setOpen(true)}>
        <span className={styles.triggerIcon}>+ Quick Capture</span>
        <span className={styles.triggerSub}>Win · Belief · Note</span>
      </button>
    );
  }

  return (
    <div className={styles.sheet}>
      <div className={styles.header}>
        <h3 className={styles.title}>Quick Capture</h3>
        {!inline && (
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">✕</button>
        )}
      </div>

      {/* Type selector */}
      <div className={styles.typeRow}>
        {TYPES.map(t => (
          <button
            key={t.id}
            id={'capture-type-' + t.id}
            className={`${styles.typeBtn} ${type === t.id ? styles.typeBtnActive : ''}`}
            onClick={() => setType(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        id="quick-capture-text"
        className={styles.input}
        placeholder={selected.placeholder}
        value={text}
        rows={3}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSave(); }}
      />

      <button
        id="quick-capture-save"
        className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`}
        onClick={handleSave}
        disabled={!text.trim()}
      >
        {saved ? '✓ Saved to Confidence Bank' : 'Save to Confidence Bank'}
      </button>
    </div>
  );
}
