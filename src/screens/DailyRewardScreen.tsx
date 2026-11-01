import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/ui/Toast';
import { soundSystem } from '../services/soundSystem';
import { ChevronLeft, Check, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { REWARDS_SCHEDULE } from '../components/daily/DailyRewardModal';

interface DailyRewardScreenProps {
  onBack: () => void;
}

export const DailyRewardScreen: React.FC<DailyRewardScreenProps> = ({ onBack }) => {
  const { user, claimDailyReward, isDailyRewardAvailable } = useAuth();
  const { showToast } = useToast();

  const currentStreak = user?.streakDay || 1;
  const isAvailable = isDailyRewardAvailable();

  const handleClaim = () => {
    if (!isAvailable) {
      showToast('Already claimed today! Next reward unlocks tomorrow.', 'info');
      return;
    }

    const reward = REWARDS_SCHEDULE[(currentStreak - 1) % REWARDS_SCHEDULE.length];
    const nextDay = (currentStreak % 7) + 1;

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFD700', '#FF4081', '#C2185B', '#FFFDF9'],
      });
    } catch {}

    soundSystem.playSparkle();
    claimDailyReward(nextDay, reward.coins, reward.gems);
    showToast(`Claimed Day ${currentStreak} Reward: ${reward.label}!`, 'glam');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-gradient-to-b from-game-bg via-game-surface to-pink-50/50 dark:to-purple-950/20">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between min-h-[48px] mb-3">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-game-surface border border-game-border text-game-muted hover:text-game-text hover:border-game-secondary transition-all cursor-pointer"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-display font-bold text-game-text">
            Daily Glam Rewards
          </h2>
          <div className="w-11" />
        </div>

        {/* Streak Counter Header Banner */}
        <Card variant="gradient" padding="md" className="flex items-center justify-between mb-4 border border-game-border shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-game-secondary to-game-primary flex items-center justify-center text-white shadow-soft">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-game-primary">
                Login Streak
              </span>
              <h3 className="text-xl font-heading font-bold text-game-text">
                {currentStreak} Days Active
              </h3>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isAvailable
                ? 'bg-game-primary/10 border-game-primary/30 text-game-primary font-bold'
                : 'bg-game-surface border-game-border text-game-muted'
            }`}
          >
            {isAvailable ? 'Ready to Claim' : 'Claimed Today'}
          </span>
        </Card>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-2.5">
          {REWARDS_SCHEDULE.map((item) => {
            const isCompleted = item.day < currentStreak || (!isAvailable && item.day === currentStreak);
            const isToday = item.day === currentStreak && isAvailable;

            return (
              <motion.div
                key={item.day}
                whileHover={isToday ? { scale: 1.02 } : {}}
                className={`
                  p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-between relative
                  ${item.isGrand ? 'col-span-2 xs:col-span-3 bg-gradient-to-r from-pink-500/10 via-amber-400/10 to-purple-500/10 border-amber-400/60' : ''}
                  ${isToday ? 'bg-game-surface border-game-primary ring-2 ring-game-primary/30 shadow-luxury' : ''}
                  ${isCompleted ? 'bg-game-surface/50 border-game-border opacity-70' : 'bg-game-surface border-game-border'}
                `}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold uppercase text-game-muted">
                    Day {item.day}
                  </span>
                  {isCompleted && <Check className="w-4 h-4 text-game-success stroke-[3]" />}
                </div>

                <div className="text-3xl my-2 drop-shadow-sm">
                  {isCompleted ? '✨' : item.icon}
                </div>

                <div className="text-xs font-heading font-bold text-game-text">
                  {item.coins.toLocaleString()} Coins
                </div>

                {item.gems > 0 && (
                  <div className="text-[10px] font-bold text-purple-600 dark:text-purple-300">
                    +{item.gems} Gems 💎
                  </div>
                )}

                {isToday && (
                  <div className="mt-2 text-[10px] font-bold text-game-primary bg-game-card px-2 py-0.5 rounded-full border border-game-primary/30">
                    READY TODAY
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-game-border/60">
        <button
          onClick={handleClaim}
          disabled={!isAvailable}
          className={`
            w-full min-h-[48px] rounded-2xl flex items-center justify-center gap-2 font-heading font-bold text-sm shadow-luxury transition-all cursor-pointer
            ${
              isAvailable
                ? 'bg-gradient-to-r from-game-primary via-pink-600 to-amber-500 text-white hover:opacity-95 active:scale-98 animate-pulse-glow'
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
              <span>Claimed Today - Next in 24 Hours</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
