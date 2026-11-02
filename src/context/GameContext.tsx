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

  // Energy System (Max 30, 12 min regen)
  energy: number;
  maxEnergy: number;
  energyTimer: string;
  spendEnergy: (amount?: number) => boolean;
  addEnergy: (amount: number) => void;

  // Meta Game Progression
  upgradeRoom: (roomId: string, cost: number) => boolean;
  unlockRangPage: (pageId: number) => void;
  advanceStoryScene: () => void;
  claimDailyMilestone: (target: number) => void;
  claimPassNode: (nodeLevel: number, isGold: boolean) => void;
  buyGoldPass: () => boolean;

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
const ENERGY_REGEN_INTERVAL_MS = 12 * 60 * 1000; // 12 minutes in ms (720,000)

const initialProfile: UserProfile = {
  uid: 'player_1',
  id: 'player_1',
  name: 'Anaya Sharma',
  displayName: 'Anaya',
  email: 'anaya@gulabmahalsalon.com',
  coins: 850,
  gems: 35,
  level: 1,
  xp: 0,
  bestScore: 18450,
  highScore: 18450,
  streakDay: 1,
  streakDays: 1,
  faceModel: 'wheatish',
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

  // Meta System Initial Defaults
  energy: 30,
  maxEnergy: 30,
  energyUpdatedAt: Date.now(),
  rooms: { reception: 1 },
  unlockedRangPages: [1],
  storyChapter: 1,
  storyScene: 1,
  dailyTaskPoints: 40,
  claimedDailyMilestones: [],
  passLevel: 2,
  passXp: 350,
  hasGoldPass: false,
  claimedPassFree: [1],
  claimedPassGold: [],
  mapRegion: 'salon_street',
  mapStop: 1,
};

function getStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return initialProfile;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...initialProfile, ...parsed };
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
    { id: 'g1', type: 'pink-blocks', label: 'Pink Lines', current: 0, target: 2, color: '#ec4899', completed: false },
    { id: 'g2', type: 'gold-blocks', label: 'Gold Lines', current: 0, target: 1, color: '#f59e0b', completed: false },
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
  const [energyTimer, setEnergyTimer] = useState<string>('');

  const maxEnergy = userProfile.maxEnergy || 30;
  const currentEnergy = userProfile.energy !== undefined ? userProfile.energy : 30;

  // Energy Regeneration Tick & Countdown
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const lastUpdate = userProfile.energyUpdatedAt || now;
      const elapsed = now - lastUpdate;

      if (currentEnergy < maxEnergy) {
        const pointsToAdd = Math.floor(elapsed / ENERGY_REGEN_INTERVAL_MS);
        if (pointsToAdd > 0) {
          const nextEnergy = Math.min(maxEnergy, currentEnergy + pointsToAdd);
          const remainder = elapsed % ENERGY_REGEN_INTERVAL_MS;
          setUserProfile((prev) => ({
            ...prev,
            energy: nextEnergy,
            energyUpdatedAt: now - remainder,
          }));
        } else {
          // Format remaining time to next point
          const msRemaining = ENERGY_REGEN_INTERVAL_MS - elapsed;
          const mins = Math.floor(msRemaining / 60000);
          const secs = Math.floor((msRemaining % 60000) / 1000);
          setEnergyTimer(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      } else {
        setEnergyTimer('');
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [currentEnergy, maxEnergy, userProfile.energyUpdatedAt]);

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

  const spendEnergy = useCallback((amount = 1): boolean => {
    if (amount <= 0) return true;
    let success = false;
    setUserProfile((prev) => {
      const cur = prev.energy !== undefined ? prev.energy : 30;
      if (cur >= amount) {
        success = true;
        return {
          ...prev,
          energy: cur - amount,
          energyUpdatedAt: cur === maxEnergy ? Date.now() : prev.energyUpdatedAt,
        };
      }
      return prev;
    });
    return success;
  }, [maxEnergy]);

  const addEnergy = useCallback((amount: number) => {
    if (amount <= 0) return;
    setUserProfile((prev) => ({
      ...prev,
      energy: Math.min(prev.maxEnergy || 30, (prev.energy ?? 30) + amount),
      energyUpdatedAt: Date.now(),
    }));
  }, []);

  const upgradeRoom = useCallback((roomId: string, cost: number): boolean => {
    let success = false;
    setUserProfile((prev) => {
      if (prev.coins >= cost) {
        success = true;
        const currentRooms = prev.rooms || {};
        const currentLevel = currentRooms[roomId] || 0;
        return {
          ...prev,
          coins: prev.coins - cost,
          rooms: {
            ...currentRooms,
            [roomId]: currentLevel + 1,
          },
        };
      }
      return prev;
    });
    return success;
  }, []);

  const unlockRangPage = useCallback((pageId: number) => {
    setUserProfile((prev) => {
      const pages = prev.unlockedRangPages || [1];
      if (!pages.includes(pageId)) {
        return { ...prev, unlockedRangPages: [...pages, pageId] };
      }
      return prev;
    });
  }, []);

  const advanceStoryScene = useCallback(() => {
    setUserProfile((prev) => {
      const curChapter = prev.storyChapter || 1;
      const curScene = prev.storyScene || 1;
      if (curScene < 12) {
        return { ...prev, storyScene: curScene + 1 };
      } else if (curChapter < 4) {
        return { ...prev, storyChapter: curChapter + 1, storyScene: 1 };
      }
      return prev;
    });
  }, []);

  const claimDailyMilestone = useCallback((target: number) => {
    setUserProfile((prev) => {
      const claimed = prev.claimedDailyMilestones || [];
      if (!claimed.includes(target) && (prev.dailyTaskPoints || 0) >= target) {
        return {
          ...prev,
          claimedDailyMilestones: [...claimed, target],
          coins: prev.coins + 150,
          gems: prev.gems + 10,
        };
      }
      return prev;
    });
  }, []);

  const claimPassNode = useCallback((nodeLevel: number, isGold: boolean) => {
    setUserProfile((prev) => {
      if (isGold) {
        const claimed = prev.claimedPassGold || [];
        if (!claimed.includes(nodeLevel) && prev.hasGoldPass && (prev.passLevel || 0) >= nodeLevel) {
          return {
            ...prev,
            claimedPassGold: [...claimed, nodeLevel],
            gems: prev.gems + 25,
            coins: prev.coins + 300,
          };
        }
      } else {
        const claimed = prev.claimedPassFree || [];
        if (!claimed.includes(nodeLevel) && (prev.passLevel || 0) >= nodeLevel) {
          return {
            ...prev,
            claimedPassFree: [...claimed, nodeLevel],
            coins: prev.coins + 150,
          };
        }
      }
      return prev;
    });
  }, []);

  const buyGoldPass = useCallback((): boolean => {
    let success = false;
    setUserProfile((prev) => {
      if (prev.hasGoldPass) return prev;
      if (prev.gems >= 150) {
        success = true;
        return {
          ...prev,
          gems: prev.gems - 150,
          hasGoldPass: true,
        };
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
        { id: 'g1', type: 'pink-blocks', label: 'Pink Lines', current: 0, target: 2, color: '#ec4899', completed: false },
        { id: 'g2', type: 'gold-blocks', label: 'Gold Lines', current: 0, target: 1, color: '#f59e0b', completed: false },
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
          coins: prev.coins + 78,
          xp: (prev.xp ?? 0) + 100,
          dailyTaskPoints: (prev.dailyTaskPoints || 0) + 20,
          passXp: (prev.passXp || 0) + 50,
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
    setGameState((prev) => ({ ...prev, score: prev.score + points }));
  }, []);

  const decrementMoves = useCallback(() => {
    setGameState((prev) => {
      const nextMoves = Math.max(0, prev.moves - 1);
      return {
        ...prev,
        moves: nextMoves,
        status: nextMoves === 0 ? 'gameover' : prev.status,
      };
    });
  }, []);

  const updateGoalProgress = useCallback((goalId: string, delta = 1) => {
    setGameState((prev) => {
      const updatedGoals = prev.goals.map((g) => {
        if (g.id === goalId) {
          const nextVal = Math.min(g.target, g.current + delta);
          return { ...g, current: nextVal, completed: nextVal >= g.target };
        }
        return g;
      });
      return { ...prev, goals: updatedGoals };
    });
  }, []);

  const setStars = useCallback((stars: 0 | 1 | 2 | 3) => {
    setGameState((prev) => ({ ...prev, stars }));
  }, []);

  const value = useMemo<GameContextValue>(() => ({
    gameState,
    userProfile,
    energy: currentEnergy,
    maxEnergy,
    energyTimer,
    spendEnergy,
    addEnergy,
    upgradeRoom,
    unlockRangPage,
    advanceStoryScene,
    claimDailyMilestone,
    claimPassNode,
    buyGoldPass,
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
    currentEnergy,
    maxEnergy,
    energyTimer,
    spendEnergy,
    addEnergy,
    upgradeRoom,
    unlockRangPage,
    advanceStoryScene,
    claimDailyMilestone,
    claimPassNode,
    buyGoldPass,
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
