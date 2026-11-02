/**
 * Glam Blocks - Makeup Shade Palette Configuration
 * Defines all 7 cosmetic shades with luminous gradients, high-fashion names,
 * accessible pattern indicators for colorblind mode, and face zone attributes.
 */

import type { ShadeId, FaceZone } from '../types';

export interface ShadeConfig {
  id: ShadeId;
  name: string;
  lightColor: string;
  darkColor: string;
  lightGloss: string;
  darkGloss: string;
  icon: string; // emoji or SVG path reference
  pattern: string; // for colorblind mode
}

export const SHADES: Record<ShadeId, ShadeConfig> = {
  rose: {
    id: 'rose',
    name: 'Rose Pink',
    lightColor: '#FF5C9E',
    darkColor: '#FF7DB4',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 92, 158, 0.95) 55%, #E0357F 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.50) 0%, rgba(255, 125, 180, 0.95) 55%, #D64288 100%)',
    icon: '💄',
    pattern: 'lips',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Violet',
    lightColor: '#9B6BFF',
    darkColor: '#B493FF',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.65) 0%, rgba(155, 107, 255, 0.95) 55%, #7A42EE 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.50) 0%, rgba(180, 147, 255, 0.95) 55%, #8C59F0 100%)',
    icon: '✨',
    pattern: 'sparkle',
  },
  peach: {
    id: 'peach',
    name: 'Peach Blush',
    lightColor: '#FF9E80',
    darkColor: '#FFB59E',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 158, 128, 0.95) 55%, #E66F4E 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.50) 0%, rgba(255, 181, 158, 0.95) 55%, #D97A5E 100%)',
    icon: '💖',
    pattern: 'heart',
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby Red',
    lightColor: '#E8344E',
    darkColor: '#FF566D',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.65) 0%, rgba(232, 52, 78, 0.95) 55%, #B71C35 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.50) 0%, rgba(255, 86, 109, 0.95) 55%, #C9203E 100%)',
    icon: '💧',
    pattern: 'drop',
  },
  gold: {
    id: 'gold',
    name: 'Champagne Gold',
    lightColor: '#F2B84B',
    darkColor: '#FFD27A',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.75) 0%, rgba(242, 184, 75, 0.95) 55%, #C28B20 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.60) 0%, rgba(255, 210, 122, 0.95) 55%, #C99933 100%)',
    icon: '⭐',
    pattern: 'star',
  },
  mint: {
    id: 'mint',
    name: 'Mint Green',
    lightColor: '#3FCB9B',
    darkColor: '#5DE0B4',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.65) 0%, rgba(63, 203, 155, 0.95) 55%, #1FA375 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.50) 0%, rgba(93, 224, 180, 0.95) 55%, #2EB88C 100%)',
    icon: '🌿',
    pattern: 'leaf',
  },
  sky: {
    id: 'sky',
    name: 'Sky Blue',
    lightColor: '#4DA3FF',
    darkColor: '#78BBFF',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.65) 0%, rgba(77, 163, 255, 0.95) 55%, #247DE0 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.50) 0%, rgba(120, 187, 255, 0.95) 55%, #3C8CE6 100%)',
    icon: '💎',
    pattern: 'diamond',
  },
  turmeric: {
    id: 'turmeric',
    name: 'Turmeric Haldi',
    lightColor: '#F5B700',
    darkColor: '#FFD043',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.70) 0%, #F5B700 55%, #D49B00 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.55) 0%, #FFD043 55%, #E5A800 100%)',
    icon: '☀️',
    pattern: 'sun',
  },
  henna: {
    id: 'henna',
    name: 'Mehendi Henna',
    lightColor: '#A24A22',
    darkColor: '#C46234',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.65) 0%, #A24A22 55%, #7D3412 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.50) 0%, #C46234 55%, #8C3E18 100%)',
    icon: '🍂',
    pattern: 'paisley',
  },
  berry: {
    id: 'berry',
    name: 'Sangeet Berry',
    lightColor: '#9C27B0',
    darkColor: '#BA68C8',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.65) 0%, #9C27B0 55%, #6A1B9A 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.50) 0%, #BA68C8 55%, #7B1FA2 100%)',
    icon: '🍇',
    pattern: 'circle',
  },
  crimson: {
    id: 'crimson',
    name: 'Bridal Crimson',
    lightColor: '#D32F2F',
    darkColor: '#EF5350',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.65) 0%, #D32F2F 55%, #B71C1C 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.50) 0%, #EF5350 55%, #C62828 100%)',
    icon: '💋',
    pattern: 'flame',
  },
  kohl: {
    id: 'kohl',
    name: 'Royal Kohl',
    lightColor: '#212121',
    darkColor: '#424242',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.40) 0%, #212121 55%, #000000 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.35) 0%, #424242 55%, #151515 100%)',
    icon: '👁️',
    pattern: 'crescent',
  },
  champagne: {
    id: 'champagne',
    name: 'Diwali Champagne',
    lightColor: '#F7E7CE',
    darkColor: '#FFF3E0',
    lightGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.85) 0%, #F7E7CE 55%, #DEC09A 100%)',
    darkGloss: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.70) 0%, #FFF3E0 55%, #E6C8A4 100%)',
    icon: '🥂',
    pattern: 'shimmer',
  },
};

export const SHADE_IDS: ShadeId[] = ['rose', 'lavender', 'peach', 'ruby', 'gold', 'mint', 'sky'];

export const SHADE_LIST: ShadeConfig[] = SHADE_IDS.map((id) => SHADES[id]);

/**
 * Retrieve configuration for a specific shade
 */
export function getShadeConfig(id: ShadeId): ShadeConfig {
  return SHADES[id];
}

/**
 * Maps a row or column index on an 8x8 grid to a FaceZone
 * Rows 0..2 -> Eyes (shadow, liner, highlight)
 * Rows 3..4 -> Cheeks (blush, contour, cheek highlighter)
 * Rows 5..7 -> Lips (velvet lipstick, gloss, liner)
 * Columns default symmetrically: 0..2 eyes, 3..4 cheeks, 5..7 lips
 */
export function getFaceZoneForIndex(index: number): FaceZone {
  if (index <= 2) {
    return 'eyes';
  }
  if (index <= 4) {
    return 'cheeks';
  }
  return 'lips';
}

/**
 * Pattern SVG paths for accessible colorblind indicators
 */
export const SHADE_PATTERNS: Record<string, string> = {
  lips: 'M3 8 C3 5, 6 4, 8 6 C10 4, 13 5, 13 8 C11 11, 5 11, 3 8 Z M5 8 C7 9, 9 9, 11 8',
  sparkle: 'M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z',
  heart: 'M8 14.5 C-3 6, 4 -2, 8 4 C12 -2, 19 6, 8 14.5 Z',
  drop: 'M8 2 C8 2, 2.5 8, 2.5 11 A5.5 5.5 0 0 0 13.5 11 C13.5 8, 8 2, 8 2 Z',
  star: 'M8 1 L10.2 5.5 L15 6.2 L11.5 9.6 L12.4 14.5 L8 12.2 L3.6 14.5 L4.5 9.6 L1 6.2 L5.8 5.5 Z',
  leaf: 'M3 13 C4 7, 9 4, 13 3 C13 7, 10 12, 3 13 Z M3 13 L8 8',
  diamond: 'M8 1.5 L14.5 8 L8 14.5 L1.5 8 Z',
};
