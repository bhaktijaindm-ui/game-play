import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ComboMeterProps {
  combo: number;
  maxCombo: number;
  className?: string;
}

export const ComboMeter: React.FC<ComboMeterProps> = ({
  combo,
  maxCombo,
  className = '',
}) => {
  const safeMax = Math.max(1, maxCombo);
  const progressPercent = Math.min(100, Math.max(0, (combo / safeMax) * 100));

  // Intensity color gradient based on combo level
  const { barGradient, glowShadow, textColor, flameColor } = useMemo(() => {
    if (combo <= 1) {
      return {
        barGradient: 'linear-gradient(90deg, #FF75A0 0%, #FF5C9E 100%)',
        glowShadow: '0 0 10px rgba(255, 92, 158, 0.45)',
        textColor: '#FF75A0',
        flameColor: '#FF5C9E',
      };
    }
    if (combo === 2) {
      return {
        barGradient: 'linear-gradient(90deg, #9B6BFF 0%, #C056FD 100%)',
        glowShadow: '0 0 14px rgba(155, 107, 255, 0.6)',
        textColor: '#C056FD',
        flameColor: '#9B6BFF',
      };
    }
    if (combo === 3) {
      return {
        barGradient: 'linear-gradient(90deg, #FF5252 0%, #FF793F 100%)',
        glowShadow: '0 0 18px rgba(255, 82, 82, 0.7)',
        textColor: '#FF793F',
        flameColor: '#FF5252',
      };
    }
    // High combo 4+
    return {
      barGradient: 'linear-gradient(90deg, #FF9F1A 0%, #F5B700 50%, #FFFA65 100%)',
      glowShadow: '0 0 24px rgba(245, 183, 0, 0.9), 0 0 8px #FFFFFF',
      textColor: '#FFD32A',
      flameColor: '#F5B700',
    };
  }, [combo]);

  return (
    <div
      className={`w-full max-w-[460px] mx-auto flex flex-col gap-1.5 select-none ${className}`}
      role="progressbar"
      aria-valuenow={combo}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label="Combo meter"
    >
      {/* Header with Title and Bouncing Number */}
      <div className="flex items-center justify-between text-xs px-1 font-semibold">
        <div className="flex items-center gap-1">
          <span
            className="text-[10px] uppercase tracking-wider font-bold"
            style={{ color: 'var(--text-muted, rgba(255,255,255,0.6))' }}
          >
            Combo
          </span>
          {combo > 1 && (
            <span
              className="text-xs transition-colors duration-300 drop-shadow-sm"
              style={{ color: flameColor }}
              role="img"
              aria-label="flame"
            >
              🔥
            </span>
          )}
        </div>

        {/* Number with springy pop bounce on change */}
        <div className="h-5 flex items-center justify-end overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={combo}
              initial={{ scale: 1.6, y: -4, opacity: 0.4 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.6, y: 4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="font-bold text-sm tracking-tight"
              style={{
                color: combo > 1 ? textColor : 'var(--text, rgba(255,255,255,0.8))',
                textShadow: combo > 1 ? `0 0 10px ${flameColor}` : 'none',
              }}
            >
              {combo > 0 ? `${combo}x` : '0x'}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Slim Progress Bar Track */}
      <div className="w-full h-2 rounded-full bg-[var(--surface,rgba(255,255,255,0.08))] border border-[var(--border,rgba(255,255,255,0.15))] p-[1px] relative overflow-hidden backdrop-blur-sm">
        {/* Fill Indicator */}
        <motion.div
          animate={{
            width: `${progressPercent}%`,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="h-full rounded-full relative"
          style={{
            background: barGradient,
            boxShadow: combo > 1 ? glowShadow : 'none',
          }}
        >
          {/* Subtle glossy sheen line inside fill */}
          <div
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ComboMeter;
