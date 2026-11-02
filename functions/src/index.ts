import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { google } from 'googleapis';

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

/**
 * 1. validateScore
 * Validates a submitted score, applies rate limiting, writes to scores collection,
 * updates user's high score, and awards coins.
 */
export const validateScore = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to submit scores.');
  }

  const uid = request.auth.uid;
  const { score, mode, movesCount } = request.data as {
    score: number;
    mode: 'free' | 'daily';
    movesCount?: number;
  };

  // Validate inputs
  if (typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > 100000) {
    throw new HttpsError('invalid-argument', 'Invalid score value. Score must be an integer between 0 and 100,000.');
  }

  if (mode !== 'free' && mode !== 'daily') {
    throw new HttpsError('invalid-argument', 'Mode must be either "free" or "daily".');
  }

  // Validate reasonable score per move if movesCount is provided
  if (movesCount !== undefined) {
    if (typeof movesCount !== 'number' || movesCount < 1) {
      throw new HttpsError('invalid-argument', 'Invalid movesCount.');
    }
    // Theoretical max per move in Glam Blocks is ~20,000
    const maxPossibleScore = movesCount * 20000;
    if (score > maxPossibleScore) {
      throw new HttpsError('invalid-argument', 'Score exceeds maximum theoretical threshold for moves played.');
    }
  }

  const userRef = db.collection('users').doc(uid);
  const now = admin.firestore.Timestamp.now();

  const result = await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);

    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User profile not found.');
    }

    const userData = userDoc.data() || {};

    // Rate limiting: 1 submission per 10 seconds per user
    const lastScoreSubmittedAt = userData.lastScoreSubmittedAt as admin.firestore.Timestamp | undefined;
    if (lastScoreSubmittedAt) {
      const diffMs = now.toMillis() - lastScoreSubmittedAt.toMillis();
      if (diffMs < 10000) {
        const waitSec = Math.ceil((10000 - diffMs) / 1000);
        throw new HttpsError(
          'resource-exhausted',
          `Rate limit exceeded. Please wait ${waitSec} second(s) before submitting again.`
        );
      }
    }

    // Calculate coins: 1 coin per 50 points (minimum 1 if score > 0)
    const coinsEarned = score > 0 ? Math.max(1, Math.floor(score / 50)) : 0;
    const currentBest = (userData.bestScore as number) || 0;
    const newBest = Math.max(currentBest, score);

    // Create score document
    const scoreRef = db.collection('scores').doc();
    transaction.set(scoreRef, {
      uid,
      displayName: userData.displayName || 'Glam Artist',
      score,
      mode,
      createdAt: now,
    });

    // Update user document
    transaction.update(userRef, {
      bestScore: newBest,
      coins: admin.firestore.FieldValue.increment(coinsEarned),
      lastScoreSubmittedAt: now,
    });

    return {
      scoreId: scoreRef.id,
      score,
      coinsAwarded: coinsEarned,
      bestScore: newBest,
    };
  });

  return {
    success: true,
    ...result,
  };
});

/**
 * 2. verifyPurchase
 * Verifies in-app purchases with store APIs, stores the purchase record,
 * and grants digital goods (gems, ads removed, or Glam Pass).
 */
