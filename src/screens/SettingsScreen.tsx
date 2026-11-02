import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../components/IconButton';
import { Toggle } from '../components/Toggle';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { useGame } from '../context/GameContext';
import { useTheme } from '../hooks/useTheme';
import { signOut, deleteAccount } from '../services/auth';

const FACE_MODELS = [
  { id: '1', name: 'Fair', tone: '#FDDCBF' },
  { id: '2', name: 'Wheatish', tone: '#E8BA91' },
  { id: '3', name: 'Medium', tone: '#D4956B' },
  { id: '4', name: 'Tan', tone: '#B87A4F' },
  { id: '5', name: 'Deep', tone: '#8B5E3C' },
  { id: '6', name: 'Dark', tone: '#5C3D2E' },
];

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    updateProfile,
    soundEnabled,
    toggleSound,
    hapticsEnabled,
    toggleHaptics,
    reducedMotion,
    toggleReducedMotion,
  } = useGame();

  const { theme, setTheme } = useTheme();

  const [colorBlind, setColorBlind] = useState(userProfile.colorBlind || false);
  const [musicEnabled, setMusicEnabled] = useState(userProfile.musicEnabled !== false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleColorBlindToggle = () => {
    const next = !colorBlind;
    setColorBlind(next);
    updateProfile({ colorBlind: next });
    localStorage.setItem('glam_colorblind_mode', next ? 'true' : 'false');
  };

  const handleMusicToggle = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    updateProfile({ musicEnabled: next });
  };

  const handleFaceModelSelect = (id: string) => {
    updateProfile({ faceModel: id });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      localStorage.clear();
      navigate('/auth');
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
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
            <h1 className="text-xl font-black text-[var(--text)]">Settings</h1>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">
              Preferences & Accessibility
            </p>
          </div>
        </div>
      </header>

      {/* Settings Sections */}
      <div className="flex-1 p-4 space-y-5 overflow-y-auto">
        {/* APPEARANCE */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Appearance & Accessibility
          </span>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 space-y-4">
            {/* Theme Selector */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[var(--text)]">Theme Mode</div>
                <div className="text-[10px] text-[var(--text-muted)]">
                  Rose Quartz Morning / Midnight Vanity
                </div>
              </div>
              <div className="flex bg-[var(--surface-2)] p-1 rounded-xl text-xs font-bold">
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                      theme === mode
                        ? 'bg-[var(--primary)] text-white shadow-sm'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Color-Blind Friendly Toggle */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
              <div>
                <div className="text-sm font-bold text-[var(--text)]">Color-Blind Friendly</div>
                <div className="text-[10px] text-[var(--text-muted)]">
                  High-contrast larger cosmetic icons on all tiles
                </div>
              </div>
              <Toggle checked={colorBlind} onChange={handleColorBlindToggle} />
            </div>

            {/* Reduce Motion Toggle */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
              <div>
                <div className="text-sm font-bold text-[var(--text)]">Reduce Motion</div>
                <div className="text-[10px] text-[var(--text-muted)]">
                  Minimizes transitions and particle animations
                </div>
              </div>
              <Toggle checked={reducedMotion} onChange={toggleReducedMotion} />
            </div>
          </div>
        </div>

        {/* AUDIO & SENSORY */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Audio & Haptics
          </span>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--text)]">Sound Effects (Pops & Chimes)</span>
              <Toggle checked={soundEnabled} onChange={toggleSound} />
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
              <span className="text-sm font-bold text-[var(--text)]">Atmospheric Music</span>
              <Toggle checked={musicEnabled} onChange={handleMusicToggle} />
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
              <span className="text-sm font-bold text-[var(--text)]">Tactile Haptics (Vibrations)</span>
              <Toggle checked={hapticsEnabled} onChange={toggleHaptics} />
            </div>
          </div>
        </div>

        {/* INCLUSIVE FACE MODELS */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Default Face Model (Inclusive Tones)
          </span>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4">
            <div className="grid grid-cols-3 gap-2">
              {FACE_MODELS.map((model) => {
                const isSelected = (userProfile.faceModel || '1') === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleFaceModelSelect(model.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-500/10 ring-2 ring-pink-500/20'
                        : 'border-[var(--border)] bg-[var(--surface-2)]'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full border border-black/20 shadow-sm"
                      style={{ backgroundColor: model.tone }}
                    />
                    <span className="text-[11px] font-bold text-[var(--text)]">
                      {model.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACCOUNT & PRIVACY */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Account & Security
          </span>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 space-y-3">
            <div className="text-xs text-[var(--text-muted)]">
              Logged in as: <strong className="text-[var(--text)]">{userProfile.email || 'Guest Player'}</strong>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-[var(--surface-2)] text-xs font-bold text-[var(--text)] hover:bg-[var(--border)] transition-colors"
            >
              Sign Out
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
            >
              Delete My Account and Data
            </button>
          </div>
        </div>

        {/* ABOUT & LEGAL */}
        <div className="text-center text-xs text-[var(--text-muted)] space-y-2 pt-2 pb-6">
          <div className="flex justify-center gap-4">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="mailto:support@glamblocks.game" className="hover:underline">Support</a>
          </div>
          <div className="text-[10px] text-zinc-400">
            Glam Blocks v1.0.0 (Production Build)
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Sheet */}
      <ConfirmSheet
        open={showDeleteConfirm}
        title="Delete Account & Data?"
        message="This action permanently deletes your game progress, stars, coins, and cloud vanity records according to GDPR & DPDP regulations. This cannot be undone."
        confirmText="Permanently Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default SettingsScreen;
