import type {
  Board,
  BoardCell,
  Shape,
  FaceZone,
  ShadeId,
  LineType,
  ClearedLine,
} from '../types';

export const BOARD_SIZE = 8;

/**
 * Creates an empty 8x8 board filled with null.
 */
export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

/**
 * Checks whether a shape can be placed on the board at the given top-left position.
 * Verifies bounds and ensures no overlapping with existing filled cells.
 */
export function canPlace(
  board: Board,
  shape: Shape,
  position: { row: number; col: number }
): boolean {
  for (const cell of shape.cells) {
    const targetRow = position.row + cell.row;
    const targetCol = position.col + cell.col;

    // Bounds check
    if (
      targetRow < 0 ||
      targetRow >= BOARD_SIZE ||
      targetCol < 0 ||
      targetCol >= BOARD_SIZE
    ) {
      return false;
    }

    // Overlap check
    if (board[targetRow][targetCol] !== null) {
      return false;
    }
  }

  return true;
}

/**
 * Places a shape on the board at the specified position.
 * Returns a new immutable copy of the board.
 */
export function placeShape(
  board: Board,
  shape: Shape,
  position: { row: number; col: number }
): Board {
  const newBoard: Board = board.map(row => [...row]);
  const cellData: BoardCell = { shade: shape.shade ?? 'rose' };

  for (const cell of shape.cells) {
    const targetRow = position.row + cell.row;
    const targetCol = position.col + cell.col;
    newBoard[targetRow][targetCol] = { ...cellData };
  }

  return newBoard;
}

/**
 * Finds all completely filled rows and columns on the board.
 */
export function findFullLines(board: Board): { rows: number[]; cols: number[] } {
  const rows: number[] = [];
  const cols: number[] = [];

  // Check rows
  for (let r = 0; r < BOARD_SIZE; r++) {
    let full = true;
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) {
      rows.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < BOARD_SIZE; c++) {
    let full = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (board[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) {
      cols.push(c);
    }
  }

  return { rows, cols };
}

/**
 * Clears the specified rows and columns simultaneously.
 * Returns a new immutable copy of the board.
 */
export function clearLines(board: Board, rows: number[], cols: number[]): Board {
  const newBoard: Board = board.map(row => [...row]);
  const rowSet = new Set(rows);
  const colSet = new Set(cols);

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (rowSet.has(r) || colSet.has(c)) {
        newBoard[r][c] = null;
      }
    }
  }

  return newBoard;
}

/**
 * Returns the facial makeup zone for a given row index.
 * Rows 0-2 = eyes, 3-5 = cheeks, 6-7 = lips.
 */
export function getZoneForRow(row: number): FaceZone {
  if (row <= 2) {
    return 'eyes';
  }
  if (row <= 5) {
    return 'cheeks';
  }
  return 'lips';
}

/**
 * Returns all zones a column crosses based on specified row indices.
 */
export function getZonesForColumn(
  col: number,
  rows: number[] = [0, 1, 2, 3, 4, 5, 6, 7]
): FaceZone[] {
  void col;
  const zoneOrder: FaceZone[] = ['eyes', 'cheeks', 'lips'];
  const presentZones = new Set<FaceZone>();

  for (const r of rows) {
    presentZones.add(getZoneForRow(r));
  }

  return zoneOrder.filter(z => presentZones.has(z));
}

export function getCellShade(cell: BoardCell): ShadeId | null {
  if (!cell) return null;
  if (typeof cell === 'string') return cell;
  if (typeof cell === 'object' && 'shade' in cell) return cell.shade as ShadeId;
  return null;
}

/**
 * Checks whether a specified row or column is monochrome (all filled cells share the exact same shade).
 */
export function isLineMonochrome(
  board: Board,
  type: LineType,
  index: number
): { isPure: boolean; shade: ShadeId | null } {
  const shades: ShadeId[] = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    const cell = type === 'row' ? board[index][i] : board[i][index];
    const shade = getCellShade(cell);
    if (shade === null) {
      return { isPure: false, shade: null };
    }
    shades.push(shade);
  }

  if (shades.length === 0) {
    return { isPure: false, shade: null };
  }

  const firstShade = shades[0];
  const isPure = shades.every(s => s === firstShade);

  return {
    isPure,
    shade: isPure ? firstShade : null,
  };
}

/**
 * Checks if ANY of the given shapes can fit ANYWHERE on the board.
 */
export function canAnyShapeFit(
  board: Board,
  shapes: (Shape | null)[]
): boolean {
  for (const shape of shapes) {
    if (!shape) continue;

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (canPlace(board, shape, { row: r, col: c })) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Finds all valid placements for a specific shape on the board.
 */
export function findValidPositions(
  board: Board,
  shape: Shape
): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (canPlace(board, shape, { row: r, col: c })) {
        positions.push({ row: r, col: c });
      }
    }
  }

  return positions;
}

/**
 * Returns the count of filled cells on the board (0 to 64).
 */
export function getBoardOccupancy(board: Board): number {
  let count = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== null) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Helper to inspect and extract full line metadata before clearing.
 */
export function extractClearedLines(
  board: Board,
  rows: number[],
  cols: number[]
): ClearedLine[] {
  const lines: ClearedLine[] = [];

  for (const r of rows) {
    const shades: ShadeId[] = [];
    const counts: Record<string, number> = {};

    for (let c = 0; c < BOARD_SIZE; c++) {
      const shade = getCellShade(board[r][c]) ?? 'rose';
      shades.push(shade);
      counts[shade] = (counts[shade] ?? 0) + 1;
    }

    let dominantShade: ShadeId = shades[0];
    let maxCount = 0;
    for (const [shadeKey, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantShade = shadeKey as ShadeId;
      }
    }

    const isPure = shades.length === BOARD_SIZE && shades.every(s => s === shades[0]);

    lines.push({
      type: 'row',
      index: r,
      shades,
      dominantShade,
      isPure,
      pureShade: isPure ? dominantShade : null,
      zone: getZoneForRow(r),
      zones: [getZoneForRow(r)],
    });
  }

  for (const c of cols) {
    const shades: ShadeId[] = [];
    const counts: Record<string, number> = {};

    for (let r = 0; r < BOARD_SIZE; r++) {
      const shade = getCellShade(board[r][c]) ?? 'rose';
      shades.push(shade);
      counts[shade] = (counts[shade] ?? 0) + 1;
    }

    let dominantShade: ShadeId = shades[0];
    let maxCount = 0;
    for (const [shadeKey, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantShade = shadeKey as ShadeId;
      }
    }

    const isPure = shades.length === BOARD_SIZE && shades.every(s => s === shades[0]);
    const columnZones = getZonesForColumn(c, [0, 1, 2, 3, 4, 5, 6, 7]);

    lines.push({
      type: 'col',
      index: c,
      shades,
      dominantShade,
      isPure,
      pureShade: isPure ? dominantShade : null,
      zone: columnZones[1] ?? 'cheeks', // middle zone fallback
      zones: columnZones,
    });
  }

  return lines;
}
