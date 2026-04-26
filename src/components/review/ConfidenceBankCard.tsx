import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { selectConfidenceBankEntries } from '../../store/evidenceSelectors';
import type { ConfidenceBankEntry } from '../../types/evidence';
import styles from './ConfidenceBankCard.module.css';

const SOURCE_CONFIG: Record<ConfidenceBankEntry['source'], { icon: string; label: string; color: string }> = {
  manual:         { icon: '✍️', label: 'Added by you',    color: '#f5c842' },
  'auto-success': { icon: '🏆', label: 'Greatest success', color: '#48c774' },
  'auto-decision':{ icon: '⚡', label: 'Key decision',     color: '#6495ed' },
  'auto-belief':  { icon: '💡', label: 'Empowering belief', color: '#ba55d3' },
  'auto-goal':    { icon: '🎯', label: 'Top goal',         color: '#20d4b8' },
};

export function ConfidenceBankCard() {
  const state = useAppStore(s => s);
  const addConfidenceEntry = useAppStore(s => s.addConfidenceEntry);
  const entries = selectConfidenceBankEntries(state);

  const [newEntry, setNewEntry] = useState('');
  const [filter, setFilter] = useState<ConfidenceBankEntry['source'] | 'all'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const filtered = filter === 'all' ? entries : entries.filter(e => e.source === filter);

  const handleAdd = () => {
    const t = newEntry.trim();
    if (!t) return;
    addConfidenceEntry(t);
    setNewEntry('');
    setIsAdding(false);
  };

  const randomEntry = () => {
    if (filtered.length === 0) return;
    setHighlighted(Math.floor(Math.random() * filtered.length));
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>⚡</span>
          <div>
            <h3 className={styles.title}>Confidence Bank</h3>
            <p className={styles.sub}>{entries.length} entries · auto-aggregated + manual</p>
          </div>
        </div>
        <button
          id="confidence-random-btn"
          className={styles.randomBtn}
          onClick={randomEntry}
          aria-label="Surface a random entry"
          disabled={filtered.length === 0}
        >
          🎲 Random
        </button>
      </div>

      {/* Filter pills */}
      <div className={styles.filters}>
        {(['all', 'manual', 'auto-success', 'auto-decision', 'auto-belief', 'auto-goal'] as const).map(f => (
          <button
            key={f}
            id={'filter-' + f}
            className={`${styles.filterPill} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : SOURCE_CONFIG[f]?.icon + ' ' + SOURCE_CONFIG[f]?.label}
          </button>
        ))}
      </div>

      {/* Entry list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>🌱</p>
          <p className={styles.emptyText}>
            {entries.length === 0
              ? 'Complete program exercises to auto-populate your Confidence Bank, or add a win manually.'
              : 'No entries for this filter.'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((entry, i) => {
            const cfg = SOURCE_CONFIG[entry.source];
            const isHighlighted = highlighted === i;
            return (
              <div
                key={i}
                className={`${styles.entry} ${isHighlighted ? styles.entryHighlighted : ''}`}
                style={isHighlighted ? { borderColor: cfg.color + '66' } : undefined}
              >
                <span className={styles.entryIcon} style={{ color: cfg.color }}>{cfg.icon}</span>
                <div className={styles.entryBody}>
                  <p className={styles.entryText}>{entry.text}</p>
                  <div className={styles.entryMeta}>
                    <span className={styles.entrySource} style={{ color: cfg.color }}>{cfg.label}</span>
                    {entry.dayNumber && <span className={styles.entryDay}>Day {entry.dayNumber}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add entry */}
      {isAdding ? (
        <div className={styles.addRow}>
          <input
            id="confidence-new-entry"
            className={styles.addInput}
            type="text"
            placeholder="Describe a win, belief, or evidence of your capability…"
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <button id="confidence-save-btn" className={styles.saveBtn} onClick={handleAdd}>Add</button>
          <button id="confidence-cancel-btn" className={styles.cancelBtn} onClick={() => setIsAdding(false)}>✕</button>
        </div>
      ) : (
        <button id="confidence-add-btn" className={styles.addTrigger} onClick={() => setIsAdding(true)}>
          + Add a win manually
        </button>
      )}
    </div>
  );
}
