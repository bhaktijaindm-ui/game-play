import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Shuffle, Sparkles } from 'lucide-react';
import { GAME_RULES } from '../../config/product.config';
import { soundSystem } from '../../services/soundSystem';

interface PowerUpBarProps {
  coins: number;
  freeUndoAvailable: boolean;
  canUndo: boolean;
  onUseUndo: () => void;
  onUseShuffle: () => void;
  onUseBomb: () => void;
  isBombActive: boolean;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({
  coins,
  freeUndoAvailable,
  canUndo,
  onUseUndo,
  onUseShuffle,
  onUseBomb,
  isBombActive,
}) => {
  const { UNDO, SHUFFLE, BOMB } = GAME_RULES.POWERUPS;

  const handleUndo = () => {
    if (!canUndo) return;
    if (!freeUndoAvailable && coins < UNDO.costCoins) return;
    soundSystem.playPowerup();
    onUseUndo();
  };

  const handleShuffle = () => {
    if (coins < SHUFFLE.costCoins) return;
    soundSystem.playPowerup();
    onUseShuffle();
  };

  const handleBomb = () => {
    if (isBombActive) {
      onUseBomb(); // Toggle off
      return;
    }
    if (coins < BOMB.costCoins) return;
    soundSystem.playPowerup();
    onUseBomb();
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2 bg-game-surface/90 border border-game-border shadow-soft rounded-2xl backdrop-blur-md">
      {/* Undo Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        disabled={!canUndo || (!freeUndoAvailable && coins < UNDO.costCoins)}
        onClick={handleUndo}
        className="flex-1 min-h-[44px] flex flex-col items-center justify-center p-1.5 rounded-xl bg-game-card hover:bg-game-border/60 transition-colors disabled:opacity-40 cursor-pointer"
        aria-label="Undo move"
      >
        <div className="flex items-center gap-1 text-game-text">
          <RotateCcw className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-heading font-semibold">Undo</span>
        </div>
        <span className="text-[10px] font-bold text-game-muted">
          {freeUndoAvailable ? (
            <span className="text-amber-500 font-bold">FREE</span>
          ) : (
            `🪙 ${UNDO.costCoins}`
          )}
        </span>
      </motion.button>

      {/* Shuffle Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        disabled={coins < SHUFFLE.costCoins}
        onClick={handleShuffle}
        className="flex-1 min-h-[44px] flex flex-col items-center justify-center p-1.5 rounded-xl bg-game-card hover:bg-game-border/60 transition-colors disabled:opacity-40 cursor-pointer"
        aria-label="Shuffle tray shapes"
      >
        <div className="flex items-center gap-1 text-game-text">
          <Shuffle className="w-4 h-4 text-pink-500" />
          <span className="text-xs font-heading font-semibold">Shuffle</span>
        </div>
        <span className="text-[10px] font-bold text-game-muted">
          🪙 {SHUFFLE.costCoins}
        </span>
      </motion.button>

      {/* Bomb Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        disabled={coins < BOMB.costCoins && !isBombActive}
        onClick={handleBomb}
        className={`flex-1 min-h-[44px] flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
          isBombActive
            ? 'bg-amber-400 text-amber-950 font-bold shadow-glossy-gold animate-bounce'
            : 'bg-game-card hover:bg-game-border/60 text-game-text disabled:opacity-40'
        }`}
        aria-label="Activate Glam Bomb 3x3 clear"
      >
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-heading font-semibold">
            {isBombActive ? 'Tap Cell' : 'Bomb'}
          </span>
        </div>
        <span className="text-[10px] font-bold text-game-muted">
          {isBombActive ? 'Active' : `🪙 ${BOMB.costCoins}`}
        </span>
      </motion.button>
    </div>
  );
};
