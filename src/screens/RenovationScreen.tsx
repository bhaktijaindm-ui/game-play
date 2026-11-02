import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TopBarCounter } from '../components/TopBarCounter';
import { BottomNav } from '../components/BottomNav';
import { PriceButton } from '../components/PriceButton';

interface RoomDef {
  id: string;
  name: string;
  cost: number;
  bonus: string;
  icon: string;
  beforeDesc: string;
  afterDesc: string;
}

export const SALON_ROOMS: RoomDef[] = [
  {
    id: 'reception',
    name: 'Reception & Waiting Lounge',
    cost: 200,
    bonus: '+5% Coins from all line clears',
    icon: '🛎️',
    beforeDesc: 'Dusty brass counter, worn wicker chairs, and flickering wall sconces.',
    afterDesc: 'Polished rosewood reception, blush velvet armchairs, and glowing chandelier.',
  },
  {
    id: 'makeupStudio',
    name: 'Makeup Studio',
    cost: 350,
    bonus: '+5% Base Score on every match',
    icon: '💄',
    beforeDesc: 'Cracked mirrors, dim yellow bulbs, and crowded cosmetic drawers.',
    afterDesc: 'High-CRI halo vanity mirrors, rose gold organizers, and plush leather chairs.',
  },
  {
    id: 'nailBar',
    name: 'Zoya’s Nail Bar',
    cost: 500,
    bonus: '+10% Customer Order Coins',
    icon: '💅',
    beforeDesc: 'Wobbly wooden desk and peeling mint paint.',
    afterDesc: 'Glossy marble nail bar, UV curing stations, and custom nail art display wall.',
  },
  {
    id: 'hairLounge',
    name: 'Hair Wash Lounge',
    cost: 700,
    bonus: '+1 Free Undo per Game',
    icon: '💇',
    beforeDesc: 'Rusted pipes, leaky brass taps, and chipped ceramic basins.',
    afterDesc: 'Ergonomic reclining wash chairs, herbal steam bar, and golden brass fixtures.',
  },
  {
    id: 'spa',
    name: 'Herbal Rose Spa',
    cost: 900,
    bonus: '15% Faster Energy Regeneration',
    icon: '🧖',
    beforeDesc: 'Cold drafty room with cobwebbed stone shelves.',
    afterDesc: 'Aromatherapy rose vaporizers, warm sandalwood stones, and soothing water fountain.',
  },
  {
    id: 'rooftopCafe',
    name: 'Rooftop Terrace Cafe',
    cost: 1200,
    bonus: '+15% Combo Multiplier Points',
    icon: '☕',
    beforeDesc: 'Empty concrete terrace covered in dry autumn leaves.',
    afterDesc: 'Teak planters with blooming jasmine, fairy-lit pergola, and artisan chai counter.',
  },
  {
    id: 'bridalSuite',
    name: 'VIP Royal Bridal Suite',
    cost: 1600,
    bonus: 'Permanent +25% Coins & Stars across all modes',
    icon: '👑',
    beforeDesc: 'Locked storeroom with faded wallpaper and antique chests.',
    afterDesc: 'Majestic silk-draped dressing suite, 360-degree mirrors, and royal bridal throne.',
  },
];

