import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ChevronRight, Sparkles, Trophy, Calendar } from 'lucide-react';
import { soundSystem } from '../services/soundSystem';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const CARDS = [
  {
    id: 'play',
    title: 'How to Play',
    subtitle: 'Place & Clear Cosmetic Blocks',
    description:
      'Drag lipstick, eyeshadow, and skincare blocks onto the 8x8 grid. Complete horizontal or vertical lines to clear them and score big combos!',
    icon: <Sparkles className="w-16 h-16 text-game-primary animate-pulse" />,
    badge: 'Step 1',
    gradient: 'from-pink-500/20 to-purple-500/10',
  },
  {
    id: 'looks',
    title: 'Collect Glam Looks',
    subtitle: 'Express Your Beauty Style',
    description:
      'Every game earns points towards unlocking exquisite makeup looks. Decorate your avatar with cat-eye wings, 24K gold highlighter, and chic lipsticks!',
    icon: <Trophy className="w-16 h-16 text-amber-500 animate-bounce" />,
    badge: 'Step 2',
    gradient: 'from-amber-500/20 to-pink-500/10',
  },
  {
    id: 'rewards',
    title: 'Daily Beauty Rewards',
    subtitle: 'Streak Prizes & Boosters',
    description:
      'Check in daily for escalating rewards! Collect gems, coins, and powerful boosters like the Glam Bomb and Shape Shuffle to conquer tricky boards.',
    icon: <Calendar className="w-16 h-16 text-game-secondary" />,
    badge: 'Step 3',
    gradient: 'from-purple-500/20 to-indigo-500/10',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    soundSystem.playClick();
    if (currentIndex < CARDS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    soundSystem.playClick();
    onComplete();
  };

  const currentCard = CARDS[currentIndex];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 safe-top safe-bottom bg-game-bg">
      {/* Top Header with Skip Button */}
      <div className="flex items-center justify-between min-h-[44px]">
        <div className="flex items-center gap-1.5">
          {CARDS.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-game-primary'
                  : 'w-2 bg-game-border'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleSkip}
          className="min-h-[44px] min-w-[44px] px-3 flex items-center justify-center text-sm font-semibold text-game-muted hover:text-game-text transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Swiping Card Content */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className={`w-full max-w-xs bg-gradient-to-b ${currentCard.gradient} border border-game-border rounded-3xl p-8 flex flex-col items-center text-center shadow-soft-lg`}
          >
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-game-surface border border-game-border rounded-full text-game-primary mb-6 shadow-sm">
              {currentCard.badge}
            </span>

            <div className="w-24 h-24 rounded-2xl bg-game-surface flex items-center justify-center shadow-soft mb-6 border border-white/60">
              {currentCard.icon}
            </div>

            <h2 className="text-2xl font-heading font-bold text-game-text mb-1">
              {currentCard.title}
            </h2>
            <p className="text-xs font-semibold text-game-primary mb-3">
              {currentCard.subtitle}
            </p>
            <p className="text-sm text-game-muted leading-relaxed">
              {currentCard.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Button */}
      <div className="w-full">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          icon={currentIndex < CARDS.length - 1 ? <ChevronRight /> : <Sparkles />}
        >
          {currentIndex < CARDS.length - 1 ? 'Next' : 'Get Started'}
        </Button>
      </div>
    </div>
  );
};
