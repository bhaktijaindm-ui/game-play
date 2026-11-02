import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Shape, ShadeId } from '../types';
import { SHADES } from '../config/shades';

export interface ShapeTrayProps {
  shapes: (Shape | null)[];
  onShapePickUp?: (index: number) => void;
  onShapeDrop?: (
    index: number,
    position: { x: number; y: number } | { row: number; col: number } | null
  ) => void;
  disabled?: boolean;
  className?: string;
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

function getShadeStyle(shadeId?: ShadeId) {
  if (!shadeId) {
    return {
      color: '#FF5C9E',
      gloss: 'linear-gradient(135deg, #FF94C2 0%, #FF5C9E 100%)',
      icon: '💄',
    };
  }
  const config = SHADES[shadeId];
  if (config) {
    return {
      color: config.lightColor,
      gloss: config.lightGloss,
      icon: config.icon,
    };
  }
  return FALLBACK_SHADE_COLORS[shadeId] || {
    color: '#FF5C9E',
    gloss: 'linear-gradient(135deg, #FF94C2 0%, #FF5C9E 100%)',
    icon: '💄',
  };
}

/**
 * Computes grid layout details for a set of shape cells
 */
function getShapeGridInfo(shape: Shape) {
  if (!shape.cells || shape.cells.length === 0) {
    return { rows: 1, cols: 1, cellSet: new Set<string>() };
  }
  const minRow = Math.min(...shape.cells.map((c) => c.row));
  const maxRow = Math.max(...shape.cells.map((c) => c.row));
  const minCol = Math.min(...shape.cells.map((c) => c.col));
  const maxCol = Math.max(...shape.cells.map((c) => c.col));

  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;
  const cellSet = new Set(shape.cells.map((c) => `${c.row - minRow}-${c.col - minCol}`));

  return { rows, cols, cellSet };
}

export const ShapeTray: React.FC<ShapeTrayProps> = ({
  shapes,
  onShapePickUp,
  onShapeDrop,
  disabled = false,
  className = '',
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const activePointerIdRef = useRef<number | null>(null);

  const handlePointerDown = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const shape = shapes[index];
    if (!shape) return;

    // Capture pointer on the element
    activePointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setDraggingIndex(index);
    setPointerPos({ x: e.clientX, y: e.clientY });
    onShapePickUp?.(index);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (draggingIndex === null) return;
      setPointerPos({ x: e.clientX, y: e.clientY });
    },
    [draggingIndex]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (draggingIndex === null) return;
      const index = draggingIndex;

      if (activePointerIdRef.current !== null) {
        try {
          e.currentTarget.releasePointerCapture(activePointerIdRef.current);
        } catch {
          // ignore
        }
        activePointerIdRef.current = null;
      }

      setDraggingIndex(null);
      setPointerPos(null);

      // Pass coordinates lifted 60px above finger so piece placement aligns with target
      onShapeDrop?.(index, { x: e.clientX, y: e.clientY - 60 });
    },
    [draggingIndex, onShapeDrop]
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerIdRef.current !== null) {
        try {
          e.currentTarget.releasePointerCapture(activePointerIdRef.current);
        } catch {
          // ignore
        }
        activePointerIdRef.current = null;
      }
      setDraggingIndex(null);
      setPointerPos(null);
    },
    []
  );

  const activeDraggedShape = draggingIndex !== null ? shapes[draggingIndex] : null;

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`
        w-full max-w-[460px] mx-auto min-h-[120px] px-3 py-2.5
        flex items-center justify-around gap-2.5
        rounded-3xl border border-[var(--border,rgba(255,255,255,0.18))]
        bg-[var(--surface,rgba(255,255,255,0.06))] backdrop-blur-xl
        shadow-[0_4px_24px_rgba(0,0,0,0.12)]
        select-none touch-none relative
        ${className}
      `}
    >
      {shapes.map((shape, idx) => {
        const isDraggingThis = draggingIndex === idx;

        return (
          <div
            key={shape ? shape.id || `shape-${idx}` : `empty-${idx}`}
            className="flex-1 min-w-[76px] max-w-[120px] h-[100px] flex items-center justify-center relative"
          >
            <AnimatePresence mode="wait">
              {shape ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isDraggingThis ? 0.35 : 1,
                    opacity: isDraggingThis ? 0.25 : 1,
                  }}
                  exit={{ scale: 0.3, opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                  onPointerDown={(e) => handlePointerDown(idx, e)}
                  className={`
                    w-full h-full min-h-[56px] min-w-[56px] rounded-2xl p-2
                    bg-[var(--surface,rgba(255,255,255,0.08))]
                    border border-[var(--border,rgba(255,255,255,0.2))]
                    shadow-[0_4px_16px_rgba(0,0,0,0.08)]
                    flex flex-col items-center justify-center relative
                    transition-shadow duration-200
                    ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:border-white/40 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]'}
                  `}
                >
                  {/* Shade Icon indicator in upper right */}
                  <div
                    className="absolute top-1.5 right-1.5 text-xs select-none pointer-events-none drop-shadow-sm"
                    title={shape.shade || 'Makeup block'}
                  >
                    {getShadeStyle(shape.shade).icon}
                  </div>

                  {/* Mini shape grid */}
                  {(() => {
                    const { rows, cols, cellSet } = getShapeGridInfo(shape);
                    const shadeStyle = getShadeStyle(shape.shade);

                    return (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                          gap: '3px',
                        }}
                        className="pointer-events-none p-1"
                      >
                        {Array.from({ length: rows }).map((_, r) =>
                          Array.from({ length: cols }).map((_, c) => {
                            const isFilled = cellSet.has(`${r}-${c}`);
                            return (
                              <div
                                key={`${r}-${c}`}
                                className="w-5 h-5 rounded-[5px] flex items-center justify-center transition-transform"
                                style={
                                  isFilled
                                    ? {
                                        background: shadeStyle.gloss,
                                        boxShadow: `0 2px 6px ${shadeStyle.color}50, inset 0 1px 1px rgba(255,255,255,0.8)`,
                                        border: '1px solid rgba(255,255,255,0.5)',
                                      }
                                    : {
                                        background: 'transparent',
                                      }
                                }
                              />
                            );
                          })
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              ) : (
                /* Empty / used slot placeholder */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full rounded-2xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center pointer-events-none"
                >
                  <div className="w-6 h-6 rounded-full border border-dashed border-white/20" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Floating Dragged Shape following finger with 60px lift offset */}
      {activeDraggedShape && pointerPos && (
        <motion.div
          initial={{ scale: 0.9, y: 0, opacity: 0.8 }}
          animate={{ scale: 1.15, y: -60, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          style={{
            position: 'fixed',
            left: pointerPos.x,
            top: pointerPos.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className="filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.35)]"
        >
          {(() => {
            const { rows, cols, cellSet } = getShapeGridInfo(activeDraggedShape);
            const shadeStyle = getShadeStyle(activeDraggedShape.shade);

            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gap: '4px',
                }}
                className="p-2 rounded-2xl bg-black/20 backdrop-blur-md border border-white/30"
              >
                {Array.from({ length: rows }).map((_, r) =>
                  Array.from({ length: cols }).map((_, c) => {
                    const isFilled = cellSet.has(`${r}-${c}`);
                    return (
                      <div
                        key={`drag-${r}-${c}`}
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center relative overflow-hidden"
                        style={
                          isFilled
                            ? {
                                background: shadeStyle.gloss,
                                boxShadow: `0 4px 12px ${shadeStyle.color}70, inset 0 1px 2px rgba(255,255,255,0.9)`,
                                border: '1.5px solid rgba(255,255,255,0.9)',
                              }
                            : {
                                background: 'transparent',
                              }
                        }
                      >
                        {isFilled && (
                          <>
                            <span className="text-xs select-none drop-shadow">
                              {shadeStyle.icon}
                            </span>
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background:
                                  'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%)',
                              }}
                            />
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};

export default ShapeTray;
