/**
 * Glam Blocks - Ads Provider System
 * Strict compliance with game rules:
 * - Rewarded ads are always user-initiated and optional (Continue / Double coins)
 * - Interstitial ONLY after every 3rd game over, NEVER during play, NEVER in first 3 games
 * - Zero ads if adsRemoved === true or active Glam Pass
 */

export interface AdsProvider {
  canShowAds(isAdFree: boolean): boolean;
  showRewardedAd(onRewarded: () => void, onClose: () => void): void;
  showInterstitial(onClose: () => void): void;
}

export class MockAdsProvider implements AdsProvider {
  canShowAds(isAdFree: boolean): boolean {
    return !isAdFree;
  }

  showRewardedAd(onRewarded: () => void, onClose: () => void): void {
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-white font-body';

    let countdown = 3;
    overlay.innerHTML = `
      <div class="bg-game-surface text-game-text p-6 rounded-3xl max-w-xs w-full text-center border border-game-border shadow-2xl">
        <div class="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/40 text-game-primary flex items-center justify-center mx-auto mb-3 text-2xl animate-bounce">
          🎬
        </div>
        <h4 class="text-lg font-heading font-bold mb-1">Sponsored Ad Preview</h4>
        <p class="text-xs text-game-muted mb-4">Demo Ad Simulation (No real ads in preview)</p>
        <div class="text-2xl font-heading font-bold text-game-primary mb-4" id="ad-timer">
          Reward in: ${countdown}s
        </div>
        <div class="w-full bg-game-card h-2 rounded-full overflow-hidden mb-4">
          <div id="ad-bar" class="h-full bg-game-primary transition-all duration-1000" style="width: 10%"></div>
        </div>
        <button id="ad-close-btn" disabled class="w-full py-2.5 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-500 font-medium text-sm cursor-not-allowed">
          Please wait...
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    const interval = setInterval(() => {
      countdown--;
      const timerEl = overlay.querySelector('#ad-timer');
      const barEl = overlay.querySelector('#ad-bar') as HTMLElement | null;
      const btn = overlay.querySelector('#ad-close-btn') as HTMLButtonElement | null;

      if (timerEl) timerEl.textContent = `Reward in: ${countdown}s`;
      if (barEl) barEl.style.width = `${((4 - countdown) / 3) * 100}%`;

      if (countdown <= 0) {
        clearInterval(interval);
        if (timerEl) timerEl.textContent = '🎉 Reward Unlocked!';
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Claim Reward';
          btn.className =
            'w-full py-2.5 rounded-xl bg-gradient-to-r from-game-primary to-pink-400 text-white font-medium text-sm cursor-pointer shadow-glossy-pink';
          btn.onclick = () => {
            document.body.removeChild(overlay);
            onRewarded();
            onClose();
          };
        }
      }
    }, 1000);
  }

  showInterstitial(onClose: () => void): void {
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-white font-body';

    let countdown = 2;
    overlay.innerHTML = `
      <div class="bg-game-surface text-game-text p-6 rounded-3xl max-w-xs w-full text-center border border-game-border shadow-2xl">
        <h4 class="text-lg font-heading font-bold mb-1">Glam Break</h4>
        <p class="text-xs text-game-muted mb-4">Sponsored Interstitial</p>
        <div class="text-sm font-semibold text-game-muted mb-4" id="interstitial-timer">
          Skip in: ${countdown}s
        </div>
        <button id="interstitial-close-btn" disabled class="w-full py-2.5 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-500 font-medium text-sm">
          Wait...
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    const interval = setInterval(() => {
      countdown--;
      const timerEl = overlay.querySelector('#interstitial-timer');
      const btn = overlay.querySelector('#interstitial-close-btn') as HTMLButtonElement | null;

      if (timerEl) timerEl.textContent = `Skip in: ${countdown}s`;

      if (countdown <= 0) {
        clearInterval(interval);
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Close';
          btn.className =
            'w-full py-2.5 rounded-xl bg-game-primary text-white font-medium text-sm cursor-pointer';
          btn.onclick = () => {
            document.body.removeChild(overlay);
            onClose();
          };
        }
      }
    }, 1000);
  }
}

export const adsProvider: AdsProvider = new MockAdsProvider();
