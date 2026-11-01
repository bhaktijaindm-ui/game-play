import type { BoardMatrix, ShapeDefinition, TrayShape, MoveResult } from './types';
import { SHAPES_LIBRARY } from './shapes';
import { MAKEUP_THEME_ITEMS, GAME_RULES } from '../config/product.config';

export const BOARD_SIZE = 8;

/**
 * Creates an empty 8x8 game board
 */
export function createEmptyBoard(): BoardMatrix {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

/**
 * Validates if a shape fits at the given row/col coordinate without collision or boundary violation
 */
export function canPlaceShape(
  board: BoardMatrix,
  shape: ShapeDefinition,
  targetRow: number,
  targetCol: number
): boolean {
  if (targetRow < 0 || targetCol < 0) return false;
  if (targetRow + shape.rows > BOARD_SIZE || targetCol + shape.cols > BOARD_SIZE) return false;

  for (let r = 0; r < shape.rows; r++) {
    for (let c = 0; c < shape.cols; c++) {
      if (shape.matrix[r][c] === 1) {
        const boardRow = targetRow + r;
        const boardCol = targetCol + c;
        if (board[boardRow][boardCol] !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Checks if a shape can be placed anywhere on the given board
 */
export function canShapeFitAnywhere(
  board: BoardMatrix,
  shape: ShapeDefinition
): boolean {
  for (let r = 0; r <= BOARD_SIZE - shape.rows; r++) {
    for (let c = 0; c <= BOARD_SIZE - shape.cols; c++) {
      if (canPlaceShape(board, shape, r, c)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Calculates current board fill percentage (0 to 1)
 */
export function getBoardFillRatio(board: BoardMatrix): number {
  let filled = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== null) filled++;
    }
  }
  return filled / (BOARD_SIZE * BOARD_SIZE);
}

/**
 * Places a shape, evaluates simultaneous row and column clears, and computes score & combos
 */
export function placeShape(
  currentBoard: BoardMatrix,
  shape: ShapeDefinition,
  targetRow: number,
  targetCol: number,
  itemId: string,
  color: string,
  currentCombo: number = 0
): MoveResult {
  if (!canPlaceShape(currentBoard, shape, targetRow, targetCol)) {
    return {
      valid: false,
      newBoard: currentBoard,
      placedCellsCount: 0,
      linesCleared: 0,
      clearedRowIndices: [],
      clearedColIndices: [],
      scoreGained: 0,
      comboCount: 0,
      isBoardCleared: false,
    };
  }

  // Clone board deeply
  const newBoard: BoardMatrix = currentBoard.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  );

  // 1. Stamp shape cells
  let placedCellsCount = 0;
  for (let r = 0; r < shape.rows; r++) {
    for (let c = 0; c < shape.cols; c++) {
      if (shape.matrix[r][c] === 1) {
        newBoard[targetRow + r][targetCol + c] = { itemId, color };
        placedCellsCount++;
      }
    }
  }

  // 2. Identify full rows and columns simultaneously
  const fullRows: number[] = [];
  const fullCols: number[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    let rowFull = true;
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (newBoard[r][c] === null) {
        rowFull = false;
        break;
      }
    }
    if (rowFull) fullRows.push(r);
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    let colFull = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (newBoard[r][c] === null) {
        colFull = false;
        break;
      }
    }
    if (colFull) fullCols.push(c);
  }

  // 3. Clear identified rows and cols simultaneously
  fullRows.forEach((r) => {
    for (let c = 0; c < BOARD_SIZE; c++) {
      newBoard[r][c] = null;
    }
  });

  fullCols.forEach((c) => {
    for (let r = 0; r < BOARD_SIZE; r++) {
      newBoard[r][c] = null;
    }
  });

  const linesCleared = fullRows.length + fullCols.length;
  let comboCount = 0;
  let lineScore = 0;

  if (linesCleared > 0) {
    comboCount = currentCombo + 1;
    const multiplierIndex = Math.min(comboCount, GAME_RULES.COMBO_MULTIPLIERS.length) - 1;
    const multiplier = GAME_RULES.COMBO_MULTIPLIERS[multiplierIndex] || 1;
    lineScore = linesCleared * GAME_RULES.POINTS_PER_LINE * multiplier;
  } else {
    comboCount = 0;
  }

  const placementScore = placedCellsCount * GAME_RULES.POINTS_PER_CELL;

  // Check if board is completely cleared
  let isBoardCleared = false;
  if (linesCleared > 0) {
    let remaining = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (newBoard[r][c] !== null) remaining++;
      }
    }
    if (remaining === 0) {
      isBoardCleared = true;
    }
  }

  const bonusScore = isBoardCleared ? GAME_RULES.BOARD_CLEAR_BONUS : 0;
  const scoreGained = placementScore + lineScore + bonusScore;

  return {
    valid: true,
    newBoard,
    placedCellsCount,
    linesCleared,
    clearedRowIndices: fullRows,
    clearedColIndices: fullCols,
    scoreGained,
    comboCount,
    isBoardCleared,
  };
}

/**
 * Random makeup item generator
 */
export function getRandomMakeupItem(): { itemId: string; color: string } {
  const itemKeys = Object.keys(MAKEUP_THEME_ITEMS);
  const selectedKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
  const item = MAKEUP_THEME_ITEMS[selectedKey];
  return {
    itemId: item.id,
    color: item.colorHexLight,
  };
}

/**
 * Spawns 3 random shapes adhering strictly to the fairness rule:
 * At least one of the 3 shapes MUST be placeable on the current board.
 * Weights shape sizes by difficulty (smaller shapes when board is fuller).
 */
export function generateTrayShapes(
  board: BoardMatrix,
  movesCount: number = 0,
  maxAttempts: number = 80
): TrayShape[] {
  const fillRatio = getBoardFillRatio(board);
  const isEarlyGame = movesCount < 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidates: ShapeDefinition[] = [];

    for (let i = 0; i < GAME_RULES.TRAY_CAPACITY; i++) {
      let pool = SHAPES_LIBRARY;

      // Fairness weighting: when board is over 60% full or in early game, favor small shapes
      const rand = Math.random();
      if (fillRatio > 0.65 || (isEarlyGame && rand < 0.6)) {
        pool = SHAPES_LIBRARY.filter((s) => s.category === 'small');
      } else if (fillRatio > 0.45) {
        pool = SHAPES_LIBRARY.filter((s) => s.category !== 'large');
      }

      if (pool.length === 0) pool = SHAPES_LIBRARY;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      candidates.push(picked);
    }

    // Fairness rule: verify that AT LEAST ONE can fit
    const hasFit = candidates.some((s) => canShapeFitAnywhere(board, s));

    if (hasFit) {
      return candidates.map((shape) => {
        const makeup = getRandomMakeupItem();
        return {
          instanceId: `${shape.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          shape,
          itemId: makeup.itemId,
          color: makeup.color,
          canPlaceOnCurrentBoard: canShapeFitAnywhere(board, shape),
        };
      });
    }
  }

  // Fallback guarantee: if 80 attempts didn't produce a fit, forcibly include a 1x1 dot
  const smallDot = SHAPES_LIBRARY.find((s) => s.id === 'dot_1x1') || SHAPES_LIBRARY[0];
  const candidates = [smallDot, SHAPES_LIBRARY[1], SHAPES_LIBRARY[2]];

  return candidates.map((shape) => {
    const makeup = getRandomMakeupItem();
    return {
      instanceId: `${shape.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      shape,
      itemId: makeup.itemId,
      color: makeup.color,
      canPlaceOnCurrentBoard: canShapeFitAnywhere(board, shape),
    };
  });
}

/**
 * Checks whether any non-null shape remaining in the tray can fit on the board
 */
export function hasAnyValidMoves(
  board: BoardMatrix,
  tray: (TrayShape | null)[]
): boolean {
  return tray.some((trayItem) => {
    if (!trayItem) return false;
    return canShapeFitAnywhere(board, trayItem.shape);
  });
}

/**
 * Glam Bomb Power-Up: clears a 3x3 area around centerRow, centerCol
 */
export function applyBomb(
  board: BoardMatrix,
  centerRow: number,
  centerCol: number
): { newBoard: BoardMatrix; clearedCellsCount: number } {
  const newBoard: BoardMatrix = board.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  );

  let clearedCellsCount = 0;
  for (let r = centerRow - 1; r <= centerRow + 1; r++) {
    for (let c = centerCol - 1; c <= centerCol + 1; c++) {
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (newBoard[r][c] !== null) {
          newBoard[r][c] = null;
          clearedCellsCount++;
        }
      }
    }
  }

  return { newBoard, clearedCellsCount };
}
