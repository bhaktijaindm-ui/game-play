import { describe, it, expect } from 'vitest';
import {
  createNewGame,
  handlePlacement,
  handleUndo,
  handleShuffle,
  handleBomb,
  serializeState,
  deserializeState,
  isGameOver,
} from '../../src/game/engine';
import { getLevel } from '../../src/game/levels';

describe('Game Engine State Machine', () => {
  it('creates a fresh new game with initial shapes and board', () => {
    const client = getLevel(1);
    const game = createNewGame(client);

    expect(game.score).toBe(0);
    expect(game.combo).toBe(0);
    expect(game.board.length).toBe(8);
    expect(game.board[0].length).toBe(8);
    expect(game.shapes.length).toBe(3);
    expect(game.isGameOver).toBe(false);
    expect(game.powerUps.undo).toBeGreaterThan(0);
    expect(game.powerUps.shuffle).toBeGreaterThan(0);
    expect(game.powerUps.bomb).toBeGreaterThan(0);
  });

  it('serializes and deserializes game state faithfully', () => {
    const client = getLevel(1);
    const game = createNewGame(client);
    game.score = 1250;
    game.combo = 3;

    const json = serializeState(game);
    const restored = deserializeState(json);

    expect(restored.score).toBe(1250);
    expect(restored.combo).toBe(3);
    expect(restored.board.length).toBe(8);
    expect(restored.shapes.length).toBe(game.shapes.length);
  });

  it('handles shuffle power-up by regenerating 3 shapes', () => {
    const client = getLevel(1);
    const game = createNewGame(client);
    const initialShuffles = game.powerUps.shuffle;

    const afterShuffle = handleShuffle(game);
    expect(afterShuffle.powerUps.shuffle).toBe(initialShuffles - 1);
    expect(afterShuffle.shapes.length).toBe(3);
  });

  it('handles bomb power-up by clearing a 3x3 radius', () => {
    const client = getLevel(1);
    const game = createNewGame(client);
    // Fill a cell
    game.board[3][3] = 'rose';
    game.board[3][4] = 'gold';

    const initialBombs = game.powerUps.bomb;
    const afterBomb = handleBomb(game, { row: 3, col: 3 });

    expect(afterBomb.powerUps.bomb).toBe(initialBombs - 1);
    expect(afterBomb.board[3][3]).toBeNull();
    expect(afterBomb.board[3][4]).toBeNull();
  });

  it('handles undo by restoring previous state', () => {
    const client = getLevel(1);
    const original = createNewGame(client);
    const modified = { ...original, score: 999 };

    const restored = handleUndo(modified, original);
    expect(restored.score).toBe(original.score);
    expect(restored.powerUps.undo).toBe(modified.powerUps.undo - 1);
  });

  it('refills tray with 3 new shapes when all 3 active shapes are placed', () => {
    const client = getLevel(1);
    let game = createNewGame(client);
    // Force specific single-cell shapes for deterministic testing
    game.currentShapes = [
      { id: 'I1_1', cells: [{ row: 0, col: 0 }], shade: 'rose' },
      { id: 'I1_2', cells: [{ row: 0, col: 0 }], shade: 'gold' },
      { id: 'I1_3', cells: [{ row: 0, col: 0 }], shade: 'mint' },
    ];
    game.shapes = [...game.currentShapes];

    // Place shape 0
    game = handlePlacement(game, 0, { row: 0, col: 0 });
    expect(game.currentShapes[0]).toBeNull();
    expect(game.currentShapes[1]).not.toBeNull();

    // Place shape 1
    game = handlePlacement(game, 1, { row: 1, col: 0 });
    expect(game.currentShapes[1]).toBeNull();
    expect(game.currentShapes[2]).not.toBeNull();

    // Place shape 2 (final shape) - should trigger auto-refill
    game = handlePlacement(game, 2, { row: 2, col: 0 });
    expect(game.currentShapes.length).toBe(3);
    expect(game.currentShapes[0]).not.toBeNull();
    expect(game.currentShapes[1]).not.toBeNull();
    expect(game.currentShapes[2]).not.toBeNull();
  });

  it('detects game over when none of the remaining shapes can fit', () => {
    const client = getLevel(1);
    const game = createNewGame(client);
    // Fill the entire board with cells
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        game.board[r][c] = { shade: 'rose' };
      }
    }
    // Set current shapes
    game.currentShapes = [
      { id: 'I2h', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }], shade: 'gold' },
    ];

    expect(isGameOver(game)).toBe(true);
  });

  it('tracks and updates best score when current score exceeds best score', () => {
    const client = getLevel(1);
    let game = createNewGame(client);
    game.bestScore = 500;
    game.currentShapes = [
      { id: 'I1', cells: [{ row: 0, col: 0 }], shade: 'rose' },
    ];

    game = handlePlacement(game, 0, { row: 0, col: 0 });
    expect(game.score).toBeGreaterThan(0);
    expect(game.bestScore).toBe(Math.max(500, game.score));
  });
});

