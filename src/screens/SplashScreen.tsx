import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SplashScreenProps {
  onFinish?: () => void;
  onSignIn?: () => void;
}

const BEAUTY_TIPS = [
  'Did you know? Pure Shades (single color lines) double your score!',
  'Nani’s Rang Book contains 7 secret signature makeup looks to discover.',
  'Clearing rows 1-3 paints Eyes, rows 4-6 cheeks, and rows 7-8 lips!',
  'Renovating rooms in Gulab Mahal Salon grants permanent coin bonuses.',
  'Sparkle Energy regenerates automatically every 12 minutes.',
  'Serving all 3 salon clients completes the day’s master challenge!',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, onSignIn }) => {
  // Stages: 'publisher' (1.2s) -> 'gameSplash' -> 'loading'
  const [stage, setStage] = useState<'publisher' | 'gameSplash' | 'loading'>('publisher');
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Stage 1: Publisher splash duration 1.2s
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('gameSplash');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Loading Carousel & Progress Bar
  useEffect(() => {
    if (stage === 'loading') {
      const tipInterval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % BEAUTY_TIPS.length);
      }, 2000);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            clearInterval(tipInterval);
            setTimeout(() => onFinish?.(), 300);
            return 100;
          }
          return prev + 12;
        });
      }, 100);

      return () => {
        clearInterval(tipInterval);
        clearInterval(progressInterval);
      };
    }
  }, [stage, onFinish]);

  const handleStartPlay = () => {
    setStage('loading');
  };

  return (
    <main className="relative flex min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex-col items-center justify-center overflow-hidden select-none text-center">
      <AnimatePresence mode="wait">
        {/* ============================================================ */}
        {/* STAGE 1: PUBLISHER-STYLE SPLASH (1.2s)                      */}
        {/* ============================================================ */}
        {stage === 'publisher' && (
          <motion.div
            key="publisher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#E6177F] text-white p-6"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="w-20 h-20 rounded-3xl bg-white text-[#E6177F] shadow-2xl flex items-center justify-center text-4xl border-4 border-amber-300">
                🌹
              </div>
              <h1 className="text-2xl font-heading font-black tracking-wider text-white">
                GULAB MAHAL
              </h1>
              <span className="text-xs uppercase tracking-widest text-pink-200 font-semibold">
                Original Game Studios • Rangpur
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* STAGE 2: GAME SPLASH (Key Art & Play Button)                */}
        {/* ============================================================ */}
        {stage === 'gameSplash' && (
          <motion.div
            key="gameSplash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col justify-between items-center bg-gradient-to-b from-[#6A3FC8] via-[#8E5CF2] to-[#E6177F] text-white p-6 overflow-hidden"
          >
            {/* Background Striped Pattern */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,#000,#000_20px,transparent_20px,transparent_40px)]" />

            {/* Top Logo & Title */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative z-10 pt-8"
            >
              <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-heading font-bold text-amber-200 uppercase tracking-widest border border-amber-300/40">
                ✨ The Face is Your Board
              </span>
              <h1 className="text-4xl font-heading font-black tracking-wide text-white mt-2 game-stroke">
                GLAM BLOCKS
              </h1>
              <h2 className="text-sm font-heading font-bold text-pink-200 tracking-wider">
                The Gulab Mahal Salon
              </h2>
            </motion.div>

            {/* Center Illustrated Cast Art (Anaya, Zoya, Kabir, Kajal) */}
            <div className="relative z-10 flex flex-col items-center my-4">
              <div className="relative w-64 h-56 flex items-center justify-center">
                {/* Kabir (Left Back) */}
                <div className="absolute left-4 bottom-14 w-20 h-20 rounded-3xl bg-[#3DA9FC] border-3 border-white shadow-xl flex items-center justify-center text-4xl -rotate-6">
                  🔧
                </div>

                {/* Zoya (Right Back) */}
                <div className="absolute right-4 bottom-14 w-20 h-20 rounded-3xl bg-[#34D399] border-3 border-white shadow-xl flex items-center justify-center text-4xl rotate-6">
                  💅🏽
                </div>

                {/* Anaya (Heroine Center Foreground) */}
                <div className="absolute bottom-2 z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-[#E6177F] to-[#FF8FB8] border-4 border-[#F5B53C] shadow-2xl flex items-center justify-center text-6xl">
                  👩🏽‍🦱
                </div>

                {/* Kajal the Cat */}
                <div className="absolute -bottom-1 right-12 z-20 w-11 h-11 rounded-2xl bg-[#140E26] border-2 border-[#F5B53C] flex items-center justify-center text-xl shadow-lg">
                  🐈‍⬛
                </div>
              </div>

              <div className="mt-2 text-xs font-heading font-semibold text-pink-100 max-w-[240px]">
                Inherit Nani’s salon, master the 7 looks of the Rang Book, and bring beauty to Rangpur!
              </div>
            </div>

            {/* Bottom Play Button & Restore Link */}
            <div className="relative z-10 w-full flex flex-col items-center space-y-3 pb-6">
              {/* Big Round Play Button */}
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleStartPlay}
                className="relative w-24 h-24 rounded-full bg-gradient-to-b from-[#5fe371] via-[#3FBF4F] to-[#2fa33d] border-4 border-white shadow-[0_12px_32px_rgba(63,191,79,0.55)] flex flex-col items-center justify-center text-white active:translate-y-1 transition-all"
              >
                <span className="text-3xl filter drop-shadow">🖌️</span>
                <span className="text-xs font-heading font-black tracking-wide uppercase game-stroke">
                  PLAY
                </span>
              </motion.button>

              <button
                type="button"
                onClick={onSignIn ? onSignIn : handleStartPlay}
                className="text-xs font-semibold text-white/80 hover:text-white underline pt-1"
              >
                Restore Purchases / Sign In
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* STAGE 3: LOADING SCREEN (Key Art, Shimmer Pill, Tips Carousel) */}
        {/* ============================================================ */}
        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between items-center bg-gradient-to-b from-[#140E26] via-[#231A45] to-[#140E26] text-white p-8"
          >
            {/* Top Logo */}
            <div className="pt-12 text-center">
              <span className="text-4xl block mb-2">💄</span>
              <h2 className="text-2xl font-heading font-bold text-white game-stroke">
                Loading Gulab Mahal...
              </h2>
            </div>

            {/* Rotating Carousel of Beauty Tips */}
            <div className="w-full max-w-[320px] p-4 rounded-2xl bg-white/10 border border-[#F5B53C]/40 backdrop-blur-md shadow-lg min-h-[90px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs font-medium text-amber-200 text-center leading-relaxed"
                >
                  {BEAUTY_TIPS[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Shimmer Pill Progress Bar */}
            <div className="w-full max-w-[280px] pb-10">
              <div className="flex justify-between text-[11px] font-heading font-bold mb-1.5 text-pink-300">
                <span>PREPARING SALON</span>
                <span className="tabular-nums">{progress}%</span>
              </div>

              <div className="w-full h-4 rounded-full bg-white/15 p-0.5 border border-white/30 overflow-hidden relative shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF8FB8] via-[#E6177F] to-[#F5B53C] transition-all duration-150 shimmer-track"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default SplashScreen;
