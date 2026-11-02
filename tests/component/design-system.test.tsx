import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { lightTheme, darkTheme } from '../../src/config/theme';
import { TopBarCounter } from '../../src/components/TopBarCounter';
import { AvatarWithLevelBadge } from '../../src/components/AvatarWithLevelBadge';
import { PriceButton } from '../../src/components/PriceButton';
import { RewardChip } from '../../src/components/RewardChip';
import { ProgressTrack } from '../../src/components/ProgressTrack';

describe('Design System (Phase 2)', () => {
  it('has correctly defined Glam Day and Glam Night color tokens', () => {
    expect(lightTheme.name).toBe('Glam Day');
    expect(lightTheme.boardFrame).toBe('#6FADD4');
    expect(lightTheme.boardCheckerA).toBe('#96BAEB');
    expect(lightTheme.boardCheckerB).toBe('#A9C6F2');
    expect(lightTheme.goldAccent).toBe('#F5B53C');
    expect(lightTheme.success).toBe('#3FBF4F');
    expect(lightTheme.energy).toBe('#3DA9FC');

    expect(darkTheme.name).toBe('Glam Night');
    expect(darkTheme.bgPrimary).toBe('#140E26');
    expect(darkTheme.bgSurface).toBe('#231A45');
    expect(darkTheme.boardFrame).toBe('#3D5E86');
    expect(darkTheme.boardCheckerA).toBe('#2C3A66');
    expect(darkTheme.boardCheckerB).toBe('#35467A');
  });

  it('renders TopBarCounter for energy with max value and timer text', () => {
    render(
      <TopBarCounter
        type="energy"
        value={24}
        maxValue={30}
        timerText="08:42"
        onPlusClick={() => {}}
      />
    );
    expect(screen.getByText('24/30')).toBeDefined();
    expect(screen.getByText('08:42')).toBeDefined();
    expect(screen.getByLabelText('Add energy')).toBeDefined();
  });

  it('renders AvatarWithLevelBadge with correct level number', () => {
    render(<AvatarWithLevelBadge level={7} name="Anaya" />);
    expect(screen.getByText('7')).toBeDefined();
  });

  it('renders PriceButton with label and formatted price', () => {
    render(<PriceButton label="Unlock" price="₹99" variant="green" />);
    expect(screen.getByText('Unlock')).toBeDefined();
    expect(screen.getByText('(₹99)')).toBeDefined();
  });

  it('renders RewardChip with reward amount', () => {
    render(<RewardChip type="coins" amount={500} />);
    expect(screen.getByText('+500')).toBeDefined();
    expect(screen.getByText('🪙')).toBeDefined();
  });

  it('renders ProgressTrack with correct milestone targets', () => {
    render(
      <ProgressTrack
        current={250}
        max={1000}
        milestones={[
          { target: 40 },
          { target: 100 },
          { target: 250 },
          { target: 550 },
          { target: 800 },
          { target: 1000 },
        ]}
      />
    );
    expect(screen.getByText('40')).toBeDefined();
    expect(screen.getByText('100')).toBeDefined();
    expect(screen.getByText('250')).toBeDefined();
    expect(screen.getByText('550')).toBeDefined();
    expect(screen.getByText('800')).toBeDefined();
    expect(screen.getByText('1000')).toBeDefined();
  });
});
