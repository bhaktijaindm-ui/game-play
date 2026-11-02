import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  arrayUnion,
  type DocumentData,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '../config/firebase';
import type {
  UserProfile,
  PortfolioEntry,
  LeaderboardEntry,
  DailyBrief,
  PalettePan,
  ShadeId,
} from '../types';

const USERS_COLLECTION = 'users';
const LEADERBOARD_COLLECTION = 'leaderboard';
const DAILY_BRIEFS_COLLECTION = 'daily_briefs';

const DEFAULT_SHADES: ShadeId[] = ['rose', 'lavender', 'peach', 'ruby', 'gold', 'mint', 'sky'];

/**
 * Creates default palette pans for a new player.
 */
function createDefaultPans(): PalettePan[] {
  return DEFAULT_SHADES.map((shade) => ({
    shade,
    filled: false,
  }));
}

/**
 * Detects user country based on browser locale/timezone.
 */
function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India')) {
      return 'IN';
    }
    if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago')) {
      return 'US';
    }
  } catch {
    // fallback
  }
  return 'US';
}

/**
 * Fetches user profile by user UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Profile not found for user: ${uid}`);
    }

    const data = docSnap.data() as DocumentData;
    return {
      uid: data.uid || uid,
      displayName: data.displayName || 'Glam Artist',
      email: data.email || '',
      photoURL: data.photoURL || '',
      createdAt: data.createdAt || Date.now(),
      country: data.country || 'US',
      theme: data.theme || 'light',
      faceModel: data.faceModel || 'model_default',
      marketingConsent: Boolean(data.marketingConsent),
      consentTimestamp: data.consentTimestamp || Date.now(),
      coins: typeof data.coins === 'number' ? data.coins : 250,
      gems: typeof data.gems === 'number' ? data.gems : 25,
      adsRemoved: Boolean(data.adsRemoved),
      glamPassUntil: data.glamPassUntil ?? null,
      streakDay: typeof data.streakDay === 'number' ? data.streakDay : 1,
      lastRewardClaimedAt: typeof data.lastRewardClaimedAt === 'number' ? data.lastRewardClaimedAt : 0,
      bestScore: typeof data.bestScore === 'number' ? data.bestScore : 0,
      level: typeof data.level === 'number' ? data.level : 1,
      stars: typeof data.stars === 'number' ? data.stars : 0,
      palette: data.palette || { pans: createDefaultPans(), completed: false },
      portfolio: Array.isArray(data.portfolio) ? data.portfolio : [],
      unlockedLooks: Array.isArray(data.unlockedLooks) ? data.unlockedLooks : ['classic_glow'],
      equippedLook: data.equippedLook ?? null,
      reducedMotion: Boolean(data.reducedMotion),
      colorBlind: Boolean(data.colorBlind),
      soundEnabled: data.soundEnabled !== false,
      musicEnabled: data.musicEnabled !== false,
      hapticsEnabled: data.hapticsEnabled !== false,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to retrieve user profile.');
  }
}

/**
 * Creates initial user profile document in Firestore.
 */
export async function createUserProfile(user: User, marketingConsent: boolean): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, user.uid);
    const existing = await getDoc(docRef);

    if (existing.exists()) {
      return;
    }

    const newProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || (user.isAnonymous ? 'Guest Artist' : 'Glam Artist'),
      email: user.email || '',
      photoURL: user.photoURL || '',
      createdAt: Date.now(),
      country: detectCountry(),
      theme: 'light',
      faceModel: 'model_default',
      marketingConsent,
      consentTimestamp: Date.now(),
      coins: 250,
      gems: 25,
      adsRemoved: false,
      glamPassUntil: null,
      streakDay: 1,
      lastRewardClaimedAt: 0,
      bestScore: 0,
      level: 1,
      stars: 0,
      palette: {
        pans: createDefaultPans(),
        completed: false,
      },
      portfolio: [],
      unlockedLooks: ['classic_glow', 'fresh_nude'],
      equippedLook: 'classic_glow',
      reducedMotion: false,
      colorBlind: false,
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,
    };

    await setDoc(docRef, newProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create user profile.');
  }
}

/**
 * Updates user profile with only whitelisted fields:
 * theme, faceModel, displayName, marketingConsent.
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, 'theme' | 'faceModel' | 'displayName' | 'marketingConsent'>>
): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const safeData: Partial<Record<string, unknown>> = {};

    if (data.theme !== undefined) {
      safeData.theme = data.theme;
    }
    if (data.faceModel !== undefined) {
      safeData.faceModel = data.faceModel;
    }
    if (data.displayName !== undefined) {
      safeData.displayName = data.displayName.trim();
    }
    if (data.marketingConsent !== undefined) {
      safeData.marketingConsent = Boolean(data.marketingConsent);
      safeData.consentTimestamp = Date.now();
    }

    if (Object.keys(safeData).length === 0) {
      return;
    }

    await updateDoc(docRef, safeData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update user profile.');
  }
}

/**
 * Adds a completed look portfolio entry to user's gallery.
 */
export async function addPortfolioEntry(uid: string, entry: PortfolioEntry): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, {
      portfolio: arrayUnion(entry),
    });
  } catch (error) {
    console.error('Error adding portfolio entry:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save portfolio entry.');
  }
}

/**
 * Submits high score to leaderboard and updates user high score if higher.
 */
