import type { GameState, Settings, StreakData } from '../types';

const STORAGE_KEYS = {
  GAME_STATE: 'glam_blocks_game_state_v1',
  SETTINGS: 'glam_blocks_settings_v1',
  STREAK: 'glam_blocks_streak_v1',
  ONBOARDING_SEEN: 'glam_blocks_onboarding_seen_v1',
  GAMES_PLAYED: 'glam_blocks_games_played_v1',
  RATE_PROMPT_SEEN: 'glam_blocks_rate_prompt_seen_v1',
} as const;

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  colorBlind: false,
  theme: 'light',
  notificationsEnabled: false,
};

export const DEFAULT_STREAK: StreakData = {
  currentStreak: 1,
  bestStreak: 1,
  lastPlayedDate: '',
  claimedToday: false,
};

/**
 * Safely writes a JSON string value to localStorage.
 */
function setItemSafe(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (err) {
    console.warn(`LocalStorage write error for key "${key}":`, err);
  }
}

/**
 * Safely reads a raw string value from localStorage.
 */
function getItemSafe(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (err) {
    console.warn(`LocalStorage read error for key "${key}":`, err);
  }
  return null;
}

/**
 * Safely removes a key from localStorage.
 */
function removeItemSafe(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn(`LocalStorage remove error for key "${key}":`, err);
  }
}

/**
 * Saves current active gameplay state.
 */
export function saveGameState(state: GameState): void {
  setItemSafe(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
}

/**
 * Loads current saved gameplay state, or null if absent/invalid.
 */
export function loadGameState(): GameState | null {
  const raw = getItemSafe(STORAGE_KEYS.GAME_STATE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch (err) {
    console.error('Failed to parse saved game state:', err);
    return null;
  }
}

/**
 * Clears saved gameplay state from storage.
 */
export function clearGameState(): void {
  removeItemSafe(STORAGE_KEYS.GAME_STATE);
}

/**
 * Saves player audio, haptics, theme, and accessibility settings.
 */
export function saveSettings(settings: Settings): void {
  setItemSafe(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

/**
 * Loads player settings with fallback to defaults.
 */
export function loadSettings(): Settings {
  const raw = getItemSafe(STORAGE_KEYS.SETTINGS);
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to parse settings from storage:', err);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Saves daily streak progression data.
 */
export function saveStreak(streak: StreakData): void {
  setItemSafe(STORAGE_KEYS.STREAK, JSON.stringify(streak));
}

/**
 * Loads daily streak progression data with fallback to defaults.
 */
export function loadStreak(): StreakData {
  const raw = getItemSafe(STORAGE_KEYS.STREAK);
  if (!raw) return { ...DEFAULT_STREAK };
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STREAK,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to parse streak data:', err);
    return { ...DEFAULT_STREAK };
  }
}

/**
 * Checks if the player has completed or dismissed the onboarding tutorial.
 */
export function hasSeenOnboarding(): boolean {
  return getItemSafe(STORAGE_KEYS.ONBOARDING_SEEN) === 'true';
}

/**
 * Marks onboarding tutorial as completed.
 */
export function setOnboardingSeen(): void {
  setItemSafe(STORAGE_KEYS.ONBOARDING_SEEN, 'true');
}

/**
 * Gets the total number of games completed by this player.
 */
export function getGamesPlayed(): number {
  const raw = getItemSafe(STORAGE_KEYS.GAMES_PLAYED);
  if (!raw) return 0;
  const count = parseInt(raw, 10);
  return Number.isNaN(count) ? 0 : count;
}

/**
 * Increments the lifetime games played counter.
 */
export function incrementGamesPlayed(): void {
  const current = getGamesPlayed();
  setItemSafe(STORAGE_KEYS.GAMES_PLAYED, String(current + 1));
}

/**
 * Checks whether the in-app rating prompt has already been shown.
 */
export function hasSeenRatePrompt(): boolean {
  return getItemSafe(STORAGE_KEYS.RATE_PROMPT_SEEN) === 'true';
}

/**
 * Marks the in-app rating prompt as completed or dismissed.
 */
export function setRatePromptSeen(): void {
  setItemSafe(STORAGE_KEYS.RATE_PROMPT_SEEN, 'true');
}

/**
 * Indicates whether face zone labels (Eyes, Cheeks, Lips) should be displayed on the grid.
 * True for the first 3 games to help guide new players, false thereafter.
 */
export function getShowZoneLabels(): boolean {
  return getGamesPlayed() < 3;
}

export const storageService = {
  saveGameState,
  loadGameState,
  clearGameState,
  saveSettings,
  loadSettings,
  saveStreak: (streak: StreakData) => setItemSafe(STORAGE_KEYS.STREAK, JSON.stringify(streak)),
  loadStreak: (): StreakData => {
    const raw = getItemSafe(STORAGE_KEYS.STREAK);
    if (!raw) return { ...DEFAULT_STREAK };
    try {
      return { ...DEFAULT_STREAK, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_STREAK };
    }
  },
  hasSeenOnboarding: () => getItemSafe(STORAGE_KEYS.ONBOARDING_SEEN) === 'true',
  setOnboardingSeen: () => setItemSafe(STORAGE_KEYS.ONBOARDING_SEEN, 'true'),
  getGamesPlayed,
  incrementGamesPlayed,
  hasSeenRatePrompt,
  setRatePromptSeen,
  getShowZoneLabels,
};