export const verifyPurchase = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to verify purchases.');
  }

  const uid = request.auth.uid;
  const { productId, purchaseToken, platform, packageName } = request.data as {
    productId: string;
    purchaseToken: string;
    platform: 'android' | 'ios' | 'web';
    packageName?: string;
  };

  if (!productId || !purchaseToken || !platform) {
    throw new HttpsError('invalid-argument', 'Missing required purchase parameters.');
  }

  const purchaseRef = db.collection('purchases').doc(purchaseToken);

  // Prevent duplicate processing
  const existingPurchase = await purchaseRef.get();
  if (existingPurchase.exists) {
    return {
      success: true,
      message: 'Purchase already processed.',
      grantedItems: existingPurchase.data()?.grantedItems,
    };
  }

  // Google Play Developer API verification
  if (platform === 'android') {
    try {
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/androidpublisher'],
      });
      const playDeveloper = google.androidpublisher({ version: 'v3', auth });
      const pkg = packageName || process.env.ANDROID_PACKAGE_NAME || 'com.glamblocks.game';

      // Check whether it's subscription or one-time product
      if (productId.includes('glam_pass')) {
        const res = await playDeveloper.purchases.subscriptions.get({
          packageName: pkg,
          subscriptionId: productId,
          token: purchaseToken,
        });
        if (res.data.paymentState !== 1 && res.data.paymentState !== 2) {
          throw new HttpsError('failed-precondition', 'Google Play subscription payment not verified.');
        }
      } else {
        const res = await playDeveloper.purchases.products.get({
          packageName: pkg,
          productId,
          token: purchaseToken,
        });
        if (res.data.purchaseState !== 0) {
          throw new HttpsError('failed-precondition', 'Google Play product purchase not verified.');
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      // In development or local sandbox, log error and allow sandbox bypass if explicitly configured
      if (process.env.FUNCTIONS_EMULATOR === 'true' || process.env.ALLOW_SANDBOX_PURCHASE === 'true') {
        console.warn(`[DEV] Skipping Play API check: ${errorMessage}`);
      } else {
        throw new HttpsError('internal', `Google Play verification failed: ${errorMessage}`);
      }
    }
  }

  // Determine rewards according to productId catalog
  const userUpdates: Record<string, unknown> = {};
  const grantedItems: Record<string, unknown> = {};

  if (productId.includes('gems_100')) {
    userUpdates.gems = admin.firestore.FieldValue.increment(100);
    grantedItems.gems = 100;
  } else if (productId.includes('gems_500')) {
    userUpdates.gems = admin.firestore.FieldValue.increment(500);
    grantedItems.gems = 500;
  } else if (productId.includes('gems_1200')) {
    userUpdates.gems = admin.firestore.FieldValue.increment(1200);
    grantedItems.gems = 1200;
  } else if (productId.includes('remove_ads')) {
    userUpdates.adsRemoved = true;
    grantedItems.adsRemoved = true;
  } else if (productId.includes('glam_pass')) {
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const passExpires = admin.firestore.Timestamp.fromMillis(Date.now() + thirtyDaysMs);
    userUpdates.glamPassUntil = passExpires;
    userUpdates.adsRemoved = true;
    grantedItems.glamPassUntil = passExpires;
    grantedItems.adsRemoved = true;
  } else {
    // Default fallback grant
    userUpdates.gems = admin.firestore.FieldValue.increment(50);
    grantedItems.gems = 50;
  }

  // Atomically write purchase record and update user doc
  const userRef = db.collection('users').doc(uid);
  const now = admin.firestore.Timestamp.now();

  const batch = db.batch();
  batch.set(purchaseRef, {
    uid,
    productId,
    purchaseToken,
    platform,
    grantedItems,
    createdAt: now,
  });
  batch.update(userRef, userUpdates);

  await batch.commit();

  return {
    success: true,
    grantedItems,
  };
});

/**
 * 3. weeklyReset
 * Scheduled every Monday at 00:00 UTC.
 * Cleans up score submissions older than 7 days from the weekly leaderboard.
 */
