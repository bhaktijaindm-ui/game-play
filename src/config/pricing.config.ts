/**
 * Glam Blocks - Centralized Monetization & Regional Pricing Configuration
 * Single source of truth for products, pricing tiers, region detection,
 * and billing providers (Google Play Billing + 3-second Mock Sandbox).
 */

import type {
  Product,
  ProductType,
  ProductReward,
  RegionTier,
  RegionalPrice,
  PurchaseResult,
  BillingProvider,
} from '../types';

export type { Product, ProductType, ProductReward, RegionTier, RegionalPrice, PurchaseResult, BillingProvider };

export const PRODUCTS: Record<string, Product> = {
  starter_bundle: {
    id: 'starter_bundle',
    name: 'Starter Glam Bundle',
    description: '300 Gems + 1,500 Coins + Remove Ads forever',
    type: 'one_time',
    badge: '80% OFF',
    popular: true,
    reward: {
      gems: 300,
      coins: 1500,
      adsRemoved: true,
    },
    prices: {
      IN: { amount: 99, currency: 'INR', currencySymbol: '₹', formatted: '₹99' },
      TIER_1: { amount: 1.99, currency: 'USD', currencySymbol: '$', formatted: '$1.99' },
      ROW: { amount: 1.49, currency: 'USD', currencySymbol: '$', formatted: '$1.49' },
    },
  },
  gem_pack_s: {
    id: 'gem_pack_s',
    name: 'Glam Gem Pouch',
    description: '100 Sparkling Gems',
    type: 'gem_pack',
    reward: { gems: 100 },
    prices: {
      IN: { amount: 49, currency: 'INR', currencySymbol: '₹', formatted: '₹49' },
      TIER_1: { amount: 0.99, currency: 'USD', currencySymbol: '$', formatted: '$0.99' },
      ROW: { amount: 0.79, currency: 'USD', currencySymbol: '$', formatted: '$0.79' },
    },
  },
  gem_pack_m: {
    id: 'gem_pack_m',
    name: 'Glam Gem Box',
    description: '550 Sparkling Gems (+10% Bonus)',
    type: 'gem_pack',
    popular: true,
    reward: { gems: 550 },
    prices: {
      IN: { amount: 199, currency: 'INR', currencySymbol: '₹', formatted: '₹199' },
      TIER_1: { amount: 3.99, currency: 'USD', currencySymbol: '$', formatted: '$3.99' },
      ROW: { amount: 2.99, currency: 'USD', currencySymbol: '$', formatted: '$2.99' },
    },
  },
  gem_pack_l: {
    id: 'gem_pack_l',
    name: 'Glam Vanity Chest',
    description: '1,200 Sparkling Gems (+20% Bonus)',
    type: 'gem_pack',
    reward: { gems: 1200 },
    prices: {
      IN: { amount: 399, currency: 'INR', currencySymbol: '₹', formatted: '₹399' },
      TIER_1: { amount: 7.99, currency: 'USD', currencySymbol: '$', formatted: '$7.99' },
      ROW: { amount: 5.99, currency: 'USD', currencySymbol: '$', formatted: '$5.99' },
    },
  },
  gem_pack_xl: {
    id: 'gem_pack_xl',
    name: 'Royal Diamond Vault',
    description: '3,000 Sparkling Gems (+35% Bonus)',
    type: 'gem_pack',
    badge: 'BEST VALUE',
    reward: { gems: 3000 },
    prices: {
      IN: { amount: 899, currency: 'INR', currencySymbol: '₹', formatted: '₹899' },
      TIER_1: { amount: 17.99, currency: 'USD', currencySymbol: '$', formatted: '$17.99' },
      ROW: { amount: 12.99, currency: 'USD', currencySymbol: '$', formatted: '$12.99' },
    },
  },
  remove_ads: {
    id: 'remove_ads',
    name: 'Ad-Free Luxury',
    description: 'Permanently removes all interstitial ads',
    type: 'one_time',
    reward: { adsRemoved: true },
    prices: {
      IN: { amount: 149, currency: 'INR', currencySymbol: '₹', formatted: '₹149' },
      TIER_1: { amount: 2.99, currency: 'USD', currencySymbol: '$', formatted: '$2.99' },
      ROW: { amount: 1.99, currency: 'USD', currencySymbol: '$', formatted: '$1.99' },
    },
  },
  glam_pass_monthly: {
    id: 'glam_pass_monthly',
    name: 'Glam Pass Monthly',
    description: 'No ads, 2x coins, 1 free Undo/game, Royal Look, Golden Frame (30 days)',
    type: 'subscription',
    popular: true,
    reward: {
      glamPassDays: 30,
      adsRemoved: true,
      exclusiveLookId: 'look_royal_empress',
    },
    prices: {
      IN: { amount: 79, currency: 'INR', currencySymbol: '₹', formatted: '₹79/mo' },
      TIER_1: { amount: 2.99, currency: 'USD', currencySymbol: '$', formatted: '$2.99/mo' },
      ROW: { amount: 1.99, currency: 'USD', currencySymbol: '$', formatted: '$1.99/mo' },
    },
  },
  glam_pass_yearly: {
    id: 'glam_pass_yearly',
    name: 'Glam Pass VIP Yearly',
    description: 'Full Glam Pass benefits for 365 days (save 40%)',
    type: 'subscription',
    badge: 'SAVE 40%',
    reward: {
      glamPassDays: 365,
      adsRemoved: true,
      exclusiveLookId: 'look_royal_empress',
    },
    prices: {
      IN: { amount: 599, currency: 'INR', currencySymbol: '₹', formatted: '₹599/yr' },
      TIER_1: { amount: 19.99, currency: 'USD', currencySymbol: '$', formatted: '$19.99/yr' },
      ROW: { amount: 12.99, currency: 'USD', currencySymbol: '$', formatted: '$12.99/yr' },
    },
  },
};

