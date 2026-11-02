import type { AdsProvider } from '../types';

/**
 * Determines whether an interstitial advertisement should be displayed.
 * Rules:
 * - Never if player purchased "Remove Ads"
 * - Never if player has active "Glam Pass"
 * - Never in the first 3 games (player onboarding experience)
 * - Shown strictly on game over, after every 3rd game completed
 */
export function shouldShowInterstitial(
  gamesPlayed: number,
  adsRemoved: boolean,
  hasGlamPass: boolean
): boolean {
  if (adsRemoved || hasGlamPass) {
    return false;
  }

  // Grace period for new players
  if (gamesPlayed < 3) {
    return false;
  }

  // Every 3rd game completed
  return gamesPlayed % 3 === 0;
}

/**
 * Mock Ads Provider with an interactive 3-second visual overlay.
 * Simulates real rewarded video and interstitial ads for web testing and development.
 */
export class MockAdsProvider implements AdsProvider {
  private ready = true;

  public async initialize(): Promise<void> {
    this.ready = true;
    return Promise.resolve();
  }

  public isReady(): boolean {
    return this.ready;
  }

  public async showRewarded(placement: string): Promise<boolean> {
    return this.displayAdModal({
      title: 'Sponsored Beauty Spotlight',
      type: 'rewarded',
      placement,
      durationSeconds: 3,
    });
  }

  public async showInterstitial(): Promise<boolean> {
    return this.displayAdModal({
      title: 'Intermission Preview',
      type: 'interstitial',
      placement: 'game_over',
      durationSeconds: 3,
    });
  }

  /**
   * Compatibility helpers for earlier interface signatures
   */
  public canShowAds(isAdFree: boolean): boolean {
    return !isAdFree;
  }

  public showRewardedAd(onRewarded: () => void, onClose: () => void): void {
    this.showRewarded('game_reward')
      .then((success) => {
        if (success) {
          onRewarded();
        }
        onClose();
      })
      .catch(() => {
        onClose();
      });
  }

  /**
   * Creates and manages a 3-second animated mock ad banner overlay in the DOM.
   */
  private displayAdModal(options: {
    title: string;
    type: 'rewarded' | 'interstitial';
    placement: string;
    durationSeconds: number;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof document === 'undefined') {
        resolve(true);
        return;
      }

      const overlay = document.createElement('div');
      overlay.id = 'glam-mock-ad-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.zIndex = '99999';
      overlay.style.backgroundColor = 'rgba(15, 15, 20, 0.95)';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.padding = '24px';
      overlay.style.fontFamily = "'Fredoka', sans-serif";
      overlay.style.color = '#ffffff';
      overlay.style.backdropFilter = 'blur(10px)';

      let secondsLeft = options.durationSeconds;

      overlay.innerHTML = `
        <div style="background: linear-gradient(135deg, #1f1f2e, #14141f); border: 2px solid #E6177F; border-radius: 20px; max-width: 380px; width: 100%; padding: 28px; text-align: center; box-shadow: 0 20px 40px rgba(230, 23, 127, 0.35); position: relative;">
          <div style="position: absolute; top: 12px; right: 14px; background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #fbcfe8;">
            Mock Ad [Demo]
          </div>
          <div style="font-size: 40px; margin-bottom: 12px;">✨💄💎</div>
          <h2 style="font-size: 22px; margin: 0 0 8px; color: #ffffff; font-weight: 700;">${options.title}</h2>
          <p style="font-size: 13px; color: #e4e4e7; margin: 0 0 16px; font-family: 'Poppins', sans-serif;">
            ${
              options.type === 'rewarded'
                ? 'Watch this simulated sponsor message to claim your glamour reward!'
                : 'Glam Blocks Intermission. Resume play in a moment.'
            }
          </p>
          <div style="background: #272736; border-radius: 8px; height: 8px; overflow: hidden; margin-bottom: 20px; width: 100%;">
            <div id="glam-ad-progress" style="background: linear-gradient(90deg, #E6177F, #a855f7); height: 100%; width: 0%; transition: width 1s linear;"></div>
          </div>
          <div id="glam-ad-timer" style="font-size: 14px; color: #a1a1aa; font-weight: 600;">
            Reward in ${secondsLeft}s...
          </div>
          <button id="glam-ad-close" style="display: none; margin-top: 18px; width: 100%; background: linear-gradient(135deg, #E6177F, #c026d3); color: #ffffff; border: none; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer;">
            Claim Reward & Continue
          </button>
        </div>
      `;

      document.body.appendChild(overlay);

      const timerEl = overlay.querySelector('#glam-ad-timer') as HTMLDivElement;
      const progressEl = overlay.querySelector('#glam-ad-progress') as HTMLDivElement;
      const closeBtn = overlay.querySelector('#glam-ad-close') as HTMLButtonElement;

      // Initial progress trigger
      setTimeout(() => {
        if (progressEl) progressEl.style.width = '33%';
      }, 50);

      const interval = setInterval(() => {
        secondsLeft -= 1;
        if (progressEl) {
          const percent = Math.min(100, Math.round(((options.durationSeconds - secondsLeft) / options.durationSeconds) * 100));
          progressEl.style.width = `${percent}%`;
        }

        if (secondsLeft <= 0) {
          clearInterval(interval);
          if (timerEl) timerEl.textContent = 'Ad Completed! 🎉';
          if (closeBtn) {
            closeBtn.style.display = 'block';
            closeBtn.onclick = () => {
              if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
              }
              resolve(true);
            };
          }
        } else if (timerEl) {
          timerEl.textContent = `Reward in ${secondsLeft}s...`;
        }
      }, 1000);
    });
  }
}

let cachedAdsProvider: AdsProvider | null = null;

/**
 * Returns the singleton AdsProvider instance.
 */
export function getAdsProvider(): AdsProvider {
  if (!cachedAdsProvider) {
    cachedAdsProvider = new MockAdsProvider();
  }
  return cachedAdsProvider;
}
