import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut as firebaseSignOut,
  deleteUser,
  updateProfile,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

/**
 * Maps Firebase Auth error codes into friendly user messages.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const err = error as { code: string; message?: string };
    switch (err.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/operation-not-allowed':
        return 'This authentication method is currently disabled.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled by user.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked. Please allow popups for this site.';
      case 'auth/requires-recent-login':
        return 'This operation is sensitive and requires recent authentication. Please sign in again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/credential-already-in-use':
        return 'This email is already linked with another account.';
      case 'auth/too-many-requests':
        return 'Access to this account has been temporarily disabled due to many failed login attempts. Try again later.';
      default:
        return err.message || 'An authentication error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred during authentication.';
}

/**
 * Signs in user with Google OAuth popup.
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Signs in user with email and password.
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    return result.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Registers a new user with email, password, and optional display name or options.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  options?: string | { displayName?: string; marketingConsent?: boolean }
): Promise<User> {
  const displayName = typeof options === 'string' ? options : options?.displayName || '';
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName.trim()) {
      await updateProfile(result.user, {
        displayName: displayName.trim(),
      });
    }
    return result.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Signs in user anonymously as guest.
 */
export async function signInAsGuest(): Promise<User> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Upgrades an anonymous guest account into a permanent email/password account.
 */
export async function upgradeGuestAccount(email: string, password: string): Promise<User> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No active guest session found to upgrade.');
    }

    const credential = EmailAuthProvider.credential(email.trim(), password);
    const result = await linkWithCredential(currentUser, credential);
    return result.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Sends a password reset email.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Sends email verification to the currently signed-in user.
 */
export async function sendVerification(): Promise<void> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in to verify.');
    }
    await sendEmailVerification(currentUser);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Signs out the currently signed-in user.
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Deletes user account: removes Firestore user document and then deletes auth account.
 */
export async function deleteAccount(): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No active user account found to delete.');
  }

  const uid = currentUser.uid;

  try {
    // 1. Remove Firestore user document
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
  } catch (firestoreError) {
    console.warn('Could not clean up Firestore user data prior to deletion:', firestoreError);
  }

  try {
    // 2. Delete the Firebase Auth user
    await deleteUser(currentUser);
  } catch (authError) {
    throw new Error(getAuthErrorMessage(authError));
  }
}

/**
 * Subscribes to authentication state changes.
 */
export function onAuthChanged(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

/**
 * Gets the current authenticated user synchronously.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
