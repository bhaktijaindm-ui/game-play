import seedrandom from 'seedrandom';
import type { Shape, BlockCell } from '../types';
import { SHADE_IDS } from '../types';

export interface ShapeDefinition {
  id: string;
  cells: BlockCell[];
}

export const SHAPES: ShapeDefinition[] = [
  // 1x1
  {
    id: 'I1',
    cells: [{ row: 0, col: 0 }],
  },
  // 1x2 and 2x1
  {
    id: 'I2h',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ],
  },
  {
    id: 'I2v',
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
    ],
  },
  // 1x3 and 3x1
  {
    id: 'I3h',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ],
  },
  {
    id: 'I3v',
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
    ],
  },
  // 1x4 and 4x1
  {
    id: 'I4h',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ],
  },
  {
    id: 'I4v',
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 3, col: 0 },
    ],
  },
  // 1x5 and 5x1
  {
    id: 'I5h',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
    ],
  },
  {
    id: 'I5v',
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 3, col: 0 },
      { row: 4, col: 0 },
    ],
  },
  // 2x2 Square
  {
    id: 'O2',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  // 3x3 Square
  {
    id: 'O3',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  // Tetrominoes: L, J, T, S, Z
  {
    id: 'Lshape',
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
    ],
  },
  {
    id: 'Jshape',
    cells: [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
    ],
  },
  {
    id: 'Tshape',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: 'Sshape',
    cells: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: 'Zshape',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
  },
  // Corners
  {
    id: 'Corner2',
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: 'Corner3',
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  // Plus shape
  {
    id: 'Plus',
    cells: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
    ],
  },
  // Diagonals
  {
    id: 'Diag2',
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: 'Diag2_inv',
    cells: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ],
  },
  // 2x2 Rect / Block
  {
    id: 'Line2x2',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  },
];

export function getRandomShapes(count: number, seed?: string | number): Shape[] {
  const rng = seed !== undefined ? seedrandom(String(seed)) : Math.random;
  const result: Shape[] = [];

  for (let i = 0; i < count; i++) {
    const index = Math.floor(rng() * SHAPES.length);
    const def = SHAPES[index];
    const shade = SHADE_IDS[Math.floor(rng() * SHADE_IDS.length)] ?? 'rose';
    result.push({
      id: def.id,
      cells: def.cells.map(c => ({ row: c.row, col: c.col })),
      shade,
    });
  }

  return result;
}
