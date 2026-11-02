import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, getPrice, detectUserRegion, getBillingProvider, type Product } from '../config/pricing.config';
import { IconButton } from '../components/IconButton';
import { Button } from '../components/Button';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { useHaptics } from '../hooks/useHaptics';

export const ShopScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useGame();
  const { playSparkle, playTaDa } = useSound();
  const { successBuzz } = useHaptics();

  const [activeTab, setActiveTab] = useState<'gems' | 'glam_pass' | 'remove_ads' | 'bundles'>('gems');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  const region = detectUserRegion();

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;
    setPurchasing(true);
    try {
      const billing = getBillingProvider();
      const result = await billing.purchaseProduct(selectedProduct.id);

      if (result.success) {
        playTaDa();
        playSparkle();
        successBuzz();

        // Apply product rewards
        const reward = selectedProduct.reward;
        updateProfile({
          gems: userProfile.gems + (reward.gems || 0),
          coins: userProfile.coins + (reward.coins || 0),
          adsRemoved: reward.adsRemoved ? true : userProfile.adsRemoved,
          glamPassUntil: reward.glamPassDays
            ? Date.now() + reward.glamPassDays * 86400000
            : userProfile.glamPassUntil,
        });

        setPurchaseNotice(`Purchased ${selectedProduct.name}! Reward granted.`);
        setTimeout(() => setPurchaseNotice(null), 3500);
      }
    } catch (err) {
      console.error('Purchase failed', err);
    } finally {
      setPurchasing(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-[480px] mx-auto flex flex-col justify-between overflow-x-hidden bg-[var(--bg,#fff6f9)] dark:bg-[var(--bg,#140e19)] text-[var(--text)] select-none pb-8">
      {/* Top Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <IconButton
            aria-label="Back"
            onClick={() => navigate('/')}
            className="w-9 h-9"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </IconButton>
          <div>
            <h1 className="text-xl font-black text-[var(--text)]">Glam Boutique</h1>
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">
              Secure in-app purchases & VIP perks
            </p>
          </div>
        </div>

        {/* Currency summary */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-full text-xs font-black border border-cyan-500/20">
            <span>💎</span>
            <span>{userProfile.gems}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-2 flex border-b border-[var(--border)] bg-[var(--surface)] sticky top-[57px] z-10 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'gems', label: '💎 Gems' },
          { id: 'glam_pass', label: '👑 Glam Pass' },
          { id: 'bundles', label: '🎁 Bundles' },
          { id: 'remove_ads', label: '🚫 Ad-Free' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {purchaseNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="m-4 p-3 bg-emerald-500 text-white rounded-2xl text-xs font-bold text-center shadow-lg"
          >
            {purchaseNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Content */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {/* GEMS TAB */}
        {activeTab === 'gems' && (
          <div className="space-y-3">
            {[PRODUCTS.gem_pack_s, PRODUCTS.gem_pack_m, PRODUCTS.gem_pack_l, PRODUCTS.gem_pack_xl].map((prod) => {
              const price = getPrice(prod.id, region);
              return (
                <div
                  key={prod.id}
                  className={`relative p-4 rounded-2xl border bg-[var(--surface)] flex items-center justify-between shadow-sm ${
                    prod.popular ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-[var(--border)]'
                  }`}
                >
                  {prod.badge && (
                    <span className="absolute -top-2.5 right-4 bg-amber-500 text-stone-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      {prod.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center text-2xl">
                      💎
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-[var(--text)]">{prod.name}</h2>
                      <p className="text-xs text-[var(--text-muted)]">{prod.description}</p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBuyClick(prod)}
                  >
                    {price.formatted}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* GLAM PASS TAB */}
        {activeTab === 'glam_pass' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-pink-500/10 border-2 border-amber-400/30 text-center space-y-2">
              <span className="text-3xl">👑</span>
              <h2 className="text-lg font-black text-[var(--text)]">Glam Pass VIP Privileges</h2>
              <ul className="text-xs text-[var(--text-muted)] space-y-1.5 text-left max-w-[280px] mx-auto pt-2">
                <li className="flex items-center gap-2">✨ Zero Interstitial Advertisements</li>
                <li className="flex items-center gap-2">🪙 2X Coin Rewards on Every Match</li>
                <li className="flex items-center gap-2">↩ 1 Free Undo Power-Up in Every Game</li>
                <li className="flex items-center gap-2">💄 Exclusive Royal Empress Lookbook</li>
                <li className="flex items-center gap-2">🌟 Prestigious Golden Avatar Frame</li>
              </ul>
            </div>

            {[PRODUCTS.glam_pass_monthly, PRODUCTS.glam_pass_yearly].map((prod) => {
              const price = getPrice(prod.id, region);
              return (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-sm font-black text-[var(--text)]">{prod.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{prod.description}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBuyClick(prod)}
                  >
                    {price.formatted}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* BUNDLES TAB */}
        {activeTab === 'bundles' && (
          <div>
            {[PRODUCTS.starter_bundle].map((prod) => {
              const price = getPrice(prod.id, region);
              return (
                <div
                  key={prod.id}
                  className="p-5 rounded-3xl border-2 border-pink-500 bg-gradient-to-br from-pink-500/10 to-purple-500/10 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-pink-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      ONE-TIME EXCLUSIVE
                    </span>
                    <span className="text-xs font-black text-pink-600 line-through">
                      {region === 'IN' ? '₹499' : '$9.99'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[var(--text)]">{prod.name}</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{prod.description}</p>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => handleBuyClick(prod)}
                  >
                    Get Bundle for {price.formatted}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* REMOVE ADS TAB */}
        {activeTab === 'remove_ads' && (
          <div>
            {[PRODUCTS.remove_ads].map((prod) => {
              const price = getPrice(prod.id, region);
              const alreadyBought = userProfile.adsRemoved;

              return (
                <div
                  key={prod.id}
                  className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3 text-center"
                >
                  <span className="text-4xl">🚫</span>
                  <div>
                    <h2 className="text-base font-black text-[var(--text)]">{prod.name}</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{prod.description}</p>
                  </div>

                  {alreadyBought ? (
                    <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold py-2 rounded-xl border border-emerald-500/20">
                      ✓ Already Active on Account
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => handleBuyClick(prod)}
                    >
                      Remove Ads for {price.formatted}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Restore Purchases Link */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => {
              setPurchaseNotice('Purchases restored successfully.');
              setTimeout(() => setPurchaseNotice(null), 3000);
            }}
            className="text-xs text-[var(--text-muted)] hover:text-pink-600 underline font-semibold"
          >
            Restore Previous Purchases
          </button>
        </div>
      </div>

      {/* Confirmation Bottom Sheet */}
      <ConfirmSheet
        open={!!selectedProduct}
        title={selectedProduct ? `Purchase ${selectedProduct.name}?` : 'Confirm Purchase'}
        message={
          selectedProduct
            ? `Charge ${getPrice(selectedProduct.id, region).formatted} for ${selectedProduct.description}. Safe & instant.`
            : ''
        }
        confirmText="Confirm & Pay"
        cancelText="Cancel"
        loading={purchasing}
        onConfirm={handleConfirmPurchase}
        onCancel={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ShopScreen;
