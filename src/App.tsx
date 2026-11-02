import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { OfflineBanner } from './components/OfflineBanner';
import { Skeleton } from './components/Skeleton';
import { storageService } from './services/storage';

// Screens
const SplashScreen = lazy(() => import('./screens/SplashScreen'));
const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen'));
const AuthScreen = lazy(() => import('./screens/AuthScreen'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const GameScreen = lazy(() => import('./screens/GameScreen'));
const ClientResultScreen = lazy(() => import('./screens/ClientResultScreen'));
const GameOverScreen = lazy(() => import('./screens/GameOverScreen'));
const PortfolioScreen = lazy(() => import('./screens/PortfolioScreen'));
const PaletteScreen = lazy(() => import('./screens/PaletteScreen'));
const CollectionsScreen = lazy(() => import('./screens/CollectionsScreen'));
const ShopScreen = lazy(() => import('./screens/ShopScreen'));
const DailyRewardScreen = lazy(() => import('./screens/DailyRewardScreen'));
const LeaderboardScreen = lazy(() => import('./screens/LeaderboardScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const AdventureMapScreen = lazy(() => import('./screens/AdventureMapScreen'));
const RenovationScreen = lazy(() => import('./screens/RenovationScreen'));
const FestivalPassScreen = lazy(() => import('./screens/FestivalPassScreen'));
const FestivalMatchScreen = lazy(() => import('./screens/FestivalMatchScreen'));

function LoadingFallback() {
  return (
    <div className="flex h-screen w-full max-w-[480px] mx-auto flex-col items-center justify-center p-6 space-y-4 bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)]">
      <div className="w-16 h-16 rounded-3xl bg-pink-500/20 animate-pulse flex items-center justify-center text-3xl">
        💄
      </div>
      <Skeleton width="180px" height="24px" rounded="12px" />
      <Skeleton width="120px" height="16px" rounded="8px" />
    </div>
  );
}

// Wrapper for Home to inject router navigation and profile
function HomeRoute() {
  const navigate = useNavigate();
  const { userProfile } = useGame();

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'home':
        navigate('/');
        break;
      case 'map':
        navigate('/map');
        break;
      case 'renovation':
        navigate('/renovation');
        break;
      case 'pass':
        navigate('/pass');
        break;
      case 'festivalMatch':
        navigate('/festival-match');
        break;
      case 'collections':
        navigate('/collections');
        break;
      case 'leaderboard':
        navigate('/leaderboard');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'palette':
        navigate('/palette');
        break;
      case 'shop':
        navigate('/shop');
        break;
      case 'portfolio':
        navigate('/portfolio');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'dailyReward':
        navigate('/daily-reward');
        break;
      default:
        navigate(`/${screen}`);
    }
  };

  return (
    <HomeScreen
      user={userProfile as any}
      coins={userProfile.coins}
      gems={userProfile.gems}
      streak={userProfile.streakDays || userProfile.streakDay || 1}
      level={userProfile.level || 1}
      bestScore={userProfile.highScore || userProfile.bestScore || 18450}
      onPlay={() => navigate('/game')}
      onNavigate={handleNavigate}
    />
  );
}

// Wrapper for Splash
function SplashRoute() {
  const navigate = useNavigate();
  const hasSeenOnboarding = storageService.hasSeenOnboarding();

  return (
    <SplashScreen
      onFinish={() => {
        if (!hasSeenOnboarding) {
          navigate('/onboarding');
        } else {
          navigate('/');
        }
      }}
      onSignIn={() => navigate('/auth')}
    />
  );
}

// Wrapper for Onboarding
function OnboardingRoute() {
  const navigate = useNavigate();
  return (
    <OnboardingScreen
      onComplete={() => {
        storageService.setOnboardingSeen();
        navigate('/auth');
      }}
    />
  );
}

// Wrapper for Auth
function AuthRoute() {
  const navigate = useNavigate();
  return (
    <AuthScreen
      onSuccess={() => navigate('/')}
      onGuest={() => navigate('/')}
      onTermsClick={() => window.open('/terms', '_blank')}
      onPrivacyClick={() => window.open('/privacy', '_blank')}
    />
  );
}

export function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] flex justify-center text-[var(--text)]">
      <OfflineBanner />
      <div className="w-full max-w-[480px] shadow-2xl relative min-h-screen min-h-[100dvh] flex flex-col">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/splash" element={<SplashRoute />} />
            <Route path="/onboarding" element={<OnboardingRoute />} />
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/map" element={<AdventureMapScreen onNavigate={(s) => navigate(`/${s === 'home' ? '' : s}`)} />} />
            <Route path="/renovation" element={<RenovationScreen onNavigate={(s) => navigate(`/${s === 'home' ? '' : s}`)} />} />
            <Route path="/pass" element={<FestivalPassScreen onNavigate={(s) => navigate(`/${s === 'home' ? '' : s}`)} />} />
            <Route path="/festival-match" element={<FestivalMatchScreen onNavigate={(s) => navigate(`/${s === 'home' ? '' : s}`)} />} />
            <Route path="/result" element={<ClientResultScreen />} />
            <Route path="/game-over" element={<GameOverScreen />} />
            <Route path="/portfolio" element={<PortfolioScreen />} />
            <Route path="/palette" element={<PaletteScreen />} />
            <Route path="/collections" element={<CollectionsScreen />} />
            <Route path="/shop" element={<ShopScreen />} />
            <Route path="/daily-reward" element={<DailyRewardScreen />} />
            <Route path="/leaderboard" element={<LeaderboardScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export function AppRoot() {
  return (
    <GameProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GameProvider>
  );
}

export default AppRoot;
