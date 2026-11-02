/**
 * Glam Blocks - Firebase Client Configuration & Service Initializer
 * Initializes Firebase App, Authentication, Cloud Firestore, and App Check
 * from environment variables with safe offline/sandbox fallback.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import type { AppCheck } from 'firebase/app-check';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'glam-blocks.firebaseapp.com';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'glam-blocks';
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'glam-blocks.appspot.com';
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890';
const appId = import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456';
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined;

export const isFirebaseConfigured: boolean = Boolean(apiKey && apiKey !== 'mock-key' && projectId);

const firebaseConfig = {
  apiKey: apiKey || 'mock-api-key',
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  ...(measurementId ? { measurementId } : {}),
};

export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

let appCheckInstance: AppCheck | null = null;
const appCheckKey = import.meta.env.VITE_FIREBASE_APPCHECK_KEY;

if (appCheckKey && typeof window !== 'undefined') {
  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    console.warn('[Firebase] App Check initialization skipped:', err);
  }
}

export const appCheck: AppCheck | null = appCheckInstance;

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
