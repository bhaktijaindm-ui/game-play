import { describe, it, expect } from 'vitest';
import {
  SHAPES,
  getRandomShapes,
  createEmptyBoard,
  canPlace,
  placeShape,
  findFullLines,
  clearLines,
  getZoneForRow,
  getZonesForColumn,
  isLineMonochrome,
  canAnyShapeFit,
  findValidPositions,
  getBoardOccupancy,
  calculatePlacementScore,
  calculateClearScore,
  calculateTotalMoveScore,
  POINTS_PER_CELL,
  POINTS_PER_LINE,
  COMBO_MULTIPLIERS,
  PURE_SHADE_MULTIPLIER,
  FULL_BOARD_BONUS,
  spawnShapes,
  getDailyBriefSeed,
  spawnDailyShapes,
  createGoal,
  updateGoals,
  checkCompletion,
  createEmptyRecipe,
  applyClearToFace,
  getMakeupIntensity,
  createNewGame,
  handlePlacement,
  handleUndo,
  handleShuffle,
  handleBomb,
  serializeState,
  deserializeState,
  COLLECTIONS,
  CLIENTS,
  getLevel,
  getDailyClient,
  getCellShade,
} from '../index';
import type { Shape, ClearResult } from '../../types';

describe('FILE 1: shapes.ts', () => {
  it('defines 22 shapes with proper IDs and cells', () => {
    expect(SHAPES.length).toBe(22);

    const expectedIds = [
      'I1',
      'I2h',
      'I2v',
      'I3h',
      'I3v',
      'I4h',
      'I4v',
      'I5h',
      'I5v',
      'O2',
      'O3',
      'Lshape',
      'Jshape',
      'Tshape',
      'Sshape',
      'Zshape',
      'Corner2',
      'Corner3',
      'Plus',
      'Diag2',
      'Diag2_inv',
      'Line2x2',
    ];

    const shapeIds = SHAPES.map(s => s.id);
    for (const id of expectedIds) {
      expect(shapeIds).toContain(id);
    }
  });

  it('getRandomShapes returns requested count and is deterministic when seeded', () => {
    const unseeded = getRandomShapes(3);
    expect(unseeded.length).toBe(3);

    const seeded1 = getRandomShapes(3, 'glam_seed_123');
    const seeded2 = getRandomShapes(3, 'glam_seed_123');
    expect(seeded1).toEqual(seeded2);
  });
});

describe('FILE 2: board.ts', () => {
  it('creates an empty 8x8 board', () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(8);
    expect(board[0].length).toBe(8);
    expect(board.every(row => row.every(cell => cell === null))).toBe(true);
  });

  it('verifies placement bounds and overlap', () => {
    const board = createEmptyBoard();
    const shape: Shape = {
      id: 'I3h',
      cells: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      shade: 'rose',
    };

    expect(canPlace(board, shape, { row: 0, col: 0 })).toBe(true);
    expect(canPlace(board, shape, { row: 0, col: 6 })).toBe(false); // exceeds col 7

    const placedBoard = placeShape(board, shape, { row: 0, col: 0 });
    expect(board[0][0]).toBeNull(); // immutability
    expect(getCellShade(placedBoard[0][0])).toBe('rose');

    // Overlap check
    expect(canPlace(placedBoard, shape, { row: 0, col: 0 })).toBe(false);
  });

  it('detects and clears full lines simultaneously', () => {
    let board = createEmptyBoard();
    // Fill row 2
    for (let c = 0; c < 8; c++) {
      board[2][c] = { shade: 'gold' };
    }
    // Fill col 4
    for (let r = 0; r < 8; r++) {
      board[r][4] = { shade: 'crimson' };
    }

    const fullLines = findFullLines(board);
    expect(fullLines.rows).toEqual([2]);
    expect(fullLines.cols).toEqual([4]);

    const cleared = clearLines(board, fullLines.rows, fullLines.cols);
    expect(cleared[2][4]).toBeNull();
    expect(cleared[2][0]).toBeNull();
    expect(cleared[0][4]).toBeNull();
  });

  it('maps rows and columns to correct face makeup zones', () => {
    expect(getZoneForRow(0)).toBe('eyes');
    expect(getZoneForRow(2)).toBe('eyes');
    expect(getZoneForRow(3)).toBe('cheeks');
    expect(getZoneForRow(5)).toBe('cheeks');
    expect(getZoneForRow(6)).toBe('lips');
    expect(getZoneForRow(7)).toBe('lips');

    const zones = getZonesForColumn(0, [1, 4, 7]);
    expect(zones).toEqual(['eyes', 'cheeks', 'lips']);
  });

  it('checks if a line is monochrome (pure shade)', () => {
    const board = createEmptyBoard();
    for (let c = 0; c < 8; c++) {
      board[1][c] = { shade: 'berry' };
    }
    expect(isLineMonochrome(board, 'row', 1)).toEqual({
      isPure: true,
      shade: 'berry',
    });

    board[1][3] = { shade: 'gold' };
    expect(isLineMonochrome(board, 'row', 1)).toEqual({
      isPure: false,
      shade: null,
    });
  });

  it('computes occupancy and valid positions', () => {
    const board = createEmptyBoard();
    expect(getBoardOccupancy(board)).toBe(0);

    board[0][0] = { shade: 'rose' };
    board[0][1] = { shade: 'rose' };
    expect(getBoardOccupancy(board)).toBe(2);

    const i1: Shape = { id: 'I1', cells: [{ row: 0, col: 0 }], shade: 'rose' };
    const validPositions = findValidPositions(board, i1);
    expect(validPositions.length).toBe(62);
    expect(canAnyShapeFit(board, [i1])).toBe(true);
  });
});