export const PRODUCT_LIST: Product[] = Object.values(PRODUCTS);

/**
 * Detect player's region tier from navigator.language / locale and timezone.
 * IN: India
 * TIER_1: US, UK, Canada, Australia, EU Tier 1
 * ROW: Rest of World
 */
export function detectUserRegion(): RegionTier {
  if (typeof window === 'undefined') {
    return 'ROW';
  }

  try {
    const locale = (navigator.language || '').toLowerCase();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    // Check India
    if (
      locale.includes('in') ||
      locale.includes('hi') ||
      timeZone.includes('Calcutta') ||
      timeZone.includes('Kolkata') ||
      timeZone.includes('India')
    ) {
      return 'IN';
    }

    // Check Tier 1
    const tier1Locales = [
      'en-us', 'en-gb', 'en-ca', 'en-au', 'en-nz',
      'fr-fr', 'de-de', 'it-it', 'es-es', 'nl-nl',
      'sv-se', 'da-dk', 'nb-no', 'nn-no', 'fi-fi',
    ];
    if (tier1Locales.some((t1) => locale.startsWith(t1))) {
      return 'TIER_1';
    }

    const tier1Zones = [
      'New_York', 'Chicago', 'Los_Angeles', 'Denver', 'Phoenix', 'Anchorage', 'Honolulu',
      'London', 'Toronto', 'Vancouver', 'Montreal', 'Sydney', 'Melbourne', 'Brisbane',
      'Perth', 'Auckland', 'Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Stockholm',
      'Copenhagen', 'Oslo', 'Helsinki', 'Zurich', 'Vienna', 'Dublin', 'Brussels',
    ];
    if (tier1Zones.some((tz) => timeZone.includes(tz))) {
      return 'TIER_1';
    }
  } catch {
    // Default fallback
  }

  return 'ROW';
}

/**
 * Formats a monetary amount into a clean currency string.
 */
export function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
  }
}

/**
 * Retrieve the RegionalPrice for a product given an optional region override.
 */
export function getPrice(productId: string, region?: RegionTier): RegionalPrice {
  const activeRegion = region || detectUserRegion();
  const product = PRODUCTS[productId];
  if (!product) {
    return {
      amount: 0,
      currency: 'USD',
      currencySymbol: '$',
      formatted: '$0.00',
    };
  }

  return product.prices[activeRegion] || product.prices.ROW;
}

/**
 * Google Play Store Digital Goods API Provider (for TWA / Google Play packaging)
 */
export class PlayBillingProvider implements BillingProvider {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'getDigitalGoodsService' in window;
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    try {
      const windowWithDGS = window as unknown as {
        getDigitalGoodsService?: (scope: string) => Promise<{
          getDetails: (itemIds: string[]) => Promise<unknown>;
        }>;
      };

      if (!windowWithDGS.getDigitalGoodsService) {
        throw new Error('Digital Goods Service is not supported on this browser/environment.');
      }

      const service = await windowWithDGS.getDigitalGoodsService('https://play.google.com/billing');
      if (!service) {
        throw new Error('Failed to connect to Google Play Digital Goods Service.');
      }

      const product = PRODUCTS[productId];
      const region = detectUserRegion();
      const regionalPrice = product ? product.prices[region] : { amount: 0.99, currency: 'USD' };

      const paymentMethodData = [
        {
          supportedMethods: 'https://play.google.com/billing',
          data: { sku: productId },
        },
      ];

      const request = new PaymentRequest(paymentMethodData, {
        total: {
          label: product?.name || 'Glam Blocks Purchase',
          amount: {
            currency: regionalPrice.currency,
            value: regionalPrice.amount.toString(),
          },
        },
      });

      const response = await request.show();
      await response.complete('success');

      return {
        success: true,
        productId,
        purchaseToken: `play_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        isMock: false,
      };
    } catch (err) {
      return {
        success: false,
        productId,
        isMock: false,
        error: (err as Error).message || 'Play Store purchase cancelled or failed',
      };
    }
  }

  async purchase(productId: string): Promise<PurchaseResult> {
    return this.purchaseProduct(productId);
  }
}

/**
 * Mock Billing Provider for web sandbox & development.
 * Simulates a 3-second realistic purchase latency with mock token generation.
 */
export class MockBillingProvider implements BillingProvider {
  isAvailable(): boolean {
    return true;
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    // 3-second simulated purchase network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const product = PRODUCTS[productId];
    if (!product) {
      return {
        success: false,
        productId,
        isMock: true,
        error: `Product not found: ${productId}`,
      };
    }

    return {
      success: true,
      productId,
      purchaseToken: `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      isMock: true,
    };
  }

  async purchase(productId: string): Promise<PurchaseResult> {
    return this.purchaseProduct(productId);
  }
}

/**
 * Factory returning the best available billing provider
 */
export function getBillingProvider(): BillingProvider {
  const play = new PlayBillingProvider();
  if (play.isAvailable()) {
    return play;
  }
  return new MockBillingProvider();
}
