import { describe, it, expect } from 'vitest';
import {
  calculatePlacementScore,
  calculateClearScore,
  calculateTotalMoveScore,
  POINTS_PER_CELL,
  POINTS_PER_LINE,
  FULL_BOARD_BONUS,
} from '../../src/game/scoring';

describe('Scoring Logic Unit Tests', () => {
  it('calculatePlacementScore returns cells * 10', () => {
    expect(calculatePlacementScore(1)).toBe(10);
    expect(calculatePlacementScore(2)).toBe(20);
    expect(calculatePlacementScore(4)).toBe(40);
    expect(calculatePlacementScore(9)).toBe(90);
    expect(calculatePlacementScore(0)).toBe(0);
    expect(calculatePlacementScore(-5)).toBe(0);
  });

  it('calculateClearScore with single line', () => {
    const result = calculateClearScore(1, 0, false);
    expect(result.score).toBe(100);
    expect(result.combo).toBe(1);

    // Multi-line clears without combo
    const doubleClear = calculateClearScore(2, 0, false);
    expect(doubleClear.score).toBe(200);
    expect(doubleClear.combo).toBe(1);
  });

  it('calculateClearScore with combo multiplier', () => {
    // 1st combo step: previous combo 0 -> combo 1 (1x)
    const step1 = calculateClearScore(1, 0, false);
    expect(step1.score).toBe(100);
    expect(step1.combo).toBe(1);

    // 2nd combo step: previous combo 1 -> combo 2 (2x multiplier)
    const step2 = calculateClearScore(1, step1.combo, false);
    expect(step2.score).toBe(200);
    expect(step2.combo).toBe(2);

    // 3rd combo step: previous combo 2 -> combo 3 (3x multiplier)
    const step3 = calculateClearScore(1, step2.combo, false);
    expect(step3.score).toBe(300);
    expect(step3.combo).toBe(3);

    // 4th combo step: previous combo 3 -> combo 4 (4x multiplier)
    const step4 = calculateClearScore(1, step3.combo, false);
    expect(step4.score).toBe(400);
    expect(step4.combo).toBe(4);
  });

  it('calculateClearScore with pure shade x2', () => {
    // Single line with pure shade (100 * 1 * 2 = 200)
    const pureSingle = calculateClearScore(1, 0, true);
    expect(pureSingle.score).toBe(200);
    expect(pureSingle.combo).toBe(1);

    // Two lines with combo 1 (2x) and pure shade (2x): 2 * 100 * 2 * 2 = 800
    const pureDoubleWithCombo = calculateClearScore(2, 1, true);
    expect(pureDoubleWithCombo.score).toBe(800);
    expect(pureDoubleWithCombo.combo).toBe(2);
  });

  it('calculateTotalMoveScore with full board bonus', () => {
    // Placement 4 cells (40) + 1 line clear (100) + full board bonus (500) = 640
    const withBoardClear = calculateTotalMoveScore(4, 1, 0, false, true);
    expect(withBoardClear).toBe(40 + 100 + FULL_BOARD_BONUS);
    expect(withBoardClear).toBe(640);

    // Without full board clear: 40 + 100 = 140
    const withoutBoardClear = calculateTotalMoveScore(4, 1, 0, false, false);
    expect(withoutBoardClear).toBe(140);

    // Placement only (0 lines cleared): no full board bonus applied
    const placementOnly = calculateTotalMoveScore(3, 0, 0, false, true);
    expect(placementOnly).toBe(30);
  });

  it('Combo caps at x5', () => {
    // combo 4 -> newCombo 5 (5x multiplier)
    const combo5 = calculateClearScore(1, 4, false);
    expect(combo5.combo).toBe(5);
    expect(combo5.score).toBe(500);

    // combo 5 -> newCombo 6 (capped at 5x multiplier)
    const combo6 = calculateClearScore(1, 5, false);
    expect(combo6.combo).toBe(6);
    expect(combo6.score).toBe(500);

    // combo 10 -> newCombo 11 (capped at 5x multiplier)
    const combo10 = calculateClearScore(1, 10, false);
    expect(combo10.combo).toBe(11);
    expect(combo10.score).toBe(500);

    // With 2 lines and capped combo: 2 * 100 * 5 = 1000
    const doubleLineCapped = calculateClearScore(2, 10, false);
    expect(doubleLineCapped.score).toBe(1000);
  });
});
