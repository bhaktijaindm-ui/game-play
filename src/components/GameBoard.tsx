import React, { memo, useState, useEffect, useMemo } from 'react';
import type { Board, BoardCell, BlockCell, ShadeId } from '../types';
import { SHADES, SHADE_PATTERNS } from '../config/shades';

export interface GameBoardProps {
  board: Board;
  validCells?: Set<string>;
  invalidCells?: Set<string>;
  ghostShape?: {
    cells: BlockCell[];
    shade: ShadeId;
  };
  clearingCells?: Set<string>;
  onCellClick?: (row: number, col: number) => void;
  className?: string;
  colorBlindMode?: boolean;
}

interface CellProps {
  row: number;
  col: number;
  cell: BoardCell | null;
  isValid: boolean;
  isInvalid: boolean;
  isGhost: boolean;
  ghostShade?: ShadeId;
  isClearing: boolean;
  isColorBlind: boolean;
  onClick?: (row: number, col: number) => void;
}

const FALLBACK_SHADE_COLORS: Record<string, { color: string; gloss: string; icon: string }> = {
  rose: { color: '#FF5C9E', gloss: 'linear-gradient(135deg, #FF94C2 0%, #FF5C9E 60%, #D83177 100%)', icon: '💄' },
  lavender: { color: '#9B6BFF', gloss: 'linear-gradient(135deg, #C2A5FF 0%, #9B6BFF 60%, #7643E0 100%)', icon: '✨' },
  peach: { color: '#FF9E80', gloss: 'linear-gradient(135deg, #FFC7B5 0%, #FF9E80 60%, #E66F4E 100%)', icon: '💖' },
  ruby: { color: '#E8344E', gloss: 'linear-gradient(135deg, #FF7285 0%, #E8344E 60%, #B71C35 100%)', icon: '💧' },
  gold: { color: '#F2B84B', gloss: 'linear-gradient(135deg, #FFE08F 0%, #F2B84B 60%, #C28B20 100%)', icon: '⭐' },
  mint: { color: '#3FCB9B', gloss: 'linear-gradient(135deg, #7AEDB8 0%, #3FCB9B 60%, #1FA375 100%)', icon: '🌿' },
  sky: { color: '#4DA3FF', gloss: 'linear-gradient(135deg, #99C9FF 0%, #4DA3FF 60%, #247DE0 100%)', icon: '💎' },
  turmeric: { color: '#F5B700', gloss: 'linear-gradient(135deg, #FFE27D 0%, #F5B700 60%, #C99000 100%)', icon: '☀️' },
  henna: { color: '#A24A22', gloss: 'linear-gradient(135deg, #CD7851 0%, #A24A22 60%, #7A3314 100%)', icon: '🍂' },
  berry: { color: '#9C27B0', gloss: 'linear-gradient(135deg, #CE64E2 0%, #9C27B0 60%, #701382 100%)', icon: '🍇' },
  crimson: { color: '#D32F2F', gloss: 'linear-gradient(135deg, #FF6659 0%, #D32F2F 60%, #9A0007 100%)', icon: '💋' },
  kohl: { color: '#212121', gloss: 'linear-gradient(135deg, #484848 0%, #212121 60%, #000000 100%)', icon: '👁️' },
  champagne: { color: '#F7E7CE', gloss: 'linear-gradient(135deg, #FFFFFF 0%, #F7E7CE 60%, #D6C1A3 100%)', icon: '🥂' },
};

function getShadeDisplay(shadeId?: ShadeId) {
  if (!shadeId) return null;
  const config = SHADES[shadeId];
  if (config) {
    return {
      color: config.lightColor,
      gloss: config.lightGloss,
      icon: config.icon,
      pattern: config.pattern,
    };
  }
  const fallback = FALLBACK_SHADE_COLORS[shadeId];
  if (fallback) {
    return {
      color: fallback.color,
      gloss: fallback.gloss,
      icon: fallback.icon,
      pattern: undefined,
    };
  }
  return {
    color: '#FF5C9E',
    gloss: 'linear-gradient(135deg, #FF94C2 0%, #FF5C9E 100%)',
    icon: '💄',
    pattern: undefined,
  };
}

