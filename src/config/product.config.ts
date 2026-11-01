/**
 * Glam Blocks - Product Configuration & Specifications (Phase 1)
 */

export interface MakeupThemeItem {
  id: string;
  name: string;
  category: 'lipstick' | 'eyeshadow' | 'blush' | 'nail_polish' | 'highlighter' | 'eyeliner' | 'mint_skincare';
  colorHexLight: string;
  colorHexDark: string;
  glowColor: string;
  textColor: string;
  iconName: string;
  description: string;
}

export interface CollectibleLook {
  id: string;
  name: string;
  subtitle: string;
  requiredScore: number;
  level: number;
  isGlamPassExclusive?: boolean;
  avatarConfig: {
    skinTone: string;
    lipColor: string;
    eyeColor: string;
    eyeshadowColor: string;
    blushColor: string;
    eyelinerStyle: 'natural' | 'cat-eye' | 'bold-wing' | 'glam-star';
    highlighterGlow: string;
    accessory: 'none' | 'pearl-earrings' | 'gold-hoops' | 'diamond-tiara' | 'flower-pin' | 'choker';
    hairColor: string;
    backgroundAura: string;
  };
}

export const MAKEUP_THEME_ITEMS: Record<string, MakeupThemeItem> = {
  lipstick: {
    id: 'lipstick',
    name: 'Velvet Lipstick',
    category: 'lipstick',
    colorHexLight: '#E91E8C', // Hot Pink
    colorHexDark: '#FF4DAF',
    glowColor: 'rgba(233, 30, 140, 0.4)',
    textColor: '#FFFFFF',
    iconName: 'lipstick',
    description: 'Vibrant matte & satin lipsticks in striking pink shades',
  },
  eyeshadow: {
    id: 'eyeshadow',
    name: 'Eyeshadow Palette',
    category: 'eyeshadow',
    colorHexLight: '#9B5DE5', // Lavender / Violet
    colorHexDark: '#B388FF',
    glowColor: 'rgba(155, 93, 229, 0.4)',
    textColor: '#FFFFFF',
    iconName: 'eyeshadow',
    description: 'Chromatic multi-reflect shimmer powders',
  },
  blush: {
    id: 'blush',
    name: 'Peach Cheek Blush',
    category: 'blush',
    colorHexLight: '#FF8A65', // Peach
    colorHexDark: '#FFAB91',
    glowColor: 'rgba(255, 138, 101, 0.4)',
    textColor: '#FFFFFF',
    iconName: 'blush',
    description: 'Soft-focus luminous cheek drape powder',
  },
  nail_polish: {
    id: 'nail_polish',
    name: 'Lustre Nail Polish',
    category: 'nail_polish',
    colorHexLight: '#E5484D', // Crimson Red
    colorHexDark: '#FF6B6B',
    glowColor: 'rgba(229, 72, 77, 0.4)',
    textColor: '#FFFFFF',
    iconName: 'nail_polish',
    description: 'High-gloss lacquer with diamond resilience',
  },
  highlighter: {
    id: 'highlighter',
    name: 'Golden Highlighter',
    category: 'highlighter',
    colorHexLight: '#F5B700', // Gold
    colorHexDark: '#FFD166',
    glowColor: 'rgba(245, 183, 0, 0.45)',
    textColor: '#2B1B2E',
    iconName: 'highlighter',
    description: 'Champagne and 24k gold sunburst highlight drops',
  },
  eyeliner: {
    id: 'eyeliner',
    name: 'Precision Eyeliner',
    category: 'eyeliner',
    colorHexLight: '#2B1B2E', // Deep Noir
    colorHexDark: '#3E2A42',
    glowColor: 'rgba(43, 27, 46, 0.35)',
    textColor: '#FFFFFF',
    iconName: 'eyeliner',
    description: 'Waterproof obsidian felt-tip wing pen',
  },
  mint_skincare: {
    id: 'mint_skincare',
    name: 'Mint Facial Serum',
    category: 'mint_skincare',
    colorHexLight: '#2FBF71', // Mint Emerald
    colorHexDark: '#3DD68C',
    glowColor: 'rgba(47, 191, 113, 0.4)',
    textColor: '#FFFFFF',
    iconName: 'mint_skincare',
    description: 'Botanical cooling peptides and hydration mist',
  },
};