export async function addScore(
  uid: string,
  score: number,
  mode: 'classic' | 'daily' | 'free'
): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userDocRef);
    const userData = userSnap.data();
    const displayName = userData?.displayName || 'Glam Artist';
    const photoURL = userData?.photoURL || '';

    // Update user best score if applicable
    if (userData && score > (userData.bestScore || 0)) {
      await updateDoc(userDocRef, { bestScore: score });
    }

    // Save to leaderboard collection
    const leaderboardDocId = `${mode}_${uid}`;
    const scoreDocRef = doc(db, LEADERBOARD_COLLECTION, leaderboardDocId);
    const existingScoreDoc = await getDoc(scoreDocRef);

    if (!existingScoreDoc.exists() || (existingScoreDoc.data()?.score || 0) < score) {
      await setDoc(scoreDocRef, {
        uid,
        mode,
        displayName,
        photoURL,
        score,
        updatedAt: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error recording score:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to submit high score.');
  }
}

/**
 * Retrieves the global leaderboard for the specified game mode.
 */
export async function getLeaderboard(
  mode: 'classic' | 'daily' | 'free',
  limitCount: number = 10
): Promise<LeaderboardEntry[]> {
  try {
    const colRef = collection(db, LEADERBOARD_COLLECTION);
    const q = query(
      colRef,
      where('mode', '==', mode),
      orderBy('score', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];

    let rank = 1;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      entries.push({
        uid: data.uid || docSnap.id,
        displayName: data.displayName || 'Anonymous Glammer',
        photoURL: data.photoURL || '',
        score: Number(data.score) || 0,
        rank: rank++,
      });
    });

    return entries;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to retrieve leaderboard.');
  }
}

/**
 * Fetches the daily brief for the specified calendar date string (YYYY-MM-DD).
 */
export async function getDailyBrief(date: string): Promise<DailyBrief> {
  try {
    const docRef = doc(db, DAILY_BRIEFS_COLLECTION, date);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        date: data.date || date,
        seed: Number(data.seed) || 123456,
        clientId: data.clientId || 'client_glam_vip',
      };
    }

    // Generate deterministic seed from date string: YYYYMMDD
    const numericSeed = Number(date.replace(/-/g, '')) || 20261102;
    const brief: DailyBrief = {
      date,
      seed: numericSeed,
      clientId: `client_daily_${date.replace(/-/g, '_')}`,
    };

    return brief;
  } catch (error) {
    console.error('Error fetching daily brief:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch daily brief.');
  }
}

/**
 * Saves a daily brief document to Firestore.
 */
export async function saveDailyBrief(brief: DailyBrief): Promise<void> {
  try {
    const docRef = doc(db, DAILY_BRIEFS_COLLECTION, brief.date);
    await setDoc(docRef, brief, { merge: true });
  } catch (error) {
    console.error('Error saving daily brief:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save daily brief.');
  }
}

/**
 * Syncs local state with remote Firestore profile using "keep higher values" conflict resolution.
 */
export async function syncLocalState(
  uid: string,
  localState: Partial<UserProfile>
): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return;
    }

    const remote = docSnap.data() as UserProfile;
    const resolved: Partial<UserProfile> = {};

    // Keep higher numerical metrics
    if (localState.coins !== undefined) {
      resolved.coins = Math.max(localState.coins, remote.coins || 0);
    }
    if (localState.gems !== undefined) {
      resolved.gems = Math.max(localState.gems, remote.gems || 0);
    }
    if (localState.bestScore !== undefined) {
      resolved.bestScore = Math.max(localState.bestScore, remote.bestScore || 0);
    }
    if (localState.level !== undefined) {
      resolved.level = Math.max(localState.level, remote.level || 1);
    }
    if (localState.stars !== undefined) {
      resolved.stars = Math.max(localState.stars, remote.stars || 0);
    }
    if (localState.streakDay !== undefined) {
      resolved.streakDay = Math.max(localState.streakDay, remote.streakDay || 1);
    }

    // Keep more recent claim timestamp
    if (localState.lastRewardClaimedAt !== undefined) {
      resolved.lastRewardClaimedAt = Math.max(
        localState.lastRewardClaimedAt,
        remote.lastRewardClaimedAt || 0
      );
    }

    // Ads removed: if unlocked anywhere, stay unlocked
    if (localState.adsRemoved || remote.adsRemoved) {
      resolved.adsRemoved = true;
    }

    // Glam Pass expiration: keep latest expiration timestamp
    const localPass = localState.glamPassUntil ?? 0;
    const remotePass = remote.glamPassUntil ?? 0;
    if (localPass > 0 || remotePass > 0) {
      resolved.glamPassUntil = Math.max(localPass, remotePass);
    }

    // Merge portfolio entries (union by ID)
    if (Array.isArray(localState.portfolio) && localState.portfolio.length > 0) {
      const existingIds = new Set((remote.portfolio || []).map((p: { id: string }) => p.id));
      const mergedPortfolio = [...(remote.portfolio || [])];
      for (const item of localState.portfolio) {
        if (!existingIds.has(item.id)) {
          mergedPortfolio.push(item);
          existingIds.add(item.id);
        }
      }
      resolved.portfolio = mergedPortfolio;
    }

    // Merge unlocked looks (unique list)
    if (Array.isArray(localState.unlockedLooks) && localState.unlockedLooks.length > 0) {
      const looksSet = new Set([...(remote.unlockedLooks || []), ...localState.unlockedLooks]);
      resolved.unlockedLooks = Array.from(looksSet);
    }

    await updateDoc(docRef, resolved);
  } catch (error) {
    console.error('Error syncing local state with Firestore:', error);
    throw new Error(error instanceof Error ? error.message : 'Sync failed.');
  }
}
