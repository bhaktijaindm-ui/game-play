import { describe, it, expect } from 'vitest';
import {
  PRODUCTS,
  PRODUCT_LIST,
  detectUserRegion,
  getPrice,
  formatPrice,
  MockBillingProvider,
} from '../../src/config/pricing.config';
import { shouldShowInterstitial, MockAdsProvider } from '../../src/services/ads';

describe('Phase 7: Pricing, Monetization & Ads Provider', () => {
  it('contains at least 10 products across gem packs, bundles, and passes', () => {
    expect(PRODUCT_LIST.length).toBeGreaterThanOrEqual(10);
    expect(PRODUCTS.starter_bundle).toBeDefined();
    expect(PRODUCTS.gem_pack_s).toBeDefined();
    expect(PRODUCTS.gem_pack_m).toBeDefined();
    expect(PRODUCTS.gem_pack_l).toBeDefined();
    expect(PRODUCTS.gem_pack_xl).toBeDefined();
    expect(PRODUCTS.remove_ads).toBeDefined();
    expect(PRODUCTS.glam_pass_monthly).toBeDefined();
    expect(PRODUCTS.energy_refill_pack).toBeDefined();
    expect(PRODUCTS.bridal_look_pack).toBeDefined();
    expect(PRODUCTS.salon_master_bundle).toBeDefined();
  });

  it('provides prices in INR (₹) for India and USD ($) for Tier 1 and ROW', () => {
    const starterIn = getPrice('starter_bundle', 'IN');
    expect(starterIn.currency).toBe('INR');
    expect(starterIn.currencySymbol).toBe('₹');
    expect(starterIn.amount).toBe(99);

    const starterT1 = getPrice('starter_bundle', 'TIER_1');
    expect(starterT1.currency).toBe('USD');
    expect(starterT1.currencySymbol).toBe('$');
    expect(starterT1.amount).toBe(1.99);

    const starterRow = getPrice('starter_bundle', 'ROW');
    expect(starterRow.currency).toBe('USD');
    expect(starterRow.amount).toBe(1.49);
  });

  it('correctly detects region and formats currency values', () => {
    const region = detectUserRegion();
    expect(['IN', 'TIER_1', 'ROW']).toContain(region);

    const formattedIn = formatPrice(99, 'INR');
    expect(formattedIn).toContain('99');

    const formattedUsd = formatPrice(1.99, 'USD');
    expect(formattedUsd).toContain('1.99');
  });

  it('strictly enforces interstitial ad display rules', () => {
    // 1. Never if ads removed
    expect(shouldShowInterstitial(3, true, false)).toBe(false);
    expect(shouldShowInterstitial(6, true, false)).toBe(false);

    // 2. Never if has active Glam Pass
    expect(shouldShowInterstitial(3, false, true)).toBe(false);
    expect(shouldShowInterstitial(6, false, true)).toBe(false);

    // 3. Never in first 3 games
    expect(shouldShowInterstitial(0, false, false)).toBe(false);
    expect(shouldShowInterstitial(1, false, false)).toBe(false);
    expect(shouldShowInterstitial(2, false, false)).toBe(false);

    // 4. Shows on game 3, 6, 9, 12...
    expect(shouldShowInterstitial(3, false, false)).toBe(true);
    expect(shouldShowInterstitial(4, false, false)).toBe(false);
    expect(shouldShowInterstitial(5, false, false)).toBe(false);
    expect(shouldShowInterstitial(6, false, false)).toBe(true);
  });

  it('validates mock billing provider functionality', async () => {
    const billing = new MockBillingProvider();
    expect(billing.isAvailable()).toBe(true);

    const result = await billing.purchaseProduct('starter_bundle');
    expect(result.success).toBe(true);
    expect(result.productId).toBe('starter_bundle');
    expect(result.isMock).toBe(true);
    expect(result.purchaseToken).toBeDefined();
  });

  it('validates mock ads provider readiness', () => {
    const ads = new MockAdsProvider();
    expect(ads.isReady()).toBe(true);
    expect(ads.canShowAds(false)).toBe(true);
    expect(ads.canShowAds(true)).toBe(false);
  });
});
