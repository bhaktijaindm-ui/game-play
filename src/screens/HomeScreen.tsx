import React from 'react';
import { motion } from 'framer-motion';
import { GlamAvatar } from '../components/avatar/GlamAvatar';
import { CurrencyChip } from '../components/ui/CurrencyChip';
import { IconButton } from '../components/ui/IconButton';
import { useAuth } from '../services/authContext';
import { Settings, Play, Sparkles, ShoppingBag, Trophy, Calendar, Crown } from 'lucide-react';
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
  const { user, isGlamPassActive } = useAuth();

  const handlePlayClick = () => {
    soundSystem.playPop();
    onPlay();
  };

  const equippedLook = user?.equippedLook || 'look_natural_glow';
  const hasGlamPass = isGlamPassActive();

  return (
    <div className="flex-1 flex flex-col justify-between p-5 safe-top safe-bottom bg-gradient-to-b from-game-bg via-game-surface to-pink-50 dark:to-purple-950/20">
      {/* Top Bar HUD */}
      <div className="flex items-center justify-between gap-2">
        {/* Avatar & Player Info */}
        <div
          onClick={onOpenLooks}
          className="flex items-center gap-2.5 cursor-pointer p-1 rounded-2xl hover:bg-game-card/80 transition-colors"
          title="Customize Avatar & Looks"
        >
          <div className="relative">
            <GlamAvatar
              lookId={equippedLook}
              size="md"
              showGoldenFrame={hasGlamPass}
            />
            {hasGlamPass && (
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-bold p-1 rounded-full shadow-sm">
                <Crown className="w-3 h-3 fill-amber-950" />
              </span>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-game-primary uppercase tracking-wider">
              Level {user?.level || 1}
            </div>
            <div className="text-sm font-heading font-semibold text-game-text truncate max-w-[110px]">
              {user?.displayName || 'Glam Player'}
            </div>
          </div>
        </div>

        {/* Currency Chips & Settings */}
        <div className="flex items-center gap-1.5">
          <CurrencyChip
            type="coins"
            amount={user?.coins || 0}
            onAddClick={onOpenShop}
            size="sm"
          />
          <CurrencyChip
            type="gems"
            amount={user?.gems || 0}
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
      </div>

      {/* Hero Section: Best Score & High-Fashion Showcase */}
      <div className="my-auto py-4 flex flex-col items-center text-center">
        {/* Score Banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-game-surface border border-game-border shadow-soft mb-6"
        >
          <Trophy className="w-5 h-5 text-amber-400 fill-amber-300" />
          <div className="text-left">
            <span className="block text-[10px] uppercase font-bold text-game-muted tracking-wider">
              Best Score
            </span>
            <span className="font-heading font-bold text-xl text-game-text">
              {(user?.bestScore || 0).toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Big Glamorous Play Button with Pulse Animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer mb-6"
          onClick={handlePlayClick}
        >
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-3 bg-gradient-to-r from-game-primary via-purple-500 to-amber-400 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse-glow" />

          <button className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-game-primary via-[#FF4DAF] to-[#FFA07A] p-1.5 shadow-2xl flex items-center justify-center border-2 border-white/60">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-game-primary to-[#D8157D] flex flex-col items-center justify-center text-white shadow-inner-gloss">
              <Play className="w-12 h-12 fill-white stroke-none ml-1.5 drop-shadow-md" />
              <span className="font-heading font-bold text-base tracking-wider mt-1 drop-shadow">
                PLAY
              </span>
            </div>
          </button>
        </motion.div>

        <p className="text-xs font-medium text-game-muted tracking-wide">
          Clear lines & unlock glamorous makeup looks!
        </p>
      </div>

      {/* Bottom Feature Navigation Grid */}
      <div className="grid grid-cols-4 gap-2.5 w-full pt-2 border-t border-game-border/60">
        {/* Daily Reward Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenDaily}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-game-surface border border-game-border shadow-soft hover:bg-game-card transition-all text-game-text min-h-[64px]"
        >
          <div className="relative">
            <Calendar className="w-6 h-6 text-pink-500" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-game-danger rounded-full animate-ping" />
          </div>
          <span className="text-[11px] font-heading font-semibold mt-1.5">
            Daily
          </span>
        </motion.button>

        {/* Looks Collection Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenLooks}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-game-surface border border-game-border shadow-soft hover:bg-game-card transition-all text-game-text min-h-[64px]"
        >
          <Sparkles className="w-6 h-6 text-purple-500" />
          <span className="text-[11px] font-heading font-semibold mt-1.5">
            Looks
          </span>
        </motion.button>

        {/* Shop Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenShop}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-game-surface border border-game-border shadow-soft hover:bg-game-card transition-all text-game-text min-h-[64px]"
        >
          <ShoppingBag className="w-6 h-6 text-amber-500" />
          <span className="text-[11px] font-heading font-semibold mt-1.5">
            Shop
          </span>
        </motion.button>

        {/* Leaderboard Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenLeaderboard}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-game-surface border border-game-border shadow-soft hover:bg-game-card transition-all text-game-text min-h-[64px]"
        >
          <Trophy className="w-6 h-6 text-emerald-500" />
          <span className="text-[11px] font-heading font-semibold mt-1.5">
            Ranks
          </span>
        </motion.button>
      </div>
    </div>
  );
};
