import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ShadeId } from '../types';
import { SHADES } from '../config/shades';

export interface PureShadeBurstProps {
  active: boolean;
  shade: ShadeId;
  multiplier?: number;
  onComplete: () => void;
  className?: string;
}

const FALLBACK_SHADE_COLORS: Record<string, string> = {
  rose: '#FF5C9E',
  lavender: '#9B6BFF',
  peach: '#FF9E80',
  ruby: '#E8344E',
  gold: '#F2B84B',
  mint: '#3FCB9B',
  sky: '#4DA3FF',
  turmeric: '#F5B700',
  henna: '#A24A22',
  berry: '#9C27B0',
  crimson: '#D32F2F',
  kohl: '#212121',
  champagne: '#F7E7CE',
};

function getShadeColor(shadeId: ShadeId): string {
  if (SHADES[shadeId]?.lightColor) {
    return SHADES[shadeId].lightColor;
  }
  return FALLBACK_SHADE_COLORS[shadeId] || '#F2B84B';
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

export const PureShadeBurst: React.FC<PureShadeBurstProps> = ({
  active,
  shade,
  multiplier = 2,
  onComplete,
  className = '',
}) => {
  const shadeColor = getShadeColor(shade);

  // Generate 20 radial particles exploding from center
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.2 - 0.1);
      const distance = 80 + Math.random() * 110;
      list.push({
        id: i,
        angle,
        distance,
        size: 4 + (i % 3) * 3,
        delay: Math.random() * 0.1,
      });
    }
    return list;
  }, []);

  // 800ms total duration timer
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      onComplete();
    }, 800);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <div
          className={`absolute inset-0 pointer-events-none select-none z-50 flex items-center justify-center overflow-hidden ${className}`}
        >
          {/* Soft background flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 bg-gradient-radial from-amber-400/30 via-white/10 to-transparent"
          />

          {/* Golden Ring Pulse 1 */}
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-44 h-44 rounded-full border-4 border-amber-300"
            style={{
              boxShadow: '0 0 35px 8px rgba(245, 183, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.9)',
            }}
          />

          {/* Golden Ring Pulse 2 (delayed slightly) */}
          <motion.div
            initial={{ scale: 0.1, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
            className="absolute w-36 h-36 rounded-full border-2 border-yellow-200"
            style={{
              boxShadow: `0 0 25px 6px ${shadeColor}`,
            }}
          />

          {/* Sparkle Particles in the shade color */}
          {particles.map((p) => {
            const targetX = Math.cos(p.angle) * p.distance;
            const targetY = Math.sin(p.angle) * p.distance;

            return (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: targetX,
                  y: targetY,
                  scale: [0, 1.4, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.75,
                  delay: p.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  position: 'absolute',
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: '50%',
                  backgroundColor: p.id % 2 === 0 ? shadeColor : '#FFF275',
                  boxShadow: `0 0 10px 2px ${shadeColor}, 0 0 16px 4px #FFFFFF`,
                }}
              />
            );
          })}

          {/* Score Multiplier Text with Springy Pop and Bounce */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0, y: 25 }}
            animate={{
              scale: [0.2, 1.25, 0.95, 1],
              opacity: [0, 1, 1, 0],
              y: [25, -10, 0, -30],
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.35, 0.55, 1],
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="relative z-20 flex flex-col items-center justify-center text-center select-none"
          >
            <div
              className="text-xs uppercase tracking-widest font-black text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ letterSpacing: '0.25em' }}
            >
              Pure Shade
            </div>

            <div
              className="text-4xl font-black italic tracking-tight"
              style={{
                color: '#FFF9D2',
                textShadow: `0 0 20px ${shadeColor}, 0 0 35px #F5B700, 0 4px 12px rgba(0,0,0,0.9)`,
              }}
            >
              {multiplier}X BONUS!
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PureShadeBurst;
