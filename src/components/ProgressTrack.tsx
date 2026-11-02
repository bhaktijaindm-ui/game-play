import React from 'react';
import { motion } from 'framer-motion';

export interface Milestone {
  target: number;
  rewardText?: string;
  claimed?: boolean;
}

interface ProgressTrackProps {
  current: number;
  max: number;
  milestones?: Milestone[];
  onClaimMilestone?: (milestone: Milestone) => void;
  className?: string;
}

export const ProgressTrack: React.FC<ProgressTrackProps> = ({
  current,
  max,
  milestones = [
    { target: 40, rewardText: '100 Coins' },
    { target: 100, rewardText: 'Small Chest' },
    { target: 250, rewardText: '20 Gems' },
    { target: 550, rewardText: 'Medium Chest' },
    { target: 800, rewardText: '50 Gems' },
    { target: 1000, rewardText: 'Royal Gold Chest' },
  ],
  onClaimMilestone,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className={`w-full py-4 px-2 select-none ${className}`}>
      {/* Track Container */}
      <div className="relative w-full h-5 rounded-full bg-[rgba(25,18,40,0.65)] dark:bg-[rgba(14,10,24,0.85)] border-2 border-[#F5B53C]/80 shadow-inner p-0.5">
        {/* Fill Bar with Shimmer */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#3DA9FC] via-[#3FBF4F] to-[#F5B53C] transition-all duration-500 ease-out shimmer-track"
          style={{ width: `${percentage}%` }}
        />

        {/* Milestone Chest Markers along the Track */}
        {milestones.map((m, idx) => {
          const markerPct = Math.min(100, (m.target / max) * 100);
          const isReached = current >= m.target;
          const isClaimed = m.claimed;

          return (
            <div
              key={idx}
              className="absolute -top-3.5 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
              style={{ left: `${markerPct}%` }}
              onClick={() => onClaimMilestone && onClaimMilestone(m)}
            >
              {/* Chest Icon */}
              <motion.div
                animate={
                  isReached && !isClaimed
                    ? {
                        rotate: [-4, 4, -4],
                        scale: [1, 1.15, 1],
                        transition: { repeat: Infinity, duration: 1.2 },
                      }
                    : {}
                }
                className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                  isClaimed
                    ? 'bg-gray-400 border-gray-300 opacity-60'
                    : isReached
                    ? 'bg-gradient-to-tr from-[#F5B53C] to-[#FFE484] border-white shadow-[0_0_12px_rgba(245,181,60,0.8)]'
                    : 'bg-[#6A3FC8] border-white/50 opacity-80'
                }`}
              >
                <span className="text-sm">
                  {isClaimed ? '✓' : idx === milestones.length - 1 ? '👑' : '🎁'}
                </span>
              </motion.div>

              {/* Number Label */}
              <span
                className={`mt-1 text-[10px] font-heading font-bold tabular-nums ${
                  isReached ? 'text-[#F5B53C]' : 'text-white/70'
                } game-stroke-sm`}
              >
                {m.target}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
