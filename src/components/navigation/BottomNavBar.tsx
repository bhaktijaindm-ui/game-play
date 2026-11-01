import React from 'react';
import { motion } from 'framer-motion';
import { Home, Play, Sparkles, ShoppingBag, Gift, Settings } from 'lucide-react';
import { soundSystem } from '../../services/soundSystem';
import { useAuth } from '../../services/authContext';
import type { ScreenState } from '../../App';

interface BottomNavBarProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const { isDailyRewardAvailable } = useAuth();
  const hasDailyGift = isDailyRewardAvailable();

  // Hide bottom nav during active gameplay, game over, onboarding, splash, or legal screens
  if (
    currentScreen === 'game' ||
    currentScreen === 'game_over' ||
    currentScreen === 'splash' ||
    currentScreen === 'onboarding' ||
    currentScreen === 'privacy' ||
    currentScreen === 'terms'
  ) {
    return null;
  }

  const navItems = [
    { id: 'home' as ScreenState, label: 'Home', icon: Home },
    { id: 'looks' as ScreenState, label: 'Looks', icon: Sparkles },
    { id: 'game' as ScreenState, label: 'Play', icon: Play, isCenterPlay: true },
    { id: 'shop' as ScreenState, label: 'Boutique', icon: ShoppingBag },
    { id: 'daily' as ScreenState, label: 'Daily', icon: Gift, hasBadge: hasDailyGift },
    { id: 'settings' as ScreenState, label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (screen: ScreenState) => {
    soundSystem.playClick();
    onNavigate(screen);
  };

  return (
    <nav
      className="sticky bottom-0 inset-x-0 z-40 bg-game-surface/90 backdrop-blur-md border-t border-game-border safe-bottom shadow-lg"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          if (item.isCenterPlay) {
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className="relative -top-3 min-w-[52px] min-h-[52px] w-13 h-13 rounded-2xl bg-gradient-to-tr from-game-primary via-pink-600 to-amber-400 p-0.5 shadow-luxury flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                aria-label="Start Game"
              >
                <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-game-primary to-pink-500 flex items-center justify-center text-white">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`
                relative min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-150 cursor-pointer
                ${isActive ? 'text-game-primary font-bold' : 'text-game-muted hover:text-game-text'}
              `}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-game-primary animate-pulse ring-2 ring-game-surface" />
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute bottom-0 w-4 h-0.5 rounded-full bg-game-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
