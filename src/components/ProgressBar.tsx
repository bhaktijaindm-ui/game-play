import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string;
  showLabel?: boolean;
  size?: ProgressBarSize;
  className?: string;
  label?: string;
}

export function ProgressBar({
  value,
  color,
  showLabel = false,
  size = 'md',
  className = '',
  label,
}: ProgressBarProps) {
  const reducedMotion = useReducedMotion();
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  const sizeClasses: Record<ProgressBarSize, string> = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  const defaultFillStyle = color
    ? { backgroundColor: color }
    : { background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light, #f472b6) 100%)' };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] px-0.5">
          <span>{label ?? 'Progress'}</span>
          {showLabel && <span className="tabular-nums text-[var(--text)]">{clampedValue}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className={`w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 shadow-inner ${sizeClasses[size]}`}
      >
        <motion.div
          initial={reducedMotion ? { width: `${clampedValue}%` } : { width: '0%' }}
          animate={{ width: `${clampedValue}%` }}
          transition={{
            type: reducedMotion ? 'tween' : 'spring',
            duration: reducedMotion ? 0.2 : undefined,
            damping: 24,
            stiffness: 180,
          }}
          style={defaultFillStyle}
          className="relative h-full rounded-full overflow-hidden"
        >
          {/* Shimmer wave */}
          <div
            className="absolute inset-0 w-full h-full animate-shimmer pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
