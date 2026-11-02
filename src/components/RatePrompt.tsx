import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface RatePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onRate?: (rating: number) => void;
}

const STORAGE_KEY = 'glam_blocks_rated';

export const shouldShowRatePrompt = (starsEarned: number): boolean => {
  if (starsEarned < 3) return false;
  try {
    const hasRated = localStorage.getItem(STORAGE_KEY);
    return !hasRated;
  } catch {
    return false;
  }
};

export const RatePrompt: React.FC<RatePromptProps> = ({
  isOpen,
  onClose,
  onRate,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRate = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    onRate?.(selectedRating);
    // Link to store review
    window.open('https://play.google.com/store/apps/details?id=com.glamblocks.game', '_blank');
    onClose();
  };

  const handleMaybeLater = () => {
    try {
      // Record a timestamp to avoid showing on immediate next turn
      localStorage.setItem(`${STORAGE_KEY}_postponed`, Date.now().toString());
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleMaybeLater}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rate-prompt-title"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm rounded-3xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] p-6 shadow-2xl border border-white/20 dark:border-white/10 text-center z-10"
          >
            {/* Crown / Star icon badge */}
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
              <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>

            <h2 id="rate-prompt-title" className="text-xl font-bold text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)]">
              Enjoying Glam Blocks?
            </h2>

            <p className="mt-2 text-sm text-[var(--text-muted,#71717a)]">
              You just styled a flawless 3-star look! Please take a quick second to support us on the Play Store.
            </p>

            {/* Interactive Stars */}
            <div className="my-5 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = (hoverRating ?? selectedRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                  >
                    <svg
                      className={`w-9 h-9 transition-colors ${
                        isLit ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-gray-300 dark:text-zinc-600 fill-transparent'
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleRate}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-pink-500/25 transition-all hover:opacity-95 active:scale-95"
              >
                <span>Rate on Play Store</span>
              </button>

              <button
                type="button"
                onClick={handleMaybeLater}
                className="w-full rounded-2xl py-2.5 text-sm font-medium text-[var(--text-muted,#71717a)] transition-colors hover:text-[var(--text,#18181b)] dark:hover:text-white"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RatePrompt;
