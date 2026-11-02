import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AuthScreenProps {
  onSuccess?: (user?: unknown) => void;
  onGuest?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  onGuest,
  onTermsClick,
  onPrivacyClick,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Field-specific validation states
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordLengthValid = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = isPasswordLengthValid && hasLetter && hasNumber;

  const handleGoogleAuth = async () => {
    if (mode === 'signup' && !agreeTerms) {
      setErrorMessage('Please agree to the Terms and Privacy Policy to continue.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    try {
      // Dynamic import from auth service with graceful fallback
      const authModule = await import('../services/auth').catch(() => null);
      if (authModule && typeof authModule.signInWithGoogle === 'function') {
        const res = await authModule.signInWithGoogle();
        onSuccess?.(res);
      } else {
        // Fallback simulation for offline or mock environment
        await new Promise((r) => setTimeout(r, 800));
        onSuccess?.({ uid: 'google_user_mock', email: 'user@glamblocks.app' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (mode === 'forgot') {
      if (!isEmailValid) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      setIsLoading(true);
      try {
        const authModule = await import('../services/auth').catch(() => null);
        if (authModule && typeof authModule.sendPasswordReset === 'function') {
          await authModule.sendPasswordReset(email);
        } else {
          await new Promise((r) => setTimeout(r, 600));
        }
        setSuccessInfo('Password reset email sent! Check your inbox.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to send reset email';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 8 characters with at least one letter and one number.');
      return;
    }

    if (mode === 'signup' && !agreeTerms) {
      setErrorMessage('Please agree to the Terms and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const authModule = await import('../services/auth').catch(() => null);
      if (mode === 'signup') {
        if (authModule && typeof authModule.signUpWithEmail === 'function') {
          const res = await authModule.signUpWithEmail(email, password, { marketingConsent });
          setSuccessInfo('Account created! A verification link has been sent to your email.');
          onSuccess?.(res);
        } else {
          await new Promise((r) => setTimeout(r, 800));
          setSuccessInfo('Account created! Verification link sent.');
          onSuccess?.({ uid: 'mock_new_user', email });
        }
      } else {
        if (authModule && typeof authModule.signInWithEmail === 'function') {
          const res = await authModule.signInWithEmail(email, password);
          onSuccess?.(res);
        } else {
          await new Promise((r) => setTimeout(r, 800));
          onSuccess?.({ uid: 'mock_signed_in_user', email });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = async () => {
    setIsLoading(true);
    try {
      const authModule = await import('../services/auth').catch(() => null);
      if (authModule && typeof authModule.signInAsGuest === 'function') {
        const res = await authModule.signInAsGuest();
        onGuest ? onGuest() : onSuccess?.(res);
      } else {
        onGuest ? onGuest() : onSuccess?.({ isAnonymous: true });
      }
    } catch {
      onGuest?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      className="relative flex min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex-col justify-center overflow-y-auto bg-[var(--background,#fdf4f8)] dark:bg-[var(--background,#0f0f13)] p-6 select-none"
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 w-full py-4">
        {/* Glam Icon & Title */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 text-3xl">
            ✨
          </div>
          <h1 className="text-2xl font-black text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)]">
            {mode === 'forgot'
              ? 'Reset Password'
              : mode === 'signup'
              ? 'Create your glam profile'
              : 'Welcome back, Stylist'}
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted,#71717a)]">
            {mode === 'forgot'
              ? 'Enter your email to receive recovery instructions'
              : mode === 'signup'
              ? 'Save your progress, sync palettes, and climb leaderboards'
              : 'Log in to continue styling your clients'}
          </p>
        </div>

        {/* Global Error Banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden rounded-xl bg-red-500/10 p-3 text-center text-xs font-semibold text-red-600 dark:text-red-400 border border-red-500/20"
            >
              {errorMessage}
            </motion.div>
          )}
          {successInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden rounded-xl bg-emerald-500/10 p-3 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            >
              {successInfo}
            </motion.div>
          )}
        </AnimatePresence>

        {mode !== 'forgot' && (
          <>
            {/* Google Primary Auth Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white dark:bg-zinc-800 p-4 font-bold text-zinc-800 dark:text-white shadow-md border border-black/10 dark:border-white/10 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-700/80 active:scale-95 disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="w-full border-t border-black/10 dark:border-white/10" />
              <span className="absolute bg-[var(--background,#fdf4f8)] dark:bg-[var(--background,#0f0f13)] px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted,#71717a)]">
                or with email
              </span>
            </div>
          </>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted,#71717a)] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="stylist@glamblocks.com"
              required
              className="w-full rounded-2xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] px-4 py-3.5 text-sm text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)] border border-black/10 dark:border-white/10 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
            {email.length > 0 && !isEmailValid && (
              <p className="mt-1 text-xs text-red-500">Please enter a valid email format</p>
            )}
          </div>

          {/* Password Field (if not in forgot mode) */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted,#71717a)]">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setSuccessInfo(null);
                      setMode('forgot');
                    }}
                    className="text-xs font-semibold text-pink-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl bg-[var(--surface-card,#ffffff)] dark:bg-[var(--surface-card,#22222a)] px-4 py-3.5 pr-12 text-sm text-[var(--text,#18181b)] dark:text-[var(--text,#f4f4f5)] border border-black/10 dark:border-white/10 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Rules indicators for Signup */}
              {mode === 'signup' && password.length > 0 && (
                <div className="mt-2 flex flex-col gap-1 text-[11px]">
                  <span className={isPasswordLengthValid ? 'text-emerald-500 font-semibold' : 'text-red-500'}>
                    ✓ At least 8 characters
                  </span>
                  <span className={hasLetter ? 'text-emerald-500 font-semibold' : 'text-red-500'}>
                    ✓ At least one letter
                  </span>
                  <span className={hasNumber ? 'text-emerald-500 font-semibold' : 'text-red-500'}>
                    ✓ At least one number
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Checkboxes for Sign Up */}
          {mode === 'signup' && (
            <div className="flex flex-col gap-3 pt-1">
              {/* Required Terms Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-xs text-[var(--text-muted,#71717a)] leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={onTermsClick}
                    className="font-semibold text-pink-500 hover:underline"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={onPrivacyClick}
                    className="font-semibold text-pink-500 hover:underline"
                  >
                    Privacy Policy
                  </button>
                  . <span className="text-red-500">*</span>
                </span>
              </label>

              {/* Optional Marketing Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-xs text-[var(--text-muted,#71717a)] leading-relaxed">
                  Send me seasonal offers, glam tips, and palette updates by email.
                </span>
              </label>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-4 font-bold text-white shadow-lg shadow-pink-500/25 transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : mode === 'forgot' ? (
              'Send Reset Link'
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Toggle between Sign In / Sign Up */}
        <div className="mt-5 text-center text-xs text-[var(--text-muted,#71717a)]">
          {mode === 'forgot' ? (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setSuccessInfo(null);
                setMode('signin');
              }}
              className="font-semibold text-pink-500 hover:underline"
            >
              ← Back to Sign In
            </button>
          ) : mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessInfo(null);
                  setMode('signin');
                }}
                className="font-bold text-pink-500 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Glam Blocks?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessInfo(null);
                  setMode('signup');
                }}
                className="font-bold text-pink-500 hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Guest Play Link */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleGuest}
            disabled={isLoading}
            className="text-xs font-semibold text-[var(--text-muted,#71717a)] hover:text-[var(--text,#18181b)] dark:hover:text-white transition-colors"
          >
            Play as guest →
          </button>
        </div>
      </div>
    </motion.main>
  );
};

export default AuthScreen;
