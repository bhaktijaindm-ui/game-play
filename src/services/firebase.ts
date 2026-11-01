import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import type { UserProfile } from './authContext';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'glam-blocks-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'glam-blocks-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'glam-blocks-dev.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '0000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:0000000000:web:0000000000',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // App Check (reCAPTCHA v3) if key provided
  const appCheckKey = import.meta.env.VITE_FIREBASE_APPCHECK_KEY;
  if (appCheckKey && typeof window !== 'undefined') {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckKey),
      isTokenAutoRefreshEnabled: true,
    });
  }
} catch {
  // Offline or invalid config: fallback to local simulation
}

export { app, auth, db };
export const googleAuthProvider = new GoogleAuthProvider();

/**
 * Calculates current ISO week string, e.g. "2026-W44"
 */
export function getCurrentIsoWeek(): string {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// In-memory rate limiting tracker (max 1 score submission per 10s per user)
const lastScoreSubmissionTimes: Record<string, number> = {};

/**
 * Sync user profile between local device and Firestore
 * Rule: Keep the higher score and union of unlocked looks
 */
export async function syncUserProfileWithFirestore(
  localProfile: UserProfile
): Promise<UserProfile> {
  if (!db || !auth || !auth.currentUser) {
    return localProfile;
  }

  try {
    const userRef = doc(db, 'users', localProfile.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const remoteData = snap.data() as Partial<UserProfile>;
      const reconciledBestScore = Math.max(localProfile.bestScore, remoteData.bestScore || 0);
      const reconciledCoins = Math.max(localProfile.coins, remoteData.coins || 0);
      const reconciledGems = Math.max(localProfile.gems, remoteData.gems || 0);
      const combinedLooks = Array.from(
        new Set([...localProfile.unlockedLooks, ...(remoteData.unlockedLooks || [])])
      );

      const mergedProfile: UserProfile = {
        ...localProfile,
        ...remoteData,
        bestScore: reconciledBestScore,
        coins: reconciledCoins,
        gems: reconciledGems,
        unlockedLooks: combinedLooks,
        adsRemoved: localProfile.adsRemoved || (remoteData.adsRemoved ?? false),
        glamPassUntil: Math.max(localProfile.glamPassUntil || 0, remoteData.glamPassUntil || 0) || null,
      };

      await setDoc(userRef, mergedProfile, { merge: true });
      return mergedProfile;
    } else {
      // First time cloud sync
      await setDoc(userRef, {
        ...localProfile,
        updatedAt: serverTimestamp(),
      });
      return localProfile;
    }
  } catch {
    // If offline or network error, return local profile cleanly
    return localProfile;
  }
}

/**
 * Submits score to weekly leaderboard with 10s rate limit and validation
 */
export async function submitScoreToLeaderboard(
  uid: string,
  displayName: string,
  score: number,
  lookId: string
): Promise<{ success: boolean; error?: string }> {
  // Rate limit: max 1 per 10s per user
  const now = Date.now();
  const lastTime = lastScoreSubmissionTimes[uid] || 0;
  if (now - lastTime < 10000) {
    return { success: false, error: 'Rate limit: Please wait 10s between score submissions' };
  }
  lastScoreSubmissionTimes[uid] = now;

  if (!db) {
    return { success: true }; // Local preview mode
  }

  try {
    const currentWeek = getCurrentIsoWeek();
    const scoreDocId = `${uid}_${currentWeek}`;
    const scoreRef = doc(db, 'scores', scoreDocId);

    const existingSnap = await getDoc(scoreRef);
    if (existingSnap.exists()) {
      const existing = existingSnap.data();
      if ((existing.score || 0) >= score) {
        return { success: true }; // Keep existing higher score
      }
    }

    await setDoc(scoreRef, {
      uid,
      displayName: displayName.slice(0, 20),
      score,
      lookId,
      week: currentWeek,
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Fetch top 50 weekly global leaderboard
 */
export async function fetchTop50WeeklyLeaderboard(): Promise<
  Array<{ rank: number; uid: string; displayName: string; score: number; lookId: string }>
> {
  if (!db) return [];

  try {
    const currentWeek = getCurrentIsoWeek();
    const scoresRef = collection(db, 'scores');
    const q = query(
      scoresRef,
      where('week', '==', currentWeek),
      orderBy('score', 'desc'),
      limit(50)
    );

    const snap = await getDocs(q);
    const results: Array<{
      rank: number;
      uid: string;
      displayName: string;
      score: number;
      lookId: string;
    }> = [];

    snap.docs.forEach((d, idx) => {
      const data = d.data();
      results.push({
        rank: idx + 1,
        uid: data.uid,
        displayName: data.displayName || 'Glam Player',
        score: data.score || 0,
        lookId: data.lookId || 'look_natural_glow',
      });
    });

    return results;
  } catch {
    return [];
  }
}
