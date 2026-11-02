import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    children,
    className = '',
    onClick,
    type = 'button',
    ...rest
  },
  ref
) {
  const reducedMotion = useReducedMotion();
  const isDisabled = disabled || loading;

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-10 px-4 text-sm gap-1.5',
    md: 'h-12 px-5 text-base gap-2',
    lg: 'h-14 px-7 text-lg gap-2.5',
  };

  const getVariantClasses = (): string => {
    if (isDisabled) {
      return 'opacity-50 cursor-not-allowed bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shadow-none';
    }

    switch (variant) {
      case 'primary':
        return 'text-white shadow-lg shadow-pink-500/25 active:shadow-md';
      case 'secondary':
        return 'bg-[var(--surface-elevated)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-card)] hover:border-pink-300/40 shadow-sm';
      case 'ghost':
        return 'bg-transparent text-[var(--text)] hover:bg-[var(--surface-elevated)] border border-transparent shadow-none';
      case 'danger':
        return 'bg-[var(--danger)] text-white hover:opacity-95 shadow-md shadow-red-500/20';
      default:
        return '';
    }
  };

  const primaryInlineStyle = variant === 'primary' && !isDisabled ? {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light, #f472b6) 100%)',
  } : undefined;

  const motionProps: HTMLMotionProps<'button'> = {
    whileTap: !isDisabled && !reducedMotion ? { scale: 0.96 } : undefined,
    transition: { type: 'spring', stiffness: 500, damping: 25 },
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      style={primaryInlineStyle}
      className={`relative inline-flex items-center justify-center font-semibold rounded-2xl transition-colors select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 ${sizeClasses[size]} ${getVariantClasses()} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...motionProps}
      {...(rest as Record<string, unknown>)}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
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
          {children && <span>{children}</span>}
        </span>
      ) : (
        <>
          {icon && <span className="inline-flex items-center shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
        </>
      )}
    </motion.button>
  );
});
