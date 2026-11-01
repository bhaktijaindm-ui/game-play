import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  canPlaceShape,
  canShapeFitAnywhere,
  placeShape,
  generateTrayShapes,
  hasAnyValidMoves,
  applyBomb,
  BOARD_SIZE,
} from '../src/game/board';
import { SHAPES_LIBRARY } from '../src/game/shapes';
import type { ShapeDefinition, BoardMatrix } from '../src/game/types';

describe('Game Board & Logic Unit Tests', () => {
  it('creates an empty 8x8 board', () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(BOARD_SIZE);
    expect(board[0].length).toBe(BOARD_SIZE);
    board.forEach((row) => {
      row.forEach((cell) => {
        expect(cell).toBeNull();
      });
    });
  });

  it('validates shape placement bounds correctly', () => {
    const board = createEmptyBoard();
    const square2x2 = SHAPES_LIBRARY.find((s) => s.id === 'square_2x2')!;

    // Valid placement at (0, 0)
    expect(canPlaceShape(board, square2x2, 0, 0)).toBe(true);

    // Valid placement at (6, 6)
    expect(canPlaceShape(board, square2x2, 6, 6)).toBe(true);

    // Out of bounds at (7, 7) because 7 + 2 > 8
    expect(canPlaceShape(board, square2x2, 7, 7)).toBe(false);

    // Negative coordinates
    expect(canPlaceShape(board, square2x2, -1, 0)).toBe(false);
  });

  it('rejects placement when cells overlap existing blocks', () => {
    const board = createEmptyBoard();
    const dot1x1 = SHAPES_LIBRARY.find((s) => s.id === 'dot_1x1')!;
    const square2x2 = SHAPES_LIBRARY.find((s) => s.id === 'square_2x2')!;

    // Place dot at (2, 2)
    board[2][2] = { itemId: 'lipstick', color: '#E91E8C' };

    // Square at (2, 2) should fail due to collision
    expect(canPlaceShape(board, square2x2, 2, 2)).toBe(false);

    // Square at (1, 1) covers (2, 2), should also fail
    expect(canPlaceShape(board, square2x2, 1, 1)).toBe(false);

    // Square at (3, 3) does not cover (2, 2), should succeed
    expect(canPlaceShape(board, square2x2, 3, 3)).toBe(true);
  });

  it('detects when a shape can or cannot fit anywhere on the board', () => {
    const board = createEmptyBoard();
    const bigSquare = SHAPES_LIBRARY.find((s) => s.id === 'square_3x3')!;
    const dot1x1 = SHAPES_LIBRARY.find((s) => s.id === 'dot_1x1')!;

    expect(canShapeFitAnywhere(board, bigSquare)).toBe(true);

    // Fill the board completely
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        board[r][c] = { itemId: 'eyeshadow', color: '#9B5DE5' };
      }
    }

    expect(canShapeFitAnywhere(board, bigSquare)).toBe(false);
    expect(canShapeFitAnywhere(board, dot1x1)).toBe(false);

    // Clear a single cell at (4, 4)
    board[4][4] = null;
    expect(canShapeFitAnywhere(board, dot1x1)).toBe(true);
    expect(canShapeFitAnywhere(board, bigSquare)).toBe(false);
  });

  it('detects and clears horizontal rows correctly', () => {
    const board = createEmptyBoard();
    // Fill row 0 except col 7
    for (let c = 0; c < 7; c++) {
      board[0][c] = { itemId: 'lipstick', color: '#E91E8C' };
    }

    const dot1x1 = SHAPES_LIBRARY.find((s) => s.id === 'dot_1x1')!;
    const result = placeShape(board, dot1x1, 0, 7, 'lipstick', '#E91E8C', 0);

    expect(result.valid).toBe(true);
    expect(result.linesCleared).toBe(1);
    expect(result.clearedRowIndices).toEqual([0]);

    // Entire row 0 should now be cleared
    for (let c = 0; c < BOARD_SIZE; c++) {
      expect(result.newBoard[0][c]).toBeNull();
    }
  });

  it('detects simultaneous horizontal row and vertical column clears', () => {
    const board = createEmptyBoard();
    // Fill entire row 3 except col 3
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (c !== 3) board[3][c] = { itemId: 'blush', color: '#FF8A65' };
    }
    // Fill entire col 3 except row 3
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (r !== 3) board[r][3] = { itemId: 'blush', color: '#FF8A65' };
    }

    const dot1x1 = SHAPES_LIBRARY.find((s) => s.id === 'dot_1x1')!;
    // Place at the intersection (3, 3)
    const result = placeShape(board, dot1x1, 3, 3, 'blush', '#FF8A65', 0);

    expect(result.valid).toBe(true);
    expect(result.linesCleared).toBe(2);
    expect(result.clearedRowIndices).toEqual([3]);
    expect(result.clearedColIndices).toEqual([3]);
  });

  it('calculates placement scores, line scores, and combo multipliers', () => {
    const board = createEmptyBoard();
    // Anchor cell elsewhere so board is not empty after line clear
    board[7][7] = { itemId: 'eyeliner', color: '#2B1B2E' };
    // Fill row 1 except col 0
    for (let c = 1; c < BOARD_SIZE; c++) {
      board[1][c] = { itemId: 'nail_polish', color: '#E5484D' };
    }

    const dot1x1 = SHAPES_LIBRARY.find((s) => s.id === 'dot_1x1')!;

    // Combo 0 -> multiplier 1x (10 pts for cell + 100 pts for line = 110)
    const result1 = placeShape(board, dot1x1, 1, 0, 'nail_polish', '#E5484D', 0);
    expect(result1.scoreGained).toBe(10 + 100 * 1);
    expect(result1.comboCount).toBe(1);

    // With existing combo of 2 -> multiplier 3x (10 + 100 * 3 = 310)
    const result2 = placeShape(board, dot1x1, 1, 0, 'nail_polish', '#E5484D', 2);
    expect(result2.scoreGained).toBe(10 + 100 * 3);
    expect(result2.comboCount).toBe(3);
  });

  it('awards 500 bonus points when board is completely cleared', () => {
    const board = createEmptyBoard();
    // Entire board empty except row 0 with 7 cells
    for (let c = 0; c < 7; c++) {
      board[0][c] = { itemId: 'highlighter', color: '#F5B700' };
    }

    const dot1x1 = SHAPES_LIBRARY.find((s) => s.id === 'dot_1x1')!;
    const result = placeShape(board, dot1x1, 0, 7, 'highlighter', '#F5B700', 0);

    expect(result.isBoardCleared).toBe(true);
    expect(result.scoreGained).toBe(10 + 100 + 500); // cell + line + board clear bonus
  });

  it('honors the fairness spawning rule (at least one shape fits)', () => {
    const board = createEmptyBoard();
    // Fill board heavily leaving only space for small shapes
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (r !== 7 || c !== 7) {
          board[r][c] = { itemId: 'eyeliner', color: '#2B1B2E' };
        }
      }
    }
    // Only (7, 7) is open
    const tray = generateTrayShapes(board, 15);
    expect(tray.length).toBe(3);

    // Fairness rule: AT LEAST ONE shape in the tray must fit on the board!
    const atLeastOneFits = tray.some((t) => canShapeFitAnywhere(board, t.shape));
    expect(atLeastOneFits).toBe(true);
  });

  it('detects game over when no remaining tray shapes fit', () => {
    const board = createEmptyBoard();
    // Fill board entirely
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        board[r][c] = { itemId: 'mint_skincare', color: '#2FBF71' };
      }
    }

    const bigSquare = SHAPES_LIBRARY.find((s) => s.id === 'square_3x3')!;
    const mockTray = [
      {
        instanceId: '1',
        shape: bigSquare,
        itemId: 'lipstick',
        color: '#E91E8C',
        canPlaceOnCurrentBoard: false,
      },
    ];

    expect(hasAnyValidMoves(board, mockTray)).toBe(false);
  });

  it('applies Glam Bomb to clear a 3x3 area properly', () => {
    const board = createEmptyBoard();
    // Fill 3x3 area from (1, 1) to (3, 3)
    for (let r = 1; r <= 3; r++) {
      for (let c = 1; c <= 3; c++) {
        board[r][c] = { itemId: 'lipstick', color: '#E91E8C' };
      }
    }

    const { newBoard, clearedCellsCount } = applyBomb(board, 2, 2);
    expect(clearedCellsCount).toBe(9);

    for (let r = 1; r <= 3; r++) {
      for (let c = 1; c <= 3; c++) {
        expect(newBoard[r][c]).toBeNull();
      }
    }
  });
});
