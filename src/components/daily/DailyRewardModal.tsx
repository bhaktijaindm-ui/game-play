import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../services/authContext';
import { useToast } from '../ui/Toast';
import { soundSystem } from '../../services/soundSystem';
import { X, Flame, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const REWARDS_SCHEDULE = [
  { day: 1, coins: 250, gems: 0, label: '250 Coins', icon: '🪙' },
  { day: 2, coins: 350, gems: 10, label: '350 Coins + 10 Gems', icon: '💎' },
  { day: 3, coins: 500, gems: 15, label: '500 Coins + 15 Gems', icon: '🪙' },
  { day: 4, coins: 750, gems: 25, label: '750 Coins + 25 Gems', icon: '💎' },
  { day: 5, coins: 1000, gems: 35, label: '1,000 Coins + 35 Gems', icon: '🪙' },
  { day: 6, coins: 1500, gems: 50, label: '1,500 Coins + 50 Gems', icon: '💎' },
  { day: 7, coins: 2500, gems: 100, label: 'Grand Beauty Box (2.5K + 100 Gems)', icon: '🎁', isGrand: true },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, claimDailyReward, isDailyRewardAvailable } = useAuth();
  const { showToast } = useToast();

  const currentStreak = user?.streakDay || 1;
  const isAvailable = isDailyRewardAvailable();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const triggerCoinBurst = () => {
    try {
      // Golden confetti shower
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFD700', '#FF4081', '#C2185B', '#FFFDF9'],
        ticks: 160,
      });
    } catch {
      // ignore
    }
  };

  const handleClaim = () => {
    if (!isAvailable) {
      showToast('Already claimed today! Come back tomorrow for the next streak.', 'info');
      return;
    }

    const reward = REWARDS_SCHEDULE[(currentStreak - 1) % REWARDS_SCHEDULE.length];
    const nextDay = (currentStreak % 7) + 1;

    soundSystem.playSparkle();
    triggerCoinBurst();
    claimDailyReward(nextDay, reward.coins, reward.gems);
    showToast(`Claimed ${reward.label}!`, 'glam');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-game-surface border border-game-border shadow-luxury rounded-3xl p-5 overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="daily-reward-title"
          >
            {/* Top Close (X) Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-game-card hover:bg-game-border/80 text-game-muted hover:text-game-text transition-all duration-150 cursor-pointer"
              aria-label="Close daily rewards"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-game-primary p-0.5 shadow-rosegold mb-2">
                <div className="w-full h-full bg-game-surface rounded-[14px] flex items-center justify-center text-2xl">
                  🎁
                </div>
              </div>
              <h2
                id="daily-reward-title"
                className="text-2xl font-heading font-bold text-game-text"
              >
                Daily Beauty Gift
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-xs font-semibold text-game-primary">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Streak: Day {currentStreak} of 7</span>
              </div>
            </div>

            {/* 7-Day Streak Calendar Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {REWARDS_SCHEDULE.map((item) => {
                const isClaimedPast = item.day < currentStreak || (!isAvailable && item.day === currentStreak);
                const isCurrentToday = item.day === currentStreak && isAvailable;
                const isSeventh = item.isGrand;

                return (
                  <div
                    key={item.day}
                    className={`
                      relative p-2 rounded-2xl border flex flex-col items-center justify-between text-center transition-all duration-200
                      ${isSeventh ? 'col-span-2 bg-gradient-to-r from-pink-500/10 via-amber-400/10 to-purple-500/10 border-amber-400/60' : ''}
                      ${
                        isCurrentToday
                          ? 'bg-game-card border-game-primary ring-2 ring-game-primary/30 shadow-soft scale-[1.03]'
                          : isClaimedPast
                          ? 'bg-game-card/40 border-game-border/60 opacity-70'
                          : 'bg-game-surface border-game-border/80'
                      }
                    `}
                  >
                    <span className="text-[10px] font-bold text-game-muted uppercase">
                      Day {item.day}
                    </span>

                    <span className="text-xl my-1 drop-shadow-xs">
                      {isClaimedPast ? '✅' : item.icon}
                    </span>

                    <span className="text-[11px] font-heading font-bold text-game-text leading-tight">
                      {item.coins} 🪙
                    </span>

                    {item.gems > 0 && (
                      <span className="text-[9px] font-bold text-purple-600 dark:text-purple-300">
                        +{item.gems} 💎
                      </span>
                    )}

                    {isCurrentToday && (
                      <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-game-primary text-white text-[8px] font-bold shadow-xs">
                        TODAY
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Claim Button */}
            <button
              onClick={handleClaim}
              disabled={!isAvailable}
              className={`
                w-full min-h-[48px] rounded-2xl flex items-center justify-center gap-2 font-heading font-bold text-sm transition-all duration-200 shadow-luxury cursor-pointer
                ${
                  isAvailable
                    ? 'bg-gradient-to-r from-game-primary to-pink-600 hover:opacity-95 text-white active:scale-98 animate-pulse-glow'
                    : 'bg-game-card border border-game-border text-game-muted cursor-not-allowed opacity-75'
                }
              `}
            >
              {isAvailable ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Claim Day {currentStreak} Gift</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-game-success" />
                  <span>Claimed for Today! Next in 24h</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
