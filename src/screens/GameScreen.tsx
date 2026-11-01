import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { BoardMatrix, TrayShape, SavedGameState } from '../game/types';
import {
  createEmptyBoard,
  placeShape,
  generateTrayShapes,
  canPlaceShape,
  hasAnyValidMoves,
  applyBomb,
  BOARD_SIZE,
} from '../game/board';
import { GridCell } from '../components/game/GridCell';
import { PowerUpBar } from '../components/game/PowerUpBar';
import { PauseModal } from '../components/game/PauseModal';
import { RenderMakeupIcon } from '../components/icons/MakeupIcons';
import { soundSystem } from '../services/soundSystem';
import { useAuth } from '../services/authContext';
import { GAME_RULES } from '../config/product.config';
import { Pause, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameScreenProps {
  onGameOver: (finalScore: number, coinsEarned: number) => void;
  onHome: () => void;
}

const LOCAL_STORAGE_SAVE_KEY = 'glam_blocks_active_game_state';

export const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, onHome }) => {
  const { user, isGlamPassActive, spendCurrency, addCurrency, updateProfile } = useAuth();

  // Core Game State
  const [board, setBoard] = useState<BoardMatrix>(() => createEmptyBoard());
  const [tray, setTray] = useState<(TrayShape | null)[]>([null, null, null]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(user?.bestScore || 0);
  const [combo, setCombo] = useState<number>(0);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [isPauseOpen, setIsPauseOpen] = useState<boolean>(false);
  const [isBombActive, setIsBombActive] = useState<boolean>(false);
  const [freeUndoUsed, setFreeUndoUsed] = useState<boolean>(false);

  // Undo History Snapshot
  const [history, setHistory] = useState<{
    board: BoardMatrix;
    tray: (TrayShape | null)[];
    score: number;
    combo: number;
  } | null>(null);

  // Drag and Drop Pointer Tracking
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverGridPos, setHoverGridPos] = useState<{ row: number; col: number; valid: boolean } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  // Initialize or restore saved game
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SAVE_KEY);
      if (saved) {
        const parsed: SavedGameState = JSON.parse(saved);
        if (parsed.board && parsed.tray && parsed.tray.some((t) => t !== null)) {
          setBoard(parsed.board);
          setTray(parsed.tray);
          setScore(parsed.score);
          setBestScore(Math.max(parsed.bestScore, user?.bestScore || 0));
          setCombo(parsed.combo);
          setMovesCount(parsed.movesCount || 0);
          setHistory(parsed.historyState);
          return;
        }
      }
    } catch {
      // ignore
    }

    // New game
    const initialBoard = createEmptyBoard();
    const initialTray = generateTrayShapes(initialBoard, 0);
    setBoard(initialBoard);
    setTray(initialTray);
    setScore(0);
    setCombo(0);
    setMovesCount(0);
    setHistory(null);
  }, [user?.bestScore]);

  // Persist game state after every change
  useEffect(() => {
    if (tray.every((t) => t === null)) return;
    try {
      const stateToSave: SavedGameState = {
        board,
        tray,
        score,
        bestScore,
        combo,
        movesCount,
        lastScoreTime: Date.now(),
        historyState: history,
      };
      localStorage.setItem(LOCAL_STORAGE_SAVE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  }, [board, tray, score, bestScore, combo, movesCount, history]);

  // Check Game Over condition
  const checkGameOver = useCallback(
    (currentBoard: BoardMatrix, currentTray: (TrayShape | null)[]) => {
      // If all shapes in tray were placed, spawn new set
      const allEmpty = currentTray.every((s) => s === null);
      if (allEmpty) {
        const newTray = generateTrayShapes(currentBoard, movesCount);
        setTray(newTray);
        return;
      }

      // Check if any remaining shape can fit anywhere on the board
      const canMove = hasAnyValidMoves(currentBoard, currentTray);
      if (!canMove) {
        soundSystem.playGameOver();
        // Clear local save
        try {
          localStorage.removeItem(LOCAL_STORAGE_SAVE_KEY);
        } catch {
          // ignore
        }

        // Coins earned: 1 coin per 20 points
        const coinsEarned = Math.max(10, Math.floor(score / 20));
        addCurrency(coinsEarned, 0);

        if (score > (user?.bestScore || 0)) {
          updateProfile({ bestScore: score });
        }

        setTimeout(() => {
          onGameOver(score, coinsEarned);
        }, 600);
      }
    },
    [movesCount, score, user?.bestScore, addCurrency, updateProfile, onGameOver]
  );

  // Trigger sparkle celebratory particles
  const triggerClearParticles = (clientX?: number, clientY?: number) => {
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: {
          x: clientX ? clientX / window.innerWidth : 0.5,
          y: clientY ? clientY / window.innerHeight : 0.45,
        },
        colors: ['#E91E8C', '#9B5DE5', '#F5B700', '#FF4DAF', '#FFFFFF'],
        ticks: 120,
        disableForReducedMotion: true,
      });
    } catch {
      // confetti fallback
    }
  };

  // Convert screen coordinates (with 60px finger lift offset) into grid [row, col]
  const calculateGridCoords = (
    clientX: number,
    clientY: number,
    shape: TrayShape
  ): { row: number; col: number } | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();

    // 60px finger lift offset so piece sits comfortably above thumb
    const liftedY = clientY - 60;

    if (
      clientX < rect.left ||
      clientX > rect.right ||
      liftedY < rect.top ||
      liftedY > rect.bottom
    ) {
      return null;
    }

    const cellWidth = rect.width / BOARD_SIZE;
    const cellHeight = rect.height / BOARD_SIZE;

    // Center shape anchor on cursor
    const anchorOffsetX = (shape.shape.cols * cellWidth) / 2;
    const anchorOffsetY = (shape.shape.rows * cellHeight) / 2;

    const targetCol = Math.floor((clientX - rect.left - anchorOffsetX + cellWidth / 2) / cellWidth);
    const targetRow = Math.floor((liftedY - rect.top - anchorOffsetY + cellHeight / 2) / cellHeight);

    return { row: targetRow, col: targetCol };
  };

  // Pointer Event Handlers for Drag and Drop
  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    const shape = tray[index];
    if (!shape) return;

    soundSystem.playClick();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDraggingIndex(index);
    setPointerPos({ x: e.clientX, y: e.clientY });

    const coords = calculateGridCoords(e.clientX, e.clientY, shape);
    if (coords) {
      const valid = canPlaceShape(board, shape.shape, coords.row, coords.col);
      setHoverGridPos({ ...coords, valid });
    } else {
      setHoverGridPos(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIndex === null) return;
    const shape = tray[draggingIndex];
    if (!shape) return;

    setPointerPos({ x: e.clientX, y: e.clientY });

    const coords = calculateGridCoords(e.clientX, e.clientY, shape);
    if (coords) {
      const valid = canPlaceShape(board, shape.shape, coords.row, coords.col);
      setHoverGridPos({ ...coords, valid });
    } else {
      setHoverGridPos(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingIndex === null) return;
    const shape = tray[draggingIndex];

    if (shape && hoverGridPos && hoverGridPos.valid) {
      // 1. Save state for Undo
      setHistory({
        board: board.map((r) => [...r]),
        tray: [...tray],
        score,
        combo,
      });

      // 2. Perform placement
      const result = placeShape(
        board,
        shape.shape,
        hoverGridPos.row,
        hoverGridPos.col,
        shape.itemId,
        shape.color,
        combo
      );

      if (result.valid) {
        soundSystem.playPop();

        if (result.linesCleared > 0) {
          soundSystem.playSparkle();
          if (result.comboCount > 1) {
            soundSystem.playCombo(result.comboCount);
          }
          triggerClearParticles(e.clientX, e.clientY);
        }

        const newScore = score + result.scoreGained;
        setBoard(result.newBoard);
        setScore(newScore);
        setCombo(result.comboCount);
        setMovesCount((prev) => prev + 1);

        if (newScore > bestScore) {
          setBestScore(newScore);
        }

        // Remove placed shape from tray
        const nextTray = [...tray];
        nextTray[draggingIndex] = null;
        setTray(nextTray);

        // Check if game over or if new tray spawn needed
        checkGameOver(result.newBoard, nextTray);
      }
    }

    setDraggingIndex(null);
    setPointerPos(null);
    setHoverGridPos(null);
  };

  // Bomb Power-Up Placement
  const handleCellClick = (row: number, col: number) => {
    if (!isBombActive) return;

    // Apply 3x3 blast
    const { newBoard, clearedCellsCount } = applyBomb(board, row, col);
    if (clearedCellsCount > 0) {
      soundSystem.playSparkle();
      triggerClearParticles();
      setBoard(newBoard);
      setIsBombActive(false);
      checkGameOver(newBoard, tray);
    } else {
      setIsBombActive(false);
    }
  };

  // Power-up: Undo
  const handleUseUndo = () => {
    if (!history) return;
    const hasFree = isGlamPassActive() && !freeUndoUsed;

    if (hasFree) {
      setFreeUndoUsed(true);
    } else {
      const ok = spendCurrency(GAME_RULES.POWERUPS.UNDO.costCoins, 0);
      if (!ok) return;
    }

    setBoard(history.board);
    setTray(history.tray);
    setScore(history.score);
    setCombo(history.combo);
    setHistory(null);
  };

  // Power-up: Shuffle
  const handleUseShuffle = () => {
    const ok = spendCurrency(GAME_RULES.POWERUPS.SHUFFLE.costCoins, 0);
    if (!ok) return;
    const newTray = generateTrayShapes(board, movesCount);
    setTray(newTray);
  };

  // Power-up: Bomb Toggle
  const handleUseBomb = () => {
    if (isBombActive) {
      setIsBombActive(false);
      return;
    }
    const ok = spendCurrency(GAME_RULES.POWERUPS.BOMB.costCoins, 0);
    if (!ok) return;
    setIsBombActive(true);
  };

  const handleRestart = () => {
    setIsPauseOpen(false);
    const initialBoard = createEmptyBoard();
    const initialTray = generateTrayShapes(initialBoard, 0);
    setBoard(initialBoard);
    setTray(initialTray);
    setScore(0);
    setCombo(0);
    setMovesCount(0);
    setHistory(null);
  };

  const draggedShape = draggingIndex !== null ? tray[draggingIndex] : null;

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-game-bg select-none touch-none overflow-hidden"
    >
      {/* Top HUD */}
      <div className="flex items-center justify-between gap-2 min-h-[50px]">
        {/* Score Card */}
        <div className="flex items-center gap-2 bg-game-surface border border-game-border shadow-soft px-3.5 py-1.5 rounded-2xl">
          <div className="text-left">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-game-primary">
              Score
            </span>
            <span className="font-heading font-bold text-xl text-game-text leading-none">
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Combo Badge (if > 1) */}
        {combo > 1 && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-pink-500 text-white font-heading font-bold px-3 py-1 rounded-full shadow-glossy-gold animate-bounce text-xs">
            <Flame className="w-4 h-4 fill-white" />
            <span>{combo}X COMBO!</span>
          </div>
        )}

        {/* Best Score & Pause */}
        <div className="flex items-center gap-2">
          <div className="hidden xs:flex items-center gap-1.5 bg-game-surface border border-game-border shadow-soft px-3 py-1.5 rounded-2xl">
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-300" />
            <div className="text-left">
              <span className="block text-[9px] font-bold uppercase text-game-muted">
                Best
              </span>
              <span className="font-heading font-semibold text-sm text-game-text leading-none">
                {bestScore.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsPauseOpen(true)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl bg-game-surface border border-game-border shadow-soft flex items-center justify-center text-game-muted hover:text-game-text"
            aria-label="Pause game"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center 8x8 Grid */}
      <div className="my-auto w-full max-w-[360px] mx-auto aspect-square p-2 bg-gradient-to-b from-game-surface to-game-card border-2 border-game-border/80 rounded-3xl shadow-soft-lg flex items-center justify-center relative">
        {/* Active Glam Bomb Indicator */}
        {isBombActive && (
          <div className="absolute inset-0 z-30 bg-amber-500/10 backdrop-blur-[1px] rounded-3xl border-2 border-amber-400 flex items-center justify-center pointer-events-none">
            <span className="bg-amber-400 text-amber-950 font-heading font-bold px-4 py-2 rounded-2xl shadow-lg text-sm animate-pulse">
              💥 Tap any cell to blast 3x3!
            </span>
          </div>
        )}

        <div
          ref={gridRef}
          className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1"
        >
          {board.map((rowArr, r) =>
            rowArr.map((cell, c) => {
              // Check if cell is part of current ghost hover
              let isGhost = false;
              let isValidGhost = false;

              if (draggedShape && hoverGridPos) {
                const shape = draggedShape.shape;
                const offsetR = r - hoverGridPos.row;
                const offsetC = c - hoverGridPos.col;

                if (
                  offsetR >= 0 &&
                  offsetR < shape.rows &&
                  offsetC >= 0 &&
                  offsetC < shape.cols &&
                  shape.matrix[offsetR][offsetC] === 1
                ) {
                  isGhost = true;
                  isValidGhost = hoverGridPos.valid;
                }
              }

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className="w-full h-full"
                >
                  <GridCell
                    row={r}
                    col={c}
                    cell={cell}
                    isGhost={isGhost}
                    isValidGhost={isValidGhost}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Tray with 3 Shapes */}
      <div className="w-full flex items-center justify-around gap-2 min-h-[96px] px-2 py-1.5 bg-game-surface/80 border border-game-border/60 rounded-3xl shadow-soft">
        {tray.map((trayShape, idx) => {
          if (!trayShape) {
            return (
              <div
                key={idx}
                className="w-24 h-24 rounded-2xl border border-dashed border-game-border/60 flex items-center justify-center opacity-30"
              />
            );
          }

          const isCurrentlyDragged = draggingIndex === idx;

          return (
            <div
              key={trayShape.instanceId}
              onPointerDown={(e) => handlePointerDown(idx, e)}
              className={`
                w-24 h-24 rounded-2xl flex items-center justify-center p-2 cursor-grab active:cursor-grabbing transition-transform touch-none select-none
                ${isCurrentlyDragged ? 'opacity-30' : 'hover:scale-105 active:scale-95'}
              `}
            >
              {/* Mini preview grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: `repeat(${trayShape.shape.rows}, minmax(0, 1fr))`,
                  gridTemplateColumns: `repeat(${trayShape.shape.cols}, minmax(0, 1fr))`,
                  gap: '2px',
                }}
              >
                {trayShape.shape.matrix.map((rowArr, r) =>
                  rowArr.map((filled, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="w-5 h-5 rounded-md flex items-center justify-center relative overflow-hidden"
                      style={{
                        backgroundColor: filled === 1 ? trayShape.color : 'transparent',
                        border: filled === 1 ? '1px solid rgba(255,255,255,0.4)' : 'none',
                      }}
                    >
                      {filled === 1 && (
                        <RenderMakeupIcon type={trayShape.itemId} size={12} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Dragged Piece (Lifted 60px above finger) */}
      {draggedShape && pointerPos && (
        <div
          style={{
            position: 'fixed',
            left: pointerPos.x,
            top: pointerPos.y - 60, // 60px finger lift offset
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${draggedShape.shape.rows}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${draggedShape.shape.cols}, minmax(0, 1fr))`,
              gap: '4px',
            }}
            className="filter drop-shadow-2xl scale-110"
          >
            {draggedShape.shape.matrix.map((rowArr, r) =>
              rowArr.map((filled, c) => (
                <div
                  key={`${r}-${c}`}
                  className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg"
                  style={{
                    backgroundColor: filled === 1 ? draggedShape.color : 'transparent',
                    border: filled === 1 ? '1.5px solid #FFFFFF' : 'none',
                  }}
                >
                  {filled === 1 && (
                    <RenderMakeupIcon type={draggedShape.itemId} size={18} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Power-Up Bar (Undo, Shuffle, Bomb) */}
      <div className="w-full mt-2">
        <PowerUpBar
          coins={user?.coins || 0}
          freeUndoAvailable={isGlamPassActive() && !freeUndoUsed}
          canUndo={history !== null}
          onUseUndo={handleUseUndo}
          onUseShuffle={handleUseShuffle}
          onUseBomb={handleUseBomb}
          isBombActive={isBombActive}
        />
      </div>

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPauseOpen}
        onResume={() => setIsPauseOpen(false)}
        onRestart={handleRestart}
        onHome={onHome}
      />
    </div>
  );
};
