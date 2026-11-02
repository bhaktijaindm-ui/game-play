import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile, Client } from '../types';
import { useGame } from '../context/GameContext';
import { TopBarCounter } from '../components/TopBarCounter';
import { AvatarWithLevelBadge } from '../components/AvatarWithLevelBadge';
import { EventIconWithTimer } from '../components/EventIconWithTimer';
import { BottomNav, type TabId } from '../components/BottomNav';
import { SalonGoalsModal } from '../components/SalonGoalsModal';
import { GetEnergyModal } from '../components/GetEnergyModal';

export interface HomeScreenProps {
  user?: Partial<UserProfile> | null;
  coins?: number;
  gems?: number;
  streak?: number;
  level?: number;
  bestScore?: number;
  todayClient?: Client | null;
  onPlay?: (client?: Client | null) => void;
  onNavigate?: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  coins: propCoins,
  gems: propGems,
  level: propLevel,
  bestScore: propBestScore,
  onPlay,
  onNavigate,
}) => {
  const {
    userProfile,
    energy,
    maxEnergy,
    energyTimer,
    spendEnergy,
    addEnergy,
    spendGems,
    claimDailyMilestone,
  } = useGame();

  const [activeSpeech, setActiveSpeech] = useState<{ name: string; text: string } | null>(null);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showEnergyModal, setShowEnergyModal] = useState(false);

  // Character quotes for interactive speech bubbles
  const characterQuotes = {
    anaya: 'Anaya: “Every face is a unique canvas waiting for love and celebration!”',
    zoya: 'Zoya: “Mint green gel polish with gold foil is trending this week!”',
    kabir: 'Kabir: “I tightened the brass salon sconces. No more flickering lights!”',
    kajal: 'Kajal: “*Purrrrrr...* Kajal blesses your next Pure Shade combo!”',
  };

  const handleCharacterTap = (key: keyof typeof characterQuotes, name: string) => {
    setActiveSpeech({ name, text: characterQuotes[key] });
    setTimeout(() => {
      setActiveSpeech((cur) => (cur?.name === name ? null : cur));
    }, 4500);
  };

  const coins = propCoins !== undefined ? propCoins : userProfile.coins;
  const gems = propGems !== undefined ? propGems : userProfile.gems;
  const level = propLevel !== undefined ? propLevel : userProfile.level;
  const bestScore = propBestScore !== undefined ? propBestScore : userProfile.bestScore || 18450;

  const handlePlayClick = () => {
    if (energy <= 0) {
      setShowEnergyModal(true);
      return;
    }
    const spent = spendEnergy(1);
    if (spent) {
      onPlay ? onPlay() : onNavigate?.('game');
    } else {
      setShowEnergyModal(true);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      className="relative flex min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex-col justify-between overflow-x-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FFF4E4] to-[#FFF5F8] dark:from-[#140E26] dark:via-[#231A45] dark:to-[#140E26] select-none pb-20"
    >
      {/* 1. Top Bar HUD */}
      <header className="sticky top-0 z-30 flex w-full items-center justify-between bg-[rgba(25,18,40,0.85)] text-white backdrop-blur-md px-3 py-2 border-b border-white/10 shadow-md">
        {/* User avatar & level badge */}
        <AvatarWithLevelBadge
          level={level}
          name={userProfile.displayName || 'Anaya'}
          onClick={() => onNavigate?.('profile')}
        />

        {/* Currency Counters with Energy Timer & Plus Buttons */}
        <div className="flex items-center gap-1.5">
          <TopBarCounter
            type="energy"
            value={energy}
            maxValue={maxEnergy}
            timerText={energyTimer}
            onPlusClick={() => setShowEnergyModal(true)}
          />

          <TopBarCounter
            type="coins"
            value={coins}
            onPlusClick={() => onNavigate?.('shop')}
          />

          <TopBarCounter
            type="gems"
            value={gems}
            onPlusClick={() => onNavigate?.('shop')}
          />

          {/* Settings Button */}
          <button
            type="button"
            aria-label="Settings"
            onClick={() => onNavigate?.('settings')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-90 text-sm ml-0.5"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* 2. Main View: Isometric Cutaway of Gulab Mahal Salon */}
      <div className="relative flex-1 flex flex-col justify-between px-3 py-2">
        {/* Salon Interior Cutaway Container */}
        <div className="relative w-full h-[360px] rounded-[32px] overflow-hidden border-4 border-[#F5B53C] shadow-2xl bg-gradient-to-b from-[#A774F0]/30 via-[#FFF4E4] to-[#F8E7C9] dark:from-[#231A45] dark:via-[#140E26] dark:to-[#1E1327]">
          {/* Subtle Pink-and-Cream Checker Floor */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#E6177F_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Salon Room Sign & Best Score */}
          <div className="absolute top-3 left-4 px-3 py-1 rounded-full bg-[rgba(25,18,40,0.75)] border border-[#F5B53C] text-white flex items-center gap-1.5 shadow-md">
            <span className="text-xs">🌹</span>
            <span className="text-[11px] font-heading font-bold game-stroke-sm">Gulab Mahal Salon</span>
            <span className="text-[10px] text-[#FDE68A] font-bold ml-1 pl-1.5 border-l border-white/30">
              ⭐ {bestScore.toLocaleString()}
            </span>
          </div>

          {/* Speech Bubble Overlay */}
          <AnimatePresence>
            {activeSpeech && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="absolute top-12 left-4 right-4 z-20 p-2.5 rounded-2xl bg-white dark:bg-[#231A45] border-2 border-[#E6177F] shadow-xl text-[12px] font-medium text-[var(--text,#2A1630)] dark:text-white"
              >
                <div className="flex items-center justify-between">
                  <span>{activeSpeech.text}</span>
                  <button
                    onClick={() => setActiveSpeech(null)}
                    className="ml-2 text-xs text-gray-400 font-bold"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating "Renovate!" speech bubble pointing to affordable room */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            onClick={() => onNavigate?.('renovation')}
            className="absolute top-14 right-4 z-10 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#F5B53C] to-[#E6177F] text-white font-heading font-bold text-xs shadow-lg cursor-pointer active:scale-95 border-2 border-white game-stroke-sm flex items-center gap-1"
          >
            <span>🔨 Renovate!</span>
          </motion.div>

          {/* Interactive Characters Positioned inside Salon Cutaway */}
          {/* Anaya (Heroine in Rose Apron) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCharacterTap('anaya', 'Anaya')}
            className="absolute bottom-12 left-8 cursor-pointer flex flex-col items-center group z-10"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#E6177F] to-[#FF8FB8] border-3 border-white shadow-xl flex items-center justify-center text-3xl group-hover:shadow-[0_0_16px_rgba(230,23,127,0.6)]">
              👩🏽‍🦱
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-heading font-bold text-white shadow">
              Anaya
            </span>
          </motion.div>

          {/* Zoya (Nail Desk) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCharacterTap('zoya', 'Zoya')}
            className="absolute bottom-16 left-32 cursor-pointer flex flex-col items-center group z-10"
          >
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#34D399] to-[#6EE7B7] border-3 border-white shadow-xl flex items-center justify-center text-2xl group-hover:shadow-[0_0_16px_rgba(52,211,153,0.6)]">
              💅🏽
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-heading font-bold text-white shadow">
              Zoya
            </span>
          </motion.div>

          {/* Kabir (Handyman) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCharacterTap('kabir', 'Kabir')}
            className="absolute bottom-24 right-14 cursor-pointer flex flex-col items-center group z-10"
          >
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#3DA9FC] to-[#93C5FD] border-3 border-white shadow-xl flex items-center justify-center text-2xl group-hover:shadow-[0_0_16px_rgba(61,169,252,0.6)]">
              🔧
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-heading font-bold text-white shadow">
              Kabir
            </span>
          </motion.div>

          {/* Kajal (Black Cat sleeping on velvet chair) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCharacterTap('kajal', 'Kajal')}
            className="absolute bottom-6 right-8 cursor-pointer flex flex-col items-center group z-10"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E1327] to-[#3D254F] border-2 border-[#F5B53C] shadow-lg flex items-center justify-center text-xl">
              🐈‍⬛
            </div>
            <span className="mt-0.5 px-1.5 py-0.2 rounded-full bg-black/60 text-[9px] font-heading font-bold text-[#FDE68A]">
              Kajal 🔔
            </span>
          </motion.div>
        </div>

        {/* 3. Right-Side Vertical Event Icons Column */}
        <div className="absolute right-4 top-16 z-20 flex flex-col space-y-3 pointer-events-auto">
          <EventIconWithTimer
            id="festival_match"
            title="Match 3"
            icon="🎪"
            timeRemaining="2d 14h"
            badgeText="NEW"
            onClick={() => onNavigate?.('festivalMatch')}
          />

          <EventIconWithTimer
            id="bridal_rush"
            title="Bridal"
            icon="👰🏽"
            timeRemaining="4d 08h"
            onClick={() => onNavigate?.('collections')}
          />

          <EventIconWithTimer
            id="daily_brief"
            title="Daily"
            icon="📅"
            timeRemaining="Today"
            onClick={() => onNavigate?.('dailyReward')}
          />
        </div>

        {/* 4. Bottom Controls: Quest Notebook, Big Round Play Button, Palette */}
        <div className="flex items-center justify-between px-2 pt-2">
          {/* Bottom-Left: Quest Notebook ("Salon Goals") */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowGoalsModal(true)}
            className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-[#FFFDF8] to-[#F8E7C9] dark:from-[#2A1F3D] dark:to-[#181126] border-3 border-[#F5B53C] shadow-xl text-center active:scale-95"
            title="Salon Goals"
          >
            <span className="text-2xl filter drop-shadow">📔</span>
            <span className="text-[9px] font-heading font-bold text-[#6A3FC8] dark:text-[#FF8FB8] leading-none mt-0.5">
              Goals
            </span>
            {/* Unread badge */}
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FF4F7B] border border-white text-white font-heading font-bold text-[9px] flex items-center justify-center animate-pulse">
              !
            </span>
          </motion.button>

          {/* Bottom-Center: Big Round Pulsing Play Button */}
          <div className="relative flex flex-col items-center">
            {/* Pulsing Outer Glow */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.75, 0.4],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 -m-2 rounded-full bg-gradient-to-tr from-[#E6177F] via-[#A774F0] to-[#3DA9FC] blur-md pointer-events-none"
            />

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handlePlayClick}
              className="relative w-20 h-20 rounded-full bg-gradient-to-b from-[#FF6EA7] via-[#E6177F] to-[#A774F0] border-4 border-white shadow-[0_10px_25px_rgba(230,23,127,0.5)] flex flex-col items-center justify-center text-white active:translate-y-1 transition-all"
            >
              <span className="text-2xl filter drop-shadow">🖌️</span>
              <span className="text-xs font-heading font-black tracking-wide uppercase game-stroke">
                Play
              </span>
              <span className="text-[9px] font-bold text-[#FDE68A] tabular-nums leading-none">
                LV {level}
              </span>
            </motion.button>
          </div>

          {/* Bottom-Right: Rang Book Shortcut */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate?.('palette')}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-[#FFFDF8] to-[#F8E7C9] dark:from-[#2A1F3D] dark:to-[#181126] border-3 border-[#F5B53C] shadow-xl text-center active:scale-95"
            title="Nani's Rang Book"
          >
            <span className="text-2xl filter drop-shadow">📖</span>
            <span className="text-[9px] font-heading font-bold text-[#E6177F] dark:text-[#FF8FB8] leading-none mt-0.5">
              Rang
            </span>
          </motion.button>
        </div>
      </div>

      {/* 5. Modals */}
      <SalonGoalsModal
        isOpen={showGoalsModal}
        onClose={() => setShowGoalsModal(false)}
        points={userProfile.dailyTaskPoints || 40}
        onClaimTask={() => {
          userProfile.coins += 100;
          if (userProfile.dailyTaskPoints) userProfile.dailyTaskPoints += 25;
        }}
        onClaimMilestone={(target) => claimDailyMilestone(target)}
        claimedMilestones={userProfile.claimedDailyMilestones || []}
      />

      <GetEnergyModal
        isOpen={showEnergyModal}
        onClose={() => setShowEnergyModal(false)}
        onRefillWithGems={() => {
          if (spendGems(20)) {
            addEnergy(30);
          }
        }}
        onWatchAd={() => {
          addEnergy(10);
        }}
        onOpenPass={() => onNavigate?.('pass')}
        userGems={gems}
      />

      {/* 6. Mobile Bottom Navigation */}
      <BottomNav
        activeTab="home"
        onTabChange={(tab: TabId) => onNavigate?.(tab)}
        unreadMap={false}
        canRenovate={userProfile.coins >= 200}
        passUnlockedNodes={!userProfile.hasGoldPass}
      />
    </motion.main>
  );
};

export default HomeScreen;
