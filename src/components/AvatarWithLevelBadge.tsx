import React from 'react';

interface AvatarWithLevelBadgeProps {
  level: number;
  avatarUrl?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const AvatarWithLevelBadge: React.FC<AvatarWithLevelBadgeProps> = ({
  level,
  avatarUrl,
  name = 'Player',
  size = 'md',
  onClick,
  className = '',
}) => {
  const sizeMap = {
    sm: { avatar: 'w-9 h-9', badge: 'text-[9px] px-1 py-0.2 -bottom-1 -right-1', ring: 'border-2' },
    md: { avatar: 'w-11 h-11', badge: 'text-[10px] px-1.5 py-0.5 -bottom-1 -right-1', ring: 'border-[2.5px]' },
    lg: { avatar: 'w-14 h-14', badge: 'text-[12px] px-2 py-0.5 -bottom-1.5 -right-1.5', ring: 'border-3' },
  };

  const { avatar, badge, ring } = sizeMap[size];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative inline-block cursor-pointer select-none active:scale-95 transition-transform ${className}`}
    >
      <div
        className={`${avatar} rounded-full overflow-hidden bg-gradient-to-tr from-[#6A3FC8] to-[#FF8FB8] ${ring} border-[#F5B53C] shadow-md flex items-center justify-center text-white font-heading font-bold`}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm">👩🏽‍🦱</span>
        )}
      </div>

      <div
        className={`absolute ${badge} rounded-full bg-gradient-to-r from-[#F5B53C] to-[#E6177F] border border-white text-white font-heading font-bold shadow-md game-stroke-sm flex items-center justify-center`}
      >
        {level}
      </div>
    </div>
  );
};
