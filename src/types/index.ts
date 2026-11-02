/**
 * Glam Blocks - Core TypeScript Type Definitions
 * Complete, strictly-typed definitions for game mechanics, vanity cosmetics,
 * monetization, themes, and player state.
 */

// ==========================================
// 1. Core Shade & Beauty Types
// ==========================================

export type ShadeId =
  | 'rose'
  | 'lavender'
  | 'peach'
  | 'ruby'
  | 'gold'
  | 'mint'
  | 'sky'
  | 'turmeric'
  | 'henna'
  | 'berry'
  | 'crimson'
  | 'kohl'
  | 'champagne'
  | (string & {});

export const SHADE_IDS: ShadeId[] = [
  'rose',
  'lavender',
  'peach',
  'ruby',
  'gold',
  'mint',
  'sky',
];

export type FaceZone = 'eyes' | 'cheeks' | 'lips';

export interface ShadeApplication {
  shade: ShadeId;
  opacity?: number;
  intensity?: number;
  timestamp?: number;
  appliedAt?: number;
  zone?: FaceZone;
}

export interface FaceRecipe {
  eyes: ShadeApplication[];
  cheeks: ShadeApplication[];
  lips: ShadeApplication[];
}

// ==========================================
// 2. Board, Grid & Shape Mechanics
// ==========================================

export interface BlockCell {
  row: number;
  col: number;
}

export interface Shape {
  id: string;
  cells: BlockCell[];
  shade: ShadeId;
}

export type BoardCell = ShadeId | { shade: ShadeId; [key: string]: unknown } | null;

export type Board = BoardCell[][]; // 8x8 matrix

export type LineType = 'row' | 'col';

export interface ClearedLine {
  type: LineType;
  index: number;
  zone: FaceZone;
  shade?: ShadeId | null;
  dominantShade?: ShadeId | null;
  pureShade?: ShadeId | null;
  shades?: ShadeId[];
  isPure: boolean;
  zones?: FaceZone[];
}

export interface ClearResult {
  lines: ClearedLine[];
  score: number;
  combo: number;
  isPureShade?: boolean;
  hasPureShade?: boolean;
  rowsCleared?: number[];
  colsCleared?: number[];
  totalLines?: number;
}

export interface PowerUps {
  undo: number;
  shuffle: number;
  bomb: number;
}

export interface GameState {
  board: Board;
  score: number;
  bestScore?: number;
  highScore: number;
  shapes: Shape[];
  currentShapes: (Shape | null)[];
  combo: number;
  moveCount: number;
  isGameOver: boolean;
  clearedLines: ClearedLine[];
  faceRecipe: FaceRecipe;
  powerUps: PowerUps;
  goals: Goal[];
  client: Client | null;
  stars?: 1 | 2 | 3;
  history?: GameState[];
  dailySeed?: number;
}

// ==========================================
// 3. Goal, Client & Progression Types
// ==========================================

export type GoalType = 'clearColor' | 'clearLines' | 'combo' | 'score' | 'pureShade';

export interface Goal {
  id?: string;
  type: GoalType;
  target: number;
  shade?: ShadeId;
  current: number;
  completed: boolean;
  description?: string;
  color?: string;
  label?: string;
}

export interface GoalProgress {
  goals: Goal[];
  allCompleted: boolean;
  stars: number;
}

export interface Client {
  id: string;
  name: string;
  occasion: string;
  collection: string;
  avatar: string;
  goals: Goal[];
  starThresholds: [number, number, number];
  dialogue?: {
    intro?: string;
    success?: string;
    failure?: string;
  };
}

export interface PalettePan {
  shade: ShadeId;
  filled: boolean;
  filledAt?: number;
}

export interface PaletteState {
  pans: PalettePan[];
  completed: boolean;
}

export interface PortfolioEntry {
  id: string;
  faceRecipe: FaceRecipe;
  faceModel: string;
  score: number;
  clientId?: string;
  lookName?: string;
  stars?: number;
  createdAt: number;
}

export interface CollectionLook {
  id: string;
  name: string;
  preview: FaceRecipe;
  unlocked: boolean;
}

export interface Collection {
  id: string;
  name: string;
  occasion?: string;
  description?: string;
  looks?: CollectionLook[];
  seasonal?: {
    startDate: string;
    endDate: string;
  };
  seasonStart?: string;
  seasonEnd?: string;
  palette: ShadeId[];
}

export interface DailyBrief {
  date: string;
  seed: number;
  clientId: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  score: number;
  rank: number;
}

// ==========================================
// 4. User Profile & Preferences
// ==========================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  uid: string;
  id?: string;
  name?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  avatarUrl?: string;
  createdAt?: number;
  country?: string;
  theme?: ThemeMode;
  faceModel?: string;
  marketingConsent?: boolean;
  consentTimestamp?: number;
  coins: number;
  gems: number;
  adsRemoved?: boolean;
  glamPassUntil?: number | null;
  streakDay?: number;
  streakDays?: number;
  lastRewardClaimedAt?: number;
  bestScore?: number;
  highScore?: number;
  level: number;
  xp?: number;
  stars?: number;
  palette?: PaletteState;
  portfolio?: PortfolioEntry[];
  unlockedLooks?: string[];
  equippedLook?: string | null;
  reducedMotion?: boolean;
  colorBlind?: boolean;
  soundEnabled?: boolean;
  musicEnabled?: boolean;
  hapticsEnabled?: boolean;

  // Meta Game Progression (The Gulab Mahal Salon)
  energy?: number;
  maxEnergy?: number;
  energyUpdatedAt?: number;
  rooms?: Record<string, number>;
  unlockedRangPages?: number[];
  storyChapter?: number;
  storyScene?: number;
  dailyTaskPoints?: number;
  claimedDailyMilestones?: number[];
  passLevel?: number;
  passXp?: number;
  hasGoldPass?: boolean;
  claimedPassFree?: number[];
  claimedPassGold?: number[];
  mapRegion?: string;
  mapStop?: number;
  notificationsEnabled?: boolean;
}

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  colorBlind: boolean;
  theme: ThemeMode;
  notificationsEnabled?: boolean;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string;
  claimedToday: boolean;
}

// ==========================================
// 5. Monetization, Pricing & Billing Types
// ==========================================

export type ProductType = 'gem_pack' | 'one_time' | 'subscription';

export type RegionTier = 'IN' | 'TIER_1' | 'ROW';

export interface RegionalPrice {
  amount: number;
  currency: string;
  currencySymbol: string;
  formatted: string;
}

export interface ProductReward {
  gems?: number;
  coins?: number;
  adsRemoved?: boolean;
  glamPassDays?: number;
  exclusiveLookId?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  reward: ProductReward;
  prices: Record<RegionTier, RegionalPrice>;
  badge?: string;
  popular?: boolean;
}

export interface PurchaseResult {
  success: boolean;
  productId: string;
  purchaseToken?: string;
  isMock: boolean;
  error?: string;
}

export interface BillingProvider {
  isAvailable(): boolean;
  purchaseProduct(productId: string): Promise<PurchaseResult>;
  purchase?(productId: string): Promise<PurchaseResult>;
  initialize?(): Promise<void>;
  getProducts?(): Promise<Product[]>;
  restorePurchases?(): Promise<PurchaseResult[]>;
}

export interface AdsProvider {
  canShowAds(isAdFree: boolean): boolean;
  showRewardedAd(onRewarded: () => void, onClose: () => void): void;
  showInterstitial(onClose?: () => void): Promise<boolean> | void;
  initialize?(): Promise<void>;
  showRewarded(placement: string): Promise<boolean>;
  isReady(): boolean;
}
