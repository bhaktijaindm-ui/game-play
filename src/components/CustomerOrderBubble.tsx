import React from 'react';
import { motion } from 'framer-motion';

export interface CustomerOrderProps {
  id: string;
  customerName: string;
  avatarIcon: string;
  description: string;
  rewardCoins: number;
  current: number;
  target: number;
  completed: boolean;
  className?: string;
}

export const CustomerOrderBubble: React.FC<CustomerOrderProps> = ({
  customerName,
  avatarIcon,
  description,
  rewardCoins,
  current,
  target,
  completed,
  className = '',
}) => {
  return (
    <motion.div
      animate={
        completed
          ? {
              scale: [1, 1.08, 1],
              transition: { duration: 0.4 },
            }
          : {}
      }
      className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border-2 transition-all select-none shadow-md ${
        completed
          ? 'bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0] dark:from-[#064E3B] dark:to-[#047857] border-[#3FBF4F] text-[#065F46] dark:text-emerald-100'
          : 'bg-white/90 dark:bg-[#231A45]/90 border-[#6FADD4] text-[var(--text,#2A1630)] dark:text-white'
      } ${className}`}
    >
      {/* Customer Avatar */}
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6A3FC8] to-[#FF8FB8] border border-white flex items-center justify-center text-base shadow-sm">
          {avatarIcon || '👩🏽'}
        </div>

        {completed && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#3FBF4F] text-white flex items-center justify-center text-[10px] font-bold border border-white">
            ✓
          </span>
        )}
      </div>

      {/* Order Info & Progress */}
      <div className="flex flex-col text-left leading-tight min-w-[90px]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-heading font-bold truncate max-w-[80px]">
            {customerName}
          </span>
          <span className="text-[9px] font-bold text-[#F5B53C] flex items-center tabular-nums">
            +{rewardCoins} 🪙
          </span>
        </div>

        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate max-w-[120px]">
          {description}
        </span>

        {/* Mini Progress Track */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex-1 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                completed ? 'bg-[#3FBF4F]' : 'bg-[#E6177F]'
              }`}
              style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
            />
          </div>
          <span className="text-[9px] font-heading font-bold tabular-nums opacity-80">
            {current}/{target}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
