import { describe, it, expect } from 'vitest';
import {
  PRODUCTS,
  getProductDisplayPrice,
  detectUserRegionTier,
} from '../src/config/pricing.config';
import {
  getBillingProvider,
  MockBillingProvider,
  PlayBillingProvider,
} from '../src/services/billing';

describe('Pricing and Billing Unit Tests', () => {
  it('defines all required products and types', () => {
    expect(PRODUCTS.starter_bundle).toBeDefined();
    expect(PRODUCTS.starter_bundle.type).toBe('non-consumable');

    expect(PRODUCTS.gem_pack_s).toBeDefined();
    expect(PRODUCTS.gem_pack_s.type).toBe('consumable');

    expect(PRODUCTS.gem_pack_m).toBeDefined();
    expect(PRODUCTS.gem_pack_l).toBeDefined();
    expect(PRODUCTS.gem_pack_xl).toBeDefined();

    expect(PRODUCTS.remove_ads).toBeDefined();
    expect(PRODUCTS.remove_ads.type).toBe('non-consumable');

    expect(PRODUCTS.glam_pass_monthly).toBeDefined();
    expect(PRODUCTS.glam_pass_monthly.type).toBe('subscription');

    expect(PRODUCTS.glam_pass_yearly).toBeDefined();
    expect(PRODUCTS.glam_pass_yearly.type).toBe('subscription');
  });

  it('selects correct prices for India (INR) tier', () => {
    const starterPrice = getProductDisplayPrice('starter_bundle', 'IN');
    expect(starterPrice.currency).toBe('INR');
    expect(starterPrice.amount).toBe(99);
    expect(starterPrice.formatted).toBe('₹99');

    const gemSPrice = getProductDisplayPrice('gem_pack_s', 'IN');
    expect(gemSPrice.amount).toBe(49);
    expect(gemSPrice.formatted).toBe('₹49');

    const removeAdsPrice = getProductDisplayPrice('remove_ads', 'IN');
    expect(removeAdsPrice.amount).toBe(149);
    expect(removeAdsPrice.formatted).toBe('₹149');

    const passMonthly = getProductDisplayPrice('glam_pass_monthly', 'IN');
    expect(passMonthly.amount).toBe(79);
    expect(passMonthly.formatted).toBe('₹79/mo');
  });

  it('selects correct prices for USA / Tier 1 (USD) tier', () => {
    const starterPrice = getProductDisplayPrice('starter_bundle', 'TIER_1');
    expect(starterPrice.currency).toBe('USD');
    expect(starterPrice.amount).toBe(1.99);
    expect(starterPrice.formatted).toBe('$1.99');

    const gemSPrice = getProductDisplayPrice('gem_pack_s', 'TIER_1');
    expect(gemSPrice.amount).toBe(0.99);
    expect(gemSPrice.formatted).toBe('$0.99');

    const passYearly = getProductDisplayPrice('glam_pass_yearly', 'TIER_1');
    expect(passYearly.amount).toBe(19.99);
    expect(passYearly.formatted).toBe('$19.99/yr');
  });

  it('selects correct prices for Rest of World (USD) tier', () => {
    const starterPrice = getProductDisplayPrice('starter_bundle', 'ROW');
    expect(starterPrice.currency).toBe('USD');
    expect(starterPrice.amount).toBe(1.49);
    expect(starterPrice.formatted).toBe('$1.49');

    const gemSPrice = getProductDisplayPrice('gem_pack_s', 'ROW');
    expect(gemSPrice.amount).toBe(0.79);
    expect(gemSPrice.formatted).toBe('$0.79');
  });

  it('falls back to MockBillingProvider when Digital Goods API is unavailable in browser', () => {
    const provider = getBillingProvider();
    expect(provider).toBeInstanceOf(MockBillingProvider);
    expect(provider.isAvailable()).toBe(true);
  });

  it('executes mock purchase successfully with demo token', async () => {
    const mockBilling = new MockBillingProvider();
    const result = await mockBilling.purchaseProduct('gem_pack_s');

    expect(result.success).toBe(true);
    expect(result.isMock).toBe(true);
    expect(result.productId).toBe('gem_pack_s');
    expect(result.purchaseToken).toBeDefined();
    expect(result.purchaseToken).toContain('mock_token_');
  });
});
