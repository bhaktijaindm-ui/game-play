import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PauseModalProps {
  isOpen?: boolean;
  open?: boolean;
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  open,
  score,
  onResume,
  onRestart,
  onHome,
}) => {
  const show = isOpen ?? open ?? false;
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with gentle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onResume}
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pause-modal-title"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm rounded-3xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] p-6 shadow-2xl border border-white/20 dark:border-white/10 text-center z-10"
          >
            {/* Glam icon header */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
              </svg>
            </div>

            <h2 id="pause-modal-title" className="text-2xl font-black tracking-tight text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)]">
              Game Paused
            </h2>

            {/* Current Score Display */}
            <div className="my-5 rounded-2xl bg-[var(--surface-elevated,#f9fafb)] dark:bg-[var(--surface-elevated,#2c2c36)] p-4 border border-black/5 dark:border-white/5">
              <span className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted,#71717a)]">
                Current Score
              </span>
              <div className="text-3xl font-extrabold text-[var(--primary,#ec4899)] mt-1">
                {score.toLocaleString()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* Primary Resume Button */}
              <button
                type="button"
                onClick={onResume}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-6 py-4 font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:opacity-95 active:scale-95"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Resume Game</span>
              </button>

              {/* Restart Button */}
              <button
                type="button"
                onClick={onRestart}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[var(--surface-elevated,#f9fafb)] dark:bg-[var(--surface-elevated,#2c2c36)] px-6 py-3.5 font-semibold text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)] border border-black/5 dark:border-white/10 transition-all hover:bg-black/5 dark:hover:bg-white/10 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Restart</span>
              </button>

              {/* Home Button */}
              <button
                type="button"
                onClick={onHome}
                className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold text-[var(--text-muted,#71717a)] transition-all hover:text-[var(--text,#18181b)] dark:hover:text-white active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Main Menu</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PauseModal;
