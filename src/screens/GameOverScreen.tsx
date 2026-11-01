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

  // Interstitial ad trigger check (every 3rd game over, never in first 3 games, never if ad-free)
  useEffect(() => {
    try {
      const count = parseInt(localStorage.getItem(GAME_OVER_COUNT_KEY) || '0', 10) + 1;
      localStorage.setItem(GAME_OVER_COUNT_KEY, count.toString());

      if (count > 3 && count % 3 === 0 && !isAdFree()) {
        adsProvider.showInterstitial(() => {
          // Finished interstitial
        });
      }
    } catch {
      // ignore
    }
  }, [isAdFree]);

  const handleContinueWithGems = () => {
    if (continued) return;
    const ok = spendCurrency(0, GAME_RULES.CONTINUE_COST_GEMS);
    if (!ok) {
      showToast('Not enough gems! Visit the shop.', 'warning');
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
    <div className="flex-1 flex flex-col justify-between p-6 safe-top safe-bottom bg-gradient-to-b from-game-bg via-game-surface to-pink-100/40 dark:to-purple-950/40 text-center">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-4"
      >
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-game-danger/10 text-game-danger border border-game-danger/30 mb-2">
          Out of Space
        </span>
        <h1 className="text-3xl font-heading font-bold text-game-text">
          Game Over
        </h1>
        {isNewRecord && (
          <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-300 mt-2 animate-bounce">
            <Trophy className="w-3.5 h-3.5 fill-amber-400" />
            <span>NEW HIGH SCORE!</span>
          </div>
        )}
      </motion.div>

      {/* Main Score & Rewards Card */}
      <div className="w-full max-w-xs mx-auto my-4">
        <Card variant="gradient" padding="lg">
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-game-muted">
              Final Score
            </span>
            <div className="text-4xl font-heading font-bold text-game-primary mt-1">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-game-border/80 text-left">
            <div className="bg-game-surface p-2.5 rounded-xl border border-game-border">
              <span className="block text-[10px] font-bold uppercase text-game-muted">
                Best Score
              </span>
              <span className="font-heading font-bold text-base text-game-text">
                {Math.max(score, bestScore).toLocaleString()}
              </span>
            </div>

            <div className="bg-game-surface p-2.5 rounded-xl border border-game-border">
              <span className="block text-[10px] font-bold uppercase text-game-muted">
                Earned
              </span>
              <span className="font-heading font-bold text-base text-amber-500 flex items-center gap-1">
                🪙 +{coinsEarned}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs mx-auto flex flex-col gap-2.5">
        {/* Continue Options (Rewarded Ad or 50 Gems) */}
        {!continued && (
          <div className="grid grid-cols-2 gap-2 mb-1">
            <Button
              variant="accent"
              size="sm"
              onClick={handleContinueWithGems}
              icon={<Gem className="w-4 h-4 text-gray-900" />}
              className="text-xs font-heading"
            >
              50 Gems
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleContinueWithAd}
              icon={<Film className="w-4 h-4" />}
              className="text-xs font-heading"
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
        >
          Main Menu
        </Button>
      </div>
    </div>
  );
};
