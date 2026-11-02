import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  children?: ReactNode;
  className?: string;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    children,
    className = '',
    glass = false,
    padding = 'md',
    onClick,
    ...rest
  },
  ref
) {
  const reducedMotion = useReducedMotion();
  const isInteractive = Boolean(onClick);

  const paddingClasses: Record<'none' | 'sm' | 'md' | 'lg', string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const baseStyle = glass
    ? 'backdrop-blur-xl bg-white/75 dark:bg-zinc-900/70 border border-white/40 dark:border-white/10 shadow-lg shadow-pink-500/5'
    : 'bg-[var(--surface-card)] border border-[var(--border)] shadow-md shadow-black/5 dark:shadow-black/30';

  const interactiveClasses = isInteractive
    ? 'cursor-pointer transition-shadow hover:shadow-lg hover:border-pink-300/50 dark:hover:border-pink-500/40 select-none'
    : '';

  const motionProps: HTMLMotionProps<'div'> = isInteractive && !reducedMotion ? {
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 450, damping: 25 },
  } : {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <motion.div
      ref={ref}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`rounded-[20px] overflow-hidden text-[var(--text)] transition-colors ${baseStyle} ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
      {...motionProps}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </motion.div>
  );
});
