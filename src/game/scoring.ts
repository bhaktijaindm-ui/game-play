export const POINTS_PER_CELL = 10;
export const POINTS_PER_LINE = 100;
export const COMBO_MULTIPLIERS = [1, 2, 3, 4, 5];
export const PURE_SHADE_MULTIPLIER = 2;
export const FULL_BOARD_BONUS = 500;

/**
 * Calculates score earned purely by placing a shape with the given cell count.
 */
export function calculatePlacementScore(cellCount: number): number {
  return Math.max(0, cellCount) * POINTS_PER_CELL;
}

/**
 * Calculates score earned by clearing one or more lines, incorporating combo
 * multiplier and pure shade bonus.
 * If linesCleared is 0, combo is reset to 0 and score is 0.
 */
export function calculateClearScore(
  linesCleared: number,
  combo: number,
  hasPureShade: boolean
): { score: number; combo: number } {
  if (linesCleared <= 0) {
    return { score: 0, combo: 0 };
  }

  const newCombo = Math.max(0, combo) + 1;
  const comboIdx = Math.min(newCombo - 1, COMBO_MULTIPLIERS.length - 1);
  const comboMultiplier = COMBO_MULTIPLIERS[Math.max(0, comboIdx)];
  const pureMultiplier = hasPureShade ? PURE_SHADE_MULTIPLIER : 1;

  const baseLineScore = linesCleared * POINTS_PER_LINE;
  const score = baseLineScore * comboMultiplier * pureMultiplier;

  return {
    score,
    combo: newCombo,
  };
}

/**
 * Calculates the complete move score including placement, line clears, combo,
 * pure shade multiplier, and optional full board clear bonus.
 */
export function calculateTotalMoveScore(
  cellCount: number,
  linesCleared: number,
  combo: number,
  hasPureShade: boolean,
  boardEmpty: boolean
): number {
  const placementScore = calculatePlacementScore(cellCount);
  const clearResult = calculateClearScore(linesCleared, combo, hasPureShade);
  let totalScore = placementScore + clearResult.score;

  if (boardEmpty && linesCleared > 0) {
    totalScore += FULL_BOARD_BONUS;
  }

  return totalScore;
}
