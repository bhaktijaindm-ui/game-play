import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import type { FaceZone, ShadeId, GameState } from '../types';
import { getLevel, getLevelData } from '../game/levels';
import { createNewGame, handlePlacement, handleUndo, handleShuffle, handleBomb } from '../game/engine';
import { canPlace } from '../game/board';
import { getDailyBriefSeed } from '../game/spawning';
import { FaceModel } from '../assets/faces/FaceModel';
import { GameBoard } from '../components/GameBoard';
import { ShapeTray } from '../components/ShapeTray';
import { MakeupBrush } from '../components/MakeupBrush';
import { PureShadeBurst } from '../components/PureShadeBurst';
import { ComboMeter } from '../components/ComboMeter';
import { CustomerOrderBubble } from '../components/CustomerOrderBubble';
import { PauseModal } from '../components/PauseModal';
import { IconButton } from '../components/IconButton';
import { useSound } from '../hooks/useSound';
import { useHaptics } from '../hooks/useHaptics';
import { useGame } from '../context/GameContext';
import { storageService } from '../services/storage';

export const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useGame();
  const { playPop, playSparkle, playChime, playTaDa } = useSound();
  const { lightTap, mediumTap, successBuzz } = useHaptics();

  const location = useLocation();
  const isDaily = (location.state as { mode?: string } | undefined)?.mode === 'daily';

  // Load client from current level or default level 1
  const clientLevel = userProfile.level || 1;
  const currentClient = getLevel(clientLevel);
  const levelData = getLevelData(clientLevel);

  // Initialize or resume game state
  const [gameState, setGameState] = useState<GameState>(() => {
    if (isDaily) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const dailySeed = getDailyBriefSeed(todayStr);
      return createNewGame(currentClient, dailySeed);
    }
    const saved = storageService.loadGameState();
    if (saved && !saved.isGameOver) {
      return saved;
    }
    return createNewGame(currentClient);
  });

  const [previousState, setPreviousState] = useState<GameState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBrush, setActiveBrush] = useState<{ zone: FaceZone; shade: ShadeId } | null>(null);
  const [showPureBurst, setShowPureBurst] = useState<ShadeId | null>(null);

  // Drag preview states
  const [draggingShapeIndex, setDraggingShapeIndex] = useState<number | null>(null);
  const [ghostPosition, setGhostPosition] = useState<{ row: number; col: number } | null>(null);

  // Bomb target mode
  const [isBombMode, setIsBombMode] = useState(false);

  // Autosave game state after every change
  useEffect(() => {
    storageService.saveGameState(gameState);
  }, [gameState]);

  // Check victory or game over
  useEffect(() => {
    if (gameState.isGameOver) {
      storageService.clearGameState();
      storageService.incrementGamesPlayed();
      // Navigate to game over or victory
      if (gameState.goals?.every((g) => g.completed)) {
        playTaDa();
        successBuzz();
        navigate('/result', { state: { gameState, client: currentClient } });
      } else {
        mediumTap();
        navigate('/game-over', { state: { gameState, client: currentClient } });
      }
    }
  }, [gameState.isGameOver, gameState.goals, navigate, currentClient, playTaDa, successBuzz, mediumTap, gameState]);

  // Drag & drop handlers
  const handleShapePickUp = useCallback((index: number) => {
    setDraggingShapeIndex(index);
    lightTap();
  }, [lightTap]);

  const handleShapeDrag = useCallback(
    (index: number, coords: { x: number; y: number } | null) => {
      setDraggingShapeIndex(index);
      if (!coords) {
        setGhostPosition(null);
        return;
      }
      const elem = document.elementFromPoint(coords.x, coords.y);
      const cellElem = elem?.closest('[data-row][data-col]');
      if (cellElem) {
        const row = parseInt(cellElem.getAttribute('data-row') ?? '-1', 10);
        const col = parseInt(cellElem.getAttribute('data-col') ?? '-1', 10);
        if (row >= 0 && col >= 0) {
          setGhostPosition((prev) => (prev?.row === row && prev?.col === col ? prev : { row, col }));
          return;
        }
      }
      setGhostPosition(null);
    },
    []
  );

  const handleShapeDrop = useCallback(
    (
      index: number,
      posOrCoords: { x: number; y: number } | { row: number; col: number } | null
    ) => {
      setDraggingShapeIndex(null);
      setGhostPosition(null);

      if (!posOrCoords) return;

      let gridPos: { row: number; col: number } | null = null;
      if ('row' in posOrCoords && 'col' in posOrCoords) {
        gridPos = { row: posOrCoords.row, col: posOrCoords.col };
      } else if ('x' in posOrCoords && 'y' in posOrCoords) {
        const elem = document.elementFromPoint(posOrCoords.x, posOrCoords.y);
        const cellElem = elem?.closest('[data-row][data-col]');
        if (cellElem) {
          const row = parseInt(cellElem.getAttribute('data-row') ?? '-1', 10);
          const col = parseInt(cellElem.getAttribute('data-col') ?? '-1', 10);
          if (row >= 0 && col >= 0) {
            gridPos = { row, col };
          }
        }
      }

      if (!gridPos) return;

      const shape = gameState.shapes[index];
      if (!shape) return;

      if (canPlace(gameState.board, shape, gridPos)) {
        setPreviousState(gameState);
        playPop();
        lightTap();

        const nextState = handlePlacement(gameState, index, gridPos);

        // Check if lines cleared
        if (nextState.clearedLines.length > 0) {
          playSparkle();
          mediumTap();

          // Get last cleared line for animated brush sweep
          const lastLine = nextState.clearedLines[nextState.clearedLines.length - 1];
          if (lastLine?.shade) {
            setActiveBrush({ zone: lastLine.zone, shade: lastLine.shade });
          }

          // Pure shade detection
          const hasPure = nextState.clearedLines.some((l) => l.isPure);
          if (hasPure && lastLine?.shade) {
            setShowPureBurst(lastLine.shade);
            playChime();
          }
        }

        setGameState(nextState);
      }
    },
    [gameState, playPop, playSparkle, playChime, lightTap, mediumTap]
  );

  // Power-up handlers
  const handlePowerUpUndo = () => {
    if (gameState.powerUps.undo > 0 && previousState) {
      setGameState(handleUndo(gameState, previousState));
      setPreviousState(null);
      lightTap();
    }
  };

  const handlePowerUpShuffle = () => {
    if (gameState.powerUps.shuffle > 0) {
      setGameState(handleShuffle(gameState));
      mediumTap();
    }
  };

  const handlePowerUpBomb = () => {
    if (gameState.powerUps.bomb > 0) {
      setIsBombMode((prev) => !prev);
      lightTap();
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (isBombMode) {
      setPreviousState(gameState);
      setGameState(handleBomb(gameState, { row, col }));
      setIsBombMode(false);
      playSparkle();
      mediumTap();
    }
  };

  // Build ghost cells preview
  const ghostCells = ghostPosition && draggingShapeIndex !== null && gameState.shapes[draggingShapeIndex]
    ? {
        cells: gameState.shapes[draggingShapeIndex].cells.map((c) => ({
          row: ghostPosition.row + c.row,
          col: ghostPosition.col + c.col,
        })),
        shade: gameState.shapes[draggingShapeIndex].shade,
      }
    : undefined;

  const ghostValidity = Boolean(
    ghostPosition &&
    draggingShapeIndex !== null &&
    gameState.shapes[draggingShapeIndex] &&
    canPlace(gameState.board, gameState.shapes[draggingShapeIndex], ghostPosition)
  );

  const validCellsSet = ghostValidity && ghostCells
    ? new Set(ghostCells.cells.map((c) => `${c.row}-${c.col}`))
    : undefined;

  const invalidCellsSet = !ghostValidity && ghostCells
    ? new Set(ghostCells.cells.map((c) => `${c.row}-${c.col}`))
    : undefined;

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex flex-col justify-between overflow-hidden bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] text-[var(--text)] select-none">
      {/* Top HUD */}
      <header className="px-3 pt-2.5 pb-2 flex items-center justify-between border-b border-[var(--border)] bg-[rgba(25,18,40,0.85)] text-white backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <IconButton
            aria-label="Pause game"
            onClick={() => setIsPaused(true)}
            className="w-9 h-9"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </IconButton>

          <div className="px-2.5 py-1 rounded-full bg-[#6A3FC8] text-white font-heading font-bold text-xs game-stroke-sm border border-[#F5B53C] shadow">
            {isDaily ? '📅 DAILY BRIEF' : `LV ${clientLevel}`}
          </div>
        </div>

        {/* Live Score Counter */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold tracking-widest uppercase text-white/70">Score</span>
          <motion.span
            key={gameState.score}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="text-xl font-heading font-black tabular-nums leading-tight text-[#FF8FB8] game-stroke-sm"
          >
            {gameState.score.toLocaleString()}
          </motion.span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-amber-500/20 text-[#F5B53C] px-2.5 py-1 rounded-full text-xs font-bold border border-amber-500/30">
            <span>🪙</span>
            <span className="font-heading font-bold tabular-nums">{userProfile.coins}</span>
          </div>
        </div>
      </header>

      {/* 3 Customer Order Bubbles Bar */}
      <div className="px-3 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar z-10">
        {levelData.customers.map((cust, idx) => {
          const matchingGoal = gameState.goals?.[idx];
          const avatarIcon =
            cust.customerId === 'mrs_kapoor' ? '👵🏽' :
            cust.customerId === 'priya' ? '👩🏽‍🎓' :
            cust.customerId === 'simran' ? '💃🏽' :
            cust.customerId === 'meera' ? '💼' :
            cust.customerId === 'uncle_dev' ? '👨🏽‍🦳' :
            cust.customerId === 'diya' ? '📱' :
            cust.customerId === 'shanti' ? '🧓🏽' :
            cust.customerId === 'rohit' ? '🤵🏽' :
            cust.customerId === 'fatima' ? '🎨' :
            cust.customerId === 'aisha' ? '🏃🏽‍♀️' :
            cust.customerId === 'dr_neha' ? '🩺' : '👧🏽';

          return (
            <CustomerOrderBubble
              key={cust.id}
              id={cust.id}
              customerName={cust.customerName}
              avatarIcon={avatarIcon}
              description={cust.description}
              rewardCoins={cust.rewardCoins}
              current={matchingGoal ? matchingGoal.current : 0}
              target={matchingGoal ? matchingGoal.target : cust.target}
              completed={matchingGoal ? matchingGoal.completed : false}
            />
          );
        })}
      </div>

      {/* Combo Meter */}
      <div className="px-4 py-1 z-10">
        <ComboMeter combo={gameState.combo} maxCombo={5} />
      </div>

      {/* Central Makeup Face Canvas & Glass Board */}
      <div className="relative flex-1 flex items-center justify-center px-4 my-auto overflow-hidden">
        {/* Face Model Vector Canvas (underneath) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
          <FaceModel
            model={userProfile.faceModel || '1'}
            skinTone="#FDDCBF"
            makeupRecipe={gameState.faceRecipe}
            width={340}
          />
        </div>

        {/* Animated Brush Sweep Overlay */}
        {activeBrush && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <MakeupBrush
              zone={activeBrush.zone}
              shade={activeBrush.shade}
              active={true}
              onComplete={() => setActiveBrush(null)}
            />
          </div>
        )}

        {/* Pure Shade Celebratory Burst */}
        {showPureBurst && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
            <PureShadeBurst
              active={true}
              shade={showPureBurst}
              onComplete={() => setShowPureBurst(null)}
            />
          </div>
        )}

        {/* 8x8 Glass Matrix Board (over top) in blue-teal frame */}
        <div className="relative z-10 w-full max-w-[340px] aspect-square p-2 rounded-[24px] bg-[#6FADD4] dark:bg-[#3D5E86] border-2 border-white/50 shadow-xl">
          <GameBoard
            board={gameState.board}
            ghostShape={ghostCells}
            validCells={validCellsSet}
            invalidCells={invalidCellsSet}
            onCellClick={handleCellClick}
          />

          {/* Bomb indicator overlay */}
          {isBombMode && (
            <div className="absolute inset-0 bg-red-500/20 border-2 border-red-500 rounded-2xl flex items-center justify-center text-center p-4 pointer-events-none">
              <span className="bg-red-600 text-white font-black px-3 py-1 rounded-full text-xs animate-bounce">
                TAP ANY CELL TO BOMB 3x3 AREA
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Power-up Bar */}
      <div className="px-6 py-2 flex items-center justify-around border-t border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm z-10">
        {/* Undo */}
        <button
          type="button"
          onClick={handlePowerUpUndo}
          disabled={gameState.powerUps.undo === 0 || !previousState}
          className="flex flex-col items-center gap-1 disabled:opacity-40"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/20">
            <span>↩</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[9px] text-white">
              {gameState.powerUps.undo}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[var(--text-muted)]">Undo</span>
        </button>

        {/* Shuffle */}
        <button
          type="button"
          onClick={handlePowerUpShuffle}
          disabled={gameState.powerUps.shuffle === 0}
          className="flex flex-col items-center gap-1 disabled:opacity-40"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
            <span>🔀</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[9px] text-white">
              {gameState.powerUps.shuffle}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[var(--text-muted)]">Shuffle</span>
        </button>

        {/* Bomb */}
        <button
          type="button"
          onClick={handlePowerUpBomb}
          disabled={gameState.powerUps.bomb === 0}
          className={`flex flex-col items-center gap-1 disabled:opacity-40 ${isBombMode ? 'scale-110' : ''}`}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
            <span>💣</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] text-white">
              {gameState.powerUps.bomb}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[var(--text-muted)]">Bomb</span>
        </button>
      </div>

      {/* Bottom Shape Tray with 3 Pieces */}
      <footer className="px-4 pt-2 pb-6 bg-[var(--surface)] border-t border-[var(--border)] z-20">
        <ShapeTray
          shapes={gameState.shapes}
          onShapePickUp={handleShapePickUp}
          onShapeDrag={handleShapeDrag}
          onShapeDrop={handleShapeDrop}
        />
      </footer>

      {/* Pause Modal */}
      <PauseModal
        open={isPaused}
        score={gameState.score}
        onResume={() => setIsPaused(false)}
        onRestart={() => {
          setIsPaused(false);
          setGameState(createNewGame(currentClient));
        }}
        onHome={() => {
          setIsPaused(false);
          navigate('/');
        }}
      />
    </div>
  );
};

export default GameScreen;