export const RenovationScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  const { userProfile, energy, maxEnergy, energyTimer, upgradeRoom } = useGame();
  const [selectedRoomId, setSelectedRoomId] = useState<string>('reception');
  const [viewState, setViewState] = useState<'after' | 'before'>('after');

  const selectedRoom = SALON_ROOMS.find((r) => r.id === selectedRoomId) || SALON_ROOMS[0];
  const userRooms = userProfile.rooms || {};
  const currentRoomLevel = userRooms[selectedRoom.id] || 0;
  const isUpgraded = currentRoomLevel > 0;
  const canAfford = userProfile.coins >= selectedRoom.cost;

  const handleUpgrade = () => {
    if (canAfford) {
      upgradeRoom(selectedRoom.id, selectedRoom.cost);
      setViewState('after');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#FFF5F8] via-[#FFF4E4] to-[#FFF5F8] dark:from-[#140E26] dark:via-[#231A45] dark:to-[#140E26] pb-24 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-3 border-b border-white/20 bg-[rgba(25,18,40,0.85)] text-white backdrop-blur-md sticky top-0 z-30">
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

      {/* Screen Title */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-[var(--text,#2A1630)] dark:text-white">
            Salon Renovation 🪞
          </h2>
          <p className="text-xs text-[var(--text-muted,#7A6283)] dark:text-gray-300">
            Restore Gulab Mahal room by room to unlock permanent perks!
          </p>
        </div>
      </div>

      {/* Horizontal Room Selector */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {SALON_ROOMS.map((room) => {
          const isSelected = room.id === selectedRoomId;
          const upgraded = (userRooms[room.id] || 0) > 0;

          return (
            <button
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={`flex-shrink-0 p-2.5 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-[#A774F0] to-[#6A3FC8] text-white border-[#F5B53C] shadow-md scale-105'
                  : upgraded
                  ? 'bg-white/80 dark:bg-white/10 border-[#3FBF4F] text-[var(--text)]'
                  : 'bg-white/50 dark:bg-white/5 border-gray-300 text-gray-500'
              }`}
            >
              <span className="text-2xl">{room.icon}</span>
              <span className="text-[11px] font-heading font-bold max-w-[70px] truncate text-center">
                {room.name.split(' ')[0]}
              </span>
              {upgraded && (
                <span className="text-[9px] bg-[#3FBF4F] text-white font-bold px-1.5 rounded-full">
                  ✓ Done
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Big Room Showcase Card with Before/After Reveal */}
      <div className="mx-4 p-4 rounded-[28px] bg-white dark:bg-[#231A45] border-3 border-[#F3D3E1] dark:border-[#3D5E86] shadow-xl flex flex-col space-y-3">
        {/* Before / After Toggle Pill */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedRoom.icon}</span>
            <h3 className="font-heading font-bold text-base text-[var(--text)]">
              {selectedRoom.name}
            </h3>
          </div>

          <div className="flex rounded-full bg-gray-200 dark:bg-white/10 p-0.5 text-[11px] font-heading font-bold">
            <button
              onClick={() => setViewState('before')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewState === 'before' ? 'bg-[#FF4F7B] text-white shadow' : 'text-gray-500'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setViewState('after')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewState === 'after' ? 'bg-[#3FBF4F] text-white shadow' : 'text-gray-500'
              }`}
            >
              After
            </button>
          </div>
        </div>

        {/* Visual Room Preview Frame */}
        <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-[#F5B53C] shadow-inner flex items-center justify-center bg-gradient-to-br from-[#FFE8F0] via-[#FFF5F8] to-[#FFF0F6] dark:from-[#1E1327] dark:to-[#2E2239]">
          {/* Animated Illustrated Backdrop Placeholder */}
          <div className="text-center p-4">
            <span className="text-5xl filter drop-shadow mb-2 block">
              {viewState === 'after' ? '✨ ' + selectedRoom.icon + ' 🌸' : '🏚️ ' + selectedRoom.icon}
            </span>
            <p className="text-xs font-heading font-bold text-[var(--text)] px-4">
              {viewState === 'after' ? selectedRoom.afterDesc : selectedRoom.beforeDesc}
            </p>
          </div>

          {/* Ribbon Badge */}
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-heading font-bold">
            {viewState === 'after' ? '🌟 Restored Glory' : '⚠️ Faded Original'}
          </div>
        </div>

        {/* Permanent Bonus Chip */}
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#F5B53C]/15 to-[#E6177F]/15 border border-[#F5B53C]/40 flex items-center gap-2">
          <span className="text-lg">🎁</span>
          <div className="text-xs">
            <span className="font-heading font-bold text-[#E6177F] dark:text-[#FF8FB8]">
              Permanent Bonus:{' '}
            </span>
            <span className="font-medium text-[var(--text)]">{selectedRoom.bonus}</span>
          </div>
        </div>

        {/* Action Button */}
        {isUpgraded ? (
          <div className="w-full py-2.5 rounded-[18px] bg-[#3FBF4F]/20 border-2 border-[#3FBF4F] text-[#3FBF4F] text-center font-heading font-bold text-sm">
            ✓ Room Fully Restored & Active!
          </div>
        ) : (
          <PriceButton
            label="Renovate Room"
            price={`${selectedRoom.cost} 🪙`}
            variant="green"
            disabled={!canAfford}
            onClick={handleUpgrade}
            className="w-full text-sm"
          />
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="renovation" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

export default RenovationScreen;
