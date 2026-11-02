import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameProvider } from '../../src/context/GameContext';
import { AdventureMapScreen } from '../../src/screens/AdventureMapScreen';
import { RenovationScreen } from '../../src/screens/RenovationScreen';
import { FestivalPassScreen } from '../../src/screens/FestivalPassScreen';
import { FestivalMatchScreen } from '../../src/screens/FestivalMatchScreen';
import { StoryDialogueOverlay } from '../../src/components/StoryDialogueOverlay';

describe('Phase 3 Screens & Flow', () => {
  it('renders AdventureMapScreen with regions and play level button', () => {
    render(
      <GameProvider>
        <AdventureMapScreen onNavigate={() => {}} />
      </GameProvider>
    );
    expect(screen.getByText('Rangpur Town Map')).toBeDefined();
    expect(screen.getAllByText('Salon Street').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Bridal Bazaar')).toBeDefined();
  });

  it('renders RenovationScreen with salon rooms and before/after toggle', () => {
    render(
      <GameProvider>
        <RenovationScreen onNavigate={() => {}} />
      </GameProvider>
    );
    expect(screen.getByText(/Salon Renovation/i)).toBeDefined();
    expect(screen.getByText('Before')).toBeDefined();
    expect(screen.getByText('After')).toBeDefined();
  });

  it('renders FestivalPassScreen with season countdown and nodes', () => {
    render(
      <GameProvider>
        <FestivalPassScreen onNavigate={() => {}} />
      </GameProvider>
    );
    expect(screen.getByText(/Diwali Gold Pass/i)).toBeDefined();
    expect(screen.getByText('Free Pass')).toBeDefined();
  });

  it('renders FestivalMatchScreen with mascots and swap counter', () => {
    render(
      <GameProvider>
        <FestivalMatchScreen onNavigate={() => {}} />
      </GameProvider>
    );
    expect(screen.getByText(/Festival Match/i)).toBeDefined();
    expect(screen.getByText('Gobi')).toBeDefined();
    expect(screen.getByText('Chikoo')).toBeDefined();
    expect(screen.getByText('Piku')).toBeDefined();
  });

  it('renders StoryDialogueOverlay with speaker and skippable controls', () => {
    const onComplete = vi.fn();
    render(
      <StoryDialogueOverlay
        sceneTitle="The Dusty Key"
        cards={[
          {
            id: 'c1',
            speaker: 'Anaya',
            characterId: 'anaya',
            expression: 'determined',
            text: 'Gulab Mahal Salon is back.',
          },
        ]}
        onComplete={onComplete}
      />
    );
    expect(screen.getByText('The Dusty Key')).toBeDefined();
    expect(screen.getByText('Anaya')).toBeDefined();
    expect(screen.getByText('Gulab Mahal Salon is back.')).toBeDefined();
    expect(screen.getByText(/Skip/i)).toBeDefined();
  });
});
