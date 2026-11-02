import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../components/IconButton';
import { Button } from '../components/Button';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { useHaptics } from '../hooks/useHaptics';

const STREAK_REWARDS = [
  { day: 1, coins: 10, gems: 0 },
  { day: 2, coins: 20, gems: 0 },
  { day: 3, coins: 30, gems: 0 },
  { day: 4, coins: 50, gems: 0 },
  { day: 5, coins: 50, gems: 0 },
  { day: 6, coins: 75, gems: 0 },
  { day: 7, coins: 100, gems: 10 },
];

export const DailyRewardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useGame();
  const { playTaDa, playSparkle } = useSound();
  const { successBuzz } = useHaptics();

  const currentStreak = userProfile.streakDay || 1;
  const activeDayIndex = ((currentStreak - 1) % 7);

  // Check if claimed today based on date string comparison
  const todayStr = new Date().toISOString().slice(0, 10);
  const lastClaimedStr = userProfile.lastRewardClaimedAt
    ? new Date(userProfile.lastRewardClaimedAt).toISOString().slice(0, 10)
    : '';
  const canClaim = todayStr !== lastClaimedStr;

  const [claimed, setClaimed] = useState(!canClaim);

  const handleClaim = () => {
    playTaDa();
    playSparkle();
    successBuzz();

    const todayReward = STREAK_REWARDS[activeDayIndex];
    setClaimed(true);

    updateProfile({
      coins: userProfile.coins + todayReward.coins,
      gems: userProfile.gems + todayReward.gems,
      streakDay: currentStreak + (canClaim ? 1 : 0),
      lastRewardClaimedAt: Date.now(),
    });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex flex-col justify-between overflow-x-hidden bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] text-[var(--text)] select-none pb-8">
      {/* Top Header */}
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
            <h1 className="text-xl font-black text-[var(--text)]">Daily Beauty Streak</h1>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">
              Log in daily for escalating glam gifts!
            </p>
          </div>
        </div>
      </header>

      {/* Center Streak Banner & Calendar */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6">
        {/* Streak Flame Banner */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <span className="text-6xl animate-bounce">🔥</span>
          </div>
          <h2 className="text-3xl font-black text-[var(--text)] mt-2">
            Day {currentStreak} Streak!
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-[240px] mt-1">
            Keep your beauty streak going each morning to unlock Day 7 diamond chest!
          </p>
        </div>

        {/* 7-Day Visual Calendar */}
        <div className="w-full max-w-[360px] bg-[var(--surface)] rounded-3xl p-4 border border-[var(--border)] shadow-lg space-y-3">
          <div className="text-xs font-black uppercase text-[var(--text-muted)] tracking-wider">
            7-Day Beauty Calendar
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {STREAK_REWARDS.map((reward, i) => {
              const isPast = i < activeDayIndex;
              const isToday = i === activeDayIndex;

              return (
                <div
                  key={reward.day}
                  className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                    isToday
                      ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/30 scale-105'
                      : isPast
                      ? 'border-emerald-500/30 bg-emerald-500/5 opacity-70'
                      : 'border-[var(--border)] bg-[var(--surface-2)]'
                  } ${reward.day === 7 ? 'col-span-2' : ''}`}
                >
                  <span className="text-[9px] font-black text-[var(--text-muted)] uppercase">
                    Day {reward.day}
                  </span>

                  <div className="my-1 text-xl">
                    {reward.gems > 0 ? '💎' : '🪙'}
                  </div>

                  <div className="text-[10px] font-black text-[var(--text)]">
                    +{reward.coins}
                    {reward.gems > 0 && ` & +${reward.gems}💎`}
                  </div>

                  {isPast && (
                    <span className="text-[9px] font-bold text-emerald-500">✓ Done</span>
                  )}
                  {isToday && (
                    <span className="text-[9px] font-bold text-amber-500">TODAY</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Claim Button */}
      <footer className="p-4 bg-[var(--surface)] border-t border-[var(--border)]">
        {claimed ? (
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            disabled={true}
          >
            ✓ Claimed for Today! Check Back Tomorrow
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleClaim}
          >
            🎁 Claim Today's Glam Gift
          </Button>
        )}
      </footer>
    </div>
  );
};

export default DailyRewardScreen;
