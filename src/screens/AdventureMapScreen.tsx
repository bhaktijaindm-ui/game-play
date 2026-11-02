import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TopBarCounter } from '../components/TopBarCounter';
import { BottomNav } from '../components/BottomNav';

export interface MapRegion {
  id: string;
  name: string;
  icon: string;
  chapter: number;
  unlockedStars: number;
  stops: { stopNumber: number; type: 'puzzle' | 'story'; title: string }[];
}

export const MAP_REGIONS: MapRegion[] = [
  {
    id: 'salon_street',
    name: 'Salon Street',
    icon: '💈',
    chapter: 1,
    unlockedStars: 0,
    stops: [
      { stopNumber: 1, type: 'story', title: 'The Dusty Key' },
      { stopNumber: 2, type: 'puzzle', title: 'Mirror Shine' },
      { stopNumber: 3, type: 'puzzle', title: 'First Clients' },
      { stopNumber: 4, type: 'story', title: 'Nani’s Velvet Box' },
      { stopNumber: 5, type: 'puzzle', title: 'Street Grand Reopening' },
    ],
  },
  {
    id: 'bridal_bazaar',
    name: 'Bridal Bazaar',
    icon: '🧣',
    chapter: 2,
    unlockedStars: 10,
    stops: [
      { stopNumber: 1, type: 'story', title: 'Banarasi Silks' },
      { stopNumber: 2, type: 'puzzle', title: 'Gold Zari Threads' },
      { stopNumber: 3, type: 'puzzle', title: 'Jittery Groom' },
      { stopNumber: 4, type: 'story', title: 'Kathak Wings' },
      { stopNumber: 5, type: 'puzzle', title: 'Midnight Manicure' },
    ],
  },
  {
    id: 'mela_grounds',
    name: 'Mela Grounds',
    icon: '🎪',
    chapter: 3,
    unlockedStars: 25,
    stops: [
      { stopNumber: 1, type: 'story', title: 'Gulal Clouds' },
      { stopNumber: 2, type: 'puzzle', title: 'Color Splash' },
      { stopNumber: 3, type: 'puzzle', title: 'Marathon Run' },
      { stopNumber: 4, type: 'story', title: 'Sisterhood Over Rivalry' },
      { stopNumber: 5, type: 'puzzle', title: 'Diwali Glow Showcase' },
    ],
  },
  {
    id: 'rooftop_garden',
    name: 'Rooftop Garden',
    icon: '🌿',
    chapter: 3,
    unlockedStars: 40,
    stops: [
      { stopNumber: 1, type: 'story', title: 'Teak Pergola' },
      { stopNumber: 2, type: 'puzzle', title: 'Rosewater Mist' },
      { stopNumber: 3, type: 'puzzle', title: 'Sandalwood Mortar' },
      { stopNumber: 4, type: 'story', title: 'Rooftop Chai' },
      { stopNumber: 5, type: 'puzzle', title: 'Sunset Relaxation' },
    ],
  },
  {
    id: 'lumiere_mall',
    name: 'Lumiere Mall',
    icon: '🏛️',
    chapter: 4,
    unlockedStars: 55,
    stops: [
      { stopNumber: 1, type: 'story', title: 'The Invitation' },
      { stopNumber: 2, type: 'puzzle', title: 'Laser Glow vs Heritage' },
      { stopNumber: 3, type: 'puzzle', title: 'Grand Pavilion' },
      { stopNumber: 4, type: 'story', title: 'Royal Gulab Revealed' },
      { stopNumber: 5, type: 'puzzle', title: 'Final Masterpiece' },
    ],
  },
];