export const COLLECTIBLE_LOOKS: CollectibleLook[] = [
  {
    id: 'look_natural_glow',
    name: 'Natural Glow',
    subtitle: 'Fresh dewy finish for everyday elegance',
    requiredScore: 0,
    level: 1,
    avatarConfig: {
      skinTone: '#FCD5B5',
      lipColor: '#FF8A80',
      eyeColor: '#5D4037',
      eyeshadowColor: '#FFE0B2',
      blushColor: '#FFAB91',
      eyelinerStyle: 'natural',
      highlighterGlow: '#FFF9C4',
      accessory: 'none',
      hairColor: '#4E342E',
      backgroundAura: 'linear-gradient(135deg, #FFE4E6 0%, #FED7AA 100%)',
    },
  },
  {
    id: 'look_berry_chic',
    name: 'Berry Chic',
    subtitle: 'Deep plum hues with velvet undertones',
    requiredScore: 1500,
    level: 3,
    avatarConfig: {
      skinTone: '#F5D0C5',
      lipColor: '#C2185B',
      eyeColor: '#3E2723',
      eyeshadowColor: '#CE93D8',
      blushColor: '#F48FB1',
      eyelinerStyle: 'cat-eye',
      highlighterGlow: '#F8BBD0',
      accessory: 'pearl-earrings',
      hairColor: '#311B92',
      backgroundAura: 'linear-gradient(135deg, #FCE4EC 0%, #E1BEE7 100%)',
    },
  },
  {
    id: 'look_sunset_shimmer',
    name: 'Sunset Shimmer',
    subtitle: 'Warm coral blush matched with copper eyelids',
    requiredScore: 4000,
    level: 5,
    avatarConfig: {
      skinTone: '#E0AC69',
      lipColor: '#E64A19',
      eyeColor: '#263238',
      eyeshadowColor: '#FFB74D',
      blushColor: '#FF7043',
      eyelinerStyle: 'bold-wing',
      highlighterGlow: '#FFE082',
      accessory: 'gold-hoops',
      hairColor: '#BF360C',
      backgroundAura: 'linear-gradient(135deg, #FFF3E0 0%, #FFCCBC 100%)',
    },
  },
  {
    id: 'look_golden_goddess',
    name: 'Golden Goddess',
    subtitle: 'Dazzling 24K gold accents and sun-kissed contours',
    requiredScore: 8000,
    level: 8,
    avatarConfig: {
      skinTone: '#D7A15C',
      lipColor: '#D84315',
      eyeColor: '#33691E',
      eyeshadowColor: '#FFD54F',
      blushColor: '#FFA726',
      eyelinerStyle: 'glam-star',
      highlighterGlow: '#FFF59D',
      accessory: 'diamond-tiara',
      hairColor: '#F57F17',
      backgroundAura: 'linear-gradient(135deg, #FFF9C4 0%, #FFE082 100%)',
    },
  },
  {
    id: 'look_cyber_glam',
    name: 'Cyber Glam',
    subtitle: 'Futuristic neon accents with holographic wings',
    requiredScore: 15000,
    level: 12,
    avatarConfig: {
      skinTone: '#F3E5F5',
      lipColor: '#E91E8C',
      eyeColor: '#00E5FF',
      eyeshadowColor: '#7C4DFF',
      blushColor: '#FF4081',
      eyelinerStyle: 'bold-wing',
      highlighterGlow: '#E040FB',
      accessory: 'choker',
      hairColor: '#651FFF',
      backgroundAura: 'linear-gradient(135deg, #EA80FC 0%, #8C9EFF 100%)',
    },
  },
  {
    id: 'look_gothic_velvet',
    name: 'Gothic Velvet',
    subtitle: 'Dramatic smoked obsidian and dark mulberry pout',
    requiredScore: 25000,
    level: 16,
    avatarConfig: {
      skinTone: '#EFEBE9',
      lipColor: '#3E001F',
      eyeColor: '#212121',
      eyeshadowColor: '#424242',
      blushColor: '#880E4F',
      eyelinerStyle: 'bold-wing',
      highlighterGlow: '#CFD8DC',
      accessory: 'choker',
      hairColor: '#212121',
      backgroundAura: 'linear-gradient(135deg, #37474F 0%, #212121 100%)',
    },
  },
  {
    id: 'look_mint_blossom',
    name: 'Mint Blossom',
    subtitle: 'Pastel botanical harmony with rose quartz highlights',
    requiredScore: 40000,
    level: 20,
    avatarConfig: {
      skinTone: '#FBE9E7',
      lipColor: '#F06292',
      eyeColor: '#00796B',
      eyeshadowColor: '#80CBC4',
      blushColor: '#FF8A80',
      eyelinerStyle: 'natural',
      highlighterGlow: '#B2DFDB',
      accessory: 'flower-pin',
      hairColor: '#004D40',
      backgroundAura: 'linear-gradient(135deg, #E0F2F1 0%, #F8BBD0 100%)',
    },
  },
  {
    id: 'look_royal_empress',
    name: 'Royal Empress',
    subtitle: 'Exclusive imperial luxury crowned in diamonds and rubies',
    requiredScore: 50000,
    level: 25,
    isGlamPassExclusive: true,
    avatarConfig: {
      skinTone: '#E8D5C4',
      lipColor: '#B71C1C',
      eyeColor: '#4A148C',
      eyeshadowColor: '#FFD700',
      blushColor: '#AD1457',
      eyelinerStyle: 'glam-star',
      highlighterGlow: '#FFF9C4',
      accessory: 'diamond-tiara',
      hairColor: '#1A237E',
      backgroundAura: 'linear-gradient(135deg, #FFD700 0%, #FF80AB 50%, #7C4DFF 100%)',
    },
  },
];

export const GAME_RULES = {
  BOARD_SIZE: 8,
  TRAY_CAPACITY: 3,
  POINTS_PER_CELL: 10,
  POINTS_PER_LINE: 100,
  COMBO_MULTIPLIERS: [1, 2, 3, 4, 5] as const,
  BOARD_CLEAR_BONUS: 500,
  CONTINUE_COST_GEMS: 50,
  POWERUPS: {
    UNDO: { id: 'undo', name: 'Undo', costCoins: 150, freeWithGlamPass: 1 },
    SHUFFLE: { id: 'shuffle', name: 'Shuffle', costCoins: 200 },
    BOMB: { id: 'bomb', name: 'Glam Bomb', costCoins: 350 },
  },
};
