import { describe, it, expect } from 'vitest';
import {
  BOARD_SIZE,
  createEmptyBoard,
  canPlace,
  placeShape,
  findFullLines,
  clearLines,
  getZoneForRow,
  isLineMonochrome,
  canAnyShapeFit,
} from '../../src/game/board';
import type { Shape, Board } from '../../src/types';

describe('Board Logic Unit Tests', () => {
  const singleCellShape: Shape = {
    id: 'single',
    cells: [{ row: 0, col: 0 }],
    shade: 'rose',
  };

  const horizontalLineShape: Shape = {
    id: 'hLine3',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ],
    shade: 'gold',
  };

  const square2x2Shape: Shape = {
    id: 'square2x2',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
    shade: 'crimson',
  };

  it('createEmptyBoard creates 8x8 null matrix', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(BOARD_SIZE);
    expect(board).toHaveLength(8);

    for (let r = 0; r < 8; r++) {
      expect(board[r]).toHaveLength(8);
      for (let c = 0; c < 8; c++) {
        expect(board[r][c]).toBeNull();
      }
    }
  });

  it('canPlace returns true for valid placement', () => {
    const board = createEmptyBoard();
    expect(canPlace(board, singleCellShape, { row: 0, col: 0 })).toBe(true);
    expect(canPlace(board, horizontalLineShape, { row: 4, col: 2 })).toBe(true);
    expect(canPlace(board, square2x2Shape, { row: 6, col: 6 })).toBe(true);
  });

  it('canPlace returns false for out-of-bounds', () => {
    const board = createEmptyBoard();

    // Negative coordinates
    expect(canPlace(board, singleCellShape, { row: -1, col: 0 })).toBe(false);
    expect(canPlace(board, singleCellShape, { row: 0, col: -1 })).toBe(false);

    // Completely off-board
    expect(canPlace(board, singleCellShape, { row: 8, col: 8 })).toBe(false);

    // Multi-cell shape hanging off right edge
    expect(canPlace(board, horizontalLineShape, { row: 0, col: 6 })).toBe(false);

    // Multi-cell shape hanging off bottom edge
    expect(canPlace(board, square2x2Shape, { row: 7, col: 0 })).toBe(false);
    expect(canPlace(board, square2x2Shape, { row: 7, col: 7 })).toBe(false);
  });

  it('canPlace returns false for overlapping', () => {
    let board = createEmptyBoard();
    board = placeShape(board, singleCellShape, { row: 3, col: 3 });

    // Try placing another cell on the exact same spot
    expect(canPlace(board, singleCellShape, { row: 3, col: 3 })).toBe(false);

    // Try placing a 2x2 shape that overlaps cell (3, 3)
    expect(canPlace(board, square2x2Shape, { row: 2, col: 2 })).toBe(false);
    expect(canPlace(board, square2x2Shape, { row: 3, col: 3 })).toBe(false);

    // Placing nearby without overlap should still succeed
    expect(canPlace(board, square2x2Shape, { row: 0, col: 0 })).toBe(true);
  });

  it('placeShape places correctly', () => {
    const board = createEmptyBoard();
    const placedBoard = placeShape(board, horizontalLineShape, { row: 2, col: 1 });

    // Original board must not be mutated
    expect(board[2][1]).toBeNull();

    // Check cells on new board
    expect(placedBoard[2][1]).toEqual({ shade: 'gold' });
    expect(placedBoard[2][2]).toEqual({ shade: 'gold' });
    expect(placedBoard[2][3]).toEqual({ shade: 'gold' });

    // Surrounding cells remain null
    expect(placedBoard[2][0]).toBeNull();
    expect(placedBoard[2][4]).toBeNull();
    expect(placedBoard[1][1]).toBeNull();
    expect(placedBoard[3][1]).toBeNull();
  });

  it('findFullLines detects full row', () => {
    let board = createEmptyBoard();

    // Fill row 3
    for (let c = 0; c < 8; c++) {
      board[3][c] = { shade: 'rose' };
    }

    const fullLines = findFullLines(board);
    expect(fullLines.rows).toEqual([3]);
    expect(fullLines.cols).toEqual([]);
  });

  it('findFullLines detects full column', () => {
    let board = createEmptyBoard();

    // Fill column 5
    for (let r = 0; r < 8; r++) {
      board[r][5] = { shade: 'berry' };
    }

    const fullLines = findFullLines(board);
    expect(fullLines.rows).toEqual([]);
    expect(fullLines.cols).toEqual([5]);
  });

  it('findFullLines detects simultaneous row and column', () => {
    let board = createEmptyBoard();

    // Fill row 2
    for (let c = 0; c < 8; c++) {
      board[2][c] = { shade: 'henna' };
    }

    // Fill column 6
    for (let r = 0; r < 8; r++) {
      board[r][6] = { shade: 'turmeric' };
    }

    const fullLines = findFullLines(board);
    expect(fullLines.rows).toEqual([2]);
    expect(fullLines.cols).toEqual([6]);
  });

  it('clearLines clears correctly', () => {
    let board = createEmptyBoard();

    // Fill row 2 and col 4
    for (let c = 0; c < 8; c++) {
      board[2][c] = { shade: 'rose' };
    }
    for (let r = 0; r < 8; r++) {
      board[r][4] = { shade: 'gold' };
    }

    // Also put an isolated cell at (0, 0) and (7, 7) that shouldn't be cleared
    board[0][0] = { shade: 'kohl' };
    board[7][7] = { shade: 'crimson' };

    const clearedBoard = clearLines(board, [2], [4]);

    // Check row 2 is cleared
    for (let c = 0; c < 8; c++) {
      expect(clearedBoard[2][c]).toBeNull();
    }

    // Check col 4 is cleared
    for (let r = 0; r < 8; r++) {
      expect(clearedBoard[r][4]).toBeNull();
    }

    // Unaffected cells persist
    expect(clearedBoard[0][0]).toEqual({ shade: 'kohl' });
    expect(clearedBoard[7][7]).toEqual({ shade: 'crimson' });
  });

  it('getZoneForRow maps correctly (0-2=eyes, 3-5=cheeks, 6-7=lips)', () => {
    expect(getZoneForRow(0)).toBe('eyes');
    expect(getZoneForRow(1)).toBe('eyes');
    expect(getZoneForRow(2)).toBe('eyes');

    expect(getZoneForRow(3)).toBe('cheeks');
    expect(getZoneForRow(4)).toBe('cheeks');
    expect(getZoneForRow(5)).toBe('cheeks');

    expect(getZoneForRow(6)).toBe('lips');
    expect(getZoneForRow(7)).toBe('lips');
  });

  it('isLineMonochrome detects pure shade', () => {
    let board = createEmptyBoard();

    // Create a pure row in row 1
    for (let c = 0; c < 8; c++) {
      board[1][c] = { shade: 'champagne' };
    }

    const rowCheck = isLineMonochrome(board, 'row', 1);
    expect(rowCheck.isPure).toBe(true);
    expect(rowCheck.shade).toBe('champagne');

    // Create a pure column in col 7
    for (let r = 0; r < 8; r++) {
      board[r][7] = { shade: 'berry' };
    }

    const colCheck = isLineMonochrome(board, 'col', 7);
    expect(colCheck.isPure).toBe(true);
    expect(colCheck.shade).toBe('berry');
  });

  it('isLineMonochrome detects mixed shade', () => {
    let board = createEmptyBoard();

    // Mixed row: 7 rose cells and 1 gold cell
    for (let c = 0; c < 7; c++) {
      board[0][c] = { shade: 'rose' };
    }
    board[0][7] = { shade: 'gold' };

    const mixedCheck = isLineMonochrome(board, 'row', 0);
    expect(mixedCheck.isPure).toBe(false);
    expect(mixedCheck.shade).toBeNull();

    // Incomplete row with a null cell
    board[4][0] = { shade: 'rose' };
    const incompleteCheck = isLineMonochrome(board, 'row', 4);
    expect(incompleteCheck.isPure).toBe(false);
    expect(incompleteCheck.shade).toBeNull();
  });

  it('canAnyShapeFit detects possible placements', () => {
    const board = createEmptyBoard();
    const shapes = [square2x2Shape, horizontalLineShape];
    expect(canAnyShapeFit(board, shapes)).toBe(true);
  });

  it('canAnyShapeFit detects no possible placements', () => {
    // Completely fill the board
    const fullBoard: Board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => ({ shade: 'kohl' }))
    );

    const shapes = [singleCellShape, horizontalLineShape, square2x2Shape];
    expect(canAnyShapeFit(fullBoard, shapes)).toBe(false);

    // Board with only 1 empty cell, but shapes are larger
    fullBoard[0][0] = null;
    expect(canAnyShapeFit(fullBoard, [square2x2Shape, horizontalLineShape])).toBe(false);
    expect(canAnyShapeFit(fullBoard, [singleCellShape])).toBe(true);
  });
});
