import { describe, it, expect } from 'vitest';
import { HANDCRAFTED_LEVELS, getLevelData } from '../../src/game/levels';

describe('Handcrafted Levels & Customer Orders (Phase 4)', () => {
  it('has exactly 60 handcrafted levels in levels.json', () => {
    expect(HANDCRAFTED_LEVELS).toHaveLength(60);

    HANDCRAFTED_LEVELS.forEach((level, idx) => {
      expect(level.level).toBe(idx + 1);
      expect(level.title.length).toBeGreaterThan(0);
      expect(level.maxMoves).toBeGreaterThanOrEqual(15);
      expect(level.customers).toHaveLength(3);
      expect(level.starThresholds).toHaveLength(3);
      expect(level.starThresholds[0]).toBeLessThan(level.starThresholds[1]);
      expect(level.starThresholds[1]).toBeLessThan(level.starThresholds[2]);

      // Verify each customer order has valid goals
      level.customers.forEach((order) => {
        expect(order.customerName.length).toBeGreaterThan(0);
        expect(order.description.length).toBeGreaterThan(0);
        expect(order.rewardCoins).toBeGreaterThan(0);
        expect(order.target).toBeGreaterThan(0);
        expect(['clearLines', 'clearColor', 'pureShade', 'combo', 'score']).toContain(
          order.goalType
        );
      });
    });
  });

  it('getLevelData retrieves specific levels and falls back to procedural beyond 60', () => {
    const lvl1 = getLevelData(1);
    expect(lvl1.level).toBe(1);
    expect(lvl1.customers).toHaveLength(3);

    const lvl60 = getLevelData(60);
    expect(lvl60.level).toBe(60);

    const lvl75 = getLevelData(75);
    expect(lvl75.level).toBe(75);
    expect(lvl75.difficulty).toBe('expert');
    expect(lvl75.customers).toHaveLength(3);
  });
});
