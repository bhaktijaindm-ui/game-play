import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/ui/Toast';
import { soundSystem } from '../services/soundSystem';
import { ChevronLeft, Gift, Check, Flame } from 'lucide-react';

interface DailyRewardScreenProps {
  onBack: () => void;
}

const REWARDS_SCHEDULE = [
  { day: 1, coins: 150, gems: 0, label: '150 Coins', icon: '🪙' },
  { day: 2, coins: 250, gems: 10, label: '250 Coins + 10 Gems', icon: '💎' },
  { day: 3, coins: 400, gems: 15, label: '400 Coins + 15 Gems', icon: '🪙' },
  { day: 4, coins: 600, gems: 25, label: '600 Coins + 25 Gems', icon: '💎' },
  { day: 5, coins: 850, gems: 35, label: '850 Coins + 35 Gems', icon: '🪙' },
  { day: 6, coins: 1200, gems: 50, label: '1,200 Coins + 50 Gems', icon: '💎' },
  { day: 7, coins: 2000, gems: 100, label: 'Grand Glam Box (2K + 100 Gems)', icon: '🎁', isGrand: true },
];

export const DailyRewardScreen: React.FC<DailyRewardScreenProps> = ({ onBack }) => {
  const { user, claimDailyReward } = useAuth();
  const { showToast } = useToast();

  const currentStreak = user?.streakDay || 1;
  const lastClaimed = user?.lastRewardClaimedAt || 0;

  // Check if claimed in last 20 hours
  const isClaimedToday = Date.now() - lastClaimed < 20 * 60 * 60 * 1000;

  const handleClaim = () => {
    if (isClaimedToday) return;

    const reward = REWARDS_SCHEDULE[(currentStreak - 1) % REWARDS_SCHEDULE.length];
    const nextDay = (currentStreak % 7) + 1;

    soundSystem.playSparkle();
    claimDailyReward(nextDay, reward.coins, reward.gems);
    showToast(`Claimed Day ${currentStreak} Reward: ${reward.label}!`, 'glam');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-game-bg">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between min-h-[44px] mb-2">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-game-surface border border-game-border text-game-muted hover:text-game-text"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-heading font-bold text-game-text">
            Daily Glam Rewards
          </h2>
          <div className="w-11" />
        </div>

        {/* Streak Counter Header Banner */}
        <Card variant="gradient" padding="md" className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white shadow-soft">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-game-primary">
                Login Streak
              </span>
              <h3 className="text-xl font-heading font-bold text-game-text">
                {currentStreak} Days
              </h3>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-game-surface border border-game-border rounded-full text-game-muted">
            {isClaimedToday ? 'Claimed Today' : 'Ready to Claim'}
          </span>
        </Card>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-2.5">
          {REWARDS_SCHEDULE.map((item) => {
            const isCompleted = item.day < currentStreak;
            const isToday = item.day === currentStreak;
            const isFuture = item.day > currentStreak;

            return (
              <motion.div
                key={item.day}
                whileHover={isToday && !isClaimedToday ? { scale: 1.03 } : {}}
                className={`
                  p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-between relative
                  ${item.isGrand ? 'col-span-2 xs:col-span-3 bg-gradient-to-r from-pink-500/10 via-amber-400/10 to-purple-500/10 border-amber-400/60' : ''}
                  ${isToday ? 'bg-game-surface border-game-primary ring-2 ring-game-primary/30 shadow-soft' : ''}
                  ${isCompleted ? 'bg-game-surface/50 border-game-border opacity-60' : ''}
                  ${isFuture ? 'bg-game-surface/70 border-game-border' : ''}
                `}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold uppercase text-game-muted">
                    Day {item.day}
                  </span>
                  {isCompleted && <Check className="w-4 h-4 text-game-success stroke-[3]" />}
                </div>

                <div className="text-3xl my-1.5 drop-shadow-sm">{item.icon}</div>

                <div className="text-xs font-heading font-semibold text-game-text">
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Claim Button */}
      <div className="w-full mt-3">
        <Button
          variant={isClaimedToday ? 'ghost' : 'primary'}
          size="lg"
          fullWidth
          disabled={isClaimedToday}
          onClick={handleClaim}
          icon={isClaimedToday ? <Check className="w-5 h-5 text-game-success" /> : <Gift className="w-5 h-5" />}
        >
          {isClaimedToday ? 'Come Back Tomorrow!' : 'Claim Today\'s Gift'}
        </Button>
      </div>
    </div>
  );
};
