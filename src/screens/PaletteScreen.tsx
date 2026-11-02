import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ShadeId, PalettePan } from '../types';
import { SHADES } from '../config/shades';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { useHaptics } from '../hooks/useHaptics';

const DEFAULT_PAN_SHADES: ShadeId[] = [
  'rose', 'lavender', 'peach', 'ruby',
  'gold', 'mint', 'sky', 'rose',
  'gold', 'lavender', 'ruby', 'peach',
];

export const PaletteScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useGame();
  const { playSparkle, playTaDa } = useSound();
  const { successBuzz } = useHaptics();

  // If user doesn't have 12 pans initialized yet, create initial 12 pans
  const pans: PalettePan[] = userProfile.palette?.pans?.length === 12
    ? userProfile.palette.pans
    : DEFAULT_PAN_SHADES.map((shade, i) => ({
        shade,
        filled: i < 7, // Demo state: 7/12 filled
        filledAt: i < 7 ? Date.now() - i * 86400000 : undefined,
      }));

  const filledCount = pans.filter((p) => p.filled).length;
  const isFull = filledCount >= 12;
  const [claimed, setClaimed] = useState(userProfile.palette?.completed || false);

  const handleClaim = () => {
    playTaDa();
    playSparkle();
    successBuzz();
    setClaimed(true);

    updateProfile({
      gems: userProfile.gems + 100,
      coins: userProfile.coins + 500,
      palette: {
        pans: pans.map((p) => ({ ...p, filled: false })), // Reset for next cycle
        completed: false,
      },
    });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex flex-col justify-between overflow-x-hidden bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] text-[var(--text)] select-none">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <IconButton
            aria-label="Back"
            onClick={() => navigate('/')}
            className="w-9 h-9"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </IconButton>
          <div>
            <h1 className="text-xl font-black text-[var(--text)]">Eyeshadow Palette</h1>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">
              Pure Shades fill your pans ({filledCount}/12 Filled)
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6">
        {/* Luxury Palette Vanity Case */}
        <div className="w-full max-w-[340px] bg-gradient-to-br from-stone-900 to-stone-800 dark:from-zinc-900 dark:to-zinc-950 p-5 rounded-3xl shadow-2xl border-2 border-amber-500/30 relative overflow-hidden">
          {/* Gold Inlay Trim */}
          <div className="absolute inset-1.5 border border-amber-400/20 rounded-[22px] pointer-events-none" />

          {/* Vanity Mirror Top Strip */}
          <div className="w-full h-8 mb-4 rounded-xl bg-gradient-to-r from-cyan-100/20 via-white/40 to-cyan-100/20 border border-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-200">
              GLAM BLOCKS LUXURY VANITY
            </span>
          </div>

          {/* 12 Circular Eyeshadow Pans in 3 rows x 4 cols */}
          <div className="grid grid-cols-4 gap-3 relative z-10">
            {pans.map((pan, idx) => {
              const shadeInfo = SHADES[pan.shade] || SHADES.rose;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`relative w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center shadow-inner ${
                      pan.filled
                        ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-100'
                        : 'border-zinc-700 bg-zinc-800/80 opacity-60 scale-95'
                    }`}
                    style={{
                      background: pan.filled
                        ? `radial-gradient(circle at 35% 35%, #ffffff 0%, ${shadeInfo.lightColor} 45%, ${shadeInfo.darkColor} 100%)`
                        : undefined,
                    }}
                  >
                    {pan.filled ? (
                      <span className="text-sm drop-shadow">{shadeInfo.icon}</span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-bold">#{idx + 1}</span>
                    )}

                    {/* Gloss sheen overlay */}
                    {pan.filled && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                    )}
                  </div>
                  <span className="text-[9px] font-semibold text-zinc-400 truncate max-w-[50px]">
                    {pan.filled ? shadeInfo.name.split(' ')[0] : 'Empty'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pure Shade Tip Box */}
        <div className="w-full max-w-[340px] bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] text-xs text-[var(--text-muted)] space-y-1">
          <div className="font-bold text-[var(--text)] flex items-center gap-1.5">
            <span>✨</span> How to fill pans:
          </div>
          <p>
            Clear a full line using blocks of <strong className="text-pink-600 dark:text-pink-400">ONE COLOR ONLY</strong> (Pure Shade) to fill an eyeshadow pan with that shade!
          </p>
        </div>
      </div>

      {/* Claim Button Bar */}
      <footer className="p-4 bg-[var(--surface)] border-t border-[var(--border)]">
        {isFull && !claimed ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleClaim}
            className="animate-pulse shadow-amber-500/30"
          >
            🎁 Claim 100 Gems & Themed Collection!
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/game')}
          >
            Play to Fill More Pans ({12 - filledCount} remaining)
          </Button>
        )}
      </footer>
    </div>
  );
};

export default PaletteScreen;
