import { type KeyboardEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  size?: ToggleSize;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}: ToggleProps) {
  const reducedMotion = useReducedMotion();

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const dimensions: Record<ToggleSize, { track: string; thumb: string; travel: number }> = {
    sm: { track: 'w-10 h-6 p-0.5', thumb: 'w-5 h-5', travel: 16 },
    md: { track: 'w-12 h-7 p-1', thumb: 'w-5 h-5', travel: 20 },
    lg: { track: 'w-15 h-8 p-1', thumb: 'w-6 h-6', travel: 28 },
  };

  const currentDim = dimensions[size];

  return (
    <label
      className={`inline-flex items-center justify-between gap-3 select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold text-[var(--text)]">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-[var(--text-muted)] mt-0.5">
              {description}
            </span>
          )}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        style={checked && !disabled ? {
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light, #f472b6) 100%)',
        } : undefined}
        className={`relative inline-flex items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 ${
          currentDim.track
        } ${
          checked ? 'shadow-sm shadow-pink-500/30' : 'bg-zinc-300 dark:bg-zinc-700'
        }`}
      >
        <motion.span
          animate={{ x: checked ? currentDim.travel : 0 }}
          transition={{
            type: reducedMotion ? 'tween' : 'spring',
            stiffness: 600,
            damping: 35,
            duration: reducedMotion ? 0.15 : undefined,
          }}
          className={`rounded-full bg-white shadow-md block pointer-events-none ${currentDim.thumb}`}
        />
      </button>
    </label>
  );
}
