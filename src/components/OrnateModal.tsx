import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrnateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  themeColor?: 'purple' | 'blue' | 'cream' | 'gold';
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export const OrnateModal: React.FC<OrnateModalProps> = ({
  isOpen,
  onClose,
  title,
  themeColor = 'purple',
  children,
  maxWidth = 'max-w-sm',
  className = '',
}) => {
  const frameThemes = {
    purple: {
      border: 'border-[#6A3FC8] dark:border-[#7C4DFF]',
      ribbon: 'from-[#A774F0] via-[#6A3FC8] to-[#5B2E9E]',
      shadow: 'shadow-[0_16px_40px_rgba(106,63,200,0.35)]',
      bg: 'bg-gradient-to-b from-[#FFF5F8] to-[#FFF4E4] dark:from-[#231A45] dark:to-[#140E26]',
    },
    blue: {
      border: 'border-[#3DA9FC]',
      ribbon: 'from-[#70C5FF] via-[#3DA9FC] to-[#1E67AF]',
      shadow: 'shadow-[0_16px_40px_rgba(61,169,252,0.35)]',
      bg: 'bg-gradient-to-b from-[#F0F9FF] to-[#FFF4E4] dark:from-[#1E293B] dark:to-[#0F172A]',
    },
    cream: {
      border: 'border-[#D9A28E]',
      ribbon: 'from-[#F5B53C] via-[#E6177F] to-[#6A3FC8]',
      shadow: 'shadow-[0_16px_40px_rgba(230,23,127,0.25)]',
      bg: 'bg-gradient-to-b from-[#FFF9F2] to-[#F8E7C9] dark:from-[#2A2042] dark:to-[#1A1233]',
    },
    gold: {
      border: 'border-[#F5B53C]',
      ribbon: 'from-[#FDD562] via-[#F5B53C] to-[#C98218]',
      shadow: 'shadow-[0_16px_40px_rgba(245,181,60,0.35)]',
      bg: 'bg-gradient-to-b from-[#FFFDF5] to-[#FEF3C7] dark:from-[#2D2010] dark:to-[#1A1233]',
    },
  };

  const selected = frameThemes[themeColor];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[rgba(25,18,40,0.72)] backdrop-blur-md"
          />

          {/* Modal Container with Overshoot Animation */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: { type: 'spring', damping: 22, stiffness: 320 },
            }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            className={`relative w-full ${maxWidth} rounded-[28px] border-4 ${selected.border} ${selected.bg} ${selected.shadow} overflow-visible z-10 ${className}`}
          >
            {/* Top Ribbon Header */}
            {title && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                <div
                  className={`px-6 py-2 rounded-full bg-gradient-to-r ${selected.ribbon} border-2 border-[#F5B53C] shadow-lg flex items-center justify-center`}
                >
                  <h3 className="font-heading text-lg font-bold text-white text-center whitespace-nowrap game-stroke tracking-wide">
                    {title}
                  </h3>
                </div>
              </div>
            )}

            {/* Round Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-[#FF4F7B] hover:bg-[#E6177F] border-2 border-white text-white flex items-center justify-center font-bold text-base shadow-lg active:scale-90 transition-transform z-30"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Body */}
            <div className={`pt-${title ? '8' : '4'} p-5 max-h-[85vh] overflow-y-auto`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
