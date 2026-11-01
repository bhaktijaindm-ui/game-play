import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlamAvatar } from '../components/avatar/GlamAvatar';
import { CurrencyChip } from '../components/ui/CurrencyChip';
import { IconButton } from '../components/ui/IconButton';
import { DailyRewardModal } from '../components/daily/DailyRewardModal';
import { useAuth } from '../services/authContext';
import { Settings, Play, Sparkles, ShoppingBag, Trophy, Calendar, Crown, Gift } from 'lucide-react';
import { soundSystem } from '../services/soundSystem';

interface HomeScreenProps {
  onPlay: () => void;
  onOpenLooks: () => void;
  onOpenShop: () => void;
  onOpenDaily: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlay,
  onOpenLooks,
  onOpenShop,
  onOpenDaily,
  onOpenLeaderboard,
  onOpenSettings,
}) => {
  const { user, isGlamPassActive, isDailyRewardAvailable, addCurrency } = useAuth();
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);

  const handlePlayClick = () => {
    soundSystem.playPop();
    onPlay();
  };

  const handleQuickClaimBonus = () => {
    soundSystem.playSparkle();
    addCurrency(250, 0, 'quick_bonus');
  };

  const equippedLook = user?.equippedLook || 'look_natural_glow';
  const hasGlamPass = isGlamPassActive();
  const hasDailyGift = isDailyRewardAvailable();

  return (
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-gradient-to-b from-game-bg via-game-surface to-pink-50/50 dark:to-purple-950/20">
      {/* Top Bar HUD */}
      <header className="flex items-center justify-between gap-2 min-h-[48px]">
        {/* Avatar & Player Info */}
        <button
          type="button"
          onClick={onOpenLooks}
          className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-game-card transition-all text-left cursor-pointer"
          aria-label="Open looks studio"
        >
          <div className="relative">
            <GlamAvatar
              lookId={equippedLook}
              size="md"
              showGoldenFrame={hasGlamPass}
            />
            {hasGlamPass && (
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-bold p-1 rounded-full shadow-xs">
                <Crown className="w-3 h-3 fill-amber-950" />
              </span>
            )}
          </div>
          <div>
            <div className="text-[10px] font-bold text-game-primary uppercase tracking-widest">
              Level {user?.level || 1}
            </div>
            <div className="text-sm font-heading font-bold text-game-text truncate max-w-[105px]">
              {user?.displayName || 'Glam Queen'}
            </div>
          </div>
        </button>

        {/* Currency Chips & Settings */}
        <div className="flex items-center gap-1.5">
          <CurrencyChip
            type="coins"
            amount={user?.coins ?? 500}
            onAddClick={() => setIsDailyModalOpen(true)}
            size="sm"
          />
          <CurrencyChip
            type="gems"
            amount={user?.gems ?? 100}
            onAddClick={onOpenShop}
            size="sm"
          />
          <IconButton
            icon={<Settings className="w-5 h-5 text-game-muted" />}
            label="Settings"
            variant="surface"
            size="sm"
            onClick={onOpenSettings}
          />
        </div>
      </header>

      {/* Main Hero Showcase */}
      <div className="my-auto py-2 flex flex-col items-center text-center">
        {/* Brand Title */}
        <div className="mb-2">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-game-primary/80">
            Beauty Block Puzzle
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-game-text tracking-tight mt-0.5">
            Glam Blocks
          </h1>
        </div>

        {/* Best Score & Quick Bonus Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-game-surface border border-game-border shadow-soft">
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-300" />
            <span className="text-[11px] uppercase font-bold text-game-muted tracking-wider">
              Best:
            </span>
            <span className="font-heading font-bold text-sm text-game-text">
              {(user?.bestScore || 0).toLocaleString()}
            </span>
          </div>

          {/* Instant Claim Bonus Coins Button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleQuickClaimBonus}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-heading font-bold text-xs shadow-xs hover:shadow-rosegold active:scale-95 transition-all cursor-pointer"
            title="Claim bonus 250 coins immediately"
          >
            <span>+250 🪙</span>
          </motion.button>
        </div>

        {/* Big Glamorous Play Button with Pulse Animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer my-2"
          onClick={handlePlayClick}
        >
          {/* Radiant Aura Ring */}
          <div className="absolute -inset-4 bg-gradient-to-r from-game-primary via-game-secondary to-amber-300 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-glow" />

          <button
            type="button"
            className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-game-primary via-[#D8157D] to-amber-400 p-1.5 shadow-luxury flex items-center justify-center border-2 border-white/80 cursor-pointer"
            aria-label="Play game"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-game-primary to-[#AD1457] flex flex-col items-center justify-center text-white shadow-inner-gloss">
              <Play className="w-12 h-12 fill-white stroke-none ml-1.5 drop-shadow-md" />
              <span className="font-heading font-bold text-base tracking-wider mt-0.5 drop-shadow">
                PLAY
              </span>
            </div>
          </button>
        </motion.div>

        {/* Daily Gift Prompt Banner */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsDailyModalOpen(true)}
          className={`
            mt-3 px-4 py-2 rounded-2xl border flex items-center gap-2 shadow-soft transition-all cursor-pointer
            ${
              hasDailyGift
                ? 'bg-gradient-to-r from-game-card to-pink-100/60 dark:to-purple-950/40 border-game-primary/40 text-game-primary ring-2 ring-game-primary/20 animate-pulse'
                : 'bg-game-surface border-game-border text-game-muted'
            }
          `}
        >
          <Gift className={`w-4 h-4 ${hasDailyGift ? 'text-game-primary animate-bounce' : 'text-game-muted'}`} />
          <span className="text-xs font-heading font-bold">
            {hasDailyGift ? 'Daily Gift Ready to Claim! 🎁' : 'Daily Streak Active'}
          </span>
        </motion.button>
      </div>

      {/* Feature Navigation Grid */}
      <div className="grid grid-cols-4 gap-2 w-full pt-2 border-t border-game-border/60">
        <button
          type="button"
          onClick={onOpenDaily}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-game-surface border border-game-border shadow-soft hover:bg-game-card active:scale-95 transition-all text-game-text min-h-[56px] cursor-pointer"
        >
          <div className="relative">
            <Calendar className="w-5 h-5 text-game-primary" />
            {hasDailyGift && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-game-danger rounded-full animate-ping" />
            )}
          </div>
          <span className="text-[11px] font-heading font-semibold mt-1">Daily</span>
        </button>

        <button
          type="button"
          onClick={onOpenLooks}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-game-surface border border-game-border shadow-soft hover:bg-game-card active:scale-95 transition-all text-game-text min-h-[56px] cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-[11px] font-heading font-semibold mt-1">Looks</span>
        </button>

        <button
          type="button"
          onClick={onOpenShop}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-game-surface border border-game-border shadow-soft hover:bg-game-card active:scale-95 transition-all text-game-text min-h-[56px] cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 text-amber-500" />
          <span className="text-[11px] font-heading font-semibold mt-1">Boutique</span>
        </button>

        <button
          type="button"
          onClick={onOpenLeaderboard}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-game-surface border border-game-border shadow-soft hover:bg-game-card active:scale-95 transition-all text-game-text min-h-[56px] cursor-pointer"
        >
          <Trophy className="w-5 h-5 text-emerald-500" />
          <span className="text-[11px] font-heading font-semibold mt-1">Ranks</span>
        </button>
      </div>

      {/* Daily Reward Modal */}
      <DailyRewardModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
      />
    </div>
  );
};