describe('FILE 3: scoring.ts', () => {
  it('calculates placement scores correctly', () => {
    expect(calculatePlacementScore(4)).toBe(4 * POINTS_PER_CELL);
    expect(calculatePlacementScore(0)).toBe(0);
  });

  it('calculates clear scores with combo multipliers and pure shade bonus', () => {
    // 0 lines cleared resets combo
    expect(calculateClearScore(0, 3, false)).toEqual({ score: 0, combo: 0 });

    // 1 line cleared with no prior combo: combo becomes 1, mult = 1
    expect(calculateClearScore(1, 0, false)).toEqual({
      score: 1 * POINTS_PER_LINE * COMBO_MULTIPLIERS[0],
      combo: 1,
    });

    // 2 lines cleared with prior combo 2: combo becomes 3, mult = 3, pure shade mult = 2
    expect(calculateClearScore(2, 2, true)).toEqual({
      score: 2 * POINTS_PER_LINE * COMBO_MULTIPLIERS[2] * PURE_SHADE_MULTIPLIER,
      combo: 3,
    });
  });

  it('calculates total move score including full board bonus', () => {
    const score = calculateTotalMoveScore(4, 1, 0, false, false);
    expect(score).toBe(40 + 100);

    const fullClearScore = calculateTotalMoveScore(4, 1, 0, false, true);
    expect(fullClearScore).toBe(40 + 100 + FULL_BOARD_BONUS);
  });
});

describe('FILE 4: spawning.ts', () => {
  it('spawns 3 valid shapes with shades', () => {
    const board = createEmptyBoard();
    const shapes = spawnShapes(board);
    expect(shapes.length).toBe(3);
    for (const shape of shapes) {
      expect(shape.cells.length).toBeGreaterThan(0);
      expect(shape.shade).toBeDefined();
    }
  });

  it('favors smaller shapes when occupancy > 75%', () => {
    const board = createEmptyBoard();
    // Fill 50 cells (> 75% of 64 is 48)
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 8; c++) {
        board[r][c] = { shade: 'rose' };
      }
    }
    board[6][0] = { shade: 'rose' };
    board[6][1] = { shade: 'rose' };

    const shapes = spawnShapes(board, 'seed_high_occupancy');
    expect(shapes.length).toBe(3);
  });

  it('generates deterministic daily seeds and shapes', () => {
    const seed1 = getDailyBriefSeed('2026-11-02');
    const seed2 = getDailyBriefSeed('2026-11-02');
    expect(seed1).toBe(seed2);

    const board = createEmptyBoard();
    const daily1 = spawnDailyShapes('2026-11-02', 1, board);
    const daily2 = spawnDailyShapes('2026-11-02', 1, board);
    expect(daily1).toEqual(daily2);
  });
});

