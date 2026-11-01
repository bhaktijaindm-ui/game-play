import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectUserRegionTier } from '../config/pricing.config';

export interface UserProfile {
  uid: string;
  isAnonymous: boolean;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  createdAt: number;
  country: string;
  theme: 'light' | 'dark' | 'system';
  marketingConsent: boolean;
  consentTimestamp: number;
  coins: number;
  gems: number;
  adsRemoved: boolean;
  glamPassUntil: number | null; // Timestamp or null
  streakDay: number;
  lastRewardClaimedAt: number | null;
  bestScore: number;
  level: number;
  unlockedLooks: string[];
  equippedLook: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, marketingConsent: boolean) => Promise<void>;
  signInAsGuest: () => void;
  signOutUser: () => Promise<void>;
  deleteAccountAndData: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  claimDailyReward: (day: number, coins: number, gems: number) => boolean;
  spendCurrency: (coins: number, gems: number) => boolean;
  addCurrency: (coins: number, gems: number) => void;
  equipLook: (lookId: string) => void;
  unlockLook: (lookId: string) => void;
  isGlamPassActive: () => boolean;
  isAdFree: () => boolean;
}

const STORAGE_KEY_USER = 'glam_blocks_user_profile';

const createDefaultGuestProfile = (): UserProfile => {
  const region = detectUserRegionTier();
  return {
    uid: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    isAnonymous: true,
    displayName: 'Glam Guest',
    email: null,
    photoURL: null,
    createdAt: Date.now(),
    country: region === 'IN' ? 'IN' : 'US',
    theme: 'system',
    marketingConsent: false,
    consentTimestamp: Date.now(),
    coins: 500, // Generous starting balance
    gems: 100,
    adsRemoved: false,
    glamPassUntil: null,
    streakDay: 1,
    lastRewardClaimedAt: null,
    bestScore: 0,
    level: 1,
    unlockedLooks: ['look_natural_glow'],
    equippedLook: 'look_natural_glow',
  };
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Sync to local storage on any user change
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY_USER);
      } catch {
        // ignore
      }
    }
  }, [user]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  };

  const isGlamPassActive = (): boolean => {
    if (!user || !user.glamPassUntil) return false;
    return user.glamPassUntil > Date.now();
  };

  const isAdFree = (): boolean => {
    if (!user) return false;
    return user.adsRemoved || isGlamPassActive();
  };

  const signInAsGuest = () => {
    if (!user) {
      const guest = createDefaultGuestProfile();
      setUser(guest);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate OAuth login if Firebase not configured or in browser preview
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUser((prev) => {
        const base = prev || createDefaultGuestProfile();
        return {
          ...base,
          uid: prev?.isAnonymous ? prev.uid : `google_${Date.now()}`,
          isAnonymous: false,
          displayName: 'Beauty Queen',
          email: 'glam.player@example.com',
          marketingConsent: true,
          consentTimestamp: Date.now(),
        };
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const displayName = email.split('@')[0] || 'Glam Player';
      setUser((prev) => {
        const base = prev || createDefaultGuestProfile();
        return {
          ...base,
          uid: prev?.isAnonymous ? prev.uid : `user_${Date.now()}`,
          isAnonymous: false,
          displayName,
          email,
        };
      });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, _pass: string, marketingConsent: boolean) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const displayName = email.split('@')[0] || 'Glam Player';
      setUser((prev) => {
        const base = prev || createDefaultGuestProfile();
        return {
          ...base,
          uid: prev?.isAnonymous ? prev.uid : `user_${Date.now()}`,
          isAnonymous: false,
          displayName,
          email,
          marketingConsent,
          consentTimestamp: Date.now(),
        };
      });
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccountAndData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUser(null);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const claimDailyReward = (day: number, coins: number, gems: number): boolean => {
    if (!user) return false;
    const now = Date.now();
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        coins: prev.coins + coins,
        gems: prev.gems + gems,
        streakDay: day,
        lastRewardClaimedAt: now,
      };
    });
    return true;
  };

  const spendCurrency = (coins: number, gems: number): boolean => {
    if (!user) return false;
    if (user.coins < coins || user.gems < gems) return false;

    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        coins: prev.coins - coins,
        gems: prev.gems - gems,
      };
    });
    return true;
  };

  const addCurrency = (coins: number, gems: number) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        coins: prev.coins + coins,
        gems: prev.gems + gems,
      };
    });
  };

  const equipLook = (lookId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, equippedLook: lookId };
    });
  };

  const unlockLook = (lookId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      if (prev.unlockedLooks.includes(lookId)) return prev;
      return {
        ...prev,
        unlockedLooks: [...prev.unlockedLooks, lookId],
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOutUser,
        deleteAccountAndData,
        updateProfile,
        claimDailyReward,
        spendCurrency,
        addCurrency,
        equipLook,
        unlockLook,
        isGlamPassActive,
        isAdFree,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
