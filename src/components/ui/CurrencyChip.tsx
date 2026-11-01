import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { soundSystem } from '../../services/soundSystem';

export interface CurrencyChipProps {
  type: 'coins' | 'gems';
  amount: number;
  onAddClick?: () => void;
  size?: 'sm' | 'md';
}

export const CurrencyChip: React.FC<CurrencyChipProps> = ({
  type,
  amount,
  onAddClick,
  size = 'md',
}) => {
  const isCoins = type === 'coins';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSystem.playClick();
    if (onAddClick) onAddClick();
  };

  return (
    <div
      onClick={onAddClick}
      className={`
        inline-flex items-center gap-2 bg-game-surface/90 border border-game-border shadow-soft rounded-full pl-2.5 pr-1.5 py-1 backdrop-blur-sm
        ${onAddClick ? 'cursor-pointer hover:border-game-primary/50' : ''}
        ${size === 'sm' ? 'text-xs' : 'text-sm'}
      `}
    >
      {/* Icon */}
      {isCoins ? (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 shadow-sm text-xs font-bold text-amber-950">
          🪙
        </span>
      ) : (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 shadow-sm text-xs text-white">
          💎
        </span>
      )}

      {/* Amount Number */}
      <span className="font-heading font-semibold text-game-text tracking-wide px-0.5">
        {amount.toLocaleString()}
      </span>

      {/* Optional Quick-Add Button */}
      {onAddClick && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleAdd}
          className="w-6 h-6 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-full bg-game-primary text-white shadow-xs hover:opacity-90"
          aria-label={`Buy more ${type}`}
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
        </motion.button>
      )}
    </div>
  );
};
