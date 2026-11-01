import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { soundSystem } from '../../services/soundSystem';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    soundSystem.playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative w-full max-w-[480px] bg-game-surface border-t border-game-border rounded-t-3xl shadow-soft-lg z-10 p-6 safe-bottom max-h-[85vh] flex flex-col"
          >
            {/* Grab Bar Handle */}
            <div className="w-12 h-1.5 bg-game-muted/30 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-game-border/40">
              {title ? (
                <h3 className="text-xl font-heading font-semibold text-game-text">
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                onClick={handleClose}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-game-muted hover:text-game-text hover:bg-game-card transition-colors"
                aria-label="Close sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 pr-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