/**
 * Memoized individual Grid Cell component for high-performance 60fps dragging
 */
const GridCell = memo(function GridCell({
  row,
  col,
  cell,
  isValid,
  isInvalid,
  isGhost,
  ghostShade,
  isClearing,
  isColorBlind,
  onClick,
}: CellProps) {
  const cellShade = typeof cell === 'string' ? cell : cell?.shade;
  const activeShade = cellShade || (isGhost ? ghostShade : undefined);
  const shadeInfo = getShadeDisplay(activeShade);

  const handleClick = () => {
    onClick?.(row, col);
  };

  // Determine background styling: crystal semi-transparent glass so face canvas underneath is vivid
  let cellBgStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
    borderColor: 'var(--border, rgba(255, 255, 255, 0.22))',
  };

  if (cell && shadeInfo) {
    cellBgStyle = {
      ...cellBgStyle,
      background: shadeInfo.gloss,
      boxShadow: `0 4px 12px ${shadeInfo.color}45, inset 0 1px 2px rgba(255, 255, 255, 0.65)`,
      borderColor: 'rgba(255, 255, 255, 0.45)',
    };
  } else if (isGhost && shadeInfo) {
    cellBgStyle = {
      ...cellBgStyle,
      background: `${shadeInfo.color}55`,
      borderColor: isValid ? 'rgba(52, 211, 153, 0.8)' : 'rgba(255, 255, 255, 0.75)',
      boxShadow: `0 0 12px ${shadeInfo.color}60`,
    };
  } else if (isValid) {
    cellBgStyle = {
      ...cellBgStyle,
      background: 'rgba(52, 211, 153, 0.22)',
      borderColor: 'rgba(52, 211, 153, 0.75)',
      boxShadow: '0 0 10px rgba(52, 211, 153, 0.4)',
    };
  } else if (isInvalid) {
    cellBgStyle = {
      ...cellBgStyle,
      background: 'rgba(244, 63, 94, 0.22)',
      borderColor: 'rgba(244, 63, 94, 0.75)',
      boxShadow: '0 0 10px rgba(244, 63, 94, 0.4)',
    };
  }

  // Animation classes
  const clearingClass = isClearing ? 'animate-shimmer-burst' : '';
  const ghostClass = isGhost ? 'animate-pulse scale-[0.96] border-dashed' : '';

  return (
    <div
      onClick={handleClick}
      style={cellBgStyle}
      className={`
        relative w-full h-full rounded-[10px] border transition-all duration-150
        flex items-center justify-center select-none overflow-hidden
        ${clearingClass}
        ${ghostClass}
        ${cell ? 'cursor-default' : 'hover:border-white/40 cursor-pointer'}
      `}
      data-row={row}
      data-col={col}
    >
      {/* Subtle diagonal light sheen for filled glossy cells */}
      {cell && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 42%, transparent 60%)',
          }}
        />
      )}

      {/* Accessibility Shade Icon / Pattern */}
      {shadeInfo && (cell || isGhost) && (
        <div
          className={`
            relative z-10 flex items-center justify-center transition-transform duration-200
            ${isColorBlind ? 'scale-125 font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]' : 'scale-90 opacity-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'}
          `}
        >
          {isColorBlind && shadeInfo.pattern && SHADE_PATTERNS[shadeInfo.pattern] ? (
            <svg
              viewBox="0 0 16 16"
              className={isColorBlind ? 'w-5 h-5 text-white fill-white' : 'w-3.5 h-3.5 text-white/90 fill-white/90'}
            >
              <path
                d={SHADE_PATTERNS[shadeInfo.pattern]}
                fill="currentColor"
                stroke="#000000"
                strokeWidth="0.8"
              />
            </svg>
          ) : (
            <span
              className={isColorBlind ? 'text-base leading-none' : 'text-xs leading-none'}
              role="img"
              aria-label={activeShade}
            >
              {shadeInfo.icon}
            </span>
          )}
        </div>
      )}

      {/* Shimmer Burst Particle Wave overlay when line clears */}
      {isClearing && (
        <div className="absolute inset-0 bg-white/70 animate-ping rounded-[10px] pointer-events-none" />
      )}
    </div>
  );
});

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  validCells,
  invalidCells,
  ghostShape,
  clearingCells,
  onCellClick,
  className = '',
  colorBlindMode: propColorBlind,
}) => {
  // Check localStorage for user preference if not explicitly provided
  const [storedColorBlind, setStoredColorBlind] = useState<boolean>(false);

  useEffect(() => {
    try {
      const mode = localStorage.getItem('glam_colorblind_mode') === 'true';
      setStoredColorBlind(mode);
    } catch {
      // ignore
    }

    const handleStorageChange = () => {
      try {
        const mode = localStorage.getItem('glam_colorblind_mode') === 'true';
        setStoredColorBlind(mode);
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isColorBlind = propColorBlind !== undefined ? propColorBlind : storedColorBlind;

  // Build quick lookup set for ghost coordinates
  const ghostCellLookup = useMemo(() => {
    const lookup = new Set<string>();
    if (ghostShape?.cells) {
      for (const c of ghostShape.cells) {
        lookup.add(`${c.row}-${c.col}`);
      }
    }
    return lookup;
  }, [ghostShape]);

  return (
    <>
      {/* CSS Keyframes for shimmer then burst line clear animation */}
      <style>{`
        @keyframes shimmerBurst {
          0% {
            transform: scale(1);
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
            opacity: 1;
          }
          40% {
            transform: scale(1.15);
            filter: brightness(2.2) drop-shadow(0 0 16px rgba(255, 255, 255, 0.95));
            opacity: 0.95;
          }
          100% {
            transform: scale(0.35);
            filter: brightness(3);
            opacity: 0;
          }
        }
        .animate-shimmer-burst {
          animation: shimmerBurst 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          z-index: 20;
        }
      `}</style>

      <div
        className={`
          w-full max-w-[460px] aspect-square mx-auto p-2.5 rounded-3xl
          border border-[var(--border,rgba(255,255,255,0.18))]
          bg-[var(--glass,rgba(255,255,255,0.06))] backdrop-blur-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.15)]
          grid grid-cols-8 grid-rows-8 gap-1.5 select-none touch-none
          ${className}
        `}
        role="grid"
        aria-label="8 by 8 makeup puzzle game board"
      >
        {board.map((rowArr, r) =>
          rowArr.map((cell, c) => {
            const keyHyphen = `${r}-${c}`;
            const keyComma = `${r},${c}`;
            const isValid = Boolean(validCells?.has(keyHyphen) || validCells?.has(keyComma));
            const isInvalid = Boolean(invalidCells?.has(keyHyphen) || invalidCells?.has(keyComma));
            const isGhost = ghostCellLookup.has(keyHyphen) || ghostCellLookup.has(keyComma);
            const isClearing =
              (typeof cell === 'object' && cell !== null && 'clearing' in cell && Boolean((cell as Record<string, unknown>).clearing)) ||
              Boolean(clearingCells?.has(keyHyphen) || clearingCells?.has(keyComma));

            return (
              <GridCell
                key={keyHyphen}
                row={r}
                col={c}
                cell={cell}
                isValid={isValid}
                isInvalid={isInvalid}
                isGhost={isGhost}
                ghostShade={ghostShape?.shade}
                isClearing={isClearing}
                isColorBlind={isColorBlind}
                onClick={onCellClick}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default GameBoard;
