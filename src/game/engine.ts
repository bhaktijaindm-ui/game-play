import {
  createEmptyBoard,
  canPlace,
  placeShape,
  findFullLines,
  clearLines,
  getBoardOccupancy,
  canAnyShapeFit,
  extractClearedLines,
  BOARD_SIZE,
} from './board';
import { calculatePlacementScore, calculateTotalMoveScore } from './scoring';
import { spawnShapes, spawnDailyShapes } from './spawning';
import { updateGoals, calculateStars } from './goals';
import { createEmptyRecipe, applyClearToFace } from './faceMapping';
import type { GameState, Client, Shape, ClearResult } from '../types';

/**
 * Checks whether the current game state has no remaining valid moves.
 */
export function isGameOver(state: GameState): boolean {
  const activeShapes = state.currentShapes.filter(
    (shape): shape is Shape => shape !== null
  );

  if (activeShapes.length === 0) {
    return false;
  }

  return !canAnyShapeFit(state.board, activeShapes);
}

/**
 * Initializes a new game state.
 */
export function createNewGame(
  client?: Client | null,
  dailySeed?: number
): GameState {
  const initialBoard = createEmptyBoard();
  const initialShapes =
    dailySeed !== undefined
      ? spawnDailyShapes(String(dailySeed), 0, initialBoard)
      : spawnShapes(initialBoard);

  const goals = client
    ? client.goals.map(goal => ({
        ...goal,
        current: 0,
        completed: false,
      }))
    : [];

  return {
    board: initialBoard,
    shapes: initialShapes,
    currentShapes: initialShapes,
    score: 0,
    highScore: 0,
    bestScore: 0,
    clearedLines: [],
    combo: 0,
    powerUps: {
      undo: 3,
      shuffle: 2,
      bomb: 1,
    },
    faceRecipe: createEmptyRecipe(),
    goals,
    client: client ?? null,
    isGameOver: false,
    moveCount: 0,
    stars: 1,
    history: [],
    dailySeed,
  };
}

/**
 * Places a shape on the board, evaluates full line clears, computes scores,
 * updates facial makeup mapping, tracks goals, replenishes shapes when 3 are used,
 * and detects game over.
 * Returns a new immutable GameState.
 */
export function handlePlacement(
  state: GameState,
  shapeIndex: number,
  position: { row: number; col: number }
): GameState {
  if (state.isGameOver) {
    return state;
  }

  if (shapeIndex < 0 || shapeIndex >= state.currentShapes.length) {
    return state;
  }

  const shape = state.currentShapes[shapeIndex];
  if (!shape) {
    return state;
  }

  if (!canPlace(state.board, shape, position)) {
    return state;
  }

  // 1. Place shape on board
  const boardWithShape = placeShape(state.board, shape, position);

  // 2. Mark shape slot as used
  const nextShapes: (Shape | null)[] = [...state.currentShapes];
  nextShapes[shapeIndex] = null;

  // 3. Detect full lines
  const fullLines = findFullLines(boardWithShape);
  const clearedLinesCount = fullLines.rows.length + fullLines.cols.length;

  let boardAfterClear = boardWithShape;
  let newCombo = 0;
  let moveScore = 0;
  let newGoals = state.goals;
  let newFaceRecipe = state.faceRecipe;

  if (clearedLinesCount > 0) {
    const lines = extractClearedLines(boardWithShape, fullLines.rows, fullLines.cols);
    boardAfterClear = clearLines(boardWithShape, fullLines.rows, fullLines.cols);

    const hasPureShade = lines.some(l => l.isPure);
    const isBoardEmpty = getBoardOccupancy(boardAfterClear) === 0;

    moveScore = calculateTotalMoveScore(
      shape.cells.length,
      clearedLinesCount,
      state.combo,
      hasPureShade,
      isBoardEmpty
    );

    newCombo = state.combo + 1;

    const clearResult: ClearResult = {
      lines,
      rowsCleared: fullLines.rows,
      colsCleared: fullLines.cols,
      totalLines: clearedLinesCount,
      hasPureShade,
      combo: newCombo,
      score: moveScore,
    };

    newGoals = updateGoals(state.goals, clearResult);
    newFaceRecipe = applyClearToFace(state.faceRecipe, clearResult);
  } else {
    // Placement points only, combo reset
    moveScore = calculatePlacementScore(shape.cells.length);
    newCombo = 0;
  }

  const newScore = state.score + moveScore;
  const newHighScore = Math.max(state.highScore, newScore);
  const nextMoveCount = state.moveCount + 1;

  // 4. Replenish shapes if all 3 slots are empty
  const allUsed = nextShapes.every(s => s === null);
  let finalShapes = nextShapes;

  if (allUsed) {
    finalShapes =
      state.dailySeed !== undefined
        ? spawnDailyShapes(String(state.dailySeed), nextMoveCount, boardAfterClear)
        : spawnShapes(boardAfterClear);
  }

  // 5. Calculate stars
  const thresholds = state.client?.starThresholds ?? [1000, 2500, 5000];
  const stars = calculateStars(newGoals, newScore, thresholds);

  // 6. Check game over
  const activeShapes = finalShapes.filter((s): s is Shape => s !== null);
  const gameOver = !canAnyShapeFit(boardAfterClear, activeShapes);

  const extractedLines =
    clearedLinesCount > 0
      ? extractClearedLines(boardWithShape, fullLines.rows, fullLines.cols)
      : [];

  return {
    ...state,
    board: boardAfterClear,
    shapes: activeShapes,
    currentShapes: finalShapes,
    clearedLines: extractedLines,
    score: newScore,
    highScore: newHighScore,
    bestScore: Math.max(state.bestScore ?? 0, newHighScore),
    combo: newCombo,
    faceRecipe: newFaceRecipe,
    goals: newGoals,
    isGameOver: gameOver,
    moveCount: nextMoveCount,
    stars,
    history: [...(state.history ?? []).slice(-10), state],
  };
}

