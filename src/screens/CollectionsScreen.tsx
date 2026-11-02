import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLLECTIONS } from '../game/levels';
import { FaceModel } from '../assets/faces/FaceModel';
import { IconButton } from '../components/IconButton';
import { Button } from '../components/Button';
import { useGame } from '../context/GameContext';
import type { FaceRecipe } from '../types';

// Pre-designed makeup looks for each collection
const SAMPLE_RECIPES: Record<string, FaceRecipe> = {
  'everyday-glow': {
    eyes: [{ shade: 'rose', opacity: 0.6, timestamp: 1 }],
    cheeks: [{ shade: 'peach', opacity: 0.5, timestamp: 1 }],
    lips: [{ shade: 'rose', opacity: 0.8, timestamp: 1 }],
  },
  'haldi-day': {
    eyes: [{ shade: 'gold', opacity: 0.7, timestamp: 1 }],
    cheeks: [{ shade: 'peach', opacity: 0.6, timestamp: 1 }],
    lips: [{ shade: 'gold', opacity: 0.7, timestamp: 1 }],
  },
  'mehendi-night': {
    eyes: [{ shade: 'mint', opacity: 0.7, timestamp: 1 }, { shade: 'gold', opacity: 0.5, timestamp: 2 }],
    cheeks: [{ shade: 'peach', opacity: 0.6, timestamp: 1 }],
    lips: [{ shade: 'ruby', opacity: 0.8, timestamp: 1 }],
  },
  'sangeet-sparkle': {
    eyes: [{ shade: 'lavender', opacity: 0.8, timestamp: 1 }, { shade: 'sky', opacity: 0.6, timestamp: 2 }],
    cheeks: [{ shade: 'rose', opacity: 0.7, timestamp: 1 }],
    lips: [{ shade: 'ruby', opacity: 0.9, timestamp: 1 }],
  },
  'bridal-red': {
    eyes: [{ shade: 'gold', opacity: 0.8, timestamp: 1 }],
    cheeks: [{ shade: 'rose', opacity: 0.7, timestamp: 1 }],
    lips: [{ shade: 'ruby', opacity: 1.0, timestamp: 1 }],
  },
  'diwali-gold': {
    eyes: [{ shade: 'gold', opacity: 0.9, timestamp: 1 }, { shade: 'sky', opacity: 0.5, timestamp: 2 }],
    cheeks: [{ shade: 'gold', opacity: 0.6, timestamp: 1 }],
    lips: [{ shade: 'ruby', opacity: 0.9, timestamp: 1 }],
  },
};

export const CollectionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useGame();
  const [activeTab, setActiveTab] = useState(COLLECTIONS[0].id);

  const activeCollection = COLLECTIONS.find((c) => c.id === activeTab) || COLLECTIONS[0];
  const unlockedLooks = userProfile.unlockedLooks || ['everyday-glow_look_1'];
  const equippedLook = userProfile.equippedLook || 'everyday-glow_look_1';

  // 6 looks for each collection
  const looks = Array.from({ length: 6 }).map((_, i) => ({
    id: `${activeCollection.id}_look_${i + 1}`,
    name: `${activeCollection.name} Look #${i + 1}`,
    levelReq: i * 3 + 1,
    isUnlocked: unlockedLooks.includes(`${activeCollection.id}_look_${i + 1}`) || userProfile.level >= (i * 3 + 1),
    recipe: SAMPLE_RECIPES[activeCollection.id] || SAMPLE_RECIPES['everyday-glow'],
  }));

  const handleEquip = (lookId: string) => {
    updateProfile({ equippedLook: lookId });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex flex-col justify-between overflow-x-hidden bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] text-[var(--text)] select-none pb-8">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-20">
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
            <h1 className="text-xl font-black text-[var(--text)]">Indian Occasions</h1>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">
              Curated Bridal & Festive Lookbooks
            </p>
          </div>
        </div>
      </header>

      {/* Horizontal Tabs for 6 Collections */}
      <div className="px-3 py-2.5 overflow-x-auto no-scrollbar flex gap-2 border-b border-[var(--border)] bg-[var(--surface)] sticky top-[57px] z-10">
        {COLLECTIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveTab(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              activeTab === c.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Collection Info Header */}
      <div className="px-4 pt-3 pb-1">
        <h2 className="text-base font-black text-[var(--text)]">{activeCollection.name}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
          {activeCollection.description}
        </p>
      </div>

      {/* Grid of 6 Looks */}
      <div className="flex-1 px-4 py-2 grid grid-cols-2 gap-3 overflow-y-auto">
        {looks.map((look) => {
          const isEquipped = equippedLook === look.id;

          return (
            <div
              key={look.id}
              className={`relative rounded-2xl overflow-hidden border bg-[var(--surface)] p-2 shadow-sm flex flex-col justify-between ${
                isEquipped ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-[var(--border)]'
              }`}
            >
              {/* Miniature Face Preview */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center">
                {look.isUnlocked ? (
                  <FaceModel
                    model={userProfile.faceModel || '1'}
                    skinTone="#FDDCBF"
                    makeupRecipe={look.recipe}
                    width={150}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-3 text-[var(--text-muted)] space-y-1">
                    <span className="text-2xl">🔒</span>
                    <span className="text-[10px] font-bold">Unlocks Level {look.levelReq}</span>
                  </div>
                )}

                {/* Equipped Badge */}
                {isEquipped && (
                  <div className="absolute top-2 right-2 bg-pink-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                    EQUIPPED
                  </div>
                )}
              </div>

              {/* Look Info & Action */}
              <div className="pt-2">
                <div className="text-xs font-bold text-[var(--text)] truncate">
                  {look.name}
                </div>
                <div className="mt-2">
                  {look.isUnlocked ? (
                    <Button
                      variant={isEquipped ? 'ghost' : 'secondary'}
                      size="sm"
                      fullWidth
                      disabled={isEquipped}
                      onClick={() => handleEquip(look.id)}
                    >
                      {isEquipped ? 'Active' : 'Equip Look'}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      disabled={true}
                    >
                      Level {look.levelReq}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionsScreen;
