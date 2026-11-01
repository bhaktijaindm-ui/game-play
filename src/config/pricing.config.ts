/**
 * Glam Blocks - Centralized Monetization & Pricing Configuration (Phase 7)
 * Strictly single source of truth for all products, types, tiers, and regional pricing.
 */

export type ProductType = 'consumable' | 'non-consumable' | 'subscription';
export type RegionTier = 'IN' | 'TIER_1' | 'ROW'; // India, Tier 1 (US/UK/EU/CA/AU), Rest of World

export interface ProductReward {
  gems?: number;
  coins?: number;
  adsRemoved?: boolean;
  glamPassDays?: number;
  exclusiveLookId?: string;
}

export interface RegionalPrice {
  amount: number;
  currency: string;
  currencySymbol: string;
  formatted: string;
}

export interface ProductDefinition {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  reward: ProductReward;
  prices: Record<RegionTier, RegionalPrice>;
  badge?: string;
  popular?: boolean;
}

export const PRODUCTS: Record<string, ProductDefinition> = {
  starter_bundle: {
    id: 'starter_bundle',
    name: 'Starter Glam Bundle',
    description: '300 Gems + 1,500 Coins + Remove Ads forever',
    type: 'non-consumable',
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
    type: 'consumable',
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
    type: 'consumable',
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
    type: 'consumable',
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
    type: 'consumable',
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
    type: 'non-consumable',
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

/**
 * Detect player's region using standard Intl API & device locale
 */
export function detectUserRegionTier(): RegionTier {
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

    // Check Tier 1 countries: USA, UK, EU, Canada, Australia
    const tier1Locales = ['en-us', 'en-gb', 'en-ca', 'en-au', 'fr-fr', 'de-de', 'it-it', 'es-es', 'nl-nl', 'sv-se'];
    if (tier1Locales.some((t1) => locale.startsWith(t1))) {
      return 'TIER_1';
    }

    const tier1Zones = [
      'New_York',
      'Chicago',
      'Los_Angeles',
      'London',
      'Toronto',
      'Vancouver',
      'Sydney',
      'Melbourne',
      'Paris',
      'Berlin',
      'Rome',
      'Madrid',
      'Amsterdam',
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
 * Helper to get region-formatted price object for any product
 */
export function getProductDisplayPrice(productId: string, region?: RegionTier): RegionalPrice {
  const activeRegion = region || detectUserRegionTier();
  const product = PRODUCTS[productId];
  if (!product) {
    return { amount: 0, currency: 'USD', currencySymbol: '$', formatted: '$0.00' };
  }
  return product.prices[activeRegion] || product.prices['ROW'];
}
