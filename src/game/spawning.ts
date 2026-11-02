import seedrandom from 'seedrandom';
import { SHAPES } from './shapes';
import { canAnyShapeFit, getBoardOccupancy } from './board';
import { SHADE_IDS } from '../types';
import type { Board, Shape, ShadeId } from '../types';

const SMALL_SHAPES = SHAPES.filter(s => s.cells.length <= 3);

/**
 * Returns a deterministic integer seed from a date string (e.g. 'YYYY-MM-DD').
 */
export function getDailyBriefSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generates 3 shapes according to fair spawning rules:
 * - 30% chance all 3 shapes receive the exact same shade (Pure Shade opportunity)
 * - When board occupancy > 75%, 70% probability per shape to select from small shapes (1-3 cells)
 * - Regenerates up to 10 times if no shape in the set can fit and the board is not completely full
 */
export function spawnShapes(
  board: Board,
  seed?: string | number,
  palette: ShadeId[] = SHADE_IDS
): Shape[] {
  const rng = seed !== undefined ? seedrandom(String(seed)) : Math.random;
  const occupancy = getBoardOccupancy(board) / 64;
  const isHighOccupancy = occupancy > 0.75;
  const maxAttempts = 10;

  let chosenShapes: Shape[] = [];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // 30% chance for pure shade across all 3 shapes
    const isPureShadeBatch = rng() < 0.3;
    const commonShade = palette[Math.floor(rng() * palette.length)] ?? 'rose';

    const candidateBatch: Shape[] = [];

    for (let i = 0; i < 3; i++) {
      const useSmall = isHighOccupancy && rng() < 0.7;
      const pool = useSmall && SMALL_SHAPES.length > 0 ? SMALL_SHAPES : SHAPES;
      const def = pool[Math.floor(rng() * pool.length)];

      const assignedShade = isPureShadeBatch
        ? commonShade
        : palette[Math.floor(rng() * palette.length)] ?? 'rose';

      const uniqueSuffix = Math.floor(rng() * 1000000).toString(36);
      candidateBatch.push({
        id: `${def.id}_${uniqueSuffix}_${i}`,
        cells: def.cells.map(c => ({ row: c.row, col: c.col })),
        shade: assignedShade,
      });
    }

    chosenShapes = candidateBatch;

    // If at least one shape can fit, or board is full, return this batch
    if (canAnyShapeFit(board, chosenShapes) || getBoardOccupancy(board) >= 64) {
      return chosenShapes;
    }
  }

  // Guaranteed fairness rule fallback:
  // If no shapes fit after max attempts and the board is not completely full (has at least 1 free cell),
  // actively find a shape definition from small shapes (e.g. single cell I1) that can fit and insert it.
  if (getBoardOccupancy(board) < 64 && chosenShapes.length > 0) {
    const candidatePool = [...SMALL_SHAPES, ...SHAPES];
    const fallbackShade = palette[0] ?? 'rose';
    for (const def of candidatePool) {
      const testShape: Shape = {
        id: `${def.id}_fallback_fair`,
        cells: def.cells.map(c => ({ row: c.row, col: c.col })),
        shade: fallbackShade,
      };
      if (canAnyShapeFit(board, [testShape])) {
        chosenShapes[0] = testShape;
        break;
      }
    }
  }

  return chosenShapes;
}

/**
 * Spawns 3 deterministic shapes for the daily challenge based on date and moveIndex.
 */
export function spawnDailyShapes(
  date: string,
  moveIndex: number,
  board: Board,
  palette: ShadeId[] = SHADE_IDS
): Shape[] {
  const seed = `${date}_daily_move_${moveIndex}`;
  return spawnShapes(board, seed, palette);
}
