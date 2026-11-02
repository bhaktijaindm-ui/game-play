import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { TopBarCounter } from '../components/TopBarCounter';

// Makeup mini-game item types
type MatchItem = '💄' | '💅' | '🧴' | '✨' | '🪞';
const ITEMS: MatchItem[] = ['💄', '💅', '🧴', '✨', '🪞'];

export const FestivalMatchScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  const { userProfile, energy, maxEnergy, energyTimer, addCoins } = useGame();
  const [swapsLeft, setSwapsLeft] = useState(20);
  const [goalCount, setGoalCount] = useState(14);
  const targetGoal = 45;

  // 6x6 Mini Match Grid
  const [grid, setGrid] = useState<MatchItem[][]>(() => {
    return Array.from({ length: 6 }, () =>
      Array.from({ length: 6 }, () => ITEMS[Math.floor(Math.random() * ITEMS.length)])
    );
  });

  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);

  const handleCellClick = (r: number, c: number) => {
    if (swapsLeft <= 0) return;

    if (!selectedCell) {
      setSelectedCell({ r, c });
      return;
    }

    // Check adjacency
    const dist = Math.abs(selectedCell.r - r) + Math.abs(selectedCell.c - c);
    if (dist === 1) {
      // Swap
      const newGrid = grid.map((row) => [...row]);
      const temp = newGrid[selectedCell.r][selectedCell.c];
      newGrid[selectedCell.r][selectedCell.c] = newGrid[r][c];
      newGrid[r][c] = temp;

      setGrid(newGrid);
      setSwapsLeft((prev) => prev - 1);
      setGoalCount((prev) => Math.min(targetGoal, prev + 2));
      addCoins(25);
      setSelectedCell(null);
    } else {
      setSelectedCell({ r, c });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#2A123D] via-[#481E66] to-[#140E26] pb-8 select-none text-white">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-3 border-b border-purple-500/30 bg-[rgba(25,18,40,0.85)] text-white backdrop-blur-md sticky top-0 z-30">
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

      {/* Purple Theatre-Curtain Header Banner */}
      <div className="relative p-4 mx-3 mt-3 rounded-[24px] bg-gradient-to-b from-[#7C4DFF] via-[#6A3FC8] to-[#4A1E85] border-4 border-[#F5B53C] shadow-2xl text-center overflow-hidden">
        {/* Curtain scalloped border decorative effect */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFD166] via-transparent to-transparent opacity-60" />

        <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-[10px] font-heading font-bold text-[#FDE68A] uppercase tracking-wider">
          🎪 Limited-Time Mini Mode • 2d 14h Left
        </span>

        <h2 className="text-xl font-heading font-bold text-white mt-1 game-stroke">
          Festival Match 🎭
        </h2>

        {/* 3 Cute Original Mascot Monsters */}
        <div className="flex items-center justify-around mt-3 pt-2 border-t border-purple-400/30">
          {/* Mascot 1: Blue Puffy */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-[#3DA9FC] border-2 border-white flex items-center justify-center text-xl shadow">
              👾
            </div>
            <span className="text-[10px] font-heading font-bold mt-1 text-[#70C5FF]">Gobi</span>
            <span className="text-[9px] bg-black/40 px-1.5 rounded-full text-white tabular-nums">
              {goalCount}/{targetGoal}
            </span>
          </div>

          {/* Mascot 2: Orange Cheerful */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-[#F5B53C] border-2 border-white flex items-center justify-center text-xl shadow">
              🦊
            </div>
            <span className="text-[10px] font-heading font-bold mt-1 text-[#FDE68A]">Chikoo</span>
            <span className="text-[9px] bg-black/40 px-1.5 rounded-full text-white tabular-nums">
              22/{targetGoal}
            </span>
          </div>

          {/* Mascot 3: Mint Bubbly */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-[#3FBF4F] border-2 border-white flex items-center justify-center text-xl shadow">
              🐸
            </div>
            <span className="text-[10px] font-heading font-bold mt-1 text-[#A7F3D0]">Piku</span>
            <span className="text-[9px] bg-black/40 px-1.5 rounded-full text-white tabular-nums">
              31/{targetGoal}
            </span>
          </div>
        </div>
      </div>

      {/* 6x6 Match-3 Game Grid */}
      <div className="flex-1 flex flex-col items-center justify-center p-3">
        <div className="p-3 rounded-[28px] bg-[rgba(25,18,40,0.85)] border-3 border-[#F5B53C] shadow-2xl">
          <div className="grid grid-cols-6 gap-1.5">
            {grid.map((row, r) =>
              row.map((item, c) => {
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;

                return (
                  <motion.button
                    key={`${r}-${c}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all select-none ${
                      isSelected
                        ? 'bg-[#E6177F] border-white shadow-lg ring-2 ring-white scale-110'
                        : 'bg-white/10 hover:bg-white/20 border-white/20'
                    }`}
                  >
                    {item}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Control Bar with Swaps Counter & Backpack */}
      <div className="flex items-center justify-between px-6 py-2 bg-[rgba(25,18,40,0.9)] border-t border-purple-500/30">
        <button
          onClick={() => onNavigate('collections')}
          className="p-2.5 rounded-2xl bg-[#6A3FC8] text-white text-lg shadow active:scale-95"
          title="Backpack"
        >
          🎒
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-bold text-purple-200">Swaps Left:</span>
          <span className="text-base font-heading font-bold text-[#F5B53C] tabular-nums bg-black/40 px-3 py-1 rounded-full border border-[#F5B53C]/40 game-stroke-sm">
            {swapsLeft}
          </span>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="btn-3d-green px-4 py-1.5 rounded-2xl text-xs font-heading font-bold text-white active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default FestivalMatchScreen;
