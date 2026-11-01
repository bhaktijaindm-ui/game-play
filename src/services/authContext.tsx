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
  user: UserProfile;
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
  addCurrency: (coins: number, gems: number, source?: string) => void;
  equipLook: (lookId: string) => void;
  unlockLook: (lookId: string) => void;
  isGlamPassActive: () => boolean;
  isAdFree: () => boolean;
  isDailyRewardAvailable: () => boolean;
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
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.coins === 'number') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    const defaultProfile = createDefaultGuestProfile();
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultProfile));
    } catch {
      // ignore
    }
    return defaultProfile;
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
    }
  }, [user]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } catch {}
      return updated;
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

  const isDailyRewardAvailable = (): boolean => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const storedDate = localStorage.getItem('glam_last_claimed_date');
      if (storedDate === todayStr) return false;

      if (!user.lastRewardClaimedAt) return true;
      const lastClaimDateStr = new Date(user.lastRewardClaimedAt).toISOString().split('T')[0];
      return lastClaimDateStr !== todayStr;
    } catch {
      return true;
    }
  };

  const signInAsGuest = () => {
    try {
      localStorage.setItem('glam_auth_dismissed', 'true');
    } catch {}
    if (!user) {
      const guest = createDefaultGuestProfile();
      setUser(guest);
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(guest));
      } catch {}
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
      const freshGuest = createDefaultGuestProfile();
      setUser(freshGuest);
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(freshGuest));
        localStorage.removeItem('glam_auth_dismissed');
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const deleteAccountAndData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      try {
        localStorage.clear();
      } catch {}
      const freshGuest = createDefaultGuestProfile();
      setUser(freshGuest);
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(freshGuest));
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const claimDailyReward = (day: number, coins: number, gems: number): boolean => {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = Date.now();
    let claimed = false;

    setUser((prev) => {
      const base = prev || createDefaultGuestProfile();
      const updated: UserProfile = {
        ...base,
        coins: Math.max(0, (base.coins || 0) + coins),
        gems: Math.max(0, (base.gems || 0) + gems),
        streakDay: day,
        lastRewardClaimedAt: now,
      };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
        localStorage.setItem('glam_last_claimed_date', todayStr);
      } catch (err) {
        console.error('Failed to save daily reward:', err);
      }
      claimed = true;
      return updated;
    });

    try {
      window.dispatchEvent(
        new CustomEvent('glam-coins-earned', {
          detail: { coins, gems, source: 'daily_reward' },
        })
      );
    } catch {}

    return claimed;
  };

  const spendCurrency = (coins: number, gems: number): boolean => {
    if (!user) return false;
    if ((user.coins || 0) < coins || (user.gems || 0) < gems) return false;

    setUser((prev) => {
      const base = prev || createDefaultGuestProfile();
      const updated: UserProfile = {
        ...base,
        coins: Math.max(0, (base.coins || 0) - coins),
        gems: Math.max(0, (base.gems || 0) - gems),
      };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const addCurrency = (coins: number, gems: number, source = 'reward') => {
    setUser((prev) => {
      const base = prev || createDefaultGuestProfile();
      const updated: UserProfile = {
        ...base,
        coins: Math.max(0, (base.coins || 0) + coins),
        gems: Math.max(0, (base.gems || 0) + gems),
      };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save currency updates:', err);
      }
      return updated;
    });

    if (coins > 0 || gems > 0) {
      try {
        window.dispatchEvent(
          new CustomEvent('glam-coins-earned', {
            detail: { coins, gems, source },
          })
        );
      } catch {}
    }
  };

  const equipLook = (lookId: string) => {
    setUser((prev) => {
      const updated = { ...prev, equippedLook: lookId };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const unlockLook = (lookId: string) => {
    setUser((prev) => {
      if (prev.unlockedLooks.includes(lookId)) return prev;
      const updated = {
        ...prev,
        unlockedLooks: [...prev.unlockedLooks, lookId],
      };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } catch {}
      return updated;
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
        isDailyRewardAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
