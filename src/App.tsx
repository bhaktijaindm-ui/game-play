import React, { useState, useEffect, useCallback } from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { Suspense, lazy } from 'react';

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
  | 'auth'
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
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [, setScreenHistory] = useState<ScreenState[]>(['home']);
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
        // Allow default exit
        return;
      } else {
        setLastBackTapTime(now);
        showToast('Press back again to exit game', 'info');
        window.history.pushState({ screen: 'home' }, '', '#home');
        return;
      }
    }

    if (currentScreen === 'game') {
      // Prompt before quitting mid-game
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

  // Listen to popstate for Android back button
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
      } else if (!user) {
        setCurrentScreen('auth');
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
    } catch {
      // ignore
    }
    if (!user) {
      setCurrentScreen('auth');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleGameOver = (score: number, coinsEarned: number) => {
    setLastGameOverStats({ score, coinsEarned });
    navigateTo('game_over');
  };

  return (
    <div className="mobile-frame">
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {currentScreen === 'auth' && (
        <AuthScreen
          onSuccess={() => navigateTo('home')}
          onOpenPrivacy={() => navigateTo('privacy')}
          onOpenTerms={() => navigateTo('terms')}
        />
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
            onLoggedOut={() => setCurrentScreen('auth')}
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
