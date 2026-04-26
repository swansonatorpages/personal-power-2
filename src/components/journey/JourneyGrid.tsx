import { Fragment } from 'react';
import { JourneyTile } from './JourneyTile';
import type { TileData } from '../../lib/progressEngine';
import styles from './JourneyGrid.module.css';

interface JourneyGridProps {
  tiles: TileData[];
  currentDay: number;
}

// Phase start days — these get a full-row label before their tile
const PHASE_STARTS: Record<number, string> = {
  1:  'Foundation · Days 1–7',
  8:  'Identity Shift · Days 8–14',
  15: 'Momentum · Days 15–21',
  22: 'Mastery · Days 22–30',
};

export function JourneyGrid({ tiles, currentDay }: JourneyGridProps) {
  return (
    <div className={styles.outer}>
      {tiles.map(tile => {
        const phaseLabel = PHASE_STARTS[tile.dayNumber];
        return (
          <Fragment key={tile.dayNumber}>
            {/* Phase label renders as a full-width block outside the grid */}
            {phaseLabel && (
              <div className={styles.phaseRow}>
                <span className={styles.phaseName}>{phaseLabel}</span>
                <div className={styles.phaseLine} />
              </div>
            )}
            {/* Individual tile in its grid cell */}
            <div className={styles.cell}>
              <JourneyTile tile={tile} isCurrentDay={tile.dayNumber === currentDay} />
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