/**
 * Reverts the state to a previous state using an Undo power-up.
 */
export function handleUndo(
  state: GameState,
  previousState?: GameState
): GameState {
  if (state.powerUps.undo <= 0 || !previousState) {
    return state;
  }

  const updatedPowerUps = {
    ...previousState.powerUps,
    undo: state.powerUps.undo - 1,
  };

  const activeShapes = previousState.currentShapes.filter(
    (s): s is Shape => s !== null
  );

  return {
    ...previousState,
    powerUps: updatedPowerUps,
    isGameOver: !canAnyShapeFit(previousState.board, activeShapes),
    history: state.history ? state.history.slice(0, -1) : [],
  };
}

/**
 * Shuffles current shapes using a Shuffle power-up.
 */
export function handleShuffle(state: GameState): GameState {
  if (state.powerUps.shuffle <= 0) {
    return state;
  }

  const newShapes =
    state.dailySeed !== undefined
      ? spawnDailyShapes(String(state.dailySeed), state.moveCount + 999, state.board)
      : spawnShapes(state.board);

  const updatedPowerUps = {
    ...state.powerUps,
    shuffle: state.powerUps.shuffle - 1,
  };

  const activeShapes = newShapes.filter((s): s is Shape => s !== null);

  return {
    ...state,
    shapes: activeShapes,
    currentShapes: newShapes,
    powerUps: updatedPowerUps,
    isGameOver: !canAnyShapeFit(state.board, activeShapes),
    history: [...(state.history ?? []).slice(-10), state],
  };
}

/**
 * Clears a 3x3 area around the given position using a Bomb power-up.
 */
export function handleBomb(
  state: GameState,
  position: { row: number; col: number }
): GameState {
  if (state.powerUps.bomb <= 0) {
    return state;
  }

  const newBoard = state.board.map(row => [...row]);
  let clearedCells = 0;

  for (let r = position.row - 1; r <= position.row + 1; r++) {
    for (let c = position.col - 1; c <= position.col + 1; c++) {
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (newBoard[r][c] !== null) {
          newBoard[r][c] = null;
          clearedCells++;
        }
      }
    }
  }

  const bombScore = clearedCells * 15;
  const newScore = state.score + bombScore;
  const updatedPowerUps = {
    ...state.powerUps,
    bomb: state.powerUps.bomb - 1,
  };

  const activeShapes = state.currentShapes.filter(
    (s): s is Shape => s !== null
  );

  return {
    ...state,
    board: newBoard,
    shapes: activeShapes,
    score: newScore,
    highScore: Math.max(state.highScore, newScore),
    bestScore: Math.max(state.bestScore ?? 0, newScore),
    powerUps: updatedPowerUps,
    isGameOver: !canAnyShapeFit(newBoard, activeShapes),
    history: [...(state.history ?? []).slice(-10), state],
  };
}

/**
 * Serializes the game state to JSON for autosave or persistence.
 */
export function serializeState(state: GameState): string {
  // Strip out circular or oversized history in autosave
  const storableState = {
    ...state,
    history: [],
  };
  return JSON.stringify(storableState);
}

/**
 * Deserializes JSON string back into GameState.
 */
export function deserializeState(json: string): GameState {
  const parsed = JSON.parse(json) as GameState;
  return {
    ...parsed,
    history: parsed.history ?? [],
  };
}
