import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FaceZone, ShadeId } from '../types';
import { SHADES } from '../config/shades';

export interface MakeupBrushProps {
  zone: FaceZone;
  shade: ShadeId;
  active: boolean;
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

function getShadeHex(shadeId: ShadeId): string {
  if (SHADES[shadeId]?.lightColor) {
    return SHADES[shadeId].lightColor;
  }
  return FALLBACK_SHADE_COLORS[shadeId] || '#FF5C9E';
}

interface SparkleParticle {
  id: number;
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  size: number;
  delay: number;
}

export const MakeupBrush: React.FC<MakeupBrushProps> = ({
  zone,
  shade,
  active,
  onComplete,
  className = '',
}) => {
  const shadeColor = getShadeHex(shade);

  // Position zone parameters (percentage of height)
  const zoneStyle = useMemo(() => {
    switch (zone) {
      case 'eyes':
        return { top: '24%', height: '22%' };
      case 'cheeks':
        return { top: '44%', height: '24%' };
      case 'lips':
        return { top: '64%', height: '20%' };
      default:
        return { top: '35%', height: '25%' };
    }
  }, [zone]);

  // Generate exactly 20 soft sparkle particles (limit < 24)
  const sparkles = useMemo<SparkleParticle[]>(() => {
    const list: SparkleParticle[] = [];
    for (let i = 0; i < 20; i++) {
      const progress = i / 20;
      list.push({
        id: i,
        startX: progress * 80 + 10,
        startY: 50 + (Math.sin(i * 1.5) * 35),
        driftX: (Math.random() - 0.5) * 40,
        driftY: (Math.random() - 0.5) * 40 - 15,
        size: 3 + (i % 3) * 2.5,
        delay: progress * 0.42,
      });
    }
    return list;
  }, []);

  // Safety timer for 600ms completion
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      onComplete();
    }, 600);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <div
          className={`absolute inset-0 pointer-events-none select-none z-30 overflow-hidden ${className}`}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Active Zone Container */}
          <div
            className="absolute left-[8%] right-[8%] rounded-3xl overflow-hidden"
            style={{
              top: zoneStyle.top,
              height: zoneStyle.height,
            }}
          >
            {/* 1. Sweeping Makeup Color Wash via clip-path animation (600ms ease-out) */}
            <motion.div
              initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${shadeColor}90 0%, ${shadeColor}40 60%, transparent 85%)`,
                filter: 'blur(6px)',
              }}
            />

            {/* 2. Soft Sparkle Particles at the edge of the sweep */}
            {sparkles.map((sp) => (
              <motion.div
                key={sp.id}
                initial={{
                  x: `${sp.startX}%`,
                  y: `${sp.startY}%`,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: `calc(${sp.startX}% + ${sp.driftX}px)`,
                  y: `calc(${sp.startY}% + ${sp.driftY}px)`,
                  scale: [0, 1.3, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.55,
                  delay: sp.delay,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  width: `${sp.size}px`,
                  height: `${sp.size}px`,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  boxShadow: `0 0 8px 2px ${shadeColor}, 0 0 14px 4px #FFFFFF`,
                }}
              />
            ))}

            {/* 3. Luxury Stylized Brush Head travelling left-to-right */}
            <motion.div
              initial={{ left: '0%', opacity: 0, scale: 0.8 }}
              animate={{
                left: ['0%', '100%'],
                opacity: [0, 1, 1, 0],
                scale: [0.85, 1.1, 1.05, 0.9],
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 25,
              }}
              className="flex items-center"
            >
              {/* Glowing Brush Tip */}
              <div
                className="w-8 h-14 rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, ${shadeColor} 0%, #FFFFFF 60%, ${shadeColor} 100%)`,
                  boxShadow: `0 0 20px 6px ${shadeColor}, 0 0 35px 10px rgba(255, 255, 255, 0.8)`,
                  filter: 'blur(1.5px)',
                }}
              />

              {/* Rose Gold Ferrule & Handle Hint */}
              <div
                className="w-4 h-6 rounded-r-md -ml-1 border border-amber-200/50 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #FAD0C4 0%, #FFD1FF 50%, #C99036 100%)',
                }}
              />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MakeupBrush;
