import React, { useState } from 'react';
import { GlamAvatar } from '../components/avatar/GlamAvatar';
import { useAuth } from '../services/authContext';
import { ChevronLeft, Users, Globe } from 'lucide-react';
import { soundSystem } from '../services/soundSystem';

interface LeaderboardScreenProps {
  onBack: () => void;
}

interface LeaderboardEntry {
  rank: number;
  uid: string;
  displayName: string;
  score: number;
  lookId: string;
}

// Sample weekly high scores
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, uid: 'user_1', displayName: 'Bella Chic', score: 48920, lookId: 'look_golden_goddess' },
  { rank: 2, uid: 'user_2', displayName: 'Aria Glow', score: 42150, lookId: 'look_cyber_glam' },
  { rank: 3, uid: 'user_3', displayName: 'Chloe Velvet', score: 38740, lookId: 'look_gothic_velvet' },
  { rank: 4, uid: 'user_4', displayName: 'Maya Sun', score: 31200, lookId: 'look_sunset_shimmer' },
  { rank: 5, uid: 'user_5', displayName: 'Zara Berry', score: 28450, lookId: 'look_berry_chic' },
  { rank: 6, uid: 'user_6', displayName: 'Sophia Star', score: 24190, lookId: 'look_natural_glow' },
  { rank: 7, uid: 'user_7', displayName: 'Elena Mint', score: 19800, lookId: 'look_mint_blossom' },
  { rank: 8, uid: 'user_8', displayName: 'Kavya Rouge', score: 16500, lookId: 'look_sunset_shimmer' },
  { rank: 9, uid: 'user_9', displayName: 'Ruby Spark', score: 14200, lookId: 'look_berry_chic' },
  { rank: 10, uid: 'user_10', displayName: 'Mia Beauty', score: 12800, lookId: 'look_natural_glow' },
];

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'global' | 'friends'>('global');

  // Feature Flag: Friends Leaderboard
  const FRIENDS_FEATURE_ENABLED = false;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-xs shadow-glossy-gold">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-full bg-gray-300 text-gray-800 font-bold flex items-center justify-center text-xs shadow-soft">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs shadow-soft">
            🥉
          </div>
        );
      default:
        return (
          <span className="w-7 text-center font-heading font-semibold text-xs text-game-muted">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-game-bg">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between min-h-[44px] mb-2">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-game-surface border border-game-border text-game-muted hover:text-game-text"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-heading font-bold text-game-text">
            Hall of Glam
          </h2>
          <div className="w-11" />
        </div>

        {/* Global vs Friends Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-game-card rounded-2xl border border-game-border mb-3">
          <button
            onClick={() => {
              soundSystem.playClick();
              setTab('global');
            }}
            className={`min-h-[40px] text-xs font-heading font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              tab === 'global'
                ? 'bg-game-surface text-game-primary shadow-soft'
                : 'text-game-muted hover:text-game-text'
            }`}
          >
            <Globe className="w-4 h-4" /> Global Top 50
          </button>
          <button
            onClick={() => {
              soundSystem.playClick();
              setTab('friends');
            }}
            className={`min-h-[40px] text-xs font-heading font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              tab === 'friends'
                ? 'bg-game-surface text-game-primary shadow-soft'
                : 'text-game-muted hover:text-game-text'
            }`}
          >
            <Users className="w-4 h-4" /> Friends
          </button>
        </div>
      </div>

      {/* Main Ranking List */}
      <div className="flex-1 overflow-y-auto pr-1">
        {tab === 'global' ? (
          <div className="space-y-2">
            {MOCK_LEADERBOARD.map((entry) => (
              <div
                key={entry.uid}
                className="flex items-center justify-between p-3 rounded-2xl bg-game-surface border border-game-border shadow-soft"
              >
                <div className="flex items-center gap-3">
                  {getRankBadge(entry.rank)}
                  <GlamAvatar lookId={entry.lookId} size="sm" />
                  <div className="text-left">
                    <div className="text-xs font-heading font-bold text-game-text">
                      {entry.displayName}
                    </div>
                    <div className="text-[10px] text-game-muted">Weekly Master</div>
                  </div>
                </div>
                <div className="font-heading font-bold text-sm text-game-primary">
                  {entry.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/40 text-game-secondary flex items-center justify-center mb-3">
              <Users className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-base text-game-text">
              Friends Leaderboard
            </h4>
            <p className="text-xs text-game-muted mt-1 max-w-xs leading-relaxed">
              {!FRIENDS_FEATURE_ENABLED
                ? 'Coming Soon in Season 2! Connect with social friends to compare scores and send daily beauty gifts.'
                : 'No friends found. Invite your contacts to compete!'}
            </p>
          </div>
        )}
      </div>

      {/* Player Sticky Bottom Rank Bar */}
      <div className="mt-3 pt-2 border-t border-game-border/80">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-game-primary to-pink-500 text-white shadow-glossy-pink">
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-xs bg-white/20 px-2.5 py-1 rounded-full">
              Your Rank
            </span>
            <GlamAvatar lookId={user?.equippedLook || 'look_natural_glow'} size="sm" />
            <div className="text-left">
              <div className="text-xs font-heading font-bold text-white">
                {user?.displayName || 'Glam Player'}
              </div>
              <div className="text-[10px] text-white/80">Personal Best</div>
            </div>
          </div>
          <div className="font-heading font-bold text-base text-white">
            {(user?.bestScore || 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
