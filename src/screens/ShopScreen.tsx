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

interface ShopScreenProps {
  onBack: () => void;
}

type ShopTab = 'bundles' | 'gems' | 'glam_pass' | 'remove_ads';

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

  const handlePurchase = async () => {
    if (!confirmProduct) return;
    setPurchasing(true);

    try {
      const result = await billingProvider.purchaseProduct(confirmProduct.id);

      if (result.success) {
        soundSystem.playSparkle();

        // Apply product rewards
        const reward = confirmProduct.reward;
        if (reward.gems || reward.coins) {
          addCurrency(reward.coins || 0, reward.gems || 0);
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
    <div className="flex-1 flex flex-col justify-between p-4 safe-top safe-bottom bg-game-bg">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between min-h-[44px] mb-2">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-game-surface border border-game-border text-game-muted hover:text-game-text"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-heading font-bold text-game-text">
            Glam Beauty Shop
          </h2>
          <div className="flex items-center gap-1.5">
            <CurrencyChip type="gems" amount={user?.gems || 0} size="sm" />
          </div>
        </div>

        {/* Browser Demo Sandbox Notice */}
        <div className="bg-game-card/80 border border-game-border/80 px-3 py-1.5 rounded-xl text-center mb-3">
          <p className="text-[10px] text-game-muted font-medium">
            ✨ Store Sandbox: Tap any item to test simulated purchase without real billing.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-game-card rounded-2xl border border-game-border mb-3">
          {(
            [
              { id: 'bundles', label: 'Bundles' },
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
                min-h-[40px] text-xs font-heading font-semibold rounded-xl transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-game-surface text-game-primary shadow-soft'
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
                  className="relative overflow-hidden border-2 border-pink-400/40"
                >
                  {prod.badge && (
                    <span className="absolute top-0 right-0 bg-game-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
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

        {/* 2. Gems Tab */}
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
                    className="flex flex-col items-center text-center relative"
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

        {/* 3. Glam Pass VIP Tab */}
        {activeTab === 'glam_pass' && (
          <div className="space-y-3">
            <Card variant="gradient" padding="md" className="border-2 border-amber-400/50">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-amber-500 fill-amber-400" />
                <h4 className="font-heading font-bold text-lg text-game-text">
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

        {/* 4. Remove Ads Tab */}
        {activeTab === 'remove_ads' && (
          <div className="space-y-3">
            <Card variant="surface" padding="lg" className="text-center">
              <div className="w-16 h-16 rounded-3xl bg-pink-100 dark:bg-pink-950/40 text-game-primary flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-lg text-game-text">
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
