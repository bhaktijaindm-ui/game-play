import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../services/authContext';
import { useToast } from '../ui/Toast';
import { soundSystem } from '../../services/soundSystem';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth();
  const { showToast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const termsAgreed = true; // Agreement implicit with continue options
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleDismiss = () => {
    try {
      localStorage.setItem('glam_auth_dismissed', 'true');
    } catch {}
    soundSystem.playClick();
    onClose();
  };

  const handleGuestContinue = () => {
    try {
      localStorage.setItem('glam_auth_dismissed', 'true');
    } catch {}
    soundSystem.playClick();
    signInAsGuest();
    showToast('Playing as Guest. Progress saved locally.', 'info');
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleGoogleAuth = async () => {
    if (!termsAgreed) {
      setErrorMsg('Please accept the Terms & Privacy Policy to continue.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      try {
        localStorage.setItem('glam_auth_dismissed', 'true');
      } catch {}
      soundSystem.playSparkle();
      showToast('Welcome to Glam Blocks!', 'success');
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      setErrorMsg('Google sign-in could not complete. You can continue as Guest.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!termsAgreed) {
      setErrorMsg('Please accept the Terms & Privacy Policy to continue.');
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(cleanEmail, password, false);
        showToast('Account created successfully!', 'success');
      } else {
        await signInWithEmail(cleanEmail, password);
        showToast('Welcome back, Glam Star!', 'success');
      }
      try {
        localStorage.setItem('glam_auth_dismissed', 'true');
      } catch {}
      soundSystem.playSparkle();
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      setErrorMsg('Authentication failed. Check your details or continue as Guest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur & dismiss on click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-game-surface border border-game-border shadow-luxury rounded-3xl p-6 overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            {/* Top Close (X) Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-game-card hover:bg-game-border/80 text-game-muted hover:text-game-text transition-all duration-150 cursor-pointer"
              aria-label="Close login dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Brand Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-game-primary via-game-secondary to-amber-300 p-0.5 shadow-rosegold mb-2.5">
                <div className="w-full h-full bg-game-surface rounded-[14px] flex items-center justify-center text-2xl">
                  💄
                </div>
              </div>
              <h2
                id="auth-modal-title"
                className="text-2xl font-heading font-bold text-game-text"
              >
                Glam Blocks
              </h2>
              <p className="text-xs text-game-muted mt-1">
                Save your beauty looks, high scores & streak across devices
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/40 border border-game-danger/30 text-game-danger p-2.5 rounded-xl text-xs mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-white text-gray-800 border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 flex items-center justify-center gap-3 text-sm font-semibold transition-all duration-150 cursor-pointer disabled:opacity-60"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-px bg-game-border" />
              <span className="text-[10px] font-bold text-game-muted uppercase tracking-wider">
                OR
              </span>
              <div className="flex-1 h-px bg-game-border" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-2.5">
              <div className="relative">
                <Mail className="w-4 h-4 text-game-muted absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full min-h-[44px] bg-game-card border border-game-border rounded-xl pl-10 pr-3 text-xs text-game-text focus:outline-none focus:border-game-primary"
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-game-muted absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 characters)"
                  className="w-full min-h-[44px] bg-game-card border border-game-border rounded-xl pl-10 pr-3 text-xs text-game-text focus:outline-none focus:border-game-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[44px] rounded-xl bg-game-primary hover:bg-game-primary-hover text-white text-xs font-semibold shadow-glossy-pink transition-all duration-150 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Processing...' : isSignUp ? 'Create Glam Account' : 'Sign In with Email'}
              </button>
            </form>

            <div className="mt-2.5 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[11px] text-game-primary hover:underline font-medium"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'New here? Create an account'}
              </button>
            </div>

            {/* Continue as Guest / Maybe later */}
            <div className="mt-4 pt-3 border-t border-game-border/80 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="w-full min-h-[44px] rounded-2xl bg-game-card hover:bg-game-border/60 text-game-text text-xs font-semibold transition-all duration-150 cursor-pointer"
              >
                Continue as Guest / Maybe Later
              </button>

              <p className="text-[10px] text-game-muted text-center leading-tight">
                By continuing, you agree to our{' '}
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="underline hover:text-game-text"
                >
                  Terms
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="underline hover:text-game-text"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
