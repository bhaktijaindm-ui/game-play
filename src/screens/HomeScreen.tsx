import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile, Client } from '../types';
import DailyBriefCard from '../components/DailyBriefCard';

export interface HomeScreenProps {
  user?: Partial<UserProfile> | null;
  coins?: number;
  gems?: number;
  streak?: number;
  level?: number;
  bestScore?: number;
  todayClient?: Client | null;
  onPlay?: (client?: Client | null) => void;
  onNavigate?: (screen: 'home' | 'collections' | 'leaderboard' | 'profile' | 'palette' | 'shop' | 'portfolio' | 'settings' | 'dailyReward') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  coins = 450,
  gems = 25,
  streak = 4,
  level = 7,
  bestScore = 18450,
  todayClient,
  onPlay,
  onNavigate,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Handle Android back button hardware intercept
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setShowExitConfirm(true);
      // Re-push state so user doesn't leave unexpectedly
      window.history.pushState(null, '', window.location.pathname);
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleExitApp = () => {
    setShowExitConfirm(false);
    // Standard web exit / history back
    window.history.go(-2);
  };

  const palettePansFilled = user?.palette?.pans?.filter((p) => p.filled).length ?? 7;
  const paletteTotal = 12;
  const palettePercent = Math.round((palettePansFilled / paletteTotal) * 100);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      className="relative flex min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex-col justify-between overflow-x-hidden bg-[var(--background,#fdf4f8)] dark:bg-[var(--background,#0f0f13)] select-none pb-20"
    >
      {/* Top Bar HUD */}
      <header className="sticky top-0 z-20 flex w-full items-center justify-between bg-[var(--background,#fdf4f8)]/90 dark:bg-[var(--background,#0f0f13)]/90 backdrop-blur-md px-4 py-3 border-b border-black/5 dark:border-white/5">
        {/* User avatar & level badge */}
        <button
          type="button"
          onClick={() => onNavigate?.('profile')}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="relative">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-pink-500 bg-gradient-to-tr from-pink-400 to-purple-500 p-0.5 shadow-md">
              <img
                src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[9px] font-black text-white">
              {level}
            </span>
          </div>
          <div>
            <div className="text-xs font-black text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)] leading-tight">
              {user?.displayName || 'Glam Artist'}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-500">
              <span>🔥</span> {streak} Day Streak
            </div>
          </div>
        </button>

        {/* Currency chips and Settings Gear */}
        <div className="flex items-center gap-2">
          {/* Coins Chip */}
          <button
            type="button"
            onClick={() => onNavigate?.('shop')}
            className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-600 dark:text-amber-400 border border-amber-500/20"
          >
            <span>🪙</span>
            <span>{coins.toLocaleString()}</span>
          </button>

