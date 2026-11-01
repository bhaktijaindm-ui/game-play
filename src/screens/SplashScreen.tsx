import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-game-bg via-game-surface to-pink-50 dark:to-purple-950/20 text-center select-none">
      {/* Animated Glowing Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative mb-6"
      >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-[#E91E8C] via-[#9B5DE5] to-[#F5B700] p-1 shadow-glossy-pink animate-pulse-glow flex items-center justify-center">
          <div className="w-full h-full bg-game-surface rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />

            {/* Lipstick / Block hybrid emblem */}
            <div className="text-5xl drop-shadow-md">💄</div>
            <div className="flex gap-1 mt-1">
              <span className="w-3 h-3 rounded-md bg-game-primary shadow-sm" />
              <span className="w-3 h-3 rounded-md bg-game-secondary shadow-sm" />
              <span className="w-3 h-3 rounded-md bg-game-accent shadow-sm" />
            </div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-3 -right-3 text-amber-400"
        >
          <Sparkles className="w-8 h-8 fill-amber-300" />
        </motion.div>
      </motion.div>

      {/* Brand Title with Gradient Typography */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl font-heading font-bold tracking-tight bg-gradient-to-r from-game-primary via-purple-500 to-amber-500 bg-clip-text text-transparent"
      >
        Glam Blocks
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="text-sm font-medium text-game-muted mt-2 tracking-wide"
      >
        The Chic Makeup Block Puzzle
      </motion.p>

      {/* Loading Progress Bar */}
      <div className="w-48 h-1.5 bg-game-card rounded-full mt-10 overflow-hidden border border-game-border/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-r from-game-primary to-game-accent"
        />
      </div>
    </div>
  );
};
