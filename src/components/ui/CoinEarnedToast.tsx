import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CoinNotification {
  id: string;
  coins: number;
  gems?: number;
  source?: string;
}

export const CoinEarnedToast: React.FC = () => {
  const [notifications, setNotifications] = useState<CoinNotification[]>([]);

  useEffect(() => {
    const handleCoinsEarned = (e: Event) => {
      const customEvent = e as CustomEvent<{ coins: number; gems?: number; source?: string }>;
      if (!customEvent.detail) return;
      const { coins, gems, source } = customEvent.detail;

      if ((coins && coins > 0) || (gems && gems > 0)) {
        const id = `coin_${Date.now()}_${Math.random()}`;
        setNotifications((prev) => [...prev.slice(-3), { id, coins, gems, source }]);

        // Auto remove after 2.2 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 2200);
      }
    };

    window.addEventListener('glam-coins-earned', handleCoinsEarned);
    return () => window.removeEventListener('glam-coins-earned', handleCoinsEarned);
  }, []);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 15, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-amber-950 font-heading font-bold text-sm shadow-luxury border border-amber-200/80 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-800 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="flex items-center gap-1">
              +{n.coins.toLocaleString()} 🪙
            </span>
            {n.gems && n.gems > 0 ? (
              <span className="flex items-center gap-1 text-purple-900 border-l border-amber-500/40 pl-2">
                +{n.gems} 💎
              </span>
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
