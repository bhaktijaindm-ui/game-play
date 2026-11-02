import type {
  FaceRecipe,
  ClearedLine,
  ClearResult,
  ShadeApplication,
  FaceZone,
} from '../types';

/**
 * Creates a clean, empty FaceRecipe without any makeup applications.
 */
export function createEmptyRecipe(): FaceRecipe {
  return {
    eyes: [],
    cheeks: [],
    lips: [],
  };
}

/**
 * Calculates current visual makeup opacity/intensity (0 to 1) based on
 * stacked shade applications in a zone.
 */
export function getMakeupIntensity(applications: ShadeApplication[]): number {
  if (!applications || applications.length === 0) {
    return 0;
  }

  const rawSum = applications.reduce(
    (sum, app) => sum + (app.intensity ?? 0.25),
    0
  );

  return Math.min(1, Math.round(rawSum * 100) / 100);
}

/**
 * Applies a single cleared line to the corresponding facial zone(s) in the FaceRecipe.
 * Pure shade lines contribute stronger intensity.
 * Returns a new immutable FaceRecipe.
 */
export function applyLineToFace(
  recipe: FaceRecipe,
  line: ClearedLine
): FaceRecipe {
  const chosenShade =
    line.pureShade ?? line.dominantShade ?? line.shades?.[0] ?? 'rose';
  const intensity = line.isPure ? 0.4 : 0.25;

  const targetZones: FaceZone[] =
    line.type === 'col' && line.zones && line.zones.length > 0
      ? line.zones
      : [line.zone];

  const updatedRecipe: FaceRecipe = {
    eyes: [...recipe.eyes],
    cheeks: [...recipe.cheeks],
    lips: [...recipe.lips],
  };

  const now = Date.now();

  for (const zone of targetZones) {
    const application: ShadeApplication = {
      shade: chosenShade,
      zone,
      intensity,
      appliedAt: now,
    };

    updatedRecipe[zone].push(application);
  }

  return updatedRecipe;
}

/**
 * Processes all cleared lines in a ClearResult and updates the FaceRecipe.
 * Returns a new immutable FaceRecipe.
 */
export function applyClearToFace(
  recipe: FaceRecipe,
  clearResult: ClearResult
): FaceRecipe {
  return clearResult.lines.reduce(
    (currentRecipe, line) => applyLineToFace(currentRecipe, line),
    recipe
  );
}
