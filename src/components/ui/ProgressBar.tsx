import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  height?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'gold' | 'secondary';
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  height = 'md',
  variant = 'primary',
  showLabel = false,
  label,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heightStyles = {
    sm: 'h-2 rounded-full',
    md: 'h-3.5 rounded-full',
    lg: 'h-5 rounded-full',
  };

  const gradientStyles = {
    primary: 'bg-gradient-to-r from-game-primary to-[#FF80BF]',
    gold: 'bg-gradient-to-r from-game-accent to-[#FF9E00]',
    secondary: 'bg-gradient-to-r from-game-secondary to-[#B388FF]',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-game-muted">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-game-card border border-game-border/80 overflow-hidden ${heightStyles[height]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full shadow-inner-gloss ${gradientStyles[variant]}`}
        />
      </div>
    </div>
  );
};
