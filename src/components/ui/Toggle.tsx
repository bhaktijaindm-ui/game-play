import React from 'react';
import { motion } from 'framer-motion';
import { soundSystem } from '../../services/soundSystem';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const handleToggle = () => {
    if (disabled) return;
    soundSystem.playClick();
    onChange(!checked);
  };

  return (
    <div
      onClick={handleToggle}
      className={`min-h-[44px] flex items-center justify-between gap-4 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      {label && <span className="text-sm font-medium text-game-text">{label}</span>}
      <div
        className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-200 border ${
          checked
            ? 'bg-gradient-to-r from-game-primary to-[#FF69B4] border-pink-400'
            : 'bg-game-border/80 border-game-border'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs"
        />
      </div>
    </div>
  );
};