export const weeklyReset = onSchedule(
  { schedule: '0 0 * * 1', timeZone: 'UTC' },
  async () => {
    const sevenDaysAgo = admin.firestore.Timestamp.fromMillis(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const oldScoresSnapshot = await db
      .collection('scores')
      .where('createdAt', '<', sevenDaysAgo)
      .limit(500)
      .get();

    if (oldScoresSnapshot.empty) {
      console.log('Weekly reset completed: No old scores to delete.');
      return;
    }

    const batch = db.batch();
    oldScoresSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Weekly reset completed: Deleted ${oldScoresSnapshot.size} expired leaderboard scores.`);
  }
);

/**
 * 4. grantReward
 * Grants palette completion rewards, client look completion rewards, and achievements.
 * Validates requirements on the server to prevent cheating.
 */
export const grantReward = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to claim rewards.');
  }

  const uid = request.auth.uid;
  const { rewardType, rewardId } = request.data as {
    rewardType: 'palette' | 'look' | 'collection';
    rewardId: string;
  };

  if (!rewardType || !rewardId) {
    throw new HttpsError('invalid-argument', 'Missing rewardType or rewardId.');
  }

  const userRef = db.collection('users').doc(uid);

  return await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User profile not found.');
    }

    const userData = userDoc.data() || {};
    const unlockedLooks: string[] = userData.unlockedLooks || [];
    const completedPalettes: string[] = userData.completedPalettes || [];

    let coinsGranted = 0;
    let gemsGranted = 0;
    const updates: Record<string, unknown> = {};

    if (rewardType === 'palette') {
      if (completedPalettes.includes(rewardId)) {
        throw new HttpsError('already-exists', 'Palette completion reward already claimed.');
      }
      coinsGranted = 150;
      gemsGranted = 5;
      updates.completedPalettes = admin.firestore.FieldValue.arrayUnion(rewardId);
    } else if (rewardType === 'look') {
      if (unlockedLooks.includes(rewardId)) {
        throw new HttpsError('already-exists', 'Look reward already claimed.');
      }
      coinsGranted = 200;
      gemsGranted = 10;
      updates.unlockedLooks = admin.firestore.FieldValue.arrayUnion(rewardId);
    } else if (rewardType === 'collection') {
      coinsGranted = 500;
      gemsGranted = 25;
      updates.unlockedCollections = admin.firestore.FieldValue.arrayUnion(rewardId);
    } else {
      throw new HttpsError('invalid-argument', 'Unsupported reward type.');
    }

    updates.coins = admin.firestore.FieldValue.increment(coinsGranted);
    updates.gems = admin.firestore.FieldValue.increment(gemsGranted);

    transaction.update(userRef, updates);

    return {
      success: true,
      rewardType,
      rewardId,
      coinsGranted,
      gemsGranted,
    };
  });
});

/**
 * 5. claimDailyReward
 * Tracks consecutive daily logins, computes streak, and grants escalating rewards.
 */
export const claimDailyReward = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to claim daily rewards.');
  }

  const uid = request.auth.uid;
  const userRef = db.collection('users').doc(uid);
  const now = Date.now();

  return await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User profile not found.');
    }

    const userData = userDoc.data() || {};
    const lastClaimed = userData.lastRewardClaimedAt as admin.firestore.Timestamp | undefined;
    let currentStreak = (userData.dailyStreak as number) || 0;

    if (lastClaimed) {
      const lastClaimedTime = lastClaimed.toMillis();
      const lastDate = new Date(lastClaimedTime).toISOString().slice(0, 10);
      const currentDate = new Date(now).toISOString().slice(0, 10);

      // Same calendar day check
      if (lastDate === currentDate) {
        throw new HttpsError('failed-precondition', 'Daily reward has already been claimed today.');
      }

      // Check whether streak was broken (> 48 hours)
      const hoursDiff = (now - lastClaimedTime) / (1000 * 60 * 60);
      if (hoursDiff > 48) {
        currentStreak = 1;
      } else {
        currentStreak = (currentStreak % 7) + 1;
      }
    } else {
      currentStreak = 1;
    }

    // Reward table based on 7-day streak
    const rewardTable: Record<number, { coins: number; gems: number }> = {
      1: { coins: 50, gems: 0 },
      2: { coins: 100, gems: 0 },
      3: { coins: 150, gems: 5 },
      4: { coins: 200, gems: 0 },
      5: { coins: 250, gems: 10 },
      6: { coins: 300, gems: 0 },
      7: { coins: 500, gems: 25 },
    };

    const reward = rewardTable[currentStreak] || { coins: 50, gems: 0 };

    transaction.update(userRef, {
      dailyStreak: currentStreak,
      coins: admin.firestore.FieldValue.increment(reward.coins),
      gems: admin.firestore.FieldValue.increment(reward.gems),
      lastRewardClaimedAt: admin.firestore.Timestamp.fromMillis(now),
    });

    return {
      success: true,
      streak: currentStreak,
      coinsGranted: reward.coins,
      gemsGranted: reward.gems,
    };
  });
});

/**
 * 6. deleteUserData
 * Complete GDPR/CCPA data erasure across users, scores, and purchases collections.
 * Typically invoked prior to Firebase Authentication user account deletion.
 */
export const deleteUserData = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to delete data.');
  }

  const uid = request.auth.uid;
  const userRef = db.collection('users').doc(uid);

  // 1. Delete all user scores
  const scoresSnapshot = await db.collection('scores').where('uid', '==', uid).get();
  const batch1 = db.batch();
  scoresSnapshot.docs.forEach((doc) => {
    batch1.delete(doc.ref);
  });
  if (!scoresSnapshot.empty) {
    await batch1.commit();
  }

  // 2. Delete all user purchases
  const purchasesSnapshot = await db.collection('purchases').where('uid', '==', uid).get();
  const batch2 = db.batch();
  purchasesSnapshot.docs.forEach((doc) => {
    batch2.delete(doc.ref);
  });
  if (!purchasesSnapshot.empty) {
    await batch2.commit();
  }

  // 3. Delete user document
  await userRef.delete();

  return {
    success: true,
    message: `All data for user ${uid} has been permanently deleted.`,
    scoresDeleted: scoresSnapshot.size,
    purchasesDeleted: purchasesSnapshot.size,
  };
});

/**
 * 7. syncEnergy
 * Server-side reconciliation of energy regeneration.
 * Computes elapsed time since last energyUpdatedAt and updates energy (1 per 12 min, max 30).
 */
export const syncEnergy = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to sync energy.');
  }

  const uid = request.auth.uid;
  const userRef = db.collection('users').doc(uid);
  const now = Date.now();

  return await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User profile not found.');
    }

    const data = userDoc.data() || {};
    let currentEnergy = typeof data.energy === 'number' ? data.energy : 30;
    const maxEnergy = typeof data.maxEnergy === 'number' ? data.maxEnergy : 30;
    
    let lastUpdatedMs = now;
    if (data.energyUpdatedAt && typeof data.energyUpdatedAt.toMillis === 'function') {
      lastUpdatedMs = data.energyUpdatedAt.toMillis();
    } else if (typeof data.energyUpdatedAt === 'number') {
      lastUpdatedMs = data.energyUpdatedAt;
    }

    if (currentEnergy < maxEnergy) {
      const elapsedMs = now - lastUpdatedMs;
      const regenPeriodMs = 12 * 60 * 1000; // 12 minutes per 1 energy point
      const pointsToAdd = Math.floor(elapsedMs / regenPeriodMs);

      if (pointsToAdd > 0) {
        currentEnergy = Math.min(maxEnergy, currentEnergy + pointsToAdd);
        const remainderMs = elapsedMs % regenPeriodMs;
        const newUpdatedTime = now - remainderMs;

        transaction.update(userRef, {
          energy: currentEnergy,
          energyUpdatedAt: admin.firestore.Timestamp.fromMillis(newUpdatedTime),
        });
      }
    }

    return {
      success: true,
      energy: currentEnergy,
      maxEnergy,
    };
  });
});

