import React from 'react';

export type CounterType = 'energy' | 'coins' | 'gems';

interface TopBarCounterProps {
  type: CounterType;
  value: number;
  maxValue?: number;
  timerText?: string | null;
  onPlusClick?: () => void;
  className?: string;
}

export const TopBarCounter: React.FC<TopBarCounterProps> = ({
  type,
  value,
  maxValue,
  timerText,
  onPlusClick,
  className = '',
}) => {
  const renderIcon = () => {
    switch (type) {
      case 'energy':
        return (
          <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center relative">
            <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(61,169,252,0.6)]">
              {/* Lipstick Base & Lightning Hybrid */}
              <defs>
                <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#70C5FF" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <path
                d="M13 2L3 14h7l-2 8 11-13h-7l2-7z"
                fill="url(#energyGrad)"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case 'coins':
        return (
          <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(245,181,60,0.6)]">
              {/* Compact Mirror Coin */}
              <circle cx="12" cy="12" r="10" fill="#F5B53C" stroke="#B45309" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="7.5" fill="#FDE68A" stroke="#D97706" strokeWidth="0.8" />
              <circle cx="12" cy="12" r="4.5" fill="#FEF3C7" />
              <path d="M10 8l4 8M14 8l-4 8" stroke="#B45309" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        );
      case 'gems':
        return (
          <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(255,79,123,0.6)]">
              {/* Pink Diamond */}
              <defs>
                <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF8FB8" />
                  <stop offset="100%" stopColor="#E6177F" />
                </linearGradient>
              </defs>
              <polygon
                points="12,2 22,8 18,22 6,22 2,8"
                fill="url(#gemGrad)"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <line x1="2" y1="8" x2="22" y2="8" stroke="#FFE4E6" strokeWidth="0.8" />
              <line x1="12" y1="2" x2="6" y2="22" stroke="#FFE4E6" strokeWidth="0.8" />
              <line x1="12" y1="2" x2="18" y2="22" stroke="#FFE4E6" strokeWidth="0.8" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(25,18,40,0.78)] dark:bg-[rgba(14,10,24,0.85)] border border-white/20 shadow-md backdrop-blur-md select-none ${className}`}
    >
      {renderIcon()}

      <div className="flex flex-col items-start leading-none pr-1">
        <span className="font-heading text-white text-[13px] font-bold tabular-nums tracking-wide game-stroke-sm">
          {type === 'energy' && maxValue !== undefined
            ? `${value}/${maxValue}`
            : value.toLocaleString()}
        </span>
        {timerText && (
          <span className="text-[9px] text-[#3DA9FC] font-semibold tracking-tighter">
            {timerText}
          </span>
        )}
      </div>

      {onPlusClick && (
        <button
          onClick={e => {
            e.stopPropagation();
            onPlusClick();
          }}
          className="w-4 h-4 rounded-full bg-[#3FBF4F] hover:bg-[#34a842] text-white flex items-center justify-center text-[11px] font-bold border border-white/40 shadow-sm active:scale-90 transition-transform -mr-1"
          aria-label={`Add ${type}`}
        >
          +
        </button>
      )}
    </div>
  );
};
