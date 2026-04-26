import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { selectAllEvidence } from '../../store/evidenceSelectors';
import type { EvidenceCategory } from '../../types/evidence';
import styles from './EvidenceTimeline.module.css';

const CATEGORY_CONFIG: Record<EvidenceCategory, { icon: string; color: string; label: string }> = {
  success:    { icon: '🏆', color: '#48c774', label: 'Success' },
  decision:   { icon: '⚡', color: '#f5c842', label: 'Decision' },
  belief:     { icon: '💡', color: '#ba55d3', label: 'Belief' },
  goal:       { icon: '🎯', color: '#20d4b8', label: 'Goal' },
  problem:    { icon: '🔧', color: '#6495ed', label: 'Problem solved' },
  note:       { icon: '📝', color: '#aaa',    label: 'Daily note' },
  confidence: { icon: '⚡', color: '#f5c842', label: 'Confidence' },
  identity:   { icon: '🌿', color: '#48c774', label: 'Identity shift' },
};

const ALL_CATEGORIES: EvidenceCategory[] = ['success', 'decision', 'belief', 'goal', 'problem', 'note', 'identity'];

export function EvidenceTimeline() {
  const state = useAppStore(s => s);
  const all = selectAllEvidence(state);

  const [filter, setFilter] = useState<EvidenceCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = all
    .filter(e => filter === 'all' || e.category === filter)
    .filter(e => !search || e.text.toLowerCase().includes(search.toLowerCase()) ||
      (e.dayTitle ?? '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.timeline}>
      <div className={styles.header}>
        <h3 className={styles.title}>Evidence Timeline</h3>
        <p className={styles.sub}>{filtered.length} of {all.length} entries</p>
      </div>

      {/* Search */}
      <input
        id="evidence-search"
        className={styles.search}
        type="search"
        placeholder="Search your evidence…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Category filters */}
      <div className={styles.filters}>
        <button
          id="evidence-filter-all"
          className={`${styles.pill} ${filter === 'all' ? styles.pillActive : ''}`}
          onClick={() => setFilter('all')}
        >All</button>
        {ALL_CATEGORIES.map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              id={'evidence-filter-' + cat}
              className={`${styles.pill} ${filter === cat ? styles.pillActive : ''}`}
              style={filter === cat ? { borderColor: cfg.color + '66', color: cfg.color } : undefined}
              onClick={() => setFilter(cat)}
            >
              {cfg.icon} {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>🗺️</p>
          <p className={styles.emptyText}>
            {all.length === 0
              ? 'Complete program exercises and they\'ll appear here as evidence of your growth.'
              : 'No entries match this filter.'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((entry, i) => {
            const cfg = CATEGORY_CONFIG[entry.category];
            const showDayMarker = i === 0 || filtered[i - 1].dayNumber !== entry.dayNumber;
            return (
              <div key={entry.id}>
                {showDayMarker && entry.dayNumber && (
                  <div className={styles.dayMarker}>
                    <div className={styles.dayMarkerLine} />
                    <span className={styles.dayMarkerLabel}>Day {entry.dayNumber}</span>
                    <div className={styles.dayMarkerLine} />
                  </div>
                )}
                <div className={styles.entry}>
                  <div className={styles.entryDot} style={{ background: cfg.color }} />
                  <div className={styles.entryCard}>
                    <div className={styles.entryHeader}>
                      <span className={styles.entryIcon}>{cfg.icon}</span>
                      <span className={styles.entryCategory} style={{ color: cfg.color }}>{cfg.label}</span>
                      {entry.dayTitle && <span className={styles.entryDayTitle}>{entry.dayTitle}</span>}
                    </div>
                    <p className={styles.entryText}>{entry.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
