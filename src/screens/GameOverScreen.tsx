import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../services/authContext';
import { adsProvider } from '../services/ads';
import { soundSystem } from '../services/soundSystem';
import { Trophy, RotateCcw, Home, Film, Gem } from 'lucide-react';
import { GAME_RULES } from '../config/product.config';
import { useToast } from '../components/ui/Toast';
import confetti from 'canvas-confetti';

interface GameOverScreenProps {
  score: number;
  coinsEarned: number;
  onPlayAgain: () => void;
  onContinueGame: () => void;
  onHome: () => void;
}

const GAME_OVER_COUNT_KEY = 'glam_blocks_game_over_count';

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  coinsEarned,
  onPlayAgain,
  onContinueGame,
  onHome,
}) => {
  const { user, isAdFree, spendCurrency } = useAuth();
  const { showToast } = useToast();

  const [continued, setContinued] = useState(false);
  const bestScore = user?.bestScore || 0;
  const isNewRecord = score >= bestScore && score > 0;

  // Interstitial ad check and celebratory particles on high score
  useEffect(() => {
    if (isNewRecord) {
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#D4AF37', '#FF4081', '#C2185B', '#FFFFFF'],
        });
      } catch {}
    }

    try {
      const count = parseInt(localStorage.getItem(GAME_OVER_COUNT_KEY) || '0', 10) + 1;
      localStorage.setItem(GAME_OVER_COUNT_KEY, count.toString());

      if (count > 3 && count % 3 === 0 && !isAdFree()) {
        adsProvider.showInterstitial(() => {});
      }
    } catch {}
  }, [isNewRecord, isAdFree]);

  const handleContinueWithGems = () => {
    if (continued) return;
    const ok = spendCurrency(0, GAME_RULES.CONTINUE_COST_GEMS);
    if (!ok) {
      showToast('Not enough gems! Visit the boutique.', 'warning');
      return;
    }
    soundSystem.playPowerup();
    setContinued(true);
    showToast('Board refreshed! Keep playing!', 'glam');
    onContinueGame();
  };

  const handleContinueWithAd = () => {
    if (continued) return;
    adsProvider.showRewardedAd(
      () => {
        soundSystem.playPowerup();
        setContinued(true);
        showToast('Ad completed! Board refreshed!', 'glam');
        onContinueGame();
      },
      () => {}
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 safe-top safe-bottom bg-gradient-to-b from-game-bg via-game-surface to-pink-50/50 dark:to-purple-950/20 text-center">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-2"
      >
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-game-danger/10 text-game-danger border border-game-danger/30 mb-2">
          Out of Space
        </span>
        <h1 className="text-3xl font-display font-bold text-game-text">
          Game Over
        </h1>
        {isNewRecord && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 to-yellow-400 px-3.5 py-1 rounded-full shadow-xs border border-amber-200 mt-2 animate-bounce">
            <Trophy className="w-3.5 h-3.5 fill-amber-950" />
            <span>NEW HIGH SCORE!</span>
          </div>
        )}
      </motion.div>

      {/* Main Score & Rewards Card */}
      <div className="w-full max-w-xs mx-auto my-auto py-2">
        <Card variant="gradient" padding="lg" className="border border-game-border shadow-luxury">
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-game-muted">
              Final Beauty Score
            </span>
            <div className="text-4xl font-display font-bold text-game-primary mt-1">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-game-border text-left">
            <div className="bg-game-surface p-2.5 rounded-2xl border border-game-border">
              <span className="block text-[10px] font-bold uppercase text-game-muted">
                Best Score
              </span>
              <span className="font-heading font-bold text-base text-game-text">
                {Math.max(score, bestScore).toLocaleString()}
              </span>
            </div>

            <div className="bg-game-surface p-2.5 rounded-2xl border border-game-border">
              <span className="block text-[10px] font-bold uppercase text-game-muted">
                Coins Earned
              </span>
              <span className="font-heading font-bold text-base text-amber-500 flex items-center gap-1">
                🪙 +{coinsEarned.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs mx-auto flex flex-col gap-2.5">
        {/* Continue Options */}
        {!continued && (
          <div className="grid grid-cols-2 gap-2 mb-1">
            <Button
              variant="accent"
              size="sm"
              onClick={handleContinueWithGems}
              icon={<Gem className="w-4 h-4 text-gray-900" />}
              className="text-xs font-heading font-bold min-h-[44px]"
            >
              50 Gems
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleContinueWithAd}
              icon={<Film className="w-4 h-4" />}
              className="text-xs font-heading font-bold min-h-[44px]"
            >
              Watch Ad
            </Button>
          </div>
        )}

        {/* Play Again */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={onPlayAgain}
          icon={<RotateCcw className="w-5 h-5" />}
          className="font-heading font-bold shadow-luxury"
        >
          Play Again
        </Button>

        {/* Home */}
        <Button
          variant="ghost"
          size="md"
          fullWidth
          onClick={onHome}
          icon={<Home className="w-5 h-5" />}
          className="font-heading font-semibold"
        >
          Main Menu
        </Button>
      </div>
    </div>
  );
};
