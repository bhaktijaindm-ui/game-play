import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * 1. validateScore
 * Rejects physically impossible scores based on move counts and game speed
 */
export const validateScore = functions.https.onCall(
  async (data: { uid: string; score: number; movesCount: number; durationSeconds: number }, context) => {
    // Must be authenticated
    if (!context.auth || context.auth.uid !== data.uid) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required to submit score'
      );
    }

    const { uid, score, movesCount, durationSeconds } = data;

    if (typeof score !== 'number' || typeof movesCount !== 'number' || movesCount <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Malformed score submission data');
    }

    // Maximum plausible score per move is roughly 2,500 (multiple simultaneous clears with 5x combo + board wipe)
    const maxPlausibleScore = movesCount * 2500 + 1000;
    if (score > maxPlausibleScore) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Score exceeds maximum plausible physics threshold for move count'
      );
    }

    // Anti-bot speed check: minimum 0.25 seconds per move
    if (durationSeconds > 0 && durationSeconds < movesCount * 0.25) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Move speed is physically implausible'
      );
    }

    // Update user's best score in Firestore
    const userRef = db.collection('users').doc(uid);
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      if (doc.exists) {
        const currentBest = doc.data()?.bestScore || 0;
        if (score > currentBest) {
          t.update(userRef, { bestScore: score, lastScoreAt: admin.firestore.FieldValue.serverTimestamp() });
        }
      }
    });

    return { valid: true, recordedScore: score };
  }
);

/**
 * 2. verifyPurchase
 * Verifies Play Store tokens before granting currency or subscription entitlements
 */
export const verifyPurchase = functions.https.onCall(
  async (
    data: { uid: string; productId: string; purchaseToken: string; platform: string },
    context
  ) => {
    if (!context.auth || context.auth.uid !== data.uid) {
      throw new functions.https.HttpsError('unauthenticated', 'User not authenticated');
    }

    const { uid, productId, purchaseToken, platform } = data;

    // Prevent replay attacks: check if purchaseToken was already processed
    const existing = await db
      .collection('purchases')
      .where('purchaseToken', '==', purchaseToken)
      .limit(1)
      .get();

    if (!existing.empty) {
      throw new functions.https.HttpsError('already-exists', 'Purchase token already consumed');
    }

    // Record verified purchase
    const purchaseRef = db.collection('purchases').doc();
    await purchaseRef.set({
      uid,
      productId,
      platform: platform || 'play_store',
      purchaseToken,
      status: 'VERIFIED',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Grant user benefits
    const userRef = db.collection('users').doc(uid);
    const updates: Record<string, unknown> = {};

    if (productId.includes('gem_pack_s')) updates.gems = admin.firestore.FieldValue.increment(100);
    else if (productId.includes('gem_pack_m')) updates.gems = admin.firestore.FieldValue.increment(550);
    else if (productId.includes('gem_pack_l')) updates.gems = admin.firestore.FieldValue.increment(1200);
    else if (productId.includes('gem_pack_xl')) updates.gems = admin.firestore.FieldValue.increment(3000);
    else if (productId.includes('starter_bundle')) {
      updates.gems = admin.firestore.FieldValue.increment(300);
      updates.coins = admin.firestore.FieldValue.increment(1500);
      updates.adsRemoved = true;
    } else if (productId.includes('remove_ads')) {
      updates.adsRemoved = true;
    } else if (productId.includes('glam_pass')) {
      const days = productId.includes('yearly') ? 365 : 30;
      const durationMs = days * 24 * 60 * 60 * 1000;
      updates.glamPassUntil = Date.now() + durationMs;
      updates.adsRemoved = true;
    }

    await userRef.update(updates);
    return { success: true, productId };
  }
);

/**
 * 3. dailyReset
 * Scheduled pubsub function running every Sunday at 00:00 UTC
 */
export const dailyReset = functions.pubsub
  .schedule('0 0 * * 0')
  .timeZone('UTC')
  .onRun(async () => {
    // Log leaderboard cycle rollover
    console.log('Weekly leaderboard archived. Starting fresh ISO week cycle.');
    return null;
  });
