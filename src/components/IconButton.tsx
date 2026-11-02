import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  icon?: ReactNode;
  children?: ReactNode;
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  disabled?: boolean;
  badge?: string | number;
  className?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    icon,
    children,
    'aria-label': ariaLabel,
    variant = 'secondary',
    size = 'sm',
    loading = false,
    disabled = false,
    badge,
    className = '',
    onClick,
    type = 'button',
    ...rest
  },
  ref
) {
  const reducedMotion = useReducedMotion();
  const isDisabled = disabled || loading;

  const sizeClasses: Record<IconButtonSize, string> = {
    sm: 'w-12 h-12 min-w-[48px] min-h-[48px] text-lg',
    md: 'w-14 h-14 min-w-[56px] min-h-[56px] text-xl',
    lg: 'w-16 h-16 min-w-[64px] min-h-[64px] text-2xl',
  };

  const getVariantClasses = (): string => {
    if (isDisabled) {
      return 'opacity-50 cursor-not-allowed bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 shadow-none';
    }

    switch (variant) {
      case 'primary':
        return 'text-white shadow-md shadow-pink-500/30';
      case 'secondary':
        return 'bg-[var(--surface-elevated)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-card)] hover:border-pink-300/40 shadow-sm';
      case 'ghost':
        return 'bg-transparent text-[var(--text)] hover:bg-[var(--surface-elevated)] shadow-none';
      case 'glass':
        return 'backdrop-blur-md bg-white/40 dark:bg-zinc-800/50 border border-white/40 dark:border-white/10 text-[var(--text)] shadow-sm';
      default:
        return '';
    }
  };

  const primaryStyle = variant === 'primary' && !isDisabled ? {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light, #f472b6) 100%)',
  } : undefined;

  const motionProps: HTMLMotionProps<'button'> = {
    whileTap: !isDisabled && !reducedMotion ? { scale: 0.94 } : undefined,
    transition: { type: 'spring', stiffness: 500, damping: 25 },
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      style={primaryStyle}
      className={`relative inline-flex items-center justify-center rounded-full select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] transition-colors ${sizeClasses[size]} ${getVariantClasses()} ${className}`}
      {...motionProps}
      {...(rest as Record<string, unknown>)}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <span className="inline-flex items-center justify-center shrink-0">{icon || children}</span>
      )}

      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-bold text-white bg-pink-500 rounded-full border-2 border-[var(--surface)] shadow-sm">
          {badge}
        </span>
      )}
    </motion.button>
  );
});