          {/* Gems Chip */}
          <button
            type="button"
            onClick={() => onNavigate?.('shop')}
            className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-black text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
          >
            <span>💎</span>
            <span>{gems.toLocaleString()}</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            aria-label="Settings"
            onClick={() => onNavigate?.('settings')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-muted,#71717a)] hover:text-[var(--text,#18181b)] dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Release Pill Badge */}
        <div className="flex items-center justify-between text-[11px] font-bold text-pink-600 dark:text-pink-400 bg-pink-500/10 px-3.5 py-1.5 rounded-xl border border-pink-500/20">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Glam Blocks 2.0 Live
          </span>
          <span className="font-semibold text-xs text-[var(--text-muted,#71717a)]">The Face is Your Board</span>
        </div>

        {/* Best Score Banner */}
        <div className="flex items-center justify-between rounded-2xl bg-[var(--surface-elevated,#f9fafb)] dark:bg-[var(--surface-elevated,#2c2c36)] px-4 py-2.5 border border-black/5 dark:border-white/5">
          <span className="text-xs font-semibold text-[var(--text-muted,#71717a)]">All-Time Best Score</span>
          <span className="text-sm font-black text-pink-600 dark:text-pink-400">
            {bestScore.toLocaleString()} pts
          </span>
        </div>

        {/* Center: Large Today's Client Card */}
        <DailyBriefCard
          client={todayClient}
          streakCount={streak}
          onPlay={() => onPlay?.(todayClient)}
        />

        {/* Big 56px Primary Play Button with Gentle Glow Pulse */}
        <div className="relative">
          {/* Gentle glow pulse underneath */}
          <motion.div
            animate={{
              scale: [1, 1.04, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 blur-lg"
          />

          <button
            type="button"
            onClick={() => onPlay?.(todayClient)}
            className="relative flex h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-6 font-black text-white shadow-xl transition-all hover:brightness-105 active:scale-[0.98]"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-lg tracking-wide uppercase">Play Now</span>
          </button>
        </div>

        {/* Row of 4 Primary Mobile Hub Tiles */}
        <div className="grid grid-cols-4 gap-2.5 pt-2">
          {/* Daily Beauty Brief */}
          <button
            type="button"
            onClick={() => onNavigate?.('dailyReward')}
            className="flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] p-3 shadow-sm border border-black/5 dark:border-white/5 hover:border-pink-500/30 transition-all active:scale-95 text-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500 mb-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)] leading-tight">
              Daily
            </span>
          </button>

          {/* Collection */}
          <button
            type="button"
            onClick={() => onNavigate?.('collections')}
            className="flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] p-3 shadow-sm border border-black/5 dark:border-white/5 hover:border-pink-500/30 transition-all active:scale-95 text-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 mb-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)] leading-tight">
              Collection
            </span>
          </button>

          {/* Shop */}
          <button
            type="button"
            onClick={() => onNavigate?.('shop')}
            className="flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] p-3 shadow-sm border border-black/5 dark:border-white/5 hover:border-pink-500/30 transition-all active:scale-95 text-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 mb-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)] leading-tight">
              Shop
            </span>
          </button>

          {/* Leaderboard */}
          <button
            type="button"
            onClick={() => onNavigate?.('leaderboard')}
            className="flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] p-3 shadow-sm border border-black/5 dark:border-white/5 hover:border-pink-500/30 transition-all active:scale-95 text-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 mb-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)] leading-tight">
              Leaderboard
            </span>
          </button>
        </div>

        {/* Quick Vanity Access: Palette & Portfolio */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigate?.('palette')}
            className="flex items-center justify-between rounded-xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] px-3 py-2.5 shadow-sm border border-black/5 dark:border-white/5 hover:border-pink-500/30 transition-all active:scale-95"
          >
            <span className="text-xs font-bold text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)]">🎨 Palette</span>
            <span className="text-[10px] font-black bg-pink-500/10 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/20">{palettePercent}%</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('portfolio')}
            className="flex items-center justify-between rounded-xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] px-3 py-2.5 shadow-sm border border-black/5 dark:border-white/5 hover:border-pink-500/30 transition-all active:scale-95"
          >
            <span className="text-xs font-bold text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)]">📸 Portfolio</span>
            <span className="text-[10px] font-semibold text-[var(--text-muted,#71717a)]">Looks →</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav: Home (active), Collections, Leaderboard, Profile */}
      <nav className="fixed bottom-0 inset-x-0 z-30 mx-auto max-w-[480px] bg-[var(--surface-card,#ffffff)]/95 dark:bg-[var(--surface-card,#22222a)]/95 backdrop-blur-lg border-t border-black/5 dark:border-white/5 px-6 py-2 flex items-center justify-between">
        {/* Home */}
        <button
          type="button"
          onClick={() => onNavigate?.('home')}
          className="flex flex-col items-center text-pink-600 dark:text-pink-400 font-bold"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Collections */}
        <button
          type="button"
          onClick={() => onNavigate?.('collections')}
          className="flex flex-col items-center text-[var(--text-muted,#71717a)] hover:text-pink-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-[10px] mt-0.5">Looks</span>
        </button>

        {/* Leaderboard */}
        <button
          type="button"
          onClick={() => onNavigate?.('leaderboard')}
          className="flex flex-col items-center text-[var(--text-muted,#71717a)] hover:text-pink-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[10px] mt-0.5">Rank</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => onNavigate?.('profile')}
          className="flex flex-col items-center text-[var(--text-muted,#71717a)] hover:text-pink-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </nav>

      {/* Exit Bottom Sheet Dialog */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-[480px] rounded-t-3xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] p-6 text-center border-t border-black/10 dark:border-white/10"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <h3 className="text-xl font-black text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)]">
                Exit Glam Blocks?
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted,#71717a)]">
                Don't lose your styling streak! You can return anytime.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 py-3.5 font-bold text-white shadow-md active:scale-95"
                >
                  Keep Playing
                </button>
                <button
                  type="button"
                  onClick={handleExitApp}
                  className="w-full rounded-2xl py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 active:scale-95"
                >
                  Exit Game
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default HomeScreen;
