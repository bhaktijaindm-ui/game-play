import React, { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';

export interface OnboardingScreenProps {
  onComplete?: () => void;
}

interface OnboardingCard {
  id: number;
  title: string;
  subtitle: string;
  illustration: React.ReactNode;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const finishOnboarding = () => {
    try {
      localStorage.setItem('hasSeenOnboarding', 'true');
      localStorage.setItem('glam_blocks_has_seen_onboarding', 'true');
    } catch {
      // ignore
    }
    onComplete?.();
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const cards: OnboardingCard[] = [
    {
      id: 0,
      title: 'Drop blocks, clear lines',
      subtitle: 'Fit colorful cosmetic shapes onto the 8x8 grid to blast complete rows and columns.',
      illustration: (
        <div className="relative flex h-52 w-52 items-center justify-center rounded-3xl bg-pink-500/10 dark:bg-pink-500/5 p-4 border border-pink-500/20">
          {/* Mini 3x3 block grid representation */}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                animate={
                  i === 4 || i === 5 || i === 3
                    ? {
                        scale: [1, 1.1, 0.9, 1],
                        opacity: [0.6, 1, 0.4, 0.8],
                        backgroundColor: ['#f472b6', '#ec4899', '#f43f5e', '#f472b6'],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity, delay: (i % 3) * 0.2 }}
                className="h-10 w-10 rounded-xl bg-gradient-to-tr from-pink-400 to-rose-400 shadow-md shadow-pink-500/20"
              />
            ))}
          </div>
          {/* Floating drop shape */}
          <motion.div
            animate={{
              y: [-25, 0, -25],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 rounded-xl bg-purple-500 p-2 shadow-lg shadow-purple-500/30 text-white text-xs font-bold"
          >
            🧩 Match!
          </motion.div>
        </div>
      ),
    },
    {
      id: 1,
      title: 'Every clear paints a real look',
      subtitle: 'Zone clears automatically apply glamorous eyeshadow, blush, and lipstick to your client.',
      illustration: (
        <div className="relative flex h-52 w-52 items-center justify-center rounded-3xl bg-purple-500/10 dark:bg-purple-500/5 p-4 border border-purple-500/20">
          {/* Stylized face avatar */}
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-b from-amber-100 to-rose-200 dark:from-zinc-800 dark:to-zinc-900 border-2 border-white/40 shadow-inner">
            {/* Eyes */}
            <div className="absolute top-11 flex w-20 justify-between px-2">
              <div className="h-2 w-4 rounded-full bg-zinc-800" />
              <div className="h-2 w-4 rounded-full bg-zinc-800" />
            </div>
            {/* Animated Eyeshadow */}
            <motion.div
              animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-9 flex w-20 justify-between px-1"
            >
              <div className="h-2.5 w-6 rounded-full bg-pink-500/70 blur-[1px]" />
              <div className="h-2.5 w-6 rounded-full bg-pink-500/70 blur-[1px]" />
            </motion.div>
            {/* Cheeks */}
            <motion.div
              animate={{ opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="absolute top-16 flex w-28 justify-between px-2"
            >
              <div className="h-4 w-4 rounded-full bg-rose-400/60 blur-[2px]" />
              <div className="h-4 w-4 rounded-full bg-rose-400/60 blur-[2px]" />
            </motion.div>
            {/* Lips */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], filter: ['hue-rotate(0deg)', 'hue-rotate(30deg)', 'hue-rotate(0deg)'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-9 h-3 w-8 rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600 shadow-sm"
            />
          </div>
          {/* Makeup brush sweep animation */}
          <motion.div
            animate={{
              x: [-35, 35, -35],
              y: [-10, 10, -10],
              rotate: [0, 25, 0],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 right-2 text-3xl filter drop-shadow"
          >
            🖌️
          </motion.div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Finish clients, collect & share',
      subtitle: 'Complete bespoke wedding and runway briefs, build your master portfolio, and show off your glam.',
      illustration: (
        <div className="relative flex h-52 w-52 items-center justify-center rounded-3xl bg-amber-500/10 dark:bg-amber-500/5 p-4 border border-amber-500/20">
          {/* Mini Portfolio Cards */}
          <motion.div
            animate={{ rotate: [-8, -4, -8], y: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-1 top-8 h-28 w-24 rounded-2xl bg-white dark:bg-zinc-800 p-2 shadow-lg border border-pink-200 dark:border-zinc-700"
          >
            <div className="h-16 w-full rounded-xl bg-pink-100 dark:bg-pink-950/40 flex items-center justify-center text-xl">
              👰‍♀️
            </div>
            <div className="mt-2 text-center text-[10px] font-bold text-pink-600">Bridal Red</div>
          </motion.div>

          <motion.div
            animate={{ rotate: [8, 4, 8], y: [3, -3, 3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -right-1 top-6 h-28 w-24 rounded-2xl bg-white dark:bg-zinc-800 p-2 shadow-lg border border-amber-200 dark:border-zinc-700"
          >
            <div className="h-16 w-full rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-xl">
              ✨
            </div>
            <div className="mt-2 text-center text-[10px] font-bold text-amber-600">Diwali Gold</div>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white shadow-xl shadow-amber-500/30 text-2xl"
          >
            ⭐
          </motion.div>
        </div>
      ),
    },
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
      className="relative flex min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex-col justify-between overflow-hidden bg-[var(--background,#fdf4f8)] dark:bg-[var(--background,#0f0f13)] p-6 select-none"
    >
      {/* Top Header with Skip Button */}
      <header className="flex w-full items-center justify-between pt-2">
        <div className="text-sm font-bold uppercase tracking-wider text-[var(--primary,#ec4899)]">
          Glam Blocks
        </div>
        <button
          type="button"
          onClick={finishOnboarding}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--text-muted,#71717a)] hover:text-[var(--text,#18181b)] dark:hover:text-white transition-colors"
        >
          Skip
        </button>
      </header>

      {/* Swipeable Card Area */}
      <section className="relative my-auto flex w-full flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex w-full flex-col items-center text-center cursor-grab active:cursor-grabbing"
          >
            {/* Visual illustration */}
            <div className="mb-8">{cards[currentIndex].illustration}</div>

            {/* Title & subtitle */}
            <h2 className="text-2xl font-black text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)]">
              {cards[currentIndex].title}
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--text-muted,#71717a)]">
              {cards[currentIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Bottom Nav: Dots & CTA */}
      <footer className="w-full pb-4 flex flex-col items-center gap-6">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {cards.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-[var(--primary,#ec4899)]'
                  : 'w-2.5 bg-black/15 dark:bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="w-full">
          {currentIndex === cards.length - 1 ? (
            <button
              type="button"
              onClick={finishOnboarding}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-4 font-bold text-white shadow-xl shadow-pink-500/30 transition-all hover:opacity-95 active:scale-95"
            >
              <span>Let's glam ✨</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] py-4 font-bold text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)] shadow-md border border-black/5 dark:border-white/10 transition-all hover:bg-black/5 active:scale-95"
            >
              <span>Continue</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </footer>
    </motion.main>
  );
};

export default OnboardingScreen;
