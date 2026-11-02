import type {
  Goal,
  GoalType,
  GoalProgress,
  ClearResult,
  ShadeId,
} from '../types';

/**
 * Returns a human-readable description for a given goal.
 */
export function getGoalDescription(
  type: GoalType,
  target: number,
  shade?: ShadeId
): string {
  switch (type) {
    case 'clearColor':
      return `Clear ${target} line${target > 1 ? 's' : ''} in ${shade ?? 'matching'} shade`;
    case 'clearLines':
      return `Clear ${target} line${target > 1 ? 's' : ''}`;
    case 'combo':
      return `Achieve a ${target}x combo`;
    case 'score':
      return `Reach ${target.toLocaleString()} points`;
    case 'pureShade':
      return `Clear ${target} Pure Shade line${target > 1 ? 's' : ''}`;
    default:
      return `Complete objective (${target})`;
  }
}

/**
 * Creates a new Goal instance.
 */
export function createGoal(
  type: GoalType,
  target: number,
  shade?: ShadeId
): Goal {
  return {
    id: `${type}_${target}${shade ? '_' + shade : ''}`,
    type,
    target,
    current: 0,
    completed: false,
    shade,
    description: getGoalDescription(type, target, shade),
  };
}

/**
 * Updates goal progress after a line clear event.
 */
export function updateGoals(
  goals: Goal[],
  clearResult: ClearResult
): Goal[] {
  return goals.map(goal => {
    let newCurrent = goal.current;

    switch (goal.type) {
      case 'clearColor': {
        const matchingLines = clearResult.lines.filter(
          line =>
            line.dominantShade === goal.shade ||
            (line.pureShade !== null && line.pureShade === goal.shade)
        ).length;
        newCurrent = Math.min(goal.target, goal.current + matchingLines);
        break;
      }

      case 'clearLines': {
        newCurrent = Math.min(
          goal.target,
          goal.current + (clearResult.totalLines ?? clearResult.lines?.length ?? 0)
        );
        break;
      }

      case 'combo': {
        newCurrent = Math.max(goal.current, clearResult.combo);
        break;
      }

      case 'score': {
        newCurrent = Math.min(goal.target, goal.current + clearResult.score);
        break;
      }

      case 'pureShade': {
        const pureLines = clearResult.lines.filter(line => line.isPure).length;
        newCurrent = Math.min(goal.target, goal.current + pureLines);
        break;
      }
    }

    const completed = newCurrent >= goal.target;

    return {
      ...goal,
      current: newCurrent,
      completed,
    };
  });
}

/**
 * Calculates star rating (1, 2, or 3) based on goal completion and score thresholds.
 */
export function calculateStars(
  goals: Goal[],
  score: number,
  starThresholds: [number, number, number] = [1000, 2500, 5000]
): 1 | 2 | 3 {
  const allCompleted = goals.length === 0 || goals.every(g => g.completed);

  if (allCompleted && score >= starThresholds[2]) {
    return 3;
  }
  if ((allCompleted && score >= starThresholds[1]) || score >= starThresholds[2]) {
    return 2;
  }
  return 1;
}

/**
 * Evaluates the completion status and star rating of all goals.
 */
export function checkCompletion(
  goals: Goal[],
  score: number = 0,
  starThresholds: [number, number, number] = [1000, 2500, 5000]
): GoalProgress {
  const allCompleted = goals.length > 0 && goals.every(g => g.completed);
  const stars = calculateStars(goals, score, starThresholds);

  return {
    goals,
    allCompleted,
    stars,
  };
}
