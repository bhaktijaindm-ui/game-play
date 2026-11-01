import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Toggle } from '../components/ui/Toggle';
import { Modal } from '../components/ui/Modal';
import { useTheme } from '../services/themeContext';
import type { ThemePreference } from '../services/themeContext';
import { useI18n } from '../i18n/i18nContext';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/ui/Toast';
import { soundSystem } from '../services/soundSystem';
import {
  ChevronLeft,
  Moon,
  Sun,
  Monitor,
  Globe,
  User,
  LogOut,
  Trash2,
  FileText,
  Shield,
  Mail,
} from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onLoggedOut: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOpenPrivacy,
  onOpenTerms,
  onLoggedOut,
}) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useI18n();
  const { user, signOutUser, deleteAccountAndData } = useAuth();
  const { showToast } = useToast();

  const [soundOn, setSoundOn] = useState(() => soundSystem.isSoundOn());
  const [musicOn, setMusicOn] = useState(() => soundSystem.isMusicOn());
  const [hapticsOn, setHapticsOn] = useState(() => soundSystem.isHapticsOn());
  const [reduceMotion, setReduceMotion] = useState(() => {
    try {
      return localStorage.getItem('glam_blocks_reduce_motion') === 'true';
    } catch {
      return false;
    }
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggleSound = (enabled: boolean) => {
    setSoundOn(enabled);
    soundSystem.setSoundEnabled(enabled);
    saveSettings({ sound: enabled });
  };

  const handleToggleMusic = (enabled: boolean) => {
    setMusicOn(enabled);
    soundSystem.setMusicEnabled(enabled);
    saveSettings({ music: enabled });
  };

  const handleToggleHaptics = (enabled: boolean) => {
    setHapticsOn(enabled);
    soundSystem.setHapticsEnabled(enabled);
    saveSettings({ haptics: enabled });
  };

  const handleToggleReduceMotion = (enabled: boolean) => {
    setReduceMotion(enabled);
    try {
      localStorage.setItem('glam_blocks_reduce_motion', String(enabled));
      document.documentElement.classList.toggle('reduce-motion', enabled);
    } catch {
      // ignore
    }
    showToast(enabled ? 'Reduced motion enabled' : 'Smooth animations enabled', 'info');
  };

  const saveSettings = (partial: Record<string, boolean>) => {
    try {
      const stored = localStorage.getItem('glam_blocks_settings');
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem('glam_blocks_settings', JSON.stringify({ ...parsed, ...partial }));
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    soundSystem.playClick();
    await signOutUser();
    showToast('Signed out successfully.', 'info');
    onLoggedOut();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      soundSystem.playClick();
      await deleteAccountAndData();
      showToast('All your account data has been permanently deleted.', 'warning');
      setShowDeleteModal(false);
      onLoggedOut();
    } catch {
      showToast('Error deleting account.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-game-bg">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between min-h-[44px] mb-3">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-game-surface border border-game-border text-game-muted hover:text-game-text"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-heading font-bold text-game-text">
            Settings
          </h2>
          <div className="w-11" />
        </div>
      </div>

      {/* Settings Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {/* Appearance / Theme Toggle */}
        <Card variant="surface" padding="md">
          <h4 className="text-xs font-bold uppercase tracking-wider text-game-primary mb-3">
            Appearance
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundSystem.playClick();
                  setTheme(item.id as ThemePreference);
                }}
                className={`
                  min-h-[44px] rounded-xl flex items-center justify-center gap-2 text-xs font-heading font-semibold border transition-all
                  ${
                    theme === item.id
                      ? 'bg-game-primary text-white border-pink-400 shadow-glossy-pink'
                      : 'bg-game-card text-game-muted border-game-border hover:text-game-text'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Audio & Haptics Toggles */}
        <Card variant="surface" padding="md" className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-game-primary mb-2">
            Audio & Feedback
          </h4>
          <Toggle
            checked={soundOn}
            onChange={handleToggleSound}
            label="Sound Effects (Pops & Sparkles)"
          />
          <Toggle
            checked={musicOn}
            onChange={handleToggleMusic}
            label="Background Chimes"
          />
          <Toggle
            checked={hapticsOn}
            onChange={handleToggleHaptics}
            label="Vibration & Haptics"
          />
          <Toggle
            checked={reduceMotion}
            onChange={handleToggleReduceMotion}
            label="Reduce Motion (Accessibility)"
          />
        </Card>

        {/* Language Selection */}
        <Card variant="surface" padding="md">
          <h4 className="text-xs font-bold uppercase tracking-wider text-game-primary mb-3 flex items-center gap-1.5">
            <Globe className="w-4 h-4" /> Language / भाषा
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundSystem.playClick();
                setLanguage('en');
              }}
              className={`min-h-[44px] rounded-xl text-xs font-heading font-semibold border transition-all ${
                language === 'en'
                  ? 'bg-game-primary text-white border-pink-400 shadow-soft'
                  : 'bg-game-card text-game-muted border-game-border'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                soundSystem.playClick();
                setLanguage('hi');
              }}
              className={`min-h-[44px] rounded-xl text-xs font-heading font-semibold border transition-all ${
                language === 'hi'
                  ? 'bg-game-primary text-white border-pink-400 shadow-soft'
                  : 'bg-game-card text-game-muted border-game-border'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </Card>

        {/* Account Details & Management */}
        <Card variant="surface" padding="md" className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-game-primary mb-2 flex items-center gap-1.5">
            <User className="w-4 h-4" /> Account & Data
          </h4>
          <div className="text-xs text-game-text">
            <span className="text-game-muted">Signed in as: </span>
            <span className="font-semibold">
              {user?.email || user?.displayName || 'Guest Player'}
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut className="w-4 h-4" />}
              className="flex-1 text-xs"
            >
              Sign Out
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              icon={<Trash2 className="w-4 h-4" />}
              className="flex-1 text-xs"
            >
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Legal & Support Links */}
        <Card variant="surface" padding="md" className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-game-primary mb-2">
            About & Compliance
          </h4>
          <button
            onClick={onOpenPrivacy}
            className="w-full min-h-[44px] flex items-center justify-between text-xs font-medium text-game-text hover:text-game-primary py-1 border-b border-game-border/60"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-500" /> Privacy Policy (GDPR / DPDP)
            </span>
            <ChevronLeft className="w-4 h-4 rotate-180 text-game-muted" />
          </button>
          <button
            onClick={onOpenTerms}
            className="w-full min-h-[44px] flex items-center justify-between text-xs font-medium text-game-text hover:text-game-primary py-1 border-b border-game-border/60"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-pink-500" /> Terms of Service
            </span>
            <ChevronLeft className="w-4 h-4 rotate-180 text-game-muted" />
          </button>
          <a
            href="mailto:support@glamblocks.game?subject=Glam%20Blocks%20Support%20Request"
            className="w-full min-h-[44px] flex items-center justify-between text-xs font-medium text-game-text hover:text-game-primary py-1"
          >
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500" /> Contact Support
            </span>
            <ChevronLeft className="w-4 h-4 rotate-180 text-game-muted" />
          </a>
        </Card>

        {/* App Version & Age Notice */}
        <div className="text-center py-2 text-[11px] text-game-muted space-y-1">
          <div>Glam Blocks v1.0.0 (Production PWA)</div>
          <div>Rated for Ages 13+ • Made with ♥ for Beauty Enthusiasts</div>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account & Data?"
        maxWidth="max-w-xs"
      >
        <div className="pt-1 text-center">
          <p className="text-xs text-game-muted mb-4 leading-relaxed">
            In compliance with GDPR and India DPDP regulations, this will permanently delete your authentication record, saved scores, purchased looks, and inventory. This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              fullWidth
              loading={deleting}
              onClick={handleDeleteAccount}
            >
              Delete All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
