import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { PortfolioEntry } from '../types';
import { FaceModel } from '../assets/faces/FaceModel';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { Modal } from '../components/Modal';
import { useGame } from '../context/GameContext';
import { generateLookCard, shareImage } from '../services/share';

export const PortfolioScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useGame();
  const portfolio = userProfile.portfolio || [];

  const [selectedLook, setSelectedLook] = useState<PortfolioEntry | null>(null);
  const [sharing, setSharing] = useState(false);

  const handleShareLook = async () => {
    if (!selectedLook) return;
    setSharing(true);
    try {
      const canvas = await generateLookCard(
        selectedLook.faceRecipe,
        selectedLook.faceModel || '1',
        selectedLook.score || 1500,
        userProfile.displayName || 'Glam Artist',
        'post'
      );
      await shareImage(canvas, 'Portfolio Look', 'Look from my Glam Blocks portfolio!');
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  const handleSetProfilePic = () => {
    if (!selectedLook) return;
    // Set face model
    updateProfile({
      faceModel: selectedLook.faceModel,
    });
    setSelectedLook(null);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex flex-col justify-between overflow-x-hidden bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] text-[var(--text)] select-none">
      {/* Top Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <IconButton
            aria-label="Back to vanity home"
            onClick={() => navigate('/')}
            className="w-9 h-9"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </IconButton>
          <div>
            <h1 className="text-xl font-black text-[var(--text)]">Beauty Portfolio</h1>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">
              {portfolio.length} Looks Created
            </p>
          </div>
        </div>
      </header>

      {/* Grid of Looks */}
      <div className="flex-1 p-4 overflow-y-auto">
        {portfolio.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center text-[var(--text-muted)] space-y-4">
            <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center text-3xl">
              💄
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">No Looks Yet</h2>
              <p className="text-xs max-w-[220px] mt-1 text-[var(--text-muted)]">
                Play client levels and finish makeup looks to collect them in your vanity portfolio!
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => navigate('/game')}>
              Start First Client
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {portfolio.map((entry) => (
              <motion.button
                key={entry.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedLook(entry)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col justify-end text-left p-2 group"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaceModel
                    model={entry.faceModel || '1'}
                    skinTone="#FDDCBF"
                    makeupRecipe={entry.faceRecipe}
                    width={180}
                  />
                </div>
                <div className="relative z-10 bg-black/60 backdrop-blur-sm rounded-xl p-2 text-white w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold">⭐ {entry.stars || 3} Stars</span>
                    <span className="text-[9px] text-zinc-300">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs font-black text-pink-400 mt-0.5">
                    {entry.score ? `${entry.score.toLocaleString()} pts` : 'Completed'}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Look Inspection Modal */}
      {selectedLook && (
        <Modal
          open={!!selectedLook}
          onClose={() => setSelectedLook(null)}
          title="Masterpiece Look"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-[240px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] bg-[var(--surface)]">
              <FaceModel
                model={selectedLook.faceModel || '1'}
                skinTone="#FDDCBF"
                makeupRecipe={selectedLook.faceRecipe}
                width={240}
              />
            </div>

            <div className="w-full flex flex-col gap-2 pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                loading={sharing}
                onClick={handleShareLook}
              >
                ✨ Share Look Card
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleSetProfilePic}
              >
                Set as Active Model
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PortfolioScreen;
