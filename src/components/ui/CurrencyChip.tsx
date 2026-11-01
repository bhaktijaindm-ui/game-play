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

  const handleClick = () => {
    soundSystem.playClick();
    if (onAddClick) onAddClick();
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSystem.playClick();
    if (onAddClick) onAddClick();
  };

  return (
    <div
      onClick={handleClick}
      role="group"
      aria-label={`${(amount || 0).toLocaleString()} ${type}`}
      className={`
        inline-flex items-center gap-1.5 bg-game-surface border border-game-border shadow-soft rounded-full pl-2 pr-1.5 py-1 backdrop-blur-md transition-all duration-150 select-none
        ${onAddClick ? 'cursor-pointer hover:border-game-primary/60 hover:shadow-rosegold active:bg-game-card' : ''}
        ${size === 'sm' ? 'min-h-[36px] text-xs' : 'min-h-[42px] text-sm'}
      `}
    >
      {/* Icon */}
      {isCoins ? (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 shadow-xs text-xs font-bold text-amber-950">
          🪙
        </span>
      ) : (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 shadow-xs text-xs text-white">
          💎
        </span>
      )}

      {/* Amount Number */}
      <span className="font-heading font-bold text-game-text tracking-tight px-0.5">
        {(amount || 0).toLocaleString()}
      </span>

      {/* Quick-Add Button */}
      {onAddClick && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={handleAdd}
          className="w-5 h-5 min-w-[20px] min-h-[20px] flex items-center justify-center rounded-full bg-game-primary text-white shadow-xs hover:bg-game-primary-hover active:scale-90 transition-transform cursor-pointer"
          aria-label={`Buy more ${type}`}
        >
          <Plus className="w-3 h-3 stroke-[3]" />
        </motion.button>
      )}
    </div>
  );
};
