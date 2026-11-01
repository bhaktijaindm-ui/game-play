import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/ui/Toast';
import { Sparkles, Mail, Lock, Check, AlertCircle } from 'lucide-react';
import { soundSystem } from '../services/soundSystem';

interface AuthScreenProps {
  onSuccess: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth();
  const { showToast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sanitizes input to avoid XSS
  const sanitizeText = (txt: string) => txt.replace(/<[^>]*>?/gm, '').trim();

  const handleGoogleAuth = async () => {
    if (!termsAgreed) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy to continue.');
      showToast('Terms agreement required', 'warning');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      soundSystem.playPop();
      showToast('Welcome to Glam Blocks!', 'success');
      onSuccess();
    } catch {
      setErrorMsg('Google sign-in encountered an issue. Please try email or guest mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!termsAgreed) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy to continue.');
      showToast('Terms agreement required', 'warning');
      return;
    }

    const cleanEmail = sanitizeText(email);
    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(cleanEmail, password, marketingAgreed);
        showToast('Account created successfully!', 'success');
      } else {
        await signInWithEmail(cleanEmail, password);
        showToast('Welcome back, Glam Star!', 'success');
      }
      soundSystem.playPop();
      onSuccess();
    } catch {
      setErrorMsg('Authentication failed. Check your credentials or try Guest mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPlay = () => {
    if (!termsAgreed) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy to continue.');
      showToast('Terms agreement required', 'warning');
      return;
    }
    soundSystem.playClick();
    signInAsGuest();
    showToast('Playing as Guest. Progress saved locally.', 'info');
    onSuccess();
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-6 safe-top safe-bottom bg-gradient-to-b from-game-bg to-pink-50 dark:to-purple-950/20">
      <div className="w-full max-w-sm mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-game-primary via-purple-500 to-amber-400 p-0.5 shadow-glossy-pink mb-3">
            <div className="w-full h-full bg-game-surface rounded-[14px] flex items-center justify-center text-3xl">
              💄
            </div>
          </div>
          <h1 className="text-2xl font-heading font-bold text-game-text">
            Glam Blocks
          </h1>
          <p className="text-xs text-game-muted mt-1">
            Sign in to preserve your looks, rankings, and cloud progress
          </p>
        </div>

        {/* Auth Card */}
        <Card variant="surface" padding="md" className="mb-4">
          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/40 border border-game-danger/30 text-game-danger p-3 rounded-xl text-xs mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-game-surface border border-game-border shadow-soft hover:bg-game-card flex items-center justify-center gap-3 text-sm font-semibold text-game-text transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-game-border" />
            <span className="text-[11px] font-bold text-game-muted uppercase">OR</span>
            <div className="flex-1 h-px bg-game-border" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-game-muted mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-game-muted absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full min-h-[44px] bg-game-card border border-game-border rounded-xl pl-10 pr-3 text-sm text-game-text focus:outline-none focus:border-game-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-game-muted mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-game-muted absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full min-h-[44px] bg-game-card border border-game-border rounded-xl pl-10 pr-3 text-sm text-game-text focus:outline-none focus:border-game-primary"
                />
              </div>
            </div>

            {/* Required Terms Consent Checkbox */}
            <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
              <div
                onClick={() => setTermsAgreed(!termsAgreed)}
                className={`w-5 h-5 min-w-[20px] rounded-md border flex items-center justify-center transition-colors ${
                  termsAgreed
                    ? 'bg-game-primary border-pink-400 text-white'
                    : 'bg-game-card border-game-border'
                }`}
              >
                {termsAgreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-[11px] text-game-muted leading-tight">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="text-game-primary underline font-medium"
                >
                  Terms
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="text-game-primary underline font-medium"
                >
                  Privacy Policy
                </button>{' '}
                (Required, 13+)
              </span>
            </label>

            {/* Optional Marketing Consent Checkbox */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
              <div
                onClick={() => setMarketingAgreed(!marketingAgreed)}
                className={`w-5 h-5 min-w-[20px] rounded-md border flex items-center justify-center transition-colors ${
                  marketingAgreed
                    ? 'bg-game-secondary border-purple-400 text-white'
                    : 'bg-game-card border-game-border'
                }`}
              >
                {marketingAgreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-[11px] text-game-muted leading-tight">
                Send me cosmetic updates, event offers & gifts by email (Optional)
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
              icon={<Sparkles className="w-4 h-4" />}
              className="mt-3"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-semibold text-game-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </Card>

        {/* Small Guest Play Secondary Link */}
        <div className="text-center">
          <button
            onClick={handleGuestPlay}
            className="text-xs text-game-muted hover:text-game-text underline font-medium py-2 min-h-[44px] inline-flex items-center justify-center"
          >
            Play as Guest (progress saved locally only)
          </button>
        </div>
      </div>
    </div>
  );
};
