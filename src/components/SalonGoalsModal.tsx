import React, { useState } from 'react';
import { OrnateModal } from './OrnateModal';
import { ProgressTrack } from './ProgressTrack';

interface TaskItem {
  id: string;
  title: string;
  current: number;
  target: number;
  rewardPoints: number;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
}

interface SalonGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  onClaimTask: (taskId: string) => void;
  onClaimMilestone: (target: number) => void;
  claimedMilestones: number[];
}

export const SalonGoalsModal: React.FC<SalonGoalsModalProps> = ({
  isOpen,
  onClose,
  points,
  onClaimTask,
  onClaimMilestone,
  claimedMilestones,
}) => {
  const [activeDay, setActiveDay] = useState(1);

  // Daily Tasks List
  const tasks: TaskItem[] = [
    { id: 't1', title: 'Serve 3 salon clients', current: 3, target: 3, rewardPoints: 20, rewardCoins: 100, completed: true, claimed: false },
    { id: 't2', title: 'Clear 15 puzzle lines', current: 12, target: 15, rewardPoints: 25, rewardCoins: 150, completed: false, claimed: false },
    { id: 't3', title: 'Make 1 Pure Shade line', current: 1, target: 1, rewardPoints: 30, rewardCoins: 200, completed: true, claimed: true },
    { id: 't4', title: 'Upgrade 1 salon room item', current: 0, target: 1, rewardPoints: 35, rewardCoins: 250, completed: false, claimed: false },
    { id: 't5', title: 'Daily login bonus', current: 1, target: 1, rewardPoints: 15, rewardCoins: 80, completed: true, claimed: true },
  ];

  const milestones = [
    { target: 40, rewardText: '100 Coins', claimed: claimedMilestones.includes(40) },
    { target: 100, rewardText: 'Silver Mirror Chest', claimed: claimedMilestones.includes(100) },
    { target: 250, rewardText: '20 Gems', claimed: claimedMilestones.includes(250) },
    { target: 550, rewardText: 'Velvet Vanity Chest', claimed: claimedMilestones.includes(550) },
    { target: 800, rewardText: '50 Gems', claimed: claimedMilestones.includes(800) },
    { target: 1000, rewardText: 'Royal Gold Chest', claimed: claimedMilestones.includes(1000) },
  ];

  return (
    <OrnateModal
      isOpen={isOpen}
      onClose={onClose}
      title="Salon Goals"
      themeColor="cream"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col space-y-3">
        {/* Flower Garland Subheader & Reset Timer */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#6A3FC8] dark:text-[#FF8FB8]">
            <span>🌸</span>
            <span>Rangpur Daily Tasks</span>
          </div>
          <div className="text-[10px] font-heading font-semibold text-[#7A6283] dark:text-gray-300 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">
            ⏳ Resets at midnight
          </div>
        </div>

        {/* Milestone Progress Track */}
        <div className="bg-white/60 dark:bg-black/20 p-2.5 rounded-2xl border border-[#F5B53C]/40">
          <div className="flex justify-between items-center px-1 mb-1">
            <span className="text-[11px] font-heading font-bold text-[var(--text)]">Weekly Score</span>
            <span className="text-xs font-heading font-bold text-[#E6177F] dark:text-[#FF8FB8] tabular-nums">
              {points} / 1000 pts
            </span>
          </div>
          <ProgressTrack
            current={points}
            max={1000}
            milestones={milestones}
            onClaimMilestone={(m) => onClaimMilestone(m.target)}
          />
        </div>

        {/* Task Rows List */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {tasks.map((task) => {
            const isFinished = task.completed;
            const isClaimed = task.claimed;

            return (
              <div
                key={task.id}
                className={`p-2.5 rounded-2xl flex items-center justify-between border transition-all ${
                  isClaimed
                    ? 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 opacity-70'
                    : isFinished
                    ? 'bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5] dark:from-[#064E3B]/40 dark:to-[#047857]/30 border-[#3FBF4F]'
                    : 'bg-white dark:bg-white/10 border-[#F3D3E1] dark:border-white/15'
                }`}
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    {isClaimed ? (
                      <span className="text-[#3FBF4F] text-sm">✓</span>
                    ) : (
                      <span className="text-xs">🎯</span>
                    )}
                    <span className="text-xs font-heading font-bold text-[var(--text)] leading-tight">
                      {task.title}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3DA9FC] to-[#3FBF4F]"
                        style={{ width: `${Math.min(100, (task.current / task.target) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-heading font-bold text-gray-500 dark:text-gray-300 tabular-nums">
                      {task.current}/{task.target}
                    </span>
                  </div>
                </div>

                {/* Claim Button or Reward Chip */}
                {isClaimed ? (
                  <span className="text-[10px] font-heading font-bold text-gray-400 px-2 py-1">
                    Claimed
                  </span>
                ) : isFinished ? (
                  <button
                    onClick={() => onClaimTask(task.id)}
                    className="btn-3d-green px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-white shadow-sm active:scale-95 transition-transform"
                  >
                    Claim
                  </button>
                ) : (
                  <div className="text-right">
                    <div className="text-[10px] font-heading font-bold text-[#E6177F]">
                      +{task.rewardPoints} pts
                    </div>
                    <div className="text-[9px] text-[#F5B53C] font-bold">
                      +{task.rewardCoins} 🪙
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Day 1 to Day 7 Teal Tabs */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F5B53C]/30">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isActive = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`w-9 h-9 rounded-xl font-heading font-bold text-xs flex flex-col items-center justify-center transition-all select-none ${
                  isActive
                    ? 'bg-gradient-to-b from-[#6FADD4] to-[#3DA9FC] text-white border-2 border-[#F5B53C] shadow-md scale-105'
                    : 'bg-white/50 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-white/80'
                }`}
              >
                <span className="text-[8px] opacity-80">Day</span>
                <span>{day}</span>
              </button>
            );
          })}
        </div>
      </div>
    </OrnateModal>
  );
};
