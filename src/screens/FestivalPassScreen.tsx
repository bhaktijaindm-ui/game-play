import React from 'react';
import { useGame } from '../context/GameContext';
import { TopBarCounter } from '../components/TopBarCounter';
import { BottomNav } from '../components/BottomNav';

interface PassRewardNode {
  level: number;
  freeReward: { type: string; amount: number | string; icon: string };
  goldReward: { type: string; amount: number | string; icon: string };
}

export const FestivalPassScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  const { userProfile, energy, maxEnergy, energyTimer, claimPassNode, buyGoldPass } = useGame();

  const currentLevel = userProfile.passLevel || 1;
  const currentXp = userProfile.passXp || 0;
  const maxXp = 500;
  const hasGoldPass = !!userProfile.hasGoldPass;
  const claimedFree = userProfile.claimedPassFree || [];
  const claimedGold = userProfile.claimedPassGold || [];

  // Generate 30 Pass Level Nodes
  const passNodes: PassRewardNode[] = Array.from({ length: 30 }, (_, idx) => {
    const lvl = idx + 1;
    return {
      level: lvl,
      freeReward: {
        type: lvl % 5 === 0 ? 'chest' : lvl % 2 === 0 ? 'coins' : 'energy',
        amount: lvl % 5 === 0 ? 'Chest' : lvl * 50,
        icon: lvl % 5 === 0 ? '🎁' : lvl % 2 === 0 ? '🪙' : '⚡',
      },
      goldReward: {
        type: lvl === 30 ? 'look' : lvl % 5 === 0 ? 'gems' : 'coins',
        amount: lvl === 30 ? 'Royal Gulab' : lvl % 5 === 0 ? lvl * 5 : lvl * 150,
        icon: lvl === 30 ? '👑' : lvl % 5 === 0 ? '💎' : '🪙',
      },
    };
  });

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

      {/* Season Banner (Orange-Gold Ornate Header) */}
      <div className="relative p-4 mx-3 mt-3 rounded-[24px] bg-gradient-to-r from-[#F5B53C] via-[#FF8FB8] to-[#E6177F] border-3 border-white shadow-xl text-white overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px] font-heading font-bold uppercase tracking-wider text-[#FDE68A]">
              Seasonal Event • 18 Days Left
            </span>
            <h2 className="text-xl font-heading font-bold text-white mt-1 game-stroke">
              Diwali Gold Pass 🪔
            </h2>
            <p className="text-[11px] opacity-90 font-medium">
              Level up to unlock exclusive Rang Book recipes & gems!
            </p>
          </div>

          {!hasGoldPass ? (
            <button
              onClick={() => {
                const bought = buyGoldPass();
                if (!bought) {
                  onNavigate('shop');
                }
              }}
              className="btn-3d-gold px-3.5 py-2 rounded-2xl text-xs font-heading font-bold text-[#2A1630] shadow-lg active:scale-95 transition-transform flex flex-col items-center"
            >
              <span className="text-[10px] text-pink-700 font-extrabold uppercase">Unlock Gold</span>
              <span className="flex items-center gap-1">150 💎</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-2xl bg-black/30 border border-[#FDE68A] text-[#FDE68A] font-heading font-bold text-xs">
              👑 Gold Pass Active
            </div>
          )}
        </div>

        {/* Level XP Bar */}
        <div className="mt-3 relative z-10">
          <div className="flex justify-between text-[11px] font-heading font-bold text-white mb-1">
            <span>Pass Level {currentLevel}</span>
            <span className="tabular-nums">{currentXp} / {maxXp} XP</span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/30 p-0.5 border border-white/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3FBF4F] to-[#F5B53C] transition-all duration-300"
              style={{ width: `${Math.min(100, (currentXp / maxXp) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Columns Header: Free vs Gold */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2 text-xs font-heading font-bold text-[var(--text)]">
        <span className="w-24 text-center py-1 rounded-xl bg-gray-200 dark:bg-white/10">Free Pass</span>
        <span className="text-sm font-extrabold text-[#6A3FC8] dark:text-[#A774F0]">Track</span>
        <span className="w-28 text-center py-1 rounded-xl bg-gradient-to-r from-[#F5B53C] to-[#E6177F] text-white game-stroke-sm">
          👑 Gold Pass
        </span>
      </div>

      {/* 30 Diamond Level Nodes Track */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 py-2">
        {passNodes.map((node) => {
          const isReached = currentLevel >= node.level;
          const isFreeClaimed = claimedFree.includes(node.level);
          const isGoldClaimed = claimedGold.includes(node.level);

          return (
            <div key={node.level} className="flex items-center justify-between gap-2">
              {/* Free Reward Card */}
              <div
                onClick={() => isReached && !isFreeClaimed && claimPassNode(node.level, false)}
                className={`flex-1 p-2 rounded-2xl border flex items-center gap-2 cursor-pointer transition-all ${
                  isFreeClaimed
                    ? 'bg-gray-100 dark:bg-white/5 opacity-60 border-gray-300'
                    : isReached
                    ? 'bg-white dark:bg-white/15 border-[#3FBF4F] shadow-sm animate-pulse'
                    : 'bg-white/60 dark:bg-white/5 border-gray-200 dark:border-white/10'
                }`}
              >
                <span className="text-xl">{node.freeReward.icon}</span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-heading font-bold text-[var(--text)]">
                    {node.freeReward.amount}
                  </span>
                  <span className="text-[9px] text-gray-500">
                    {isFreeClaimed ? 'Claimed' : isReached ? 'Tap to Claim' : 'Free'}
                  </span>
                </div>
              </div>

              {/* Diamond Center Level Node */}
              <div
                className={`w-10 h-10 rounded-2xl rotate-45 flex items-center justify-center border-2 shadow-md transition-all ${
                  isReached
                    ? 'bg-gradient-to-tr from-[#6A3FC8] to-[#FF8FB8] border-[#F5B53C] text-white scale-105'
                    : 'bg-gray-300 dark:bg-gray-700 border-gray-400 text-gray-600'
                }`}
              >
                <span className="-rotate-45 font-heading font-bold text-xs tabular-nums game-stroke-sm">
                  {node.level}
                </span>
              </div>

              {/* Gold Reward Card */}
              <div
                onClick={() =>
                  isReached && hasGoldPass && !isGoldClaimed && claimPassNode(node.level, true)
                }
                className={`flex-1 p-2 rounded-2xl border flex items-center gap-2 cursor-pointer transition-all ${
                  isGoldClaimed
                    ? 'bg-gray-100 dark:bg-white/5 opacity-60 border-gray-300'
                    : isReached && hasGoldPass
                    ? 'bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] dark:from-[#78350F]/40 dark:to-[#B45309]/30 border-[#F5B53C] shadow-md animate-pulse'
                    : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-300/40'
                }`}
              >
                <span className="text-xl">{node.goldReward.icon}</span>
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] font-heading font-bold text-[var(--text)] truncate">
                    {node.goldReward.amount}
                  </span>
                  <span className="text-[9px] text-gray-500 flex items-center gap-0.5">
                    {!hasGoldPass ? '🔒 Locked' : isGoldClaimed ? 'Claimed' : isReached ? 'Claim' : 'Gold'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="pass" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

export default FestivalPassScreen;
