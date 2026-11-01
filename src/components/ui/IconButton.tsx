import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { soundSystem } from '../../services/soundSystem';

export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: React.ReactNode;
  label: string;
  variant?: 'surface' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  badge?: number | string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'surface',
  size = 'md',
  badge,
  disabled,
  onClick,
  className = '',
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    soundSystem.playClick();
    if (onClick) onClick(e);
  };

  const variantStyles = {
    surface: 'bg-game-surface border border-game-border text-game-text shadow-soft hover:bg-game-card',
    primary: 'bg-game-primary text-white shadow-glossy-pink hover:opacity-95',
    secondary: 'bg-game-secondary text-white shadow-glossy-purple hover:opacity-95',
    ghost: 'bg-transparent text-game-text hover:bg-game-surface/80 border border-transparent',
  };

  const sizeStyles = {
    sm: 'w-11 h-11 min-w-[44px] min-h-[44px] p-2 text-base rounded-xl',
    md: 'w-12 h-12 min-w-[48px] min-h-[48px] p-2.5 text-lg rounded-2xl',
    lg: 'w-14 h-14 min-w-[56px] min-h-[56px] p-3 text-xl rounded-3xl',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      transition={{ duration: 0.15 }}
      disabled={disabled}
      onClick={handleClick}
      aria-label={label}
      className={`
        relative inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...rest}
    >
      {icon}
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 bg-game-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
          {badge}
        </span>
      )}
    </motion.button>
  );
};
