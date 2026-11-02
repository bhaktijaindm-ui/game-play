import React from 'react';
import { motion } from 'framer-motion';
import type { Client } from '../types';

export interface DailyBriefCardProps {
  client?: Client | null;
  streakCount: number;
  onPlay: () => void;
  className?: string;
}

export const DailyBriefCard: React.FC<DailyBriefCardProps> = ({
  client,
  streakCount,
  onPlay,
  className = '',
}) => {
  const clientName = client?.name ?? 'Ananya Sharma';
  const occasion = client?.occasion ?? 'Sangeet Night Celebration';
  const goals = client?.goals ?? [
    { id: 'g1', type: 'clearLines', target: 5, current: 0, completed: false },
    { id: 'g2', type: 'clearColor', shade: 'ruby', target: 12, current: 0, completed: false },
  ];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`relative overflow-hidden rounded-3xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] p-5 shadow-xl border border-pink-500/20 dark:border-pink-500/10 ${className}`}
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Header bar: Badge and Streak */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Daily Beauty Brief
        </span>

        {/* Streak counter */}
        <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
          <span className="text-sm">🔥</span>
          <span>{streakCount} {streakCount === 1 ? 'day' : 'days'}</span>
        </div>
      </div>

      {/* Client Preview info */}
      <div className="flex items-center gap-4 mb-4">
        {/* Client Portrait / Avatar */}
        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 border-pink-400/40 bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 dark:from-zinc-800 dark:to-zinc-900 shadow-md">
          {client?.avatar ? (
            <img src={client.avatar} alt={clientName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">
              ✨
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent py-0.5 text-center">
            <span className="text-[10px] font-bold text-white tracking-wide">TODAY</span>
          </div>
        </div>

        {/* Client details */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)]">
            {clientName}
          </h3>
          <p className="truncate text-xs font-semibold text-[var(--primary,#ec4899)]">
            {occasion}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {goals.slice(0, 2).map((g) => (
              <span
                key={g.id}
                className="inline-flex items-center gap-1 rounded-md bg-black/5 dark:bg-white/5 px-2 py-0.5 text-[11px] font-medium text-[var(--text-muted,#71717a)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                {g.type === 'clearColor' ? `Collect ${g.target} ${g.shade ?? 'blocks'}` : `Clear ${g.target} lines`}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Play Action Button */}
      <button
        type="button"
        onClick={onPlay}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-pink-500/25 transition-all hover:brightness-105 active:scale-[0.98]"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Style Today's Look</span>
      </button>
    </motion.div>
  );
};

export default DailyBriefCard;
