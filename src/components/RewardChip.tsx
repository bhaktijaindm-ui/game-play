import React from 'react';

export type RewardType = 'coins' | 'gems' | 'energy' | 'chest' | 'stars' | 'look';

interface RewardChipProps {
  type: RewardType;
  amount: number | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RewardChip: React.FC<RewardChipProps> = ({
  type,
  amount,
  size = 'md',
  className = '',
}) => {
  const iconMap: Record<RewardType, string> = {
    coins: '🪙',
    gems: '💎',
    energy: '⚡',
    chest: '🎁',
    stars: '⭐',
    look: '💄',
  };

  const bgMap: Record<RewardType, string> = {
    coins: 'from-[#F5B53C]/20 to-[#F5B53C]/40 border-[#F5B53C]',
    gems: 'from-[#FF4F7B]/20 to-[#FF4F7B]/40 border-[#FF4F7B]',
    energy: 'from-[#3DA9FC]/20 to-[#3DA9FC]/40 border-[#3DA9FC]',
    chest: 'from-[#A774F0]/20 to-[#6A3FC8]/40 border-[#A774F0]',
    stars: 'from-[#FBBF24]/20 to-[#FBBF24]/40 border-[#FBBF24]',
    look: 'from-[#E6177F]/20 to-[#E6177F]/40 border-[#E6177F]',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${bgMap[type]} border shadow-sm backdrop-blur-sm ${sizeClasses[size]} ${className}`}
    >
      <span className="text-base select-none">{iconMap[type]}</span>
      <span className="font-heading font-bold tabular-nums text-[var(--text,#2A1630)] dark:text-white">
        {typeof amount === 'number' ? `+${amount.toLocaleString()}` : amount}
      </span>
    </div>
  );
};
