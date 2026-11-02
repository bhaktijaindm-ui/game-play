import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../components/IconButton';
import { useGame } from '../context/GameContext';
import { FaceModel } from '../assets/faces/FaceModel';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useGame();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.displayName || 'Glam Artist');

  const hasGlamPass = !!(userProfile.glamPassUntil && userProfile.glamPassUntil > Date.now());
  const portfolioCount = userProfile.portfolio?.length || 0;
  const starsEarned = (userProfile.portfolio || []).reduce((acc, curr) => acc + (curr.stars || 0), 0);

  const handleSaveName = () => {
    if (nameInput.trim().length >= 2 && nameInput.trim().length <= 20) {
      updateProfile({ displayName: nameInput.trim() });
      setIsEditingName(false);
    }
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
            <h1 className="text-xl font-black text-[var(--text)]">Glam Profile</h1>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">
              Your Makeup Artistry Portfolio
            </p>
          </div>
        </div>

        <IconButton
          aria-label="Settings"
          onClick={() => navigate('/settings')}
          className="w-9 h-9"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </IconButton>
      </header>

      {/* Main Profile Info */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Avatar with Optional Glam Pass Golden Frame */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full overflow-hidden p-1 shadow-xl flex items-center justify-center ${
                hasGlamPass
                  ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 ring-4 ring-amber-400/40 animate-pulse'
                  : 'bg-gradient-to-tr from-pink-500 to-purple-600'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-[var(--surface)] flex items-center justify-center">
                <FaceModel
                  model={userProfile.faceModel || '1'}
                  skinTone="#FDDCBF"
                  makeupRecipe={{ eyes: [], cheeks: [], lips: [] }}
                  width={100}
                />
              </div>
            </div>

            {hasGlamPass && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-xs px-2 py-0.5 rounded-full font-black shadow">
                VIP
              </span>
            )}
          </div>

          {/* Name & Inline Editor */}
          <div className="mt-3 flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={20}
                  className="bg-[var(--surface)] border border-pink-500 rounded-xl px-3 py-1 text-sm font-bold text-[var(--text)] outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[var(--text)]">
                  {userProfile.displayName || 'Glam Artist'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-pink-500 hover:text-pink-600"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
            Level {userProfile.level || 1} Master Stylist
          </p>
        </div>

        {/* Artistry Statistics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="text-base font-black text-[var(--primary)]">
              {userProfile.bestScore?.toLocaleString() || '18,450'}
            </div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-0.5">
              High Score
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="text-base font-black text-amber-500">
              ⭐ {starsEarned}
            </div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-0.5">
              Stars Won
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="text-base font-black text-purple-500">
              {portfolioCount}
            </div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-0.5">
              Looks Saved
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => navigate('/portfolio')}
            className="w-full p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between shadow-sm active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <div className="text-left">
                <div className="text-sm font-bold text-[var(--text)]">Portfolio Gallery</div>
                <div className="text-[10px] text-[var(--text-muted)]">View and share your saved client looks</div>
              </div>
            </div>
            <span className="text-[var(--text-muted)]">›</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/palette')}
            className="w-full p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between shadow-sm active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div className="text-left">
                <div className="text-sm font-bold text-[var(--text)]">Eyeshadow Palette</div>
                <div className="text-[10px] text-[var(--text-muted)]">Pure Shade pan progress & rewards</div>
              </div>
            </div>
            <span className="text-[var(--text-muted)]">›</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/collections')}
            className="w-full p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between shadow-sm active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <div className="text-left">
                <div className="text-sm font-bold text-[var(--text)]">Indian Occasions</div>
                <div className="text-[10px] text-[var(--text-muted)]">Equip festive bridal collections</div>
              </div>
            </div>
            <span className="text-[var(--text-muted)]">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
