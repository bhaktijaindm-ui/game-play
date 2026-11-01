import React, { useState } from 'react';
import { PRODUCTS, getProductDisplayPrice, detectUserRegionTier } from '../config/pricing.config';
import { getBillingProvider } from '../services/billing';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { CurrencyChip } from '../components/ui/CurrencyChip';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/ui/Toast';
import { soundSystem } from '../services/soundSystem';
import { ChevronLeft, Crown, ShieldCheck, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShopScreenProps {
  onBack: () => void;
}

type ShopTab = 'bundles' | 'coins' | 'gems' | 'glam_pass' | 'remove_ads';

export const ShopScreen: React.FC<ShopScreenProps> = ({ onBack }) => {
  const { user, isGlamPassActive, isAdFree, addCurrency, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ShopTab>('bundles');
  const [confirmProductId, setConfirmProductId] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const region = detectUserRegionTier();
  const billingProvider = getBillingProvider();
  const isPassActive = isGlamPassActive();
  const hasAdsRemoved = isAdFree();

  const confirmProduct = confirmProductId ? PRODUCTS[confirmProductId] : null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFD700', '#FF4081', '#C2185B'],
      });
    } catch {}
  };

  const handleInstantCoinClaim = (coins: number, label: string) => {
    soundSystem.playSparkle();
    triggerConfetti();
    addCurrency(coins, 0, 'shop_claim');
    showToast(`Claimed ${label} (${coins.toLocaleString()} Coins)!`, 'glam');
  };

  const handlePurchase = async () => {
    if (!confirmProduct) return;
    setPurchasing(true);

    try {
      const result = await billingProvider.purchaseProduct(confirmProduct.id);

      if (result.success) {
        soundSystem.playSparkle();
        triggerConfetti();

        // Apply product rewards
        const reward = confirmProduct.reward;
        if (reward.gems || reward.coins) {
          addCurrency(reward.coins || 0, reward.gems || 0, 'in_app_purchase');
        }

        if (reward.adsRemoved) {
          updateProfile({ adsRemoved: true });
        }

        if (reward.glamPassDays) {
          const durationMs = reward.glamPassDays * 24 * 60 * 60 * 1000;
          const newPassEnd = Math.max(Date.now(), user?.glamPassUntil || 0) + durationMs;
          updateProfile({ glamPassUntil: newPassEnd });
        }

        showToast(
          result.isMock
            ? `Demo: Granted ${confirmProduct.name}!`
            : `Purchased ${confirmProduct.name}!`,
          'success'
        );
      } else {
        showToast(result.error || 'Purchase could not be completed.', 'error');
      }
    } catch {
      showToast('Purchase error occurred.', 'error');
    } finally {
      setPurchasing(false);
      setConfirmProductId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-gradient-to-b from-game-bg via-game-surface to-pink-50/50 dark:to-purple-950/20">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between min-h-[48px] mb-2">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-game-surface border border-game-border text-game-muted hover:text-game-text hover:border-game-secondary transition-all cursor-pointer"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-display font-bold text-game-text">
            Glam Boutique
          </h2>
          {/* Header Balance Chips */}
          <div className="flex items-center gap-1.5">
            <CurrencyChip
              type="coins"
              amount={user?.coins ?? 500}
              onAddClick={() => setActiveTab('coins')}
              size="sm"
            />
            <CurrencyChip
              type="gems"
              amount={user?.gems ?? 100}
              onAddClick={() => setActiveTab('gems')}
              size="sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-game-card rounded-2xl border border-game-border mb-3">
          {(
            [
              { id: 'bundles', label: 'Bundles' },
              { id: 'coins', label: 'Coins' },
              { id: 'gems', label: 'Gems' },
              { id: 'glam_pass', label: 'VIP Pass' },
              { id: 'remove_ads', label: 'No Ads' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundSystem.playClick();
                setActiveTab(tab.id);
              }}
              className={`
                min-h-[42px] text-[11px] font-heading font-semibold rounded-xl transition-all cursor-pointer
                ${
                  activeTab === tab.id
                    ? 'bg-game-surface text-game-primary shadow-soft font-bold'
                    : 'text-game-muted hover:text-game-text'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* 1. Bundles Tab */}
        {activeTab === 'bundles' && (
          <div className="space-y-3">
            {[PRODUCTS.starter_bundle].map((prod) => {
              const price = getProductDisplayPrice(prod.id, region);
              return (
                <Card
                  key={prod.id}
                  variant="gradient"
                  padding="md"
                  className="relative overflow-hidden border-2 border-pink-400/50 shadow-luxury"
                >
                  {prod.badge && (
                    <span className="absolute top-0 right-0 bg-game-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-xs">
                      {prod.badge}
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-3xl shadow-soft">
                      🎁
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-base text-game-text">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-game-muted leading-tight mt-0.5">
                        {prod.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-heading font-bold text-lg text-game-primary">
                          {price.formatted}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setConfirmProductId(prod.id)}
                        >
                          Get Bundle
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* 2. Coins Tab (Instant Free Refill & Packages) */}
        {activeTab === 'coins' && (
          <div className="space-y-3">
            {/* Free Instant Refill Card */}
            <Card variant="gradient" padding="md" className="border-2 border-amber-400/60 shadow-rosegold">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-500 flex items-center justify-center text-2xl shadow-soft">
                    🪙
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Free Reward
                    </span>
                    <h4 className="font-heading font-bold text-base text-game-text">
                      Instant Coin Refill
                    </h4>
                    <p className="text-xs text-game-muted">
                      Tap to collect +500 free gameplay coins right now!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInstantCoinClaim(500, 'Free Refill')}
                  className="px-4 py-2 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-heading font-bold text-xs shadow-soft active:scale-95 transition-all cursor-pointer"
                >
                  Claim 500
                </button>
              </div>
            </Card>

            {/* Coin Value Packs */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'coins_1000', name: 'Glam Purse', coins: 1000, price: 'FREE', icon: '👛' },
                { id: 'coins_3000', name: 'Beauty Box', coins: 3000, price: 'FREE', icon: '👝' },
                { id: 'coins_7500', name: 'Luxe Trunk', coins: 7500, price: 'FREE', icon: '✨' },
                { id: 'coins_20000', name: 'Empress Vault', coins: 20000, price: 'FREE', icon: '👑' },
              ].map((pack) => (
                <Card
                  key={pack.id}
                  variant="surface"
                  padding="md"
                  className="flex flex-col items-center text-center relative border border-game-border"
                >
                  <span className="text-3xl my-2">{pack.icon}</span>
                  <h5 className="font-heading font-bold text-xs text-game-text">
                    {pack.name}
                  </h5>
                  <span className="text-xs font-semibold text-amber-500 my-1">
                    +{pack.coins.toLocaleString()} Coins
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInstantCoinClaim(pack.coins, pack.name)}
                    className="w-full min-h-[40px] mt-2 rounded-xl bg-game-card hover:bg-game-border/80 border border-game-border text-xs font-heading font-bold text-game-text active:scale-95 transition-all cursor-pointer"
                  >
                    Tap to Add
                  </button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 3. Gems Tab */}
        {activeTab === 'gems' && (
          <div className="grid grid-cols-2 gap-2.5">
            {[PRODUCTS.gem_pack_s, PRODUCTS.gem_pack_m, PRODUCTS.gem_pack_l, PRODUCTS.gem_pack_xl].map(
              (prod) => {
                const price = getProductDisplayPrice(prod.id, region);
                return (
                  <Card
                    key={prod.id}
                    variant="surface"
                    padding="md"
                    className="flex flex-col items-center text-center relative border border-game-border"
                  >
                    {prod.badge && (
                      <span className="absolute -top-2 bg-amber-400 text-amber-950 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {prod.badge}
                      </span>
                    )}
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center my-2 text-2xl">
                      💎
                    </div>
                    <h5 className="font-heading font-bold text-xs text-game-text">
                      {prod.name}
                    </h5>
                    <span className="text-xs font-semibold text-game-primary my-1">
                      {prod.reward.gems?.toLocaleString()} Gems
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => setConfirmProductId(prod.id)}
                      className="mt-2 text-xs"
                    >
                      {price.formatted}
                    </Button>
                  </Card>
                );
              }
            )}
          </div>
        )}

        {/* 4. Glam Pass VIP Tab */}
        {activeTab === 'glam_pass' && (
          <div className="space-y-3">
            <Card variant="gradient" padding="md" className="border-2 border-amber-400/50 shadow-luxury">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-amber-500 fill-amber-400" />
                <h4 className="font-display font-bold text-lg text-game-text">
                  Glam Pass VIP Benefits
                </h4>
              </div>
              <ul className="text-xs text-game-text space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-game-success" />
                  <span>100% Ad-Free Experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-game-success" />
                  <span>2X Coins on Every Board Clear</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-game-success" />
                  <span>1 Free Undo in Every Game</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-game-success" />
                  <span>Exclusive Royal Empress Look & Golden Frame</span>
                </li>
              </ul>

              {isPassActive ? (
                <div className="bg-game-success/20 border border-game-success text-game-success p-3 rounded-2xl text-center text-xs font-bold">
                  ✓ Glam Pass VIP Active
                </div>
              ) : (
                <div className="space-y-2">
                  {[PRODUCTS.glam_pass_monthly, PRODUCTS.glam_pass_yearly].map((prod) => {
                    const price = getProductDisplayPrice(prod.id, region);
                    return (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-game-surface border border-game-border"
                      >
                        <div>
                          <div className="font-heading font-semibold text-xs text-game-text">
                            {prod.name}
                          </div>
                          {prod.badge && (
                            <span className="text-[10px] text-amber-500 font-bold">
                              {prod.badge}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => setConfirmProductId(prod.id)}
                        >
                          {price.formatted}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* 5. Remove Ads Tab */}
        {activeTab === 'remove_ads' && (
          <div className="space-y-3">
            <Card variant="surface" padding="lg" className="text-center border border-game-border shadow-soft">
              <div className="w-16 h-16 rounded-3xl bg-pink-100 dark:bg-pink-950/40 text-game-primary flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-lg text-game-text">
                Permanent Ad Removal
              </h4>
              <p className="text-xs text-game-muted max-w-xs mx-auto mt-1 mb-4 leading-relaxed">
                Enjoy uninterrupted puzzle solving without interstitial ads forever.
              </p>

              {hasAdsRemoved ? (
                <div className="bg-game-success/20 border border-game-success text-game-success p-3 rounded-2xl text-xs font-bold">
                  ✓ Ads Permanently Removed
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setConfirmProductId(PRODUCTS.remove_ads.id)}
                >
                  Buy Ad-Free — {getProductDisplayPrice('remove_ads', region).formatted}
                </Button>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Confirmation Bottom Sheet before Purchase */}
      <Modal
        isOpen={confirmProductId !== null}
        onClose={() => setConfirmProductId(null)}
        title="Confirm Purchase"
        maxWidth="max-w-xs"
      >
        {confirmProduct && (
          <div className="pt-1 text-center">
            <h4 className="font-heading font-bold text-lg text-game-text mb-1">
              {confirmProduct.name}
            </h4>
            <p className="text-xs text-game-muted mb-4">
              {confirmProduct.description}
            </p>
            <div className="text-2xl font-heading font-bold text-game-primary mb-4">
              {getProductDisplayPrice(confirmProduct.id, region).formatted}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => setConfirmProductId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                loading={purchasing}
                onClick={handlePurchase}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
