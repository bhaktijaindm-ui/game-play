import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useTheme, type Theme } from '../hooks/useTheme.ts';
import { useReducedMotion, setReducedMotionPreference } from '../hooks/useReducedMotion.ts';
import { useSound } from '../hooks/useSound.ts';
import { useHaptics } from '../hooks/useHaptics.ts';

import type { UserProfile } from '../types';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'victory';

export interface GoalItem {
  id: string;
  type: string;
  label: string;
  current: number;
  target: number;
  color?: string;
  completed: boolean;
}

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  moves: number;
  maxMoves: number;
  stars: 0 | 1 | 2 | 3;
  goals: GoalItem[];
}

export interface GameContextValue {
  // Game State
  gameState: GameState;
  userProfile: UserProfile;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;

  // Preferences
  soundEnabled: boolean;
  toggleSound: () => void;
  hapticsEnabled: boolean;
  toggleHaptics: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;

  // Game Actions
  startGame: (level?: number, goals?: GoalItem[], maxMoves?: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (victory: boolean) => void;
  restartGame: () => void;
  addScore: (points: number) => void;
  decrementMoves: () => void;
  updateGoalProgress: (goalId: string, delta?: number) => void;
  setStars: (stars: 0 | 1 | 2 | 3) => void;

  // Currency & Profile
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const PROFILE_STORAGE_KEY = 'glam_user_profile';

const initialProfile: UserProfile = {
  uid: 'player_1',
  id: 'player_1',
  name: 'Glam Player',
  displayName: 'Glam Artist',
  email: 'player@glamblocks.game',
  coins: 500,
  gems: 20,
  level: 1,
  xp: 0,
  bestScore: 18450,
  highScore: 18450,
  streakDay: 1,
  streakDays: 1,
  faceModel: '1',
  adsRemoved: false,
  glamPassUntil: null,
  palette: { pans: [], completed: false },
  portfolio: [],
  unlockedLooks: [],
  equippedLook: null,
  marketingConsent: false,
  consentTimestamp: Date.now(),
  country: 'IN',
  theme: 'system',
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  colorBlind: false,
};

function getStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return initialProfile;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      return { ...initialProfile, ...JSON.parse(raw) };
    }
  } catch {
    // Return fallback on corrupt JSON
  }
  return initialProfile;
}

