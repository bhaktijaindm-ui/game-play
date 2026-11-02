import { describe, it, expect } from 'vitest';
import {
  createGoal,
  updateGoals,
  calculateStars,
  checkCompletion,
  getGoalDescription,
} from '../../src/game/goals';
import type { Goal, ClearResult, ClearedLine } from '../../src/types';

describe('Goals Logic Unit Tests', () => {
  const dummyLine = (dominantShade = 'rose', isPure = false): ClearedLine => ({
    type: 'row',
    index: 0,
    shades: Array(8).fill(dominantShade),
    dominantShade,
    isPure,
    pureShade: isPure ? dominantShade : null,
    zone: 'eyes',
  });

  it('createGoal initializes correctly', () => {
    const lineGoal = createGoal('clearLines', 5);
    expect(lineGoal.id).toBe('clearLines_5');
    expect(lineGoal.type).toBe('clearLines');
    expect(lineGoal.target).toBe(5);
    expect(lineGoal.current).toBe(0);
    expect(lineGoal.completed).toBe(false);
    expect(lineGoal.description).toContain('5');

    const colorGoal = createGoal('clearColor', 3, 'rose');
    expect(colorGoal.id).toBe('clearColor_3_rose');
    expect(colorGoal.type).toBe('clearColor');
    expect(colorGoal.shade).toBe('rose');
    expect(colorGoal.target).toBe(3);
    expect(colorGoal.current).toBe(0);
    expect(colorGoal.completed).toBe(false);

    expect(getGoalDescription('combo', 4)).toBe('Achieve a 4x combo');
  });

  it('updateGoals tracks clearColor correctly', () => {
    const goals: Goal[] = [createGoal('clearColor', 2, 'gold')];

    // Clear event with 1 matching line and 1 non-matching line
    const clearResult: ClearResult = {
      lines: [dummyLine('gold', true), dummyLine('berry', false)],
      rowsCleared: [0],
      colsCleared: [1],
      totalLines: 2,
      hasPureShade: true,
      combo: 1,
      score: 400,
    };

    const updated = updateGoals(goals, clearResult);
    expect(updated[0].current).toBe(1);
    expect(updated[0].completed).toBe(false);

    // Another clear event with matching line completes the goal
    const secondClear: ClearResult = {
      lines: [dummyLine('gold', false)],
      rowsCleared: [2],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: false,
      combo: 2,
      score: 200,
    };

    const finished = updateGoals(updated, secondClear);
    expect(finished[0].current).toBe(2);
    expect(finished[0].completed).toBe(true);
  });

  it('updateGoals tracks clearLines', () => {
    const goals: Goal[] = [createGoal('clearLines', 4)];

    const clearResult: ClearResult = {
      lines: [dummyLine(), dummyLine(), dummyLine()],
      rowsCleared: [0, 1, 2],
      colsCleared: [],
      totalLines: 3,
      hasPureShade: false,
      combo: 1,
      score: 300,
    };

    const updated = updateGoals(goals, clearResult);
    expect(updated[0].current).toBe(3);
    expect(updated[0].completed).toBe(false);

    // One more line cleared finishes the goal
    const finishClear: ClearResult = {
      lines: [dummyLine()],
      rowsCleared: [3],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: false,
      combo: 2,
      score: 200,
    };

    const finished = updateGoals(updated, finishClear);
    expect(finished[0].current).toBe(4);
    expect(finished[0].completed).toBe(true);
  });

  it('updateGoals tracks combo', () => {
    const goals: Goal[] = [createGoal('combo', 3)];

    // Combo of 2
    const clearResult1: ClearResult = {
      lines: [dummyLine()],
      rowsCleared: [0],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: false,
      combo: 2,
      score: 200,
    };

    const step1 = updateGoals(goals, clearResult1);
    expect(step1[0].current).toBe(2);
    expect(step1[0].completed).toBe(false);

    // Combo dropped to 1: current highest achieved combo must be preserved
    const clearResult2: ClearResult = {
      lines: [dummyLine()],
      rowsCleared: [1],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: false,
      combo: 1,
      score: 100,
    };

    const step2 = updateGoals(step1, clearResult2);
    expect(step2[0].current).toBe(2);
    expect(step2[0].completed).toBe(false);

    // Combo reaches target of 3
    const clearResult3: ClearResult = {
      lines: [dummyLine()],
      rowsCleared: [2],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: false,
      combo: 3,
      score: 300,
    };

    const step3 = updateGoals(step2, clearResult3);
    expect(step3[0].current).toBe(3);
    expect(step3[0].completed).toBe(true);
  });

  it('updateGoals tracks score', () => {
    const goals: Goal[] = [createGoal('score', 1000)];

    const clearResult: ClearResult = {
      lines: [dummyLine()],
      rowsCleared: [0],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: false,
      combo: 1,
      score: 600,
    };

    const updated = updateGoals(goals, clearResult);
    expect(updated[0].current).toBe(600);
    expect(updated[0].completed).toBe(false);

    const finishClear: ClearResult = {
      lines: [dummyLine()],
      rowsCleared: [1],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: false,
      combo: 2,
      score: 500,
    };

    const finished = updateGoals(updated, finishClear);
    expect(finished[0].current).toBe(1000); // capped at target
    expect(finished[0].completed).toBe(true);
  });

  it('updateGoals tracks pureShade', () => {
    const goals: Goal[] = [createGoal('pureShade', 2)];

    // 1 pure line, 1 non-pure line
    const clearResult: ClearResult = {
      lines: [dummyLine('rose', true), dummyLine('gold', false)],
      rowsCleared: [0, 1],
      colsCleared: [],
      totalLines: 2,
      hasPureShade: true,
      combo: 1,
      score: 400,
    };

    const updated = updateGoals(goals, clearResult);
    expect(updated[0].current).toBe(1);
    expect(updated[0].completed).toBe(false);

    // 1 more pure line
    const secondClear: ClearResult = {
      lines: [dummyLine('berry', true)],
      rowsCleared: [2],
      colsCleared: [],
      totalLines: 1,
      hasPureShade: true,
      combo: 2,
      score: 400,
    };

    const finished = updateGoals(updated, secondClear);
    expect(finished[0].current).toBe(2);
    expect(finished[0].completed).toBe(true);
  });

  it('checkCompletion detects all completed', () => {
    const g1: Goal = { ...createGoal('clearLines', 2), current: 2, completed: true };
    const g2: Goal = { ...createGoal('combo', 2), current: 2, completed: true };

    const completeResult = checkCompletion([g1, g2], 3000);
    expect(completeResult.allCompleted).toBe(true);

    const incompleteGoal: Goal = { ...createGoal('score', 1000), current: 200, completed: false };
    const partialResult = checkCompletion([g1, incompleteGoal], 3000);
    expect(partialResult.allCompleted).toBe(false);
  });

  it('calculateStars returns correct stars', () => {
    const thresholds: [number, number, number] = [1000, 2500, 5000];

    const completedGoals: Goal[] = [
      { ...createGoal('clearLines', 1), current: 1, completed: true },
    ];
    const incompleteGoals: Goal[] = [
      { ...createGoal('clearLines', 5), current: 1, completed: false },
    ];

    // Incomplete goals: max 1 star unless score reaches max threshold
    expect(calculateStars(incompleteGoals, 500, thresholds)).toBe(1);
    expect(calculateStars(incompleteGoals, 2500, thresholds)).toBe(1);
    expect(calculateStars(incompleteGoals, 5000, thresholds)).toBe(2);

    // Completed goals with different scores
    expect(calculateStars(completedGoals, 500, thresholds)).toBe(1);
    expect(calculateStars(completedGoals, 1000, thresholds)).toBe(1);
    expect(calculateStars(completedGoals, 2500, thresholds)).toBe(2);
    expect(calculateStars(completedGoals, 4999, thresholds)).toBe(2);
    expect(calculateStars(completedGoals, 5000, thresholds)).toBe(3);
    expect(calculateStars(completedGoals, 10000, thresholds)).toBe(3);
  });
});
