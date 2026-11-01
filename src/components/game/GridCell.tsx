import React from 'react';
import type { CellValue } from '../../game/types';
import { RenderMakeupIcon } from '../icons/MakeupIcons';

interface GridCellProps {
  row: number;
  col: number;
  cell: CellValue;
  isGhost: boolean;
  isValidGhost: boolean;
}

export const GridCell = React.memo<GridCellProps>(({
  row,
  col,
  cell,
  isGhost,
  isValidGhost,
}) => {
  // Styling calculation
  let backgroundStyle = 'bg-game-surface/90 border border-game-border/50 shadow-inner';
  let content = null;

  if (isGhost) {
    if (isValidGhost) {
      backgroundStyle = 'bg-game-success/40 border-2 border-game-success shadow-soft animate-pulse';
    } else {
      backgroundStyle = 'bg-game-danger/35 border-2 border-game-danger';
    }
  } else if (cell) {
    backgroundStyle = 'border border-white/40 shadow-soft';
    content = (
      <div
        style={{ backgroundColor: cell.color }}
        className="w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-150 animate-pop"
      >
        {/* Subtle glossy sheen */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-lg" />
        <RenderMakeupIcon type={cell.itemId} size={18} className="relative z-10 drop-shadow-sm" />
      </div>
    );
  }

  return (
    <div
      data-row={row}
      data-col={col}
      className={`aspect-square rounded-xl p-0.5 flex items-center justify-center transition-all select-none ${backgroundStyle}`}
    >
      {content}
    </div>
  );
});

GridCell.displayName = 'GridCell';
