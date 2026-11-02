import React from 'react';

interface EventIconWithTimerProps {
  id: string;
  title: string;
  icon: string | React.ReactNode;
  timeRemaining: string;
  badgeText?: string;
  onClick?: () => void;
  className?: string;
}

export const EventIconWithTimer: React.FC<EventIconWithTimerProps> = ({
  title,
  icon,
  timeRemaining,
  badgeText,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`flex flex-col items-center cursor-pointer active:scale-95 transition-transform group select-none ${className}`}
    >
      <div className="relative w-12 h-12 rounded-[16px] bg-gradient-to-b from-[#A774F0] to-[#5B2E9E] border-2 border-[#F5B53C] shadow-lg flex items-center justify-center overflow-hidden">
        {/* Glossy top shine */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

        {typeof icon === 'string' ? (
          <span className="text-xl filter drop-shadow group-hover:scale-110 transition-transform">{icon}</span>
        ) : (
          icon
        )}

        {badgeText && (
          <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-[#FF4F7B] border border-white text-[9px] font-bold text-white rounded-full font-heading game-stroke-sm">
            {badgeText}
          </span>
        )}
      </div>

      {/* Countdown pill */}
      <div className="-mt-2 z-10 px-1.5 py-0.5 rounded-full bg-[rgba(25,18,40,0.85)] border border-[#F5B53C]/60 text-[9px] font-heading font-bold text-[#FDE68A] shadow-sm tabular-nums text-center whitespace-nowrap">
        {timeRemaining}
      </div>

      <span className="text-[10px] font-medium text-[var(--text,#2A1630)] dark:text-white/80 mt-0.5 text-center truncate max-w-[60px]">
        {title}
      </span>
    </div>
  );
};