const defaultGameState: GameState = {
  status: 'idle',
  score: 0,
  level: 1,
  moves: 25,
  maxMoves: 25,
  stars: 0,
  goals: [
    { id: 'g1', type: 'pink-blocks', label: 'Pink Gems', current: 0, target: 12, color: '#ec4899', completed: false },
    { id: 'g2', type: 'purple-blocks', label: 'Purple Gems', current: 0, target: 10, color: '#8b5cf6', completed: false },
  ],
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme, isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const { isSoundEnabled, setSoundEnabled } = useSound();
  const { isHapticsEnabled, setHapticsEnabled } = useHaptics();

  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredProfile);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  // Sync profile to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(!isSoundEnabled);
  }, [isSoundEnabled, setSoundEnabled]);

  const toggleHaptics = useCallback(() => {
    setHapticsEnabled(!isHapticsEnabled);
  }, [isHapticsEnabled, setHapticsEnabled]);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotionPreference(!reducedMotion);
  }, [reducedMotion]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const addCoins = useCallback((amount: number) => {
    if (amount <= 0) return;
    setUserProfile((prev) => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    if (amount <= 0) return false;
    let success = false;
    setUserProfile((prev) => {
      if (prev.coins >= amount) {
        success = true;
        return { ...prev, coins: prev.coins - amount };
      }
      return prev;
    });
    return success;
  }, []);

  const addGems = useCallback((amount: number) => {
    if (amount <= 0) return;
    setUserProfile((prev) => ({ ...prev, gems: prev.gems + amount }));
  }, []);

  const spendGems = useCallback((amount: number): boolean => {
    if (amount <= 0) return false;
    let success = false;
    setUserProfile((prev) => {
      if (prev.gems >= amount) {
        success = true;
        return { ...prev, gems: prev.gems - amount };
      }
      return prev;
    });
    return success;
  }, []);

  const startGame = useCallback((level = 1, goals?: GoalItem[], maxMoves = 25) => {
    setGameState({
      status: 'playing',
      score: 0,
      level,
      moves: maxMoves,
      maxMoves,
      stars: 0,
      goals: goals ?? [
        { id: 'g1', type: 'pink-blocks', label: 'Pink Gems', current: 0, target: 10 + level * 2, color: '#ec4899', completed: false },
        { id: 'g2', type: 'gold-blocks', label: 'Gold Bars', current: 0, target: 6 + level, color: '#f59e0b', completed: false },
      ],
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState((prev) => {
      if (prev.status === 'playing') {
        return { ...prev, status: 'paused' };
      }
      return prev;
    });
  }, []);

  const resumeGame = useCallback(() => {
    setGameState((prev) => {
      if (prev.status === 'paused') {
        return { ...prev, status: 'playing' };
      }
      return prev;
    });
  }, []);

  const endGame = useCallback((victory: boolean) => {
    setGameState((prev) => {
      const finalStatus: GameStatus = victory ? 'victory' : 'gameover';
      const earnedStars = victory ? (prev.moves > 10 ? 3 : prev.moves > 5 ? 2 : 1) : 0;
      return {
        ...prev,
        status: finalStatus,
        stars: (earnedStars as 0 | 1 | 2 | 3),
      };
    });

    if (victory) {
      setUserProfile((prev) => {
        const nextScore = Math.max(prev.highScore ?? 0, gameState.score);
        return {
          ...prev,
          level: Math.max(prev.level, gameState.level + 1),
          highScore: nextScore,
          coins: prev.coins + 50,
          xp: (prev.xp ?? 0) + 100,
        };
      });
    }
  }, [gameState.score, gameState.level]);

  const restartGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: 'playing',
      score: 0,
      moves: prev.maxMoves,
      stars: 0,
      goals: prev.goals.map((g) => ({ ...g, current: 0, completed: false })),
    }));
  }, []);

  const addScore = useCallback((points: number) => {
    if (points <= 0) return;
    setGameState((prev) => {
      const newScore = prev.score + points;
      return { ...prev, score: newScore };
    });
  }, []);

  const decrementMoves = useCallback(() => {
    setGameState((prev) => {
      const remainingMoves = Math.max(0, prev.moves - 1);
      const allGoalsMet = prev.goals.every((g) => g.completed);
      let status: GameStatus = prev.status;

      if (allGoalsMet) {
        status = 'victory';
      } else if (remainingMoves === 0) {
        status = 'gameover';
      }

      return {
        ...prev,
        moves: remainingMoves,
        status,
      };
    });
  }, []);

  const updateGoalProgress = useCallback((goalId: string, delta = 1) => {
    setGameState((prev) => {
      const updatedGoals = prev.goals.map((goal) => {
        if (goal.id !== goalId) return goal;
        const newCurrent = Math.min(goal.target, goal.current + delta);
        return {
          ...goal,
          current: newCurrent,
          completed: newCurrent >= goal.target,
        };
      });

      const allMet = updatedGoals.every((g) => g.completed);

      return {
        ...prev,
        goals: updatedGoals,
        status: allMet ? 'victory' : prev.status,
      };
    });
  }, []);

  const setStars = useCallback((stars: 0 | 1 | 2 | 3) => {
    setGameState((prev) => ({ ...prev, stars }));
  }, []);

  const value = useMemo<GameContextValue>(() => ({
    gameState,
    userProfile,
    theme,
    setTheme,
    isDark,
    soundEnabled: isSoundEnabled,
    toggleSound,
    hapticsEnabled: isHapticsEnabled,
    toggleHaptics,
    reducedMotion,
    toggleReducedMotion,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    restartGame,
    addScore,
    decrementMoves,
    updateGoalProgress,
    setStars,
    addCoins,
    spendCoins,
    addGems,
    spendGems,
    updateProfile,
  }), [
    gameState,
    userProfile,
    theme,
    setTheme,
    isDark,
    isSoundEnabled,
    toggleSound,
    isHapticsEnabled,
    toggleHaptics,
    reducedMotion,
    toggleReducedMotion,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    restartGame,
    addScore,
    decrementMoves,
    updateGoalProgress,
    setStars,
    addCoins,
    spendCoins,
    addGems,
    spendGems,
    updateProfile,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
