import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  // Sparkle particle coordinates and timing
  const sparkles = [
    { id: 1, top: '22%', left: '25%', delay: 0.1, size: 'w-4 h-4' },
    { id: 2, top: '18%', right: '22%', delay: 0.3, size: 'w-5 h-5' },
    { id: 3, top: '48%', left: '16%', delay: 0.2, size: 'w-3 h-3' },
    { id: 4, top: '52%', right: '18%', delay: 0.4, size: 'w-4 h-4' },
    { id: 5, top: '70%', left: '30%', delay: 0.25, size: 'w-5 h-5' },
    { id: 6, top: '68%', right: '28%', delay: 0.15, size: 'w-3 h-3' },
  ];

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
      className="relative flex min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-rose-50 via-pink-100/60 to-purple-100/70 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-900 px-6 text-center select-none"
    >
      {/* Background ambient glowing orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-pink-400/25 blur-3xl dark:bg-pink-600/15"
      />
      <motion.div
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-purple-400/25 blur-3xl dark:bg-purple-600/15"
      />

      {/* Floating sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ scale: 0, opacity: 0, rotate: -30 }}
          animate={{
            scale: [0, 1.2, 0.8, 1],
            opacity: [0, 1, 0.6, 1],
            rotate: [0, 45, 90],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: sparkle.delay,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: sparkle.top,
            left: sparkle.left,
            right: sparkle.right,
          }}
          className={`${sparkle.size} text-pink-400 dark:text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)] pointer-events-none`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </motion.div>
      ))}

      {/* Logo container */}
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Glam Icon Symbol */}
        <motion.div
          animate={{
            rotate: [0, 4, -4, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 p-0.5 shadow-2xl shadow-pink-500/40"
        >
          <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-white/10 backdrop-blur-md">
            <span className="text-5xl select-none filter drop-shadow">💄</span>
          </div>
        </motion.div>

        {/* Shimmer Sweep Brand Text */}
        <div className="relative overflow-hidden px-4 py-2">
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 dark:from-pink-400 dark:via-purple-300 dark:to-pink-300 drop-shadow-sm sm:text-5xl">
            Glam Blocks
          </h1>

          {/* Shimmer sweep animation over logo text */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-2 text-sm font-semibold tracking-wider uppercase text-[var(--text-muted,#71717a)] dark:text-zinc-400"
        >
          Puzzle • Style • Glow
        </motion.p>
      </motion.div>

      {/* Subtle loader bar at bottom */}
      <div className="absolute bottom-12 inset-x-8 max-w-xs mx-auto">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-pink-200/50 dark:bg-zinc-800">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
          />
        </div>
      </div>
    </motion.main>
  );
};

export default SplashScreen;
