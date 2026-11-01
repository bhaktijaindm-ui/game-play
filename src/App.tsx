import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { AuthModal } from './components/auth/AuthModal';
import { DailyRewardModal } from './components/daily/DailyRewardModal';
import { CoinEarnedToast } from './components/ui/CoinEarnedToast';
import { BottomNavBar } from './components/navigation/BottomNavBar';

// Lazy load secondary sub-screens
const LooksScreen = lazy(() =>
  import('./screens/LooksScreen').then((m) => ({ default: m.LooksScreen }))
);
const ShopScreen = lazy(() =>
  import('./screens/ShopScreen').then((m) => ({ default: m.ShopScreen }))
);
const DailyRewardScreen = lazy(() =>
  import('./screens/DailyRewardScreen').then((m) => ({ default: m.DailyRewardScreen }))
);
const LeaderboardScreen = lazy(() =>
  import('./screens/LeaderboardScreen').then((m) => ({ default: m.LeaderboardScreen }))
);
const SettingsScreen = lazy(() =>
  import('./screens/SettingsScreen').then((m) => ({ default: m.SettingsScreen }))
);
const PrivacyPolicyScreen = lazy(() =>
  import('./screens/PrivacyPolicyScreen').then((m) => ({ default: m.PrivacyPolicyScreen }))
);
const TermsScreen = lazy(() =>
  import('./screens/TermsScreen').then((m) => ({ default: m.TermsScreen }))
);

import { ThemeProvider } from './services/themeContext';
import { ToastProvider, useToast } from './components/ui/Toast';
import { I18nProvider } from './i18n/i18nContext';
import { AuthProvider, useAuth } from './services/authContext';

export type ScreenState =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'game'
  | 'game_over'
  | 'looks'
  | 'shop'
  | 'daily'
  | 'leaderboard'
  | 'settings'
  | 'privacy'
  | 'terms';

const ONBOARDING_COMPLETED_KEY = 'glam_blocks_onboarding_completed';

const AppNavigator: React.FC = () => {
  const { isDailyRewardAvailable } = useAuth();
  const { showToast } = useToast();

  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [, setScreenHistory] = useState<ScreenState[]>(['home']);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);

  const [lastGameOverStats, setLastGameOverStats] = useState<{ score: number; coinsEarned: number }>({
    score: 0,
    coinsEarned: 0,
  });

  const [lastBackTapTime, setLastBackTapTime] = useState<number>(0);

  // Navigate to a new screen and record history
  const navigateTo = useCallback((screen: ScreenState) => {
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.history.pushState({ screen }, '', `#${screen}`);
  }, []);

  // Handle hardware / Android back button
  const handleBack = useCallback(() => {
    if (currentScreen === 'home') {
      const now = Date.now();
      if (now - lastBackTapTime < 2000) {
        return;
      } else {
        setLastBackTapTime(now);
        showToast('Press back again to exit game', 'info');
        window.history.pushState({ screen: 'home' }, '', '#home');
        return;
      }
    }

    if (currentScreen === 'game') {
      setCurrentScreen('home');
      return;
    }

    setScreenHistory((prev) => {
      if (prev.length > 1) {
        const nextHistory = prev.slice(0, -1);
        const previousScreen = nextHistory[nextHistory.length - 1];
        setCurrentScreen(previousScreen);
        return nextHistory;
      }
      setCurrentScreen('home');
      return ['home'];
    });
  }, [currentScreen, lastBackTapTime, showToast]);

  // Listen to popstate for back button navigation
  useEffect(() => {
    const onPopState = () => {
      handleBack();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [handleBack]);

  // Handle Splash transition
  const handleSplashFinish = () => {
    try {
      const onboardingDone = localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
      if (!onboardingDone) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('home');
      }
    } catch {
      setCurrentScreen('home');
    }
  };

  const handleOnboardingComplete = () => {
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch {}
    setCurrentScreen('home');
  };

  // Show Daily Rewards modal once a day when opening Home
  useEffect(() => {
    if (currentScreen === 'home') {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const lastAutoShown = localStorage.getItem('glam_daily_auto_shown_date');
        if (isDailyRewardAvailable() && lastAutoShown !== todayStr) {
          localStorage.setItem('glam_daily_auto_shown_date', todayStr);
          const timer = setTimeout(() => {
            setIsDailyModalOpen(true);
          }, 800);
          return () => clearTimeout(timer);
        }
      } catch {}
    }
  }, [currentScreen, isDailyRewardAvailable]);

  const handleGameOver = (score: number, coinsEarned: number) => {
    setLastGameOverStats({ score, coinsEarned });
    navigateTo('game_over');
  };

  return (
    <div className="mobile-frame min-h-[100dvh] flex flex-col justify-between relative overflow-x-hidden">
      {/* Floating Currency Gain Toast */}
      <CoinEarnedToast />

      {/* Main Screen Content */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'splash' && (
          <SplashScreen onFinish={handleSplashFinish} />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            onPlay={() => navigateTo('game')}
            onOpenLooks={() => navigateTo('looks')}
            onOpenShop={() => navigateTo('shop')}
            onOpenDaily={() => navigateTo('daily')}
            onOpenLeaderboard={() => navigateTo('leaderboard')}
            onOpenSettings={() => navigateTo('settings')}
          />
        )}

        {currentScreen === 'game' && (
          <GameScreen
            onGameOver={handleGameOver}
            onHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'game_over' && (
          <GameOverScreen
            score={lastGameOverStats.score}
            coinsEarned={lastGameOverStats.coinsEarned}
            onPlayAgain={() => setCurrentScreen('game')}
            onContinueGame={() => setCurrentScreen('game')}
            onHome={() => setCurrentScreen('home')}
          />
        )}

        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-8 h-8 border-4 border-game-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          {currentScreen === 'looks' && (
            <LooksScreen
              onBack={handleBack}
              onOpenShop={() => navigateTo('shop')}
            />
          )}

          {currentScreen === 'shop' && (
            <ShopScreen onBack={handleBack} />
          )}

          {currentScreen === 'daily' && (
            <DailyRewardScreen onBack={handleBack} />
          )}

          {currentScreen === 'leaderboard' && (
            <LeaderboardScreen onBack={handleBack} />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen
              onBack={handleBack}
              onOpenPrivacy={() => navigateTo('privacy')}
              onOpenTerms={() => navigateTo('terms')}
              onLoggedOut={() => setCurrentScreen('home')}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {currentScreen === 'privacy' && (
            <PrivacyPolicyScreen onBack={handleBack} />
          )}

          {currentScreen === 'terms' && (
            <TermsScreen onBack={handleBack} />
          )}
        </Suspense>
      </div>

      {/* Global Bottom Navigation Bar */}
      <BottomNavBar currentScreen={currentScreen} onNavigate={navigateTo} />

      {/* Auth Modal with Close (X), Backdrop/Escape dismiss, and Guest option */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
        onOpenPrivacy={() => {
          setIsAuthModalOpen(false);
          navigateTo('privacy');
        }}
        onOpenTerms={() => {
          setIsAuthModalOpen(false);
          navigateTo('terms');
        }}
      />

      {/* Daily Reward Modal */}
      <DailyRewardModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <ToastProvider>
            <AppNavigator />
          </ToastProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
