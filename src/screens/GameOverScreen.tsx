import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { GameState } from '../types';
import { FaceModel } from '../assets/faces/FaceModel';
import { Button } from '../components/Button';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { useGame } from '../context/GameContext';
import { getAdsProvider } from '../services/ads';
import { generateLookCard, shareImage } from '../services/share';

export const GameOverScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, updateProfile } = useGame();

  const stateData = location.state as { gameState: GameState } | undefined;
  const gameState = stateData?.gameState;

  const [showContinueSheet, setShowContinueSheet] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [adLoading, setAdLoading] = useState(false);

  const score = gameState?.score || 0;
  const bestScore = Math.max(score, userProfile.bestScore || 0);
  const coinsEarned = Math.floor(score / 50) + 20;

  const handleWatchAdContinue = async () => {
    setAdLoading(true);
    try {
      const ads = getAdsProvider();
      const success = await ads.showRewarded('continue_game');
      if (success) {
        setShowContinueSheet(false);
        navigate('/game');
      }
    } finally {
      setAdLoading(false);
    }
  };

  const handleSpendGemsContinue = () => {
    if (userProfile.gems >= 50) {
      updateProfile({ gems: userProfile.gems - 50 });
      setShowContinueSheet(false);
      navigate('/game');
    }
  };

  const [shareFormat, setShareFormat] = useState<'post' | 'stories'>('post');
  const [hideName, setHideName] = useState(false);

  const handleShare = async () => {
    if (!gameState) return;
    setSharing(true);
    try {
      const canvas = await generateLookCard(
        gameState.faceRecipe,
        userProfile.faceModel || '1',
        score,
        userProfile.displayName || 'Glam Artist',
        shareFormat,
        hideName
      );
      await shareImage(canvas, 'My Glam Look!', 'Check out my score in Glam Blocks: The Gulab Mahal Salon!');
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex flex-col justify-between overflow-x-hidden bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] text-[var(--text)] p-4 select-none">
      {/* Title */}
      <header className="text-center pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">No More Moves</span>
        <h1 className="text-3xl font-black text-[var(--text)] mt-1">Out of Space!</h1>
      </header>

      {/* Center Makeup Result */}
      <div className="relative w-full max-w-[280px] aspect-[3/4] mx-auto rounded-3xl overflow-hidden shadow-xl border-2 border-[var(--border)] bg-[var(--surface)] my-2">
        {gameState && (
          <FaceModel
            model={userProfile.faceModel || '1'}
            skinTone="#FDDCBF"
            makeupRecipe={gameState.faceRecipe}
            width={280}
          />
        )}
      </div>

      {/* Score Summary Box */}
      <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Your Score</span>
          <span className="text-2xl font-black text-[var(--primary)] tabular-nums">{score.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 text-xs">
          <span className="font-semibold text-[var(--text-muted)]">Best Score</span>
          <span className="font-bold text-[var(--text)] tabular-nums">{bestScore.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 text-xs">
          <span className="font-semibold text-[var(--text-muted)]">Coins Collected</span>
          <span className="font-bold text-amber-500 tabular-nums">+{coinsEarned} 🪙</span>
        </div>
      </div>

      {/* Action Buttons */}
      <footer className="flex flex-col gap-2.5 pt-2 pb-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/game')}
        >
          🔄 Play Again
        </Button>

        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => setShowContinueSheet(true)}
        >
          ✨ Continue (Watch Ad or 50 Gems)
        </Button>

        {/* Share format and privacy toggles */}
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex bg-[var(--surface-2)] p-0.5 rounded-lg border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setShareFormat('post')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                shareFormat === 'post'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              Post (1:1)
            </button>
            <button
              type="button"
              onClick={() => setShareFormat('stories')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                shareFormat === 'stories'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              Stories (9:16)
            </button>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-[var(--text-muted)]">
            <input
              type="checkbox"
              checked={hideName}
              onChange={(e) => setHideName(e.target.checked)}
              className="rounded accent-[var(--primary)] w-3 h-3"
            />
            <span>Hide name</span>
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="md"
            fullWidth
            loading={sharing}
            onClick={handleShare}
          >
            Share Look
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => navigate('/')}
          >
            Home
          </Button>
        </div>
      </footer>

      {/* Continue Options Confirmation Sheet */}
      <ConfirmSheet
        open={showContinueSheet}
        title="Continue This Game?"
        message="Clear 3 bottom rows and get 3 small fresh blocks to keep your streak alive!"
        confirmText="Watch 3s Ad (Free)"
        cancelText={userProfile.gems >= 50 ? 'Spend 50 Gems 💎' : 'Cancel'}
        onConfirm={handleWatchAdContinue}
        onCancel={() => {
          if (userProfile.gems >= 50) {
            handleSpendGemsContinue();
          } else {
            setShowContinueSheet(false);
          }
        }}
        loading={adLoading}
      />
    </div>
  );
};

export default GameOverScreen;
