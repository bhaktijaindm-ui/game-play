import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { GameState, Client, PortfolioEntry } from '../types';
import { FaceModel } from '../assets/faces/FaceModel';
import { StarRating } from '../components/StarRating';
import { Button } from '../components/Button';
import { useGame } from '../context/GameContext';
import { generateLookCard, shareImage } from '../services/share';

export const ClientResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, updateProfile } = useGame();

  const stateData = location.state as { gameState: GameState; client: Client } | undefined;
  const gameState = stateData?.gameState;
  const client = stateData?.client;

  const [sliderPosition, setSliderPosition] = useState(50);
  const [sharing, setSharing] = useState(false);
  const [coinsAwarded, setCoinsAwarded] = useState(150);
  const [stars, setStars] = useState<1 | 2 | 3>(3);

  useEffect(() => {
    if (!gameState) return;

    // Calculate stars from efficiency or score
    const earnedStars: 1 | 2 | 3 = gameState.score > 2500 ? 3 : gameState.score > 1200 ? 2 : 1;
    setStars(earnedStars);

    const bonus = earnedStars * 50;
    setCoinsAwarded(bonus);

    // Save look to portfolio
    const newEntry: PortfolioEntry = {
      id: `look_${Date.now()}`,
      faceRecipe: gameState.faceRecipe,
      faceModel: userProfile.faceModel || '1',
      score: gameState.score,
      clientId: client?.id,
      stars: earnedStars,
      createdAt: Date.now(),
    };

    updateProfile({
      coins: userProfile.coins + bonus,
      level: userProfile.level + 1,
      portfolio: [newEntry, ...(userProfile.portfolio || [])],
    });
  }, []);

  const [shareFormat, setShareFormat] = useState<'post' | 'stories'>('post');
  const [hideName, setHideName] = useState(false);

  const handleShare = async () => {
    if (!gameState) return;
    setSharing(true);
    try {
      const canvas = await generateLookCard(
        gameState.faceRecipe,
        userProfile.faceModel || '1',
        gameState.score,
        userProfile.displayName || 'Glam Artist',
        shareFormat,
        hideName
      );
      await shareImage(canvas, 'My Glam Look!', 'Check out this makeup look I created in Glam Blocks: The Gulab Mahal Salon!');
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex flex-col justify-between overflow-x-hidden bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] text-[var(--text)] p-4 select-none">
      {/* Header with Occasion */}
      <header className="text-center pt-2 pb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          {client?.occasion || 'Client Complete!'}
        </span>
        <h1 className="text-2xl font-black text-[var(--text)] mt-0.5">
          {client?.name ? `${client.name}'s Look` : 'Stunning Transformation'}
        </h1>
      </header>

      {/* Interactive Before / After Split Slider */}
      <div className="relative w-full max-w-[320px] aspect-[3/4] mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-[var(--border)] bg-[var(--surface)] my-2">
        {/* AFTER (Full Makeup) Layer */}
        <div className="absolute inset-0 flex items-center justify-center">
          {gameState && (
            <FaceModel
              model={userProfile.faceModel || '1'}
              skinTone="#FDDCBF"
              makeupRecipe={gameState.faceRecipe}
              width={320}
            />
          )}
        </div>

        {/* BEFORE (Clean Natural Face) Layer clipped by slider */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden border-r-2 border-white pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="w-[320px] h-[426px] flex items-center justify-center shrink-0">
            <FaceModel
              model={userProfile.faceModel || '1'}
              skinTone="#FDDCBF"
              makeupRecipe={{ eyes: [], cheeks: [], lips: [] }}
              width={320}
            />
          </div>
        </div>

        {/* Slider Thumb line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[10px] font-black text-pink-600">
            ↔
          </div>
        </div>

        {/* Touch Slider Range Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label="Before after comparison slider"
        />

        {/* Labels */}
        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          BEFORE
        </div>
        <div className="absolute bottom-3 right-3 bg-[var(--primary)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          AFTER
        </div>
      </div>

      {/* Rewards & Stars */}
      <div className="flex flex-col items-center gap-2 my-2 text-center">
        <StarRating stars={stars} animated={true} />

        <div className="flex items-center gap-4 mt-1">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Final Score</span>
            <span className="text-xl font-black text-[var(--text)] tabular-nums">
              {gameState?.score.toLocaleString() || '1,850'}
            </span>
          </div>

          <div className="w-px h-8 bg-[var(--border)]" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Coins Won</span>
            <span className="text-xl font-black text-amber-500 tabular-nums">
              +{coinsAwarded} 🪙
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <footer className="flex flex-col gap-2.5 pt-2 pb-4">
        {/* Share format and privacy toggles */}
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex bg-[var(--surface-2)] p-0.5 rounded-lg border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setShareFormat('post')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
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
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                shareFormat === 'stories'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              Stories (9:16)
            </button>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-[var(--text-muted)]">
            <input
              type="checkbox"
              checked={hideName}
              onChange={(e) => setHideName(e.target.checked)}
              className="rounded accent-[var(--primary)] w-3.5 h-3.5"
            />
            <span>Hide name</span>
          </label>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={sharing}
          onClick={handleShare}
        >
          ✨ Share Look Card
        </Button>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => navigate('/game')}
          >
            Next Client
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => navigate('/')}
          >
            Vanity Home
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ClientResultScreen;
