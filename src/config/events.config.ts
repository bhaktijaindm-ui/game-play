/**
 * Glam Blocks: The Gulab Mahal Salon
 * Data-Driven Timed Events & Seasonal Pass Configuration
 * All original, date-driven, and configurable.
 */

export interface SeasonConfig {
  id: string;
  name: string;
  theme: 'diwali' | 'holi' | 'eid' | 'winter';
  startDate: string; // MM-DD
  endDate: string;   // MM-DD
  bannerTitle: string;
  bannerSubtitle: string;
  exclusiveLook: string;
}

export interface TimedEventConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  type: 'mini_game' | 'customer_rush' | 'palette_hunt' | 'multiplier';
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  goalTarget: number;
  rewardText: string;
  accentColor: string;
}

export const SEASONS_CONFIG: SeasonConfig[] = [
  {
    id: 'diwali_season',
    name: 'Diwali Gold Festival',
    theme: 'diwali',
    startDate: '10-01',
    endDate: '11-30',
    bannerTitle: 'Diwali Gold Pass 🪔',
    bannerSubtitle: 'Rangoli, diya lights, and royal bridal gold rewards',
    exclusiveLook: 'Royal Gulab Bride',
  },
  {
    id: 'winter_season',
    name: 'Winter Glow & New Year',
    theme: 'winter',
    startDate: '12-01',
    endDate: '01-31',
    bannerTitle: 'Winter Radiance Pass ❄️',
    bannerSubtitle: 'Frost champagne highlights and cozy salon fireplace warmth',
    exclusiveLook: 'Winter Frost Royalty',
  },
  {
    id: 'holi_season',
    name: 'Festival of Colors',
    theme: 'holi',
    startDate: '02-01',
    endDate: '04-10',
    bannerTitle: 'Holi Colors Pass 🎨',
    bannerSubtitle: 'Joyful botanical gulal powder gradients and spring blooms',
    exclusiveLook: 'Holi Bloom Radiance',
  },
  {
    id: 'eid_season',
    name: 'Eid & Spring Heritage',
    theme: 'eid',
    startDate: '04-11',
    endDate: '05-31',
    bannerTitle: 'Crescent Moon Pass 🌙',
    bannerSubtitle: 'Emerald elegance, rosewater mists, and fine silver foil',
    exclusiveLook: 'Crescent Night Radiance',
  },
];

export const TIMED_EVENTS: TimedEventConfig[] = [
  {
    id: 'festival_match',
    title: 'Festival Match',
    description: 'Swap adjacent makeup tiles to complete mascot collection orders!',
    icon: '🎪',
    badge: 'HOT',
    type: 'mini_game',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    goalTarget: 45,
    rewardText: '500 Coins + 25 Gems',
    accentColor: '#6A3FC8',
  },
  {
    id: 'bridal_rush',
    title: 'Bridal Rush',
    description: 'Serve 20 bridal customers to earn the exclusive Banarasi Silk look!',
    icon: '👰🏽',
    badge: 'EVENT',
    type: 'customer_rush',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    goalTarget: 20,
    rewardText: '1000 Coins + Zari Palette',
    accentColor: '#E6177F',
  },
  {
    id: 'palette_week',
    title: 'Palette Week',
    description: 'Clear 10 Pure Shade lines of a single color for double rewards!',
    icon: '🎨',
    type: 'palette_hunt',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    goalTarget: 10,
    rewardText: '300 Coins + 10 Gems',
    accentColor: '#F5B53C',
  },
  {
    id: 'double_coins_hour',
    title: 'Double Coins',
    description: 'Earn 2x coins on all completed customer orders!',
    icon: '⚡',
    badge: '2X',
    type: 'multiplier',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    goalTarget: 1,
    rewardText: '2x Coin Boost Active',
    accentColor: '#3FBF4F',
  },
];

/**
 * Returns the currently active season based on date.
 */
export function getActiveSeason(now = new Date()): SeasonConfig {
  const monthDay = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  for (const season of SEASONS_CONFIG) {
    if (season.startDate <= season.endDate) {
      if (monthDay >= season.startDate && monthDay <= season.endDate) {
        return season;
      }
    } else {
      // Wraps around year end (e.g. 12-01 to 01-31)
      if (monthDay >= season.startDate || monthDay <= season.endDate) {
        return season;
      }
    }
  }

  return SEASONS_CONFIG[0];
}

/**
 * Returns all currently active timed events.
 */
export function getActiveEvents(now = new Date()): TimedEventConfig[] {
  const dateStr = now.toISOString().slice(0, 10);
  return TIMED_EVENTS.filter(
    (ev) => dateStr >= ev.startDate && dateStr <= ev.endDate
  );
}
