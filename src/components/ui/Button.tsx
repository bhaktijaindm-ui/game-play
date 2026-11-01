import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { soundSystem } from '../../services/soundSystem';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  children,
  loading = false,
  disabled,
  onClick,
  className = '',
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    soundSystem.playClick();
    if (onClick) onClick(e);
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-game-primary to-[#FF69B4] text-white shadow-glossy-pink hover:opacity-95 border border-pink-300/30',
    secondary:
      'bg-gradient-to-r from-game-secondary to-[#7C4DFF] text-white shadow-glossy-purple hover:opacity-95 border border-purple-300/30',
    accent:
      'bg-gradient-to-r from-game-accent to-[#FF9E00] text-gray-900 font-bold shadow-glossy-gold hover:opacity-95 border border-yellow-200/40',
    ghost:
      'bg-transparent text-game-text hover:bg-game-surface/80 border border-game-border',
    danger:
      'bg-gradient-to-r from-game-danger to-[#D32F2F] text-white shadow-soft hover:opacity-95',
  };

  const sizeStyles = {
    sm: 'min-h-[44px] px-4 py-2 text-sm rounded-xl',
    md: 'min-h-[48px] px-6 py-3 text-base rounded-2xl',
    lg: 'min-h-[56px] px-8 py-4 text-lg rounded-3xl font-heading',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0 text-xl">{icon}</span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};
