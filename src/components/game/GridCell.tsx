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
  let backgroundStyle =
    'bg-game-surface/80 border border-game-border/60 shadow-inner hover:border-game-secondary/40';
  let content = null;

  if (isGhost) {
    if (isValidGhost) {
      backgroundStyle =
        'bg-game-success/35 border-2 border-game-success shadow-soft animate-pulse ring-2 ring-game-success/20';
    } else {
      backgroundStyle =
        'bg-game-danger/30 border-2 border-game-danger shadow-soft ring-2 ring-game-danger/20';
    }
  } else if (cell) {
    backgroundStyle = 'border border-white/60 shadow-md ring-1 ring-black/5';
    content = (
      <div
        style={{
          background: `linear-gradient(135deg, ${cell.color}EE, ${cell.color})`,
        }}
        className={`w-full h-full rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-200 animate-pop ${
          cell.clearing ? 'animate-sparkle scale-110' : ''
        }`}
      >
        {/* Luxury 3D gloss dome reflection */}
        <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/40 via-white/15 to-transparent rounded-t-xl pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-[25%] bg-black/15 rounded-b-xl pointer-events-none" />

        {/* Real Cosmetic Icon */}
        <RenderMakeupIcon
          type={cell.itemId}
          size={20}
          className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
        />

        {/* Clear shimmer wave */}
        {cell.clearing && (
          <div className="absolute inset-0 bg-white/50 animate-ping rounded-xl pointer-events-none" />
        )}
      </div>
    );
  }

  return (
    <div
      data-row={row}
      data-col={col}
      className={`aspect-square rounded-2xl p-0.5 flex items-center justify-center transition-all duration-150 select-none ${backgroundStyle}`}
    >
      {content}
    </div>
  );
});

GridCell.displayName = 'GridCell';