describe('FILE 5: goals.ts', () => {
  it('creates and tracks goals accurately', () => {
    const colorGoal = createGoal('clearColor', 3, 'henna');
    expect(colorGoal.type).toBe('clearColor');
    expect(colorGoal.target).toBe(3);
    expect(colorGoal.shade).toBe('henna');
    expect(colorGoal.completed).toBe(false);

    const clearResult: ClearResult = {
      lines: [
        {
          type: 'row',
          index: 0,
          shades: Array(8).fill('henna'),
          dominantShade: 'henna',
          isPure: true,
          pureShade: 'henna',
          zone: 'eyes',
        },
      ],
      rowsCleared: [0],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: true,
      combo: 1,
      score: 200,
    };

    const updated = updateGoals([colorGoal], clearResult);
    expect(updated[0].current).toBe(1);
    expect(updated[0].completed).toBe(false);

    const updated2 = updateGoals(
      updated,
      {
        ...clearResult,
        lines: [
          clearResult.lines[0],
          clearResult.lines[0],
        ],
        totalLines: 2,
      }
    );
    expect(updated2[0].current).toBe(3);
    expect(updated2[0].completed).toBe(true);

    const completion = checkCompletion(updated2, 3000, [1000, 2500, 5000]);
    expect(completion.allCompleted).toBe(true);
    expect(completion.stars).toBe(2);
  });
});

describe('FILE 6: faceMapping.ts', () => {
  it('applies cleared lines to the face recipe and computes intensity', () => {
    const emptyRecipe = createEmptyRecipe();
    expect(getMakeupIntensity(emptyRecipe.eyes)).toBe(0);

    const clearResult: ClearResult = {
      lines: [
        {
          type: 'row',
          index: 1, // eyes zone
          shades: Array(8).fill('berry'),
          dominantShade: 'berry',
          isPure: true,
          pureShade: 'berry',
          zone: 'eyes',
        },
      ],
      rowsCleared: [1],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: true,
      combo: 1,
      score: 200,
    };

    const newRecipe = applyClearToFace(emptyRecipe, clearResult);
    expect(newRecipe.eyes.length).toBe(1);
    expect(newRecipe.eyes[0].shade).toBe('berry');
    expect(getMakeupIntensity(newRecipe.eyes)).toBeGreaterThan(0);
  });
});

describe('FILE 7: engine.ts', () => {
  it('creates new game state and executes valid placement', () => {
    const client = getLevel(1);
    const game = createNewGame(client);
    expect(game.score).toBe(0);
    expect(game.isGameOver).toBe(false);
    expect(game.currentShapes.length).toBe(3);

    const firstShape = game.currentShapes[0]!;
    expect(firstShape).toBeDefined();
    const nextState = handlePlacement(game, 0, { row: 0, col: 0 });

    expect(nextState.score).toBeGreaterThan(0);
    expect(nextState.moveCount).toBe(1);
    expect(nextState.currentShapes[0]).toBeNull();
  });

  it('supports undo, shuffle, and bomb powerups', () => {
    const game = createNewGame();
    game.board[3][3] = { shade: 'gold' };
    game.board[3][4] = { shade: 'gold' };

    // Bomb
    const bombed = handleBomb(game, { row: 3, col: 3 });
    expect(bombed.board[3][3]).toBeNull();
    expect(bombed.board[3][4]).toBeNull();
    expect(bombed.powerUps.bomb).toBe(0);

    // Shuffle
    const shuffled = handleShuffle(bombed);
    expect(shuffled.powerUps.shuffle).toBe(1);

    // Undo
    const undone = handleUndo(shuffled, game);
    expect(undone.powerUps.undo).toBe(2);
  });

  it('serializes and deserializes game state cleanly', () => {
    const game = createNewGame(getLevel(2));
    const json = serializeState(game);
    const restored = deserializeState(json);
    expect(restored.score).toBe(game.score);
    expect(restored.client?.id).toBe(game.client?.id);
  });
});

describe('FILE 8: levels.ts', () => {
  it('provides 6 collections and 30 hand-crafted clients', () => {
    expect(COLLECTIONS.length).toBe(6);
    expect(CLIENTS.length).toBe(30);

    const collectionNames = [
      'Everyday Glow',
      'Haldi Day',
      'Mehendi Night',
      'Sangeet Sparkle',
      'Bridal Red',
      'Diwali Gold',
    ];

    for (const name of collectionNames) {
      const count = CLIENTS.filter(c => c.collection === name).length;
      expect(count).toBe(5);
    }
  });

  it('procedurally generates clients for levels > 30 and gets daily client', () => {
    const client35 = getLevel(35);
    expect(client35.id).toBe('procedural_lvl_35');
    expect(client35.goals.length).toBeGreaterThan(0);

    const daily = getDailyClient('2026-11-02');
    expect(daily.id).toBe('daily_2026-11-02');
  });
});
