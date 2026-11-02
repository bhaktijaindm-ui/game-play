import { describe, it, expect, beforeAll } from 'vitest';
import { generateLookCard } from '../../src/services/share';
import { getDailyBriefSeed, spawnDailyShapes } from '../../src/game/spawning';
import { createEmptyBoard } from '../../src/game/board';
import { SEASONS_CONFIG, TIMED_EVENTS } from '../../src/config/events.config';
import type { FaceRecipe } from '../../src/types';

describe('Phase 5: Meta Features & Social Sharing', () => {
  beforeAll(() => {
    // Mock HTMLCanvasElement.prototype.getContext for jsdom
    HTMLCanvasElement.prototype.getContext = (() => {
      const gradientMock = {
        addColorStop: () => {},
      };
      return {
        save: () => {},
        restore: () => {},
        translate: () => {},
        scale: () => {},
        beginPath: () => {},
        ellipse: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        moveTo: () => {},
        lineTo: () => {},
        quadraticCurveTo: () => {},
        fillRect: () => {},
        fillText: () => {},
        roundRect: () => {},
        createLinearGradient: () => gradientMock,
        createRadialGradient: () => gradientMock,
      } as unknown as CanvasRenderingContext2D;
    }) as any;
  });

  const dummyRecipe: FaceRecipe = {
    eyes: [{ shade: 'rose', opacity: 0.8, zone: 'eyes' }],
    cheeks: [{ shade: 'peach', opacity: 0.6, zone: 'cheeks' }],
    lips: [{ shade: 'ruby', opacity: 0.9, zone: 'lips' }],
  };

  it('generates 1080x1080 canvas for post format', async () => {
    const canvas = await generateLookCard(dummyRecipe, '1', 2450, 'Ananya', 'post', false);
    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1080);
  });

  it('generates 1080x1920 canvas for stories format', async () => {
    const canvas = await generateLookCard(dummyRecipe, '1', 3200, 'Ananya', 'stories', false);
    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1920);
  });

  it('respects hideName parameter during look card generation', async () => {
    const canvas = await generateLookCard(dummyRecipe, '1', 1500, 'PrivatePlayer', 'post', true);
    expect(canvas).toBeDefined();
    expect(canvas.width).toBe(1080);
  });

  it('produces deterministic seeds for Daily Beauty Brief', () => {
    const seed1 = getDailyBriefSeed('2026-11-03');
    const seed2 = getDailyBriefSeed('2026-11-03');
    const seedOther = getDailyBriefSeed('2026-11-04');

    expect(seed1).toBe(seed2);
    expect(seed1).not.toBe(seedOther);
  });

  it('spawns deterministic daily shapes for the same move index', () => {
    const board = createEmptyBoard();
    const shapesA = spawnDailyShapes('2026-11-03', 0, board);
    const shapesB = spawnDailyShapes('2026-11-03', 0, board);
    const shapesNext = spawnDailyShapes('2026-11-03', 1, board);

    expect(shapesA.map((s) => s.id)).toEqual(shapesB.map((s) => s.id));
    expect(shapesA.map((s) => s.shade)).toEqual(shapesB.map((s) => s.shade));
    expect(shapesA.length).toBe(3);
    expect(shapesNext.length).toBe(3);
  });

  it('validates seasonal events and timed events configuration', () => {
    expect(SEASONS_CONFIG.length).toBe(4);
    const eventIds = TIMED_EVENTS.map((e) => e.id);
    expect(eventIds).toContain('festival_match');
    expect(eventIds).toContain('bridal_rush');
    expect(eventIds).toContain('palette_week');
  });
});
