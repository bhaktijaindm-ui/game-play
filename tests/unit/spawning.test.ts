import { describe, it, expect } from 'vitest';
import {
  spawnShapes,
  spawnDailyShapes,
  getDailyBriefSeed,
} from '../../src/game/spawning';
import { createEmptyBoard, canAnyShapeFit } from '../../src/game/board';
import type { Board } from '../../src/types';

describe('Spawning Logic Unit Tests', () => {
  it('spawnShapes returns exactly 3 shapes', () => {
    const board = createEmptyBoard();
    const shapes = spawnShapes(board);

    expect(shapes).toHaveLength(3);
    for (const shape of shapes) {
      expect(shape).toBeDefined();
      expect(shape.id).toBeTypeOf('string');
      expect(shape.cells.length).toBeGreaterThan(0);
      expect(shape.shade).toBeDefined();
    }
  });

  it('Fair spawning: shapes always fit on non-full board (run 100 iterations)', () => {
    // Generate partially filled boards (20-45 cells occupied) across 100 iterations
    for (let i = 0; i < 100; i++) {
      const board = createEmptyBoard();

      // Occupy some random cells without completely blocking the board
      const filledCount = 20 + (i % 25);
      let placed = 0;
      for (let r = 0; r < 8 && placed < filledCount; r++) {
        for (let c = 0; c < 8 && placed < filledCount; c++) {
          if ((r + c + i) % 2 === 0) {
            board[r][c] = { shade: 'rose' };
            placed++;
          }
        }
      }

      const shapes = spawnShapes(board, `seed_iter_${i}`);
      expect(shapes).toHaveLength(3);

      const canFit = canAnyShapeFit(board, shapes);
      expect(canFit).toBe(true);
    }
  });

  it('Daily brief seed produces same shapes for same date', () => {
    const board = createEmptyBoard();
    const date = '2026-11-02';

    const batch1 = spawnDailyShapes(date, 0, board);
    const batch2 = spawnDailyShapes(date, 0, board);

    expect(batch1).toHaveLength(3);
    expect(batch2).toHaveLength(3);

    for (let i = 0; i < 3; i++) {
      expect(batch1[i].id).toBe(batch2[i].id);
      expect(batch1[i].shade).toBe(batch2[i].shade);
      expect(batch1[i].cells).toEqual(batch2[i].cells);
    }

    // Verify seed generation helper is consistent
    expect(getDailyBriefSeed(date)).toBe(getDailyBriefSeed(date));
  });

  it('Different dates produce different shapes', () => {
    const board = createEmptyBoard();
    const batchDateA = spawnDailyShapes('2026-11-02', 0, board);
    const batchDateB = spawnDailyShapes('2026-11-03', 0, board);

    // Either the shape IDs or cell configurations or shades should differ
    const idsA = batchDateA.map(s => s.id).join(',');
    const idsB = batchDateB.map(s => s.id).join(',');

    expect(idsA).not.toBe(idsB);
  });

  it('High occupancy favors small shapes', () => {
    const lowOccupancyBoard = createEmptyBoard();

    // High occupancy board: fill 52 of 64 cells (> 80% occupancy, threshold is > 75%)
    const highOccupancyBoard: Board = createEmptyBoard();
    let occupied = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (occupied < 52) {
          highOccupancyBoard[r][c] = { shade: 'gold' };
          occupied++;
        }
      }
    }

    const sampleBatches = 60;
    let smallShapesLow = 0;
    let totalShapesLow = 0;

    let smallShapesHigh = 0;
    let totalShapesHigh = 0;

    for (let i = 0; i < sampleBatches; i++) {
      const lowShapes = spawnShapes(lowOccupancyBoard, `low_${i}`);
      for (const shape of lowShapes) {
        totalShapesLow++;
        if (shape.cells.length <= 3) {
          smallShapesLow++;
        }
      }

      const highShapes = spawnShapes(highOccupancyBoard, `high_${i}`);
      for (const shape of highShapes) {
        totalShapesHigh++;
        if (shape.cells.length <= 3) {
          smallShapesHigh++;
        }
      }
    }

    const lowRatio = smallShapesLow / totalShapesLow;
    const highRatio = smallShapesHigh / totalShapesHigh;

    // High occupancy introduces 70% probability for small shapes pool
    expect(highRatio).toBeGreaterThan(lowRatio);
    expect(highRatio).toBeGreaterThan(0.55);
  });
});
