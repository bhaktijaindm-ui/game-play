import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'surface' | 'gradient' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  padding = 'md',
  children,
  className = '',
  ...rest
}) => {
  const variantStyles = {
    surface: 'bg-game-surface border border-game-border shadow-soft',
    gradient: 'bg-gradient-to-br from-game-surface to-game-card border border-game-border/80 shadow-soft-lg',
    bordered: 'bg-transparent border-2 border-game-border/60',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
  };

  return (
    <motion.div
      className={`rounded-2xl transition-all duration-200 ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
