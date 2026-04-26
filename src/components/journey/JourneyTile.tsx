import { useNavigate } from 'react-router-dom';
import type { TileData } from '../../lib/progressEngine';
import { MILESTONES } from '../../lib/progressEngine';
import styles from './JourneyTile.module.css';

interface JourneyTileProps {
  tile: TileData;
  isCurrentDay: boolean;
}

const STATUS_CONFIG = {
  complete: { bg: 'complete', icon: '✓', label: 'Done' },
  partial:  { bg: 'partial',  icon: '◐', label: 'In Progress' },
  missed:   { bg: 'missed',   icon: '✗', label: 'Missed' },
  today:    { bg: 'today',    icon: '',  label: 'Today' },
  weekend:  { bg: 'weekend',  icon: '◇', label: 'Bonus' },
  future:   { bg: 'future',   icon: '',  label: '' },
} as const;

export function JourneyTile({ tile, isCurrentDay }: JourneyTileProps) {
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[tile.status];
  const milestone = MILESTONES[tile.dayNumber];

  return (
    <div className={styles.wrap}>
      {/* Milestone flag above the tile */}
      {milestone && (
        <div className={styles.milestoneBadge} title={milestone.label}>
          <span>{milestone.emoji}</span>
        </div>
      )}

      <button
        id={'tile-day-' + tile.dayNumber}
        className={[
          styles.tile,
          styles['status_' + cfg.bg],
          isCurrentDay ? styles.isToday : '',
          milestone ? styles.hasMilestone : '',
        ].filter(Boolean).join(' ')}
        onClick={() => navigate('/day/' + tile.dayNumber)}
        aria-label={`Day ${tile.dayNumber}: ${tile.title} — ${cfg.label}`}
      >
        <span className={styles.num}>{tile.dayNumber}</span>

        {/* Completion arc — shown on partial */}
        {tile.status === 'partial' && tile.completionPct > 0 && (
          <svg className={styles.arc} viewBox="0 0 32 32">
            <circle className={styles.arcBg} cx="16" cy="16" r="13" />
            <circle
              className={styles.arcFill}
              cx="16" cy="16" r="13"
              strokeDasharray={`${(tile.completionPct / 100) * 81.7} 81.7`}
              transform="rotate(-90 16 16)"
            />
          </svg>
        )}

        {/* Status icon — overlaid on complete/partial/missed */}
        {cfg.icon && (
          <span className={styles.icon} aria-hidden>{cfg.icon}</span>
        )}

        {/* Today pulse ring */}
        {tile.status === 'today' && (
          <span className={styles.pulseDot} aria-hidden />
        )}
      </button>

      {/* Milestone label under tile */}
      {milestone && (
        <span className={styles.milestoneLabel}>{milestone.label}</span>
      )}
    </div>
  );
}
