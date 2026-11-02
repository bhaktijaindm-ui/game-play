import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export interface GoalChipProps {
  icon?: ReactNode;
  text?: string;
  current: number;
  target: number;
  color?: string;
  completed?: boolean;
  className?: string;
  type?: string;
  shade?: string;
}

export function GoalChip({
  icon,
  text,
  current,
  target,
  color = '#ec4899',
  completed,
  className = '',
  type,
  shade,
}: GoalChipProps) {
  const reducedMotion = useReducedMotion();
  const isCompleted = completed !== undefined ? completed : current >= target;
  const ratio = target > 0 ? Math.min(1, Math.max(0, current / target)) : 1;
  const percentage = Math.round(ratio * 100);
  const displayText = text ?? (shade ? `${shade} lines` : type ? `${type}` : 'Goal');

  const DefaultIcon = () => (
    <svg className="w-4 h-4 shrink-0 drop-shadow-sm" viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <rect x="5" y="5" width="14" height="14" rx="2" fill="white" fillOpacity="0.25" />
    </svg>
  );

  return (
    <div
      role="status"
      aria-label={`${text ? `${text}: ` : ''}${Math.min(current, target)} of ${target}${isCompleted ? ' (Completed)' : ''}`}
      className={`relative inline-flex items-center min-w-[100px] h-10 px-3 rounded-2xl border overflow-hidden select-none shadow-sm transition-colors ${
        isCompleted
          ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200'
          : 'border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)]'
      } ${className}`}
    >
      {/* Background Fill Meter */}
      <motion.div
        initial={reducedMotion ? { width: `${percentage}%` } : { width: '0%' }}
        animate={{ width: `${percentage}%` }}
        transition={{
          type: reducedMotion ? 'tween' : 'spring',
          duration: reducedMotion ? 0.2 : undefined,
          damping: 25,
          stiffness: 220,
        }}
        style={{
          backgroundColor: color,
          opacity: isCompleted ? 0.25 : 0.18,
        }}
        className="absolute top-0 bottom-0 left-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {icon ?? <DefaultIcon />}
          {displayText && (
            <span className="text-xs font-bold truncate max-w-[70px]">
              {displayText}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs font-extrabold tabular-nums tracking-tight">
            {Math.min(current, target)}/{target}
          </span>

          {isCompleted && (
            <motion.span
              initial={reducedMotion ? { opacity: 1 } : { scale: 0, rotate: -45 }}
              animate={reducedMotion ? { opacity: 1 } : { scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white"
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}
