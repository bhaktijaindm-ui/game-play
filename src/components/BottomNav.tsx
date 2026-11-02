import React from 'react';

export type TabId = 'home' | 'map' | 'renovation' | 'pass' | 'shop';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  unreadMap?: boolean;
  canRenovate?: boolean;
  passUnlockedNodes?: boolean;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadMap,
  canRenovate,
  passUnlockedNodes,
  className = '',
}) => {
  const tabs = [
    { id: 'home' as TabId, label: 'Salon', icon: '🏠' },
    { id: 'map' as TabId, label: 'Map', icon: '🗺️', badge: unreadMap },
    { id: 'renovation' as TabId, label: 'Renovate', icon: '🪞', badge: canRenovate },
    { id: 'pass' as TabId, label: 'Pass', icon: '🎟️', badge: passUnlockedNodes },
    { id: 'shop' as TabId, label: 'Shop', icon: '🛍️' },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[rgba(25,18,40,0.85)] dark:bg-[rgba(14,10,24,0.92)] border-t border-white/15 backdrop-blur-lg px-2 py-1.5 safe-area-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.25)] ${className}`}
    >
      <div className="max-w-[480px] mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 select-none ${
                isActive
                  ? 'bg-gradient-to-t from-[#6A3FC8]/80 to-[#A774F0]/40 text-white scale-105 border border-[#F5B53C]/60 shadow-md'
                  : 'text-white/60 hover:text-white/90 active:scale-95'
              }`}
            >
              <span className="text-xl filter drop-shadow-sm">{tab.icon}</span>
              <span className="text-[11px] font-heading font-bold mt-0.5 tracking-tight">
                {tab.label}
              </span>

              {tab.badge && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF4F7B] border border-white animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
