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

interface LooksScreenProps {
  onBack: () => void;
  onOpenShop: () => void;
}

export const LooksScreen: React.FC<LooksScreenProps> = ({ onBack, onOpenShop }) => {
  const { user, isGlamPassActive, equipLook } = useAuth();
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

  const isEquipped = user?.equippedLook === previewLookId;
  const isCurrentUnlocked = isLookUnlocked(currentPreviewLook);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-game-bg">
      {/* Top Header */}
      <div className="flex items-center justify-between min-h-[44px] mb-2">
        <button
          onClick={onBack}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-game-surface border border-game-border text-game-muted hover:text-game-text"
          aria-label="Back to home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-heading font-bold text-game-text">
          Looks Studio
        </h2>
        <div className="w-11" />
      </div>

      {/* Big Interactive Avatar Preview Card */}
      <Card variant="gradient" padding="md" className="mb-3 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-6 py-2">
          {/* Avatar Rendering */}
          <GlamAvatar
            lookId={previewLookId}
            size="xl"
            showGoldenFrame={isPassActive}
            className="ring-4 ring-white/60 shadow-xl"
          />

          {/* Details */}
          <div className="text-left flex-1">
            <div className="flex items-center gap-1.5 mb-1">
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
                className="w-full text-xs"
              >
                {isEquipped ? 'Currently Equipped' : 'Equip This Look'}
              </Button>
            ) : currentPreviewLook.isGlamPassExclusive ? (
              <Button
                variant="accent"
                size="sm"
                onClick={onOpenShop}
                icon={<Crown className="w-4 h-4" />}
                className="w-full text-xs"
              >
                Unlock with Glam Pass
              </Button>
            ) : (
              <div className="text-xs font-semibold text-game-muted bg-game-surface/80 p-2 rounded-xl border border-game-border flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-game-danger" />
                <span>Requires {currentPreviewLook.requiredScore.toLocaleString()} Score</span>
              </div>
            )}
          </div>
        </div>
      </Card>

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
                      ? 'bg-game-surface border-game-primary ring-2 ring-game-primary/30 shadow-soft'
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
