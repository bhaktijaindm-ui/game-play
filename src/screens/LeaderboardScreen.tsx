import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LeaderboardEntry } from '../types';
import { IconButton } from '../components/IconButton';
import { Skeleton } from '../components/Skeleton';
import { useGame } from '../context/GameContext';
import { getLeaderboard } from '../services/firestore';

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { uid: 'u1', displayName: 'Natasha Verma', photoURL: '', score: 28450, rank: 1 },
  { uid: 'u2', displayName: 'Aarav Mehta', photoURL: '', score: 24100, rank: 2 },
  { uid: 'u3', displayName: 'Simran Jolly', photoURL: '', score: 21900, rank: 3 },
  { uid: 'u4', displayName: 'Pooja Bhatt', photoURL: '', score: 19800, rank: 4 },
  { uid: 'u5', displayName: 'Rohan Deshmukh', photoURL: '', score: 17650, rank: 5 },
  { uid: 'u6', displayName: 'Kavya S', photoURL: '', score: 16200, rank: 6 },
  { uid: 'u7', displayName: 'Ananya Roy', photoURL: '', score: 14500, rank: 7 },
  { uid: 'u8', displayName: 'Devika Patel', photoURL: '', score: 13900, rank: 8 },
  { uid: 'u9', displayName: 'Tara Singhania', photoURL: '', score: 12400, rank: 9 },
  { uid: 'u10', displayName: 'Isha Chadha', photoURL: '', score: 11800, rank: 10 },
];

export const LeaderboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useGame();
  const [activeTab, setActiveTab] = useState<'today' | 'weekly'>('today');
  const [entries, setEntries] = useState<LeaderboardEntry[]>(SAMPLE_LEADERBOARD);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getLeaderboard(activeTab === 'today' ? 'daily' : 'free', 50)
      .then((data) => {
        if (mounted && data.length > 0) {
          setEntries(data);
        }
      })
      .catch(() => {
        // Fallback to sample data gracefully
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const userScore = userProfile.highScore || 18450;
  const userRank = 14;

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex flex-col justify-between overflow-x-hidden bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] text-[var(--text)] select-none pb-20">
      {/* Top Header */}
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
            <h1 className="text-xl font-black text-[var(--text)]">Beauty Leaderboard</h1>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">
              Daily Brief & Weekly Masters
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-2 flex border-b border-[var(--border)] bg-[var(--surface)] sticky top-[57px] z-10 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'today'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
              : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
          }`}
        >
          📅 Today (Daily Brief)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'weekly'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
              : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
          }`}
        >
          🏆 This Week (All-Time)
        </button>
      </div>

      {/* Podium for Top 3 */}
      <div className="p-4 flex items-end justify-center gap-3 pt-6 pb-2">
        {/* Silver Rank 2 */}
        {top3[1] && (
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full border-2 border-slate-300 bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-slate-600 dark:text-slate-200 shadow-md">
              🥈
            </div>
            <span className="text-xs font-bold text-[var(--text)] mt-1 truncate max-w-[80px]">
              {top3[1].displayName}
            </span>
            <span className="text-[10px] font-black text-pink-500">
              {top3[1].score.toLocaleString()}
            </span>
            <div className="w-full h-16 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-500 text-lg">
              2
            </div>
          </div>
        )}

        {/* Gold Rank 1 */}
        {top3[0] && (
          <div className="flex flex-col items-center flex-1 -mt-4">
            <span className="text-2xl animate-bounce">👑</span>
            <div className="w-16 h-16 rounded-full border-4 border-amber-400 bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center font-black text-amber-600 shadow-xl">
              🥇
            </div>
            <span className="text-xs font-black text-[var(--text)] mt-1 truncate max-w-[90px]">
              {top3[0].displayName}
            </span>
            <span className="text-xs font-black text-amber-500">
              {top3[0].score.toLocaleString()}
            </span>
            <div className="w-full h-24 bg-gradient-to-t from-amber-400 to-amber-200 dark:from-amber-600 dark:to-amber-400 rounded-t-xl mt-2 flex items-center justify-center font-black text-stone-900 text-2xl shadow-lg">
              1
            </div>
          </div>
        )}

        {/* Bronze Rank 3 */}
        {top3[2] && (
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full border-2 border-amber-700/50 bg-amber-700/20 flex items-center justify-center font-black text-amber-700 shadow-md">
              🥉
            </div>
            <span className="text-xs font-bold text-[var(--text)] mt-1 truncate max-w-[80px]">
              {top3[2].displayName}
            </span>
            <span className="text-[10px] font-black text-pink-500">
              {top3[2].score.toLocaleString()}
            </span>
            <div className="w-full h-12 bg-gradient-to-t from-amber-700/40 to-amber-600/30 rounded-t-xl mt-2 flex items-center justify-center font-black text-amber-700 text-base">
              3
            </div>
          </div>
        )}
      </div>

      {/* Ranks 4-50 List */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="52px" rounded="16px" />
          ))
        ) : (
          rest.map((entry) => (
            <div
              key={entry.uid}
              className="px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[var(--text-muted)] w-6 text-center">
                  #{entry.rank}
                </span>
                <span className="text-xs font-bold text-[var(--text)]">
                  {entry.displayName}
                </span>
              </div>
              <span className="text-xs font-black text-[var(--primary)] tabular-nums">
                {entry.score.toLocaleString()} pts
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pinned Current User Rank Bar */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-[480px] p-3 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white shadow-2xl flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
            #{userRank}
          </div>
          <div>
            <div className="text-xs font-black">
              {userProfile.displayName || 'You (Glam Artist)'}
            </div>
            <div className="text-[10px] text-pink-200 font-semibold">Your Best Score</div>
          </div>
        </div>

        <span className="text-sm font-black tabular-nums">
          {userScore.toLocaleString()} pts
        </span>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