export const AdventureMapScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  const { userProfile, energy, maxEnergy, energyTimer } = useGame();
  const [selectedRegionId, setSelectedRegionId] = useState<string>(userProfile.mapRegion || 'salon_street');

  const totalStars = userProfile.stars || 18;
  const currentRegion = MAP_REGIONS.find((r) => r.id === selectedRegionId) || MAP_REGIONS[0];
  const isRegionUnlocked = totalStars >= currentRegion.unlockedStars;

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#2E1E12] via-[#4A321E] to-[#2E1E12] pb-20 select-none text-amber-100">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-3 border-b border-amber-500/30 bg-[rgba(25,18,40,0.85)] text-white backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => onNavigate('home')}
          className="text-lg font-bold px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95"
        >
          ←
        </button>

        <div className="flex items-center gap-2">
          <TopBarCounter type="energy" value={energy} maxValue={maxEnergy} timerText={energyTimer} />
          <TopBarCounter type="coins" value={userProfile.coins} />
          <TopBarCounter type="gems" value={userProfile.gems} />
        </div>
      </div>

      {/* Parchment Treasure Map Header */}
      <div className="p-3 mx-3 mt-2 rounded-[24px] bg-[#EED8AE] border-4 border-[#8B5A2B] text-[#3D2314] shadow-2xl relative overflow-hidden">
        {/* Table props: Lantern & Magnifying Glass decorative markers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl filter drop-shadow">🗺️</span>
            <div>
              <h2 className="text-lg font-heading font-bold text-[#3D2314] leading-tight">
                Rangpur Town Map
              </h2>
              <span className="text-[11px] font-medium text-[#6B4423]">
                Stars Collected: ⭐ {totalStars}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-heading font-bold bg-[#8B5A2B]/10 px-2.5 py-1 rounded-full border border-[#8B5A2B]/30">
            <span>🎁 Region Chest</span>
          </div>
        </div>

        {/* Region Selector Pills */}
        <div className="flex gap-1.5 overflow-x-auto mt-3 pb-1">
          {MAP_REGIONS.map((reg) => {
            const isSelected = reg.id === selectedRegionId;
            const isUnlocked = totalStars >= reg.unlockedStars;

            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-xl text-xs font-heading font-bold flex items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-[#8B5A2B] text-white shadow-md scale-105'
                    : isUnlocked
                    ? 'bg-amber-200/80 text-[#3D2314] hover:bg-amber-300'
                    : 'bg-stone-300 text-stone-500 opacity-60'
                }`}
              >
                <span>{reg.icon}</span>
                <span>{reg.name}</span>
                {!isUnlocked && <span className="text-[10px]">🔒</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Parchment Area */}
      <div className="flex-1 mx-3 my-3 p-4 rounded-[28px] bg-[#F7E7C4] border-4 border-[#A0522D] shadow-inner relative flex flex-col justify-between overflow-hidden">
        {/* Decorative Compass & Watermark */}
        <div className="absolute top-2 right-2 opacity-20 pointer-events-none text-6xl">
          🧭
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-base text-[#4A2E12]">
              {currentRegion.name}
            </h3>
            <span className="text-xs font-semibold text-[#8B5A2B]">
              Chapter {currentRegion.chapter}
            </span>
          </div>

          {/* 5 Stops Winding Path */}
          <div className="relative flex flex-col items-center py-2 space-y-5">
            {/* Dashed trail line */}
            <div className="absolute top-6 bottom-6 w-1 border-l-2 border-dashed border-[#8B5A2B]/40 pointer-events-none" />

            {currentRegion.stops.map((stop, idx) => {
              const isCurrent = idx === 0;
              const isCompleted = idx < (userProfile.mapStop || 1);

              return (
                <div
                  key={stop.stopNumber}
                  onClick={() => onNavigate('game')}
                  className={`relative z-10 w-full max-w-[280px] p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer active:scale-95 transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border-[#F5B53C] shadow-lg ring-2 ring-[#F5B53C]/50 animate-bounce'
                      : isCompleted
                      ? 'bg-[#E2F7D8] border-[#3FBF4F] text-[#1E4D2B]'
                      : 'bg-[#FFFDF7] border-[#8B5A2B]/40 text-[#4A2E12]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs ${
                        isCompleted
                          ? 'bg-[#3FBF4F] text-white'
                          : isCurrent
                          ? 'bg-[#E6177F] text-white'
                          : 'bg-[#8B5A2B] text-white'
                      }`}
                    >
                      {isCompleted ? '✓' : stop.stopNumber}
                    </div>

                    <div>
                      <div className="text-xs font-heading font-bold text-[#3D2314]">
                        {stop.title}
                      </div>
                      <div className="text-[10px] text-gray-600 capitalize">
                        {stop.type === 'puzzle' ? '🧩 Beauty Puzzle' : '📖 Story Scene'}
                      </div>
                    </div>
                  </div>

                  <span className="text-base">{stop.type === 'puzzle' ? '💄' : '📜'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Map Controls: Backpack, Tasks, and Big Blue GO Arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-[#8B5A2B]/30">
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('collections')}
              className="p-2 rounded-2xl bg-[#8B5A2B] text-white text-base shadow active:scale-95"
              title="Backpack"
            >
              🎒
            </button>
            <button
              onClick={() => onNavigate('palette')}
              className="p-2 rounded-2xl bg-[#8B5A2B] text-white text-base shadow active:scale-95"
              title="Rang Book Tasks"
            >
              📖
            </button>
          </div>

          <button
            onClick={() => onNavigate('game')}
            disabled={!isRegionUnlocked}
            className={`btn-3d-blue px-6 py-2 rounded-2xl font-heading font-bold text-sm text-white flex items-center gap-2 shadow-lg active:scale-95 ${
              !isRegionUnlocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>{isRegionUnlocked ? 'Play Level' : `Unlock at ⭐ ${currentRegion.unlockedStars}`}</span>
            <span className="text-lg">➔</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="map" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

export default AdventureMapScreen;
