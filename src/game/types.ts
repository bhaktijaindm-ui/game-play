/**
 * Glam Blocks - Game Logic Types & Definitions
 */

export type CellValue = {
  itemId: string; // 'lipstick', 'eyeshadow', etc.
  color: string;
  clearing?: boolean; // For clear sparkle animations
} | null;

export type BoardMatrix = CellValue[][]; // 8x8

export interface ShapeDefinition {
  id: string;
  name: string;
  matrix: number[][]; // 1 for filled cell, 0 for empty
  rows: number;
  cols: number;
  size: number; // Count of filled cells
  category: 'small' | 'medium' | 'large';
}

export interface TrayShape {
  instanceId: string;
  shape: ShapeDefinition;
  itemId: string;
  color: string;
  canPlaceOnCurrentBoard: boolean;
}

export interface MoveResult {
  valid: boolean;
  newBoard: BoardMatrix;
  placedCellsCount: number;
  linesCleared: number;
  clearedRowIndices: number[];
  clearedColIndices: number[];
  scoreGained: number;
  comboCount: number;
  isBoardCleared: boolean;
}

export interface SavedGameState {
  board: BoardMatrix;
  tray: (TrayShape | null)[];
  score: number;
  bestScore: number;
  combo: number;
  movesCount: number;
  lastScoreTime: number;
  historyState: {
    board: BoardMatrix;
    tray: (TrayShape | null)[];
    score: number;
    combo: number;
  } | null;
}
