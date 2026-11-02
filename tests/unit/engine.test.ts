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
});
