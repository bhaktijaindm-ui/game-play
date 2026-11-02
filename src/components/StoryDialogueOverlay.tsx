import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { DialogueCard } from '../game/story';
import { CORE_CHARACTERS } from '../game/story';

interface StoryDialogueOverlayProps {
  sceneTitle: string;
  cards: DialogueCard[];
  onComplete: () => void;
  className?: string;
}

export const StoryDialogueOverlay: React.FC<StoryDialogueOverlayProps> = ({
  sceneTitle,
  cards,
  onComplete,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex] || cards[0];
  const charInfo = CORE_CHARACTERS[currentCard.characterId];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center p-3 select-none pointer-events-auto ${className}`}>
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleNext} />

      {/* Dialogue Card Container */}
      <motion.div
        key={currentCard.id}
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-[460px] rounded-[24px] bg-gradient-to-b from-[#FFFDF8] to-[#FFF4E4] dark:from-[#2A1F3D] dark:to-[#181126] border-4 border-[#F5B53C] shadow-2xl p-4 mb-2 z-10"
      >
        {/* Top Header: Scene Title & Skip Button */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F5B53C]/30">
          <span className="text-xs font-heading font-bold text-[#E6177F] dark:text-[#FF8FB8] uppercase tracking-wider">
            {sceneTitle}
          </span>
          <button
            onClick={handleSkip}
            className="text-xs font-heading text-[var(--text-muted,#7A6283)] hover:text-[#E6177F] dark:hover:text-white px-2 py-0.5 rounded-full hover:bg-black/5"
          >
            Skip ⏩
          </button>
        </div>

        {/* Content Row: Avatar + Dialogue */}
        <div className="flex items-start gap-3">
          {/* Avatar Ring */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div
              className="w-14 h-14 rounded-2xl border-2 border-[#F5B53C] shadow-md flex items-center justify-center text-2xl"
              style={{ backgroundColor: charInfo?.color || '#E6177F' }}
            >
              {charInfo?.avatarFallback || '👤'}
            </div>
            <span className="mt-1 text-[11px] font-heading font-bold text-[var(--text,#2A1630)] dark:text-white max-w-[64px] text-center truncate">
              {currentCard.speaker}
            </span>
          </div>

          {/* Dialogue Text (max 3 lines) */}
          <div className="flex-1 flex flex-col justify-between min-h-[72px]">
            <p className="text-[13px] leading-snug font-medium text-[var(--text,#2A1630)] dark:text-gray-100 line-clamp-3">
              {currentCard.text}
            </p>

            {/* Bottom Controls: Card Dots & Next Button */}
            <div className="flex items-center justify-between mt-2 pt-1">
              <div className="flex gap-1">
                {cards.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex ? 'bg-[#E6177F] w-4' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="btn-3d-green px-4 py-1.5 rounded-full text-xs font-heading font-bold text-white flex items-center gap-1 active:scale-95 transition-transform"
              >
                <span>{currentIndex < cards.length - 1 ? 'Next' : 'Continue'}</span>
                <span>▶</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
