import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COLLECTIBLE_LOOKS } from '../config/product.config';
import type { CollectibleLook } from '../config/product.config';
import { GlamAvatar } from '../components/avatar/GlamAvatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/ui/Toast';
import { soundSystem } from '../services/soundSystem';
import { ChevronLeft, Lock, Check, Sparkles, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LooksScreenProps {
  onBack: () => void;
  onOpenShop: () => void;
}

export const LooksScreen: React.FC<LooksScreenProps> = ({ onBack, onOpenShop }) => {
  const { user, isGlamPassActive, equipLook, unlockLook, spendCurrency } = useAuth();
  const { showToast } = useToast();

  const [previewLookId, setPreviewLookId] = useState<string>(
    user?.equippedLook || 'look_natural_glow'
  );

  const currentPreviewLook: CollectibleLook =
    COLLECTIBLE_LOOKS.find((l) => l.id === previewLookId) || COLLECTIBLE_LOOKS[0];

  const userBestScore = user?.bestScore || 0;
  const isPassActive = isGlamPassActive();

  const isLookUnlocked = (look: CollectibleLook): boolean => {
    if (look.isGlamPassExclusive) {
      return isPassActive;
    }
    return userBestScore >= look.requiredScore || (user?.unlockedLooks?.includes(look.id) ?? false);
  };

  const handleEquip = () => {
    soundSystem.playSparkle();
    equipLook(previewLookId);
    showToast(`Equipped "${currentPreviewLook.name}"!`, 'glam');
  };

  const handleUnlockWithCoins = (look: CollectibleLook) => {
    const cost = Math.max(500, look.requiredScore);
    if ((user?.coins || 0) < cost) {
      showToast(`Need ${cost.toLocaleString()} coins to unlock early. Earn coins by playing or visit the boutique!`, 'warning');
      return;
    }

    const success = spendCurrency(cost, 0);
    if (success) {
      soundSystem.playSparkle();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          colors: ['#FF4081', '#D4AF37', '#FFFDF9'],
        });
      } catch {}
      unlockLook(look.id);
      equipLook(look.id);
      showToast(`Unlocked and equipped "${look.name}"!`, 'glam');
    }
  };

  const isEquipped = user?.equippedLook === previewLookId;
  const isCurrentUnlocked = isLookUnlocked(currentPreviewLook);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-gradient-to-b from-game-bg via-game-surface to-pink-50/50 dark:to-purple-950/20">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between min-h-[48px] mb-2">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-game-surface border border-game-border text-game-muted hover:text-game-text hover:border-game-secondary transition-all cursor-pointer"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-display font-bold text-game-text">
            Looks Studio
          </h2>
          <div className="w-11" />
        </div>

        {/* Big Interactive Avatar Preview Card */}
        <Card variant="gradient" padding="md" className="mb-3 text-center relative overflow-hidden border border-game-border shadow-luxury">
          <div className="flex items-center justify-center gap-5 py-1">
            {/* Avatar Rendering */}
            <GlamAvatar
              lookId={previewLookId}
              size="xl"
              showGoldenFrame={isPassActive}
              className="ring-4 ring-white/70 shadow-rosegold"
            />

            {/* Details */}
            <div className="text-left flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-lg font-heading font-bold text-game-text">
                  {currentPreviewLook.name}
                </h3>
                {currentPreviewLook.isGlamPassExclusive && (
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                )}
              </div>
              <p className="text-xs text-game-muted leading-tight mb-3">
                {currentPreviewLook.subtitle}
              </p>

              {/* Equip / Unlock status */}
              {isCurrentUnlocked ? (
                <Button
                  variant={isEquipped ? 'ghost' : 'primary'}
                  size="sm"
                  onClick={handleEquip}
                  disabled={isEquipped}
                  icon={isEquipped ? <Check className="w-4 h-4 text-game-success" /> : <Sparkles className="w-4 h-4" />}
                  className="w-full text-xs font-heading font-bold min-h-[40px]"
                >
                  {isEquipped ? 'Currently Wearing' : 'Wear This Look'}
                </Button>
              ) : currentPreviewLook.isGlamPassExclusive ? (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={onOpenShop}
                  icon={<Crown className="w-4 h-4" />}
                  className="w-full text-xs font-heading font-bold min-h-[40px]"
                >
                  Unlock with VIP Pass
                </Button>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <div className="text-[11px] font-semibold text-game-muted bg-game-surface/80 p-1.5 rounded-xl border border-game-border flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-game-danger" />
                    <span>Score {currentPreviewLook.requiredScore.toLocaleString()} or Unlock</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnlockWithCoins(currentPreviewLook)}
                    className="w-full min-h-[36px] rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-[11px] font-heading font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    Unlock Early (🪙 {Math.max(500, currentPreviewLook.requiredScore)})
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Grid of All Collectible Looks */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-2.5 pb-2">
          {COLLECTIBLE_LOOKS.map((look) => {
            const unlocked = isLookUnlocked(look);
            const isSelected = look.id === previewLookId;
            const equipped = user?.equippedLook === look.id;

            return (
              <motion.div
                key={look.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  soundSystem.playClick();
                  setPreviewLookId(look.id);
                }}
                className={`
                  p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center relative
                  ${
                    isSelected
                      ? 'bg-game-surface border-game-primary ring-2 ring-game-primary/30 shadow-luxury'
                      : 'bg-game-surface/70 border-game-border hover:bg-game-surface'
                  }
                `}
              >
                {/* Status Badges */}
                {equipped && (
                  <span className="absolute top-2 left-2 bg-game-success text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    Equipped
                  </span>
                )}
                {look.isGlamPassExclusive && (
                  <span className="absolute top-2 right-2 bg-amber-400 text-amber-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                    <Crown className="w-2.5 h-2.5 fill-amber-950" /> VIP
                  </span>
                )}

                {/* Avatar Thumbnail */}
                <div className="my-2 relative">
                  <GlamAvatar lookId={look.id} size="md" />
                  {!unlocked && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="text-xs font-heading font-semibold text-game-text truncate w-full">
                  {look.name}
                </div>
                <div className="text-[10px] text-game-muted">
                  {unlocked
                    ? 'Ready to Wear'
                    : look.isGlamPassExclusive
                    ? 'Glam Pass VIP'
                    : `Score: ${look.requiredScore.toLocaleString()}`}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
