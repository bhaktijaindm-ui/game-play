import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export type CurrencyType = 'coins' | 'gems';
export type CurrencyChipSize = 'sm' | 'md' | 'lg';

export interface CurrencyChipProps {
  type: CurrencyType;
  amount: number;
  onClick?: () => void;
  size?: CurrencyChipSize;
  className?: string;
  showAddButton?: boolean;
}

export function CurrencyChip({
  type,
  amount,
  onClick,
  size = 'md',
  className = '',
  showAddButton = false,
}: CurrencyChipProps) {
  const reducedMotion = useReducedMotion();
  const isInteractive = Boolean(onClick);

  const formattedAmount = amount >= 1_000_000
    ? `${(amount / 1_000_000).toFixed(1)}M`
    : amount.toLocaleString();

  const sizeClasses: Record<CurrencyChipSize, { chip: string; icon: string; text: string }> = {
    sm: { chip: 'h-7 px-2.5 gap-1.5', icon: 'w-4 h-4', text: 'text-xs' },
    md: { chip: 'h-9 px-3.5 gap-2', icon: 'w-5 h-5', text: 'text-sm' },
    lg: { chip: 'h-11 px-4 gap-2.5', icon: 'w-6 h-6', text: 'text-base' },
  };

  const isCoins = type === 'coins';

  const CoinIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size].icon} shrink-0 drop-shadow-sm`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="1" />
      <circle cx="12" cy="12" r="7.5" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      <polygon points="12,6.5 13.8,10.2 17.5,10.8 14.8,13.4 15.5,17.2 12,15.4 8.5,17.2 9.2,13.4 6.5,10.8 10.2,10.2" fill="#fef08a" />
      <defs>
        <linearGradient id="coinGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde047" />
          <stop offset="0.6" stopColor="#eab308" />
          <stop offset="1" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
    </svg>
  );

  const GemIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size].icon} shrink-0 drop-shadow-sm`}
      aria-hidden="true"
    >
      <polygon points="6,3 18,3 22,9 12,21 2,9" fill="url(#gemGrad)" stroke="#0891b2" strokeWidth="0.8" />
      <polygon points="6,3 18,3 15,9 9,9" fill="#a5f3fc" fillOpacity="0.85" />
      <polygon points="2,9 6,3 9,9" fill="#67e8f9" fillOpacity="0.6" />
      <polygon points="18,3 22,9 15,9" fill="#22d3ee" fillOpacity="0.75" />
      <polygon points="9,9 15,9 12,21" fill="#06b6d4" />
      <polygon points="2,9 9,9 12,21" fill="#0891b2" fillOpacity="0.9" />
      <polygon points="15,9 22,9 12,21" fill="#0e7490" fillOpacity="0.9" />
      <defs>
        <linearGradient id="gemGrad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="0.5" stopColor="#06b6d4" />
          <stop offset="1" stopColor="#0e7490" />
        </linearGradient>
      </defs>
    </svg>
  );

  const containerClasses = isCoins
    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-300/40 dark:border-amber-500/30 text-amber-900 dark:text-amber-200'
    : 'bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-300/40 dark:border-cyan-500/30 text-cyan-900 dark:text-cyan-200';

  const interactiveClasses = isInteractive
    ? 'cursor-pointer hover:brightness-105 active:scale-95 select-none'
    : '';

  return (
    <motion.div
      role={isInteractive ? 'button' : 'status'}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`${amount} ${type}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      whileTap={isInteractive && !reducedMotion ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`inline-flex items-center rounded-full border shadow-sm backdrop-blur-sm transition-all font-bold ${sizeClasses[size].chip} ${containerClasses} ${interactiveClasses} ${className}`}
    >
      {isCoins ? <CoinIcon /> : <GemIcon />}
      <span className={`tabular-nums font-bold tracking-tight ${sizeClasses[size].text}`}>
        {formattedAmount}
      </span>
      {(showAddButton || isInteractive) && (
        <span
          className={`flex items-center justify-center rounded-full text-white ml-0.5 ${
            isCoins ? 'bg-amber-500' : 'bg-cyan-500'
          } ${size === 'sm' ? 'w-3.5 h-3.5 text-[9px]' : size === 'lg' ? 'w-5 h-5 text-xs' : 'w-4 h-4 text-[10px]'}`}
          aria-hidden="true"
        >
          +
        </span>
      )}
    </motion.div>
  );
}
