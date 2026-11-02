/**
 * Glam Blocks: The Gulab Mahal Salon
 * Story, Character & Rang Book Data System
 * All original, wholesome, 100% compliant with Phase 1 specification.
 */

import type { FaceRecipe, ShadeId } from '../types';

export type CharacterId =
  | 'anaya'
  | 'zoya'
  | 'kabir'
  | 'tara'
  | 'kajal'
  | 'rhea'
  | 'uncle_dev'
  | 'mrs_kapoor'
  | 'priya'
  | 'simran'
  | 'meera'
  | 'diya'
  | 'shanti'
  | 'rohit'
  | 'fatima'
  | 'aisha'
  | 'dr_neha'
  | 'babli'
  | 'host'
  | 'audience';

export type CharacterExpression =
  | 'normal'
  | 'happy'
  | 'determined'
  | 'surprised'
  | 'proud'
  | 'calm'
  | 'laughing'
  | 'thinking';

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  role: string;
  appearance: string;
  personality: string;
  color: string;
  avatarFallback: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  role: string;
  avatarKey: string;
  skinTone: 'fair' | 'wheatish' | 'medium' | 'tan' | 'deep' | 'dark';
  preferredShades: ShadeId[];
  quirk: string;
  catchphrase: string;
  defaultFaceModel: string;
}

export interface RangBookPage {
  id: number;
  title: string;
  chapter: number;
  lore: string;
  keyShades: ShadeId[];
  zoneFocus: string;
  recipePreview: FaceRecipe;
  unlockedByDefault?: boolean;
}

export interface DialogueCard {
  id: string;
  speaker: string;
  characterId: CharacterId;
  expression: CharacterExpression;
  text: string;
}

export interface Scene {
  id: number;
  chapterId: number;
  title: string;
  cards: DialogueCard[];
  unlockArea?: string;
  unlockRangBookPage?: number;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  unlockedArea: string;
  rangBookPages: number[];
  scenes: Scene[];
}

// ============================================================================
// 1. Core Characters
// ============================================================================

export const CORE_CHARACTERS: Record<string, CharacterInfo> = {
  anaya: {
    id: 'anaya',
    name: 'Anaya Sharma',
    role: 'Salon Owner & Heroine (Age 26)',
    appearance: 'Wavy dark-brown hair with a magenta streak, kind hazel eyes, rose-pink salon apron over a black tee, gold bangles.',
    personality: 'Warm, determined, creative listener who believes makeup celebrates natural self-expression.',
    color: '#E6177F',
    avatarFallback: '👩🏽‍🦱',
  },
  zoya: {
    id: 'zoya',
    name: 'Zoya Akhtar',
    role: 'Best Friend & Nail Artist (Age 25)',
    appearance: 'Short bouncy curly hair, mint-green linen co-ord set, colorful rings on every finger, coral sneakers.',
    personality: 'Bubbly, fiercely loyal, trendsetter, energetic comic relief.',
    color: '#34D399',
    avatarFallback: '💅🏽',
  },
  kabir: {
    id: 'kabir',
    name: 'Kabir Sen',
    role: 'Handyman & Craftsman (Age 27)',
    appearance: 'Round wire glasses, rolled-up denim jacket, heavy-duty leather tool belt, warm crooked grin.',
    personality: 'Cheerful, reliable, inventive maker who can fix any antique mirror or salon station.',
    color: '#3DA9FC',
    avatarFallback: '🔧',
  },
  tara: {
    id: 'tara',
    name: 'Tara-ji',
    role: 'Mentor & Veteran Master Artist (Age 62)',
    appearance: 'Impeccable silver bob, crisp handloom cotton saree with silver zari, oversized reading glasses.',
    personality: 'Wise, affectionate, dry wit, culinary storyteller, Nani’s closest apprentice in the 1980s.',
    color: '#8E5CF2',
    avatarFallback: '👵🏽',
  },
  kajal: {
    id: 'kajal',
    name: 'Kajal',
    role: 'Salon Mascot & Lucky Cat',
    appearance: 'Velvet-black fur, amber eyes, tiny gold bell collar that jingles softly.',
    personality: 'Curious, regal, nap connoisseur, loves sleeping on empty velvet chairs.',
    color: '#F5B53C',
    avatarFallback: '🐈‍⬛',
  },
  rhea: {
    id: 'rhea',
    name: 'Rhea Mehra',
    role: 'Friendly Rival & Lumiere Owner (Age 28)',
    appearance: 'Sleek razor-sharp bob, impeccably tailored pastel blazers, pearl studs, digital tablet stylus.',
    personality: 'Ambitious, polished, competitive perfectionist who becomes a trusted collaborative partner.',
    color: '#EC4899',
    avatarFallback: '💼',
  },
};

// ============================================================================
// 2. The 12 Recurring Customers
// ============================================================================

export const RECURRING_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'mrs_kapoor',
    name: 'Mrs. Kapoor',
    role: 'Society Auntie & Gossip Connoisseur',
    avatarKey: 'customer_1',
    skinTone: 'wheatish',
    preferredShades: ['ruby', 'gold'],
    quirk: 'Knows every piece of town news before it happens.',
    catchphrase: 'Tell me everything, beta, before my blow-dry sets!',
    defaultFaceModel: 'wheatish',
  },
  {
    id: 'priya',
    name: 'Priya',
    role: 'Anxious University Graduate',
    avatarKey: 'customer_2',
    skinTone: 'fair',
    preferredShades: ['peach', 'rose'],
    quirk: 'Quotes interview prep guides between brushstrokes.',
    catchphrase: 'Will this look professional enough for my thesis defense?',
    defaultFaceModel: 'fair',
  },
  {
    id: 'simran',
    name: 'Simran',
    role: 'Kathak & Bollywood Dance Instructor',
    avatarKey: 'customer_3',
    skinTone: 'medium',
    preferredShades: ['ruby', 'sky'],
    quirk: 'Counts dance beats while checking her eyeliner wings.',
    catchphrase: 'If it can survive twelve pirouettes, it’s good!',
    defaultFaceModel: 'medium',
  },
  {
    id: 'meera',
    name: 'Meera',
    role: 'Corporate Litigation Lawyer',
    avatarKey: 'customer_4',
    skinTone: 'tan',
    preferredShades: ['champagne', 'lavender'],
    quirk: 'Maintains stern courtroom poise until she sees high-beam highlighter.',
    catchphrase: 'Strict in court, but secretly obsessed with high-beam glow.',
    defaultFaceModel: 'tan',
  },
  {
    id: 'uncle_dev',
    name: 'Uncle Dev',
    role: 'Flower Vendor Next Door',
    avatarKey: 'customer_5',
    skinTone: 'deep',
    preferredShades: ['mint', 'gold'],
    quirk: 'Brings fresh jasmine garlands every time he steps in.',
    catchphrase: 'My jasmine garlands must smell better than your salon, Anaya!',
    defaultFaceModel: 'deep',
  },
  {
    id: 'diya',
    name: 'Diya',
    role: 'Beauty Livestreamer & Influencer',
    avatarKey: 'customer_6',
    skinTone: 'wheatish',
    preferredShades: ['lavender', 'rose'],
    quirk: 'Cannot evaluate any look without checking ring light angles.',
    catchphrase: 'Chat is screaming for the swatch, hold the mirror higher!',
    defaultFaceModel: 'wheatish',
  },
  {
    id: 'shanti',
    name: 'Grandma Shanti',
    role: 'Classical Vocalist (Age 75)',
    avatarKey: 'customer_7',
    skinTone: 'fair',
    preferredShades: ['rose', 'gold'],
    quirk: 'Hums morning ragas while getting vintage rose lips.',
    catchphrase: 'Your Nani did my makeup for my first All India Radio concert.',
    defaultFaceModel: 'fair',
  },
  {
    id: 'rohit',
    name: 'Rohit',
    role: 'Flustered First-Time Groom',
    avatarKey: 'customer_8',
    skinTone: 'medium',
    preferredShades: ['peach', 'mint'],
    quirk: 'Terrified of looking oily or powdery in 4K wedding video.',
    catchphrase: 'Please don’t let me look like a shiny rasgulla in the wedding video!',
    defaultFaceModel: 'medium',
  },
  {
    id: 'fatima',
    name: 'Fatima',
    role: 'Saree & Textile Print Designer',
    avatarKey: 'customer_9',
    skinTone: 'tan',
    preferredShades: ['sky', 'ruby'],
    quirk: 'Compares eyeshadow pigments directly to Banarasi silk swatches.',
    catchphrase: 'Colors must sing in counterpoint, like raw silk under sunlight.',
    defaultFaceModel: 'tan',
  },
  {
    id: 'aisha',
    name: 'Aisha',
    role: 'State Marathon Runner',
    avatarKey: 'customer_10',
    skinTone: 'dark',
    preferredShades: ['peach', 'mint'],
    quirk: 'Checks whether blush can survive a 10K sprint in 35°C heat.',
    catchphrase: 'Can I sprint 10 kilometers with this blush? Then sign me up.',
    defaultFaceModel: 'dark',
  },
  {
    id: 'dr_neha',
    name: 'Dr. Neha',
    role: 'Pediatric ER Physician',
    avatarKey: 'customer_11',
    skinTone: 'wheatish',
    preferredShades: ['lavender', 'peach'],
    quirk: 'Falls asleep peacefully during cold rose compress treatments.',
    catchphrase: 'Thirty-six hours on duty—please make me look like I sleep!',
    defaultFaceModel: 'wheatish',
  },
  {
    id: 'babli',
    name: 'Babli',
    role: 'High-Energy Teen Cousin',
    avatarKey: 'customer_12',
    skinTone: 'medium',
    preferredShades: ['rose', 'sky'],
    quirk: 'Has 100 questions per minute about eyeliner geometry.',
    catchphrase: 'Anaya Di, promise me my eyeliner wings will be sharper than geometry!',
    defaultFaceModel: 'medium',
  },
];

// ============================================================================
// 3. Nani's Rang Book — 7 Secret Signature Looks
// ============================================================================

export const RANG_BOOK_PAGES: RangBookPage[] = [
  {
    id: 1,
    title: 'Gulab Dawn',
    chapter: 1,
    lore: 'Nani’s original bridal recipe from 1974. Fresh morning dew over garden rose petals.',
    keyShades: ['rose', 'champagne'],
    zoneFocus: 'Dewy cheeks and delicate rosebud lips.',
    unlockedByDefault: true,
    recipePreview: {
      eyes: [{ shade: 'champagne', opacity: 0.7 }],
      cheeks: [{ shade: 'rose', opacity: 0.85 }],
      lips: [{ shade: 'rose', opacity: 0.9 }],
    },
  },
  {
    id: 2,
    title: 'Rangpur Radiance',
    chapter: 1,
    lore: 'Created for Rangpur’s annual heritage parade. Bright, sunlit, and confident.',
    keyShades: ['peach', 'gold'],
    zoneFocus: 'Luminous cheekbones and soft gold eye wash.',
    recipePreview: {
      eyes: [{ shade: 'gold', opacity: 0.8 }],
      cheeks: [{ shade: 'peach', opacity: 0.85 }],
      lips: [{ shade: 'peach', opacity: 0.9 }],
    },
  },
  {
    id: 3,
    title: 'Mehendi Glow',
    chapter: 2,
    lore: 'Crafted to complement fresh henna and evening fairy lights without fading.',
    keyShades: ['mint', 'gold'],
    zoneFocus: 'Calming under-eyes, bronze contour, and terracotta warmth.',
    recipePreview: {
      eyes: [{ shade: 'gold', opacity: 0.75 }],
      cheeks: [{ shade: 'mint', opacity: 0.4 }, { shade: 'gold', opacity: 0.6 }],
      lips: [{ shade: 'rose', opacity: 0.8 }],
    },
  },
  {
    id: 4,
    title: 'Sangeet Sparkle',
    chapter: 2,
    lore: 'Designed to catch stage spotlights during night-long musical celebrations.',
    keyShades: ['lavender', 'ruby'],
    zoneFocus: 'Ultra-sparkling eyelids and high-pigment gloss.',
    recipePreview: {
      eyes: [{ shade: 'lavender', opacity: 0.9 }],
      cheeks: [{ shade: 'peach', opacity: 0.7 }],
      lips: [{ shade: 'ruby', opacity: 0.95 }],
    },
  },
  {
    id: 5,
    title: 'Holi Bloom',
    chapter: 3,
    lore: 'Celebrating the joyous unity of spring powders with gentle botanical pigments.',
    keyShades: ['sky', 'peach'],
    zoneFocus: 'Pastel gradient eye contour and sun-kissed flush.',
    recipePreview: {
      eyes: [{ shade: 'sky', opacity: 0.85 }],
      cheeks: [{ shade: 'peach', opacity: 0.85 }],
      lips: [{ shade: 'rose', opacity: 0.85 }],
    },
  },
  {
    id: 6,
    title: 'Diwali Gold',
    chapter: 3,
    lore: 'Inspired by flickering earthen diyas and regal zari embroidery.',
    keyShades: ['gold', 'ruby'],
    zoneFocus: 'Gilded temple lids and velvet bold lips.',
    recipePreview: {
      eyes: [{ shade: 'gold', opacity: 0.95 }],
      cheeks: [{ shade: 'gold', opacity: 0.5 }, { shade: 'peach', opacity: 0.7 }],
      lips: [{ shade: 'ruby', opacity: 0.95 }],
    },
  },
  {
    id: 7,
    title: 'Royal Gulab Bride',
    chapter: 4,
    lore: 'Nani Sharda’s crowning masterpiece. Timeless, balanced grace that honors the person within.',
    keyShades: ['ruby', 'gold', 'champagne'],
    zoneFocus: 'Flawless full face harmony across Eyes, Cheeks, and Lips.',
    recipePreview: {
      eyes: [{ shade: 'gold', opacity: 0.9 }, { shade: 'champagne', opacity: 0.8 }],
      cheeks: [{ shade: 'rose', opacity: 0.85 }, { shade: 'champagne', opacity: 0.7 }],
      lips: [{ shade: 'ruby', opacity: 1.0 }],
    },
  },
];

// ============================================================================
// 4. All 4 Chapters & 12 Scenes Each (48 Scenes Total, Max 3 Lines per Card)
// ============================================================================

export const STORY_CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Reopening the Doors',
    subtitle: 'Restoring Reception & Makeup Studio',
    description: 'Anaya returns to Rangpur to revive Gulab Mahal Salon and unlock the first secrets in Nani’s Rang Book.',
    unlockedArea: 'Reception & Makeup Studio',
    rangBookPages: [1, 2],
    scenes: [
      {
        id: 1,
        chapterId: 1,
        title: 'The Dusty Key',
        cards: [
          { id: '1_1_1', speaker: 'Anaya', characterId: 'anaya', expression: 'determined', text: 'Three years closed... but the brass sign still shines under the dust. Gulab Mahal Salon is back.' },
          { id: '1_1_2', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'Careful with that rusted lock, Anaya! Here, let my wrench do the talking.' },
          { id: '1_1_3', speaker: 'Zoya', characterId: 'zoya', expression: 'surprised', text: 'Look at these velvet armchairs! They’re vintage perfection under those dust sheets!' },
        ],
      },
      {
        id: 2,
        chapterId: 1,
        title: 'Nani’s Velvet Box',
        cards: [
          { id: '1_2_1', speaker: 'Anaya', characterId: 'anaya', expression: 'surprised', text: 'Behind the reception counter... Nani’s Rang Book! The binding is embroidered with real zari thread.' },
          { id: '1_2_2', speaker: 'Kajal', characterId: 'kajal', expression: 'happy', text: 'Mrow~! *Taps the locked bronze clasp with a soft black paw*' },
          { id: '1_2_3', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'Good eye, Kajal. The combination is Nani’s salon anniversary date!' },
        ],
      },
      {
        id: 3,
        chapterId: 1,
        title: 'First Brushstrokes',
        cards: [
          { id: '1_3_1', speaker: 'Tara-ji', characterId: 'tara', expression: 'calm', text: 'I smelled rosewater all the way down the bazaar. Anaya, your eyes have Sharda’s spark.' },
          { id: '1_3_2', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'Tara-ji! You were Nani’s right hand. Will you guide us?' },
          { id: '1_3_3', speaker: 'Tara-ji', characterId: 'tara', expression: 'laughing', text: 'Only if you hold your blending brush lighter than a sparrow’s feather. Let’s inspect the mirrors.' },
        ],
      },
      {
        id: 4,
        chapterId: 1,
        title: 'The Broken Chandelier',
        cards: [
          { id: '1_4_1', speaker: 'Kabir', characterId: 'kabir', expression: 'thinking', text: 'The ceiling fixture dropped a brass leaf. But the crystal prisms are completely intact.' },
          { id: '1_4_2', speaker: 'Zoya', characterId: 'zoya', expression: 'happy', text: 'If we polish each crystal with vinegar, the afternoon light will turn the whole room into rainbow confetti!' },
          { id: '1_4_3', speaker: 'Anaya', characterId: 'anaya', expression: 'determined', text: 'Every puzzle line we clear buys fresh wiring and polish. Let’s get to work!' },
        ],
      },
      {
        id: 5,
        chapterId: 1,
        title: 'Neighborly Jasmine',
        cards: [
          { id: '1_5_1', speaker: 'Uncle Dev', characterId: 'uncle_dev', expression: 'happy', text: 'Namaste, Anaya bitiya! Fresh jasmine garlands for your front doorway.' },
          { id: '1_5_2', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'Uncle Dev! Your flowers make the salon smell alive again. Thank you!' },
          { id: '1_5_3', speaker: 'Uncle Dev', characterId: 'uncle_dev', expression: 'laughing', text: 'Just promise you’ll trim my wild beard before the Diwali temple fair begins.' },
        ],
      },
      {
        id: 6,
        chapterId: 1,
        title: 'The Nervous Candidate',
        cards: [
          { id: '1_6_1', speaker: 'Priya', characterId: 'priya', expression: 'surprised', text: 'Excuse me... are you open? I have a campus job interview in twenty minutes!' },
          { id: '1_6_2', speaker: 'Anaya', characterId: 'anaya', expression: 'calm', text: 'Come right in, Priya! Take a breath, sit back, and let’s bring out your natural glow.' },
          { id: '1_6_3', speaker: 'Priya', characterId: 'priya', expression: 'calm', text: 'Just looking at this peaceful salon lowered my racing heart rate by half.' },
        ],
      },
      {
        id: 7,
        chapterId: 1,
        title: 'Soft Peach Confidence',
        cards: [
          { id: '1_7_1', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'Soft peach on the high cheeks, and a sheer berry balm. Look in the mirror.' },
          { id: '1_7_2', speaker: 'Priya', characterId: 'priya', expression: 'proud', text: 'I look like myself, only... brave! I’m going to ace this presentation!' },
          { id: '1_7_3', speaker: 'Zoya', characterId: 'zoya', expression: 'happy', text: 'Go knock their socks off! First happy client in the book!' },
        ],
      },
      {
        id: 8,
        chapterId: 1,
        title: 'The Arrival of Lumiere',
        cards: [
          { id: '1_8_1', speaker: 'Rhea', characterId: 'rhea', expression: 'thinking', text: 'Charming nostalgia, Anaya. But artisanal salons can’t compete with Lumiere’s laser technology.' },
          { id: '1_8_2', speaker: 'Anaya', characterId: 'anaya', expression: 'calm', text: 'Technology is great, Rhea, but personal warmth and human artistry will always have a home.' },
          { id: '1_8_3', speaker: 'Rhea', characterId: 'rhea', expression: 'proud', text: 'Let’s see if your brushes can keep up when the town bridal rush hits next month.' },
        ],
      },
      {
        id: 9,
        chapterId: 1,
        title: 'Deciphering Page One',
        unlockRangBookPage: 1,
        cards: [
          { id: '1_9_1', speaker: 'Anaya', characterId: 'anaya', expression: 'surprised', text: '“Gulab Dawn: Three parts rose petal tint, one part morning dew highlight.”' },
          { id: '1_9_2', speaker: 'Tara-ji', characterId: 'tara', expression: 'proud', text: 'Your Nani created that look for young women stepping out into the world with courage.' },
          { id: '1_9_3', speaker: 'Anaya', characterId: 'anaya', expression: 'determined', text: 'I can recreate the pigment palette on the game board! Pure pink lines unlock the shade!' },
        ],
      },
      {
        id: 10,
        chapterId: 1,
        title: 'Society’s First Visit',
        cards: [
          { id: '1_10_1', speaker: 'Mrs. Kapoor', characterId: 'mrs_kapoor', expression: 'happy', text: 'Anaya darling! I hear you’re reviving your Nani’s legendary salon!' },
          { id: '1_10_2', speaker: 'Mrs. Kapoor', characterId: 'mrs_kapoor', expression: 'laughing', text: 'Give me the boldest magenta lips you have! The ladies at the kitty party must take note.' },
          { id: '1_10_3', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'Bold magenta with a subtle gold rim highlight coming right up, Auntie!' },
        ],
      },
      {
        id: 11,
        chapterId: 1,
        title: 'The Glowing Studio',
        cards: [
          { id: '1_11_1', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'Stand back everyone... flip the main breaker!' },
          { id: '1_11_2', speaker: 'Zoya', characterId: 'zoya', expression: 'surprised', text: 'The halo vanity mirrors are alive! Every station looks like a Bollywood dressing room!' },
          { id: '1_11_3', speaker: 'Kajal', characterId: 'kajal', expression: 'happy', text: 'Purrr-rr-rr! *Sunbathes under the warm vanity beam*' },
        ],
      },
      {
        id: 12,
        chapterId: 1,
        title: 'Grand Reopening Celebration',
        unlockArea: 'Reception & Makeup Studio',
        unlockRangBookPage: 2,
        cards: [
          { id: '1_12_1', speaker: 'Tara-ji', characterId: 'tara', expression: 'happy', text: 'To Sharda’s legacy, and Anaya’s bold new beginning. Gulab Mahal is open!' },
          { id: '1_12_2', speaker: 'Anaya', characterId: 'anaya', expression: 'proud', text: 'We did it together! The reception and makeup studio are bustling.' },
          { id: '1_12_3', speaker: 'Zoya', characterId: 'zoya', expression: 'happy', text: 'Rest fast, Anaya—because next week, wedding season arrives in full force!' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Bridal Season',
    subtitle: 'Nail Bar & Hair Lounge Expansion',
    description: 'Rangpur’s biggest wedding festivities begin. Kabir restores the wash stations while Zoya launches the viral Nail Bar.',
    unlockedArea: 'Nail Bar & Hair Lounge',
    rangBookPages: [3, 4],
    scenes: [
      {
        id: 1,
        chapterId: 2,
        title: 'The Saree Swatches',
        cards: [
          { id: '2_1_1', speaker: 'Fatima', characterId: 'fatima', expression: 'happy', text: 'Look at these Banarasi fabrics, Anaya! Crimson, emerald, and raw sapphire threads.' },
          { id: '2_1_2', speaker: 'Anaya', characterId: 'anaya', expression: 'thinking', text: 'We need makeup looks that balance these heavy golds without washing out the face.' },
          { id: '2_1_3', speaker: 'Fatima', characterId: 'fatima', expression: 'proud', text: 'That is why your salon is special. You understand how silk and skin breathe together.' },
        ],
      },
      {
        id: 2,
        chapterId: 2,
        title: 'Hammer & Hair Wash Station',
        cards: [
          { id: '2_2_1', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'Hot water valve secured! This ceramic wash basin has genuine brass fittings.' },
          { id: '2_2_2', speaker: 'Zoya', characterId: 'zoya', expression: 'surprised', text: 'The water pressure is silky smooth! Our hair massage lounge is officially ready.' },
          { id: '2_2_3', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'With Kabir’s carpentry, we just added three luxury styling chairs.' },
        ],
      },
      {
        id: 3,
        chapterId: 2,
        title: 'The Jittery Groom',
        cards: [
          { id: '2_3_1', speaker: 'Rohit', characterId: 'rohit', expression: 'surprised', text: 'The wedding photographer said my forehead shines brighter than the chandelier!' },
          { id: '2_3_2', speaker: 'Anaya', characterId: 'anaya', expression: 'calm', text: 'Don’t panic, Rohit. A lightweight matte emulsion and pore-smoothing primer will fix that in two minutes.' },
          { id: '2_3_3', speaker: 'Rohit', characterId: 'rohit', expression: 'happy', text: 'Wait... it’s completely invisible! I look like I slept ten hours!' },
        ],
      },
      {
        id: 4,
        chapterId: 2,
        title: 'Kathak Pirouettes',
        cards: [
          { id: '2_4_1', speaker: 'Simran', characterId: 'simran', expression: 'determined', text: 'Anaya! Sangeet night is in two hours, and my stage routine is sixty minutes long!' },
          { id: '2_4_2', speaker: 'Zoya', characterId: 'zoya', expression: 'happy', text: 'I’ll do chip-resistant ruby gel on your nails while Anaya sets your eyes.' },
          { id: '2_4_3', speaker: 'Simran', characterId: 'simran', expression: 'proud', text: 'Dual styling speed! You two are an unstoppable team!' },
        ],
      },
      {
        id: 5,
        chapterId: 2,
        title: 'Smudge-Proof Wings',
        cards: [
          { id: '2_5_1', speaker: 'Anaya', characterId: 'anaya', expression: 'determined', text: 'Waterproof gel liner locked with carbon pigment. Dance through thunder, Simran—it won’t budge.' },
          { id: '2_5_2', speaker: 'Simran', characterId: 'simran', expression: 'happy', text: 'Sharp as a dagger, yet graceful! The stage lights will adore this!' },
          { id: '2_5_3', speaker: 'Tara-ji', characterId: 'tara', expression: 'proud', text: 'That was Nani’s signature technique for classical dancers in 1985.' },
        ],
      },
      {
        id: 6,
        chapterId: 2,
        title: 'The Mysterious Scent',
        cards: [
          { id: '2_6_1', speaker: 'Anaya', characterId: 'anaya', expression: 'thinking', text: 'Do you smell that? Sandalwood and crushed vetiver... where is it coming from?' },
          { id: '2_6_2', speaker: 'Kabir', characterId: 'kabir', expression: 'surprised', text: 'Kajal crawled behind the old cedar cupboard and knocked over a secret drawer!' },
          { id: '2_6_3', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'It’s Nani’s notes on herbal scalp oils! She made them fresh every monsoon.' },
        ],
      },
      {
        id: 7,
        chapterId: 2,
        title: 'Midnight Manicures',
        cards: [
          { id: '2_7_1', speaker: 'Zoya', characterId: 'zoya', expression: 'proud', text: 'Gold leaf foil on mint green polish. This bridal party is going to turn heads.' },
          { id: '2_7_2', speaker: 'Diya', characterId: 'diya', expression: 'surprised', text: 'Ten thousand viewers just tuned in to watch Zoya’s nail art live on stream!' },
          { id: '2_7_3', speaker: 'Zoya', characterId: 'zoya', expression: 'laughing', text: 'Make sure you tag @GulabMahalSalon, darling!' },
        ],
      },
      {
        id: 8,
        chapterId: 2,
        title: 'The Power Lawyer’s Glow',
        cards: [
          { id: '2_8_1', speaker: 'Meera', characterId: 'meera', expression: 'thinking', text: 'Ten hours of courtroom cross-examinations. My best friend’s reception is tonight.' },
          { id: '2_8_2', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'Highlighter placed right on the temple bones lifts fatigue instantly.' },
          { id: '2_8_3', speaker: 'Meera', characterId: 'meera', expression: 'surprised', text: 'Good grief, I look invincible. I might wear this glow to the Supreme Court on Monday.' },
        ],
      },
      {
        id: 9,
        chapterId: 2,
        title: 'Rhea’s Surprise Inspection',
        cards: [
          { id: '2_9_1', speaker: 'Rhea', characterId: 'rhea', expression: 'thinking', text: 'Your appointment book is packed out the door, Sharma.' },
          { id: '2_9_2', speaker: 'Anaya', characterId: 'anaya', expression: 'calm', text: 'Word of mouth travels fast when clients leave feeling radiant.' },
          { id: '2_9_3', speaker: 'Rhea', characterId: 'rhea', expression: 'proud', text: 'The finish on that nail foil is... surprisingly flawless. Perhaps you have talent after all.' },
        ],
      },
      {
        id: 10,
        chapterId: 2,
        title: 'The Sangeet Sparkle Unlock',
        unlockRangBookPage: 3,
        cards: [
          { id: '2_10_1', speaker: 'Anaya', characterId: 'anaya', expression: 'surprised', text: '“Sangeet Sparkle: Foil lavender across the lid, anchored by deep plum smoke.”' },
          { id: '2_10_2', speaker: 'Tara-ji', characterId: 'tara', expression: 'proud', text: 'Your grandmother wore that shade the night she sang for the harvest jubilee.' },
          { id: '2_10_3', speaker: 'Anaya', characterId: 'anaya', expression: 'determined', text: 'The colors reflect light from every angle. Let’s master the puzzle combination!' },
        ],
      },
      {
        id: 11,
        chapterId: 2,
        title: 'The Night Before the Wedding',
        cards: [
          { id: '2_11_1', speaker: 'Zoya', characterId: 'zoya', expression: 'happy', text: 'Forty-eight manicures, thirty blow-outs, and zero broken brushes. We survived!' },
          { id: '2_11_2', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'Hot ginger chai for the bravest beauty squad in Rangpur.' },
          { id: '2_11_3', speaker: 'Kajal', characterId: 'kajal', expression: 'calm', text: '*Purr... purr... purr...* *Laps warm milk contently*' },
        ],
      },
      {
        id: 12,
        chapterId: 2,
        title: 'Bridal Triumph',
        unlockArea: 'Nail Bar & Hair Lounge',
        unlockRangBookPage: 4,
        cards: [
          { id: '2_12_1', speaker: 'Grandma Shanti', characterId: 'shanti', expression: 'proud', text: 'When I saw the bride today, I thought of Sharda. You carry her gentleness.' },
          { id: '2_12_2', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'That is the greatest compliment I could ever receive, Shanti Dadi.' },
          { id: '2_12_3', speaker: 'Tara-ji', characterId: 'tara', expression: 'happy', text: 'Two rooms restored, two looks mastered. But Rangpur’s biggest festival is around the corner!' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Festival of Colors',
    subtitle: 'Rooftop Cafe & Herbal Spa',
    description: 'Spring arrives with clouds of gulal. When Rhea faces an emergency, Anaya chooses sisterhood over competition.',
    unlockedArea: 'Spa & Rooftop Cafe',
    rangBookPages: [5, 6],
    scenes: [
      {
        id: 1,
        chapterId: 3,
        title: 'The Gulal Clouds',
        cards: [
          { id: '3_1_1', speaker: 'Babli', characterId: 'babli', expression: 'surprised', text: 'Anaya Di! Look outside! The festival carts just arrived with sacks of gulal powders!' },
          { id: '3_1_2', speaker: 'Anaya', characterId: 'anaya', expression: 'laughing', text: 'Keep that pink powder outside until we finish prepping our skin barrier creams!' },
          { id: '3_1_3', speaker: 'Babli', characterId: 'babli', expression: 'determined', text: 'Only if you teach me how to do double-winged eyeliner before sunset!' },
        ],
      },
      {
        id: 2,
        chapterId: 3,
        title: 'Rooftop Potential',
        cards: [
          { id: '3_2_1', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'Look at this view of the old town minarets and gulmohar trees.' },
          { id: '3_2_2', speaker: 'Anaya', characterId: 'anaya', expression: 'surprised', text: 'Kabir... what if we turn this dusty rooftop into an open-air relaxation cafe?' },
          { id: '3_2_3', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'I’ll build teak planters and string fairy lights across the pergola!' },
        ],
      },
      {
        id: 3,
        chapterId: 3,
        title: 'The ER Doctor’s Relief',
        cards: [
          { id: '3_3_1', speaker: 'Dr. Neha', characterId: 'dr_neha', expression: 'thinking', text: 'Between night shifts and festival emergency prep, my skin feels like sandpaper.' },
          { id: '3_3_2', speaker: 'Anaya', characterId: 'anaya', expression: 'calm', text: 'Step into our new herbal spa room, Doctor. Cold rose compress and cucumber mist.' },
          { id: '3_3_3', speaker: 'Dr. Neha', characterId: 'dr_neha', expression: 'happy', text: 'If heaven has a salon, it smells exactly like this room.' },
        ],
      },
      {
        id: 4,
        chapterId: 3,
        title: 'Marathon Runner’s Challenge',
        cards: [
          { id: '3_4_1', speaker: 'Aisha', characterId: 'aisha', expression: 'determined', text: 'The Rangpur 10K marathon runs right through the festival crowds tomorrow morning.' },
          { id: '3_4_2', speaker: 'Zoya', characterId: 'zoya', expression: 'proud', text: 'We’re setting a lightweight stain that will withstand sweat, wind, and celebratory gulal.' },
          { id: '3_4_3', speaker: 'Aisha', characterId: 'aisha', expression: 'happy', text: 'If I cross the finish line looking radiant, your salon gets the trophy!' },
        ],
      },
      {
        id: 5,
        chapterId: 3,
        title: 'Secrets in the Mortar',
        cards: [
          { id: '3_5_1', speaker: 'Kabir', characterId: 'kabir', expression: 'surprised', text: 'Anaya, come quick! There’s an antique stone mortar embedded in the terrace wall!' },
          { id: '3_5_2', speaker: 'Tara-ji', characterId: 'tara', expression: 'proud', text: 'This is where Sharda ground real sandalwood paste and saffron stigmas forty years ago.' },
          { id: '3_5_3', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'We’ll clean it and use it for our organic rooftop spa treatments!' },
        ],
      },
      {
        id: 6,
        chapterId: 3,
        title: 'The Teen Apprentice',
        cards: [
          { id: '3_6_1', speaker: 'Babli', characterId: 'babli', expression: 'thinking', text: 'Like this, Di? From the outer corner flicking upward towards the temple?' },
          { id: '3_6_2', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'Perfect angle, Babli! See how steady your fingers become when you breathe out?' },
          { id: '3_6_3', speaker: 'Babli', characterId: 'babli', expression: 'happy', text: 'I did it! Sharp wings! Take a selfie, quick!' },
        ],
      },
      {
        id: 7,
        chapterId: 3,
        title: 'Rooftop Chai & Fairy Lights',
        cards: [
          { id: '3_7_1', speaker: 'Uncle Dev', characterId: 'uncle_dev', expression: 'happy', text: 'Your rooftop cafe has the coolest evening breeze in all of Rangpur.' },
          { id: '3_7_2', speaker: 'Mrs. Kapoor', characterId: 'mrs_kapoor', expression: 'proud', text: 'And the jasmine tea cakes are simply divine, Anaya. Five stars!' },
          { id: '3_7_3', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'I told you those teak benches would become the town’s favorite spot.' },
        ],
      },
      {
        id: 8,
        chapterId: 3,
        title: 'The Holi Bloom Revelation',
        cards: [
          { id: '3_8_1', speaker: 'Anaya', characterId: 'anaya', expression: 'surprised', text: '“Holi Bloom: When colors clash, let soft pastels mediate the peace.”' },
          { id: '3_8_2', speaker: 'Tara-ji', characterId: 'tara', expression: 'calm', text: 'Sky blue wash on the brow bone, soft coral wash on the cheeks. An ode to unity.' },
          { id: '3_8_3', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'No harsh lines. Everything blends together, just like our town.' },
        ],
      },
      {
        id: 9,
        chapterId: 3,
        title: 'Lumiere in Trouble',
        cards: [
          { id: '3_9_1', speaker: 'Rhea', characterId: 'rhea', expression: 'surprised', text: 'My chemical supplier sent the wrong pigments for the festival gala! My models are waiting!' },
          { id: '3_9_2', speaker: 'Anaya', characterId: 'anaya', expression: 'determined', text: 'Take our organic floral concentrates, Rhea. We have plenty to share.' },
          { id: '3_9_3', speaker: 'Rhea', characterId: 'rhea', expression: 'surprised', text: 'You’re... helping me? Even though we’re competitors?' },
        ],
      },
      {
        id: 10,
        chapterId: 3,
        title: 'Sisterhood Over Rivalry',
        cards: [
          { id: '3_10_1', speaker: 'Anaya', characterId: 'anaya', expression: 'calm', text: 'There’s room for everyone to shine in Rangpur, Rhea. Beauty isn’t a zero-sum game.' },
          { id: '3_10_2', speaker: 'Rhea', characterId: 'rhea', expression: 'happy', text: 'I... have never experienced this kind of generosity. Thank you, Anaya.' },
          { id: '3_10_3', speaker: 'Zoya', characterId: 'zoya', expression: 'happy', text: 'Have a cup of chamomile, Rhea. Let’s fix those models together.' },
        ],
      },
      {
        id: 11,
        chapterId: 3,
        title: 'The Diwali Gold Page',
        unlockRangBookPage: 5,
        cards: [
          { id: '3_11_1', speaker: 'Anaya', characterId: 'anaya', expression: 'surprised', text: '“Diwali Gold: Deep temple maroon paired with molten gold dust.”' },
          { id: '3_11_2', speaker: 'Tara-ji', characterId: 'tara', expression: 'proud', text: 'The look that saved the salon during the 1990 crisis. It radiates unmistakable royalty.' },
          { id: '3_11_3', speaker: 'Kajal', characterId: 'kajal', expression: 'happy', text: '*Prrrrr!* *Headbutts the gold-embossed page affectionately*' },
        ],
      },
      {
        id: 12,
        chapterId: 3,
        title: 'The Golden Festival Night',
        unlockArea: 'Spa & Rooftop Cafe',
        unlockRangBookPage: 6,
        cards: [
          { id: '3_12_1', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'Thousands of clay diyas lighting up Rangpur’s night sky... it’s breathtaking.' },
          { id: '3_12_2', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'Gulab Mahal is glowing brighter than all of them, Anaya. You brought life back here.' },
          { id: '3_12_3', speaker: 'Tara-ji', characterId: 'tara', expression: 'proud', text: 'The Town Council just announced the Grand Beauty Fair. And they invited us to host!' },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'The Grand Beauty Fair',
    subtitle: 'VIP Bridal Suite & The Ultimate Look',
    description: 'Salons from across the region gather in Rangpur. Anaya and Rhea team up to present Nani’s final masterpiece: The Royal Gulab Bride.',
    unlockedArea: 'Bridal Suite',
    rangBookPages: [7],
    scenes: [
      {
        id: 1,
        chapterId: 4,
        title: 'The Invitation',
        cards: [
          { id: '4_1_1', speaker: 'Zoya', characterId: 'zoya', expression: 'surprised', text: 'The Grand Beauty Fair! Salons from five districts are coming to Rangpur!' },
          { id: '4_1_2', speaker: 'Anaya', characterId: 'anaya', expression: 'determined', text: 'They want Gulab Mahal to present the headline bridal showcase in the town heritage pavilion.' },
          { id: '4_1_3', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'Then we have to restore Nani’s ultimate dream: the VIP Bridal Suite!' },
        ],
      },
      {
        id: 2,
        chapterId: 4,
        title: 'Behind the Rose Curtain',
        cards: [
          { id: '4_2_1', speaker: 'Kabir', characterId: 'kabir', expression: 'proud', text: 'Carved rosewood vanity mirrors, silk upholstery, and private changing alcoves.' },
          { id: '4_2_2', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'It’s exactly as Nani sketched in her old diaries. Intimate, royal, and calming.' },
          { id: '4_2_3', speaker: 'Kajal', characterId: 'kajal', expression: 'happy', text: 'Meow~ *Approves of the velvet bolster cushion*' },
        ],
      },
      {
        id: 3,
        chapterId: 4,
        title: 'An Unexpected Partnership',
        cards: [
          { id: '4_3_1', speaker: 'Rhea', characterId: 'rhea', expression: 'calm', text: 'Anaya... I want to propose a joint exhibition for the Grand Fair.' },
          { id: '4_3_2', speaker: 'Anaya', characterId: 'anaya', expression: 'surprised', text: 'Lumiere and Gulab Mahal sharing the same headline stage?' },
          { id: '4_3_3', speaker: 'Rhea', characterId: 'rhea', expression: 'happy', text: 'Modern light aesthetics paired with your heritage color artistry. Together, we can put Rangpur on the map.' },
        ],
      },
      {
        id: 4,
        chapterId: 4,
        title: 'The 75-Year-Old Melody',
        cards: [
          { id: '4_4_1', speaker: 'Grandma Shanti', characterId: 'shanti', expression: 'happy', text: 'I wrote a new composition for your bridal showcase, Anaya.' },
          { id: '4_4_2', speaker: 'Anaya', characterId: 'anaya', expression: 'calm', text: 'Shanti Dadi, your voice will give everyone goosebumps.' },
          { id: '4_4_3', speaker: 'Grandma Shanti', characterId: 'shanti', expression: 'laughing', text: 'Just promise you’ll do my makeup with Nani’s signature red lip.' },
        ],
      },
      {
        id: 5,
        chapterId: 4,
        title: 'The Missing Final Page',
        cards: [
          { id: '4_5_1', speaker: 'Anaya', characterId: 'anaya', expression: 'thinking', text: 'The last page—Look 7—the ink is faded by age! I can’t read the proportion ratio!' },
          { id: '4_5_2', speaker: 'Tara-ji', characterId: 'tara', expression: 'proud', text: 'Sharda didn’t write it in ink. She sealed it with rose wax on the back cover.' },
          { id: '4_5_3', speaker: 'Anaya', characterId: 'anaya', expression: 'surprised', text: 'The wax medallion! When I warm it under the lamp, the script appears!' },
        ],
      },
      {
        id: 6,
        chapterId: 4,
        title: 'The Secret of the Royal Gulab',
        cards: [
          { id: '4_6_1', speaker: 'Anaya', characterId: 'anaya', expression: 'proud', text: '“Royal Gulab Bride: True harmony cannot be taught; it is felt when the artist honors the heart of the person before them.”' },
          { id: '4_6_2', speaker: 'Tara-ji', characterId: 'tara', expression: 'happy', text: 'Sharda always knew you would understand her truest teaching.' },
          { id: '4_6_3', speaker: 'Zoya', characterId: 'zoya', expression: 'laughing', text: 'Now I’m crying, and waterproof mascara hasn’t even been applied yet!' },
        ],
      },
      {
        id: 7,
        chapterId: 4,
        title: 'The Pavilion Buzz',
        cards: [
          { id: '4_7_1', speaker: 'Mrs. Kapoor', characterId: 'mrs_kapoor', expression: 'happy', text: 'Front row seats for the Gulab Mahal showcase! Move along, everyone!' },
          { id: '4_7_2', speaker: 'Uncle Dev', characterId: 'uncle_dev', expression: 'happy', text: 'Five hundred fresh garlands for the grand stage runway!' },
          { id: '4_7_3', speaker: 'Kabir', characterId: 'kabir', expression: 'happy', text: 'Soundcheck clear! Anaya, they’re queuing up around the block!' },
        ],
      },
      {
        id: 8,
        chapterId: 4,
        title: 'The Live Showcase Begins',
        cards: [
          { id: '4_8_1', speaker: 'Anaya', characterId: 'anaya', expression: 'proud', text: 'Welcome to Rangpur’s heritage showcase. Tonight, we celebrate every face as a living canvas.' },
          { id: '4_8_2', speaker: 'Rhea', characterId: 'rhea', expression: 'happy', text: 'Bridging timeless traditional pigments with clean modern radiance.' },
          { id: '4_8_3', speaker: 'Diya', characterId: 'diya', expression: 'surprised', text: 'Fifty thousand viewers live! The chat is pure heart emojis!' },
        ],
      },
      {
        id: 9,
        chapterId: 4,
        title: 'Painting the Royal Gulab',
        cards: [
          { id: '4_9_1', speaker: 'Anaya', characterId: 'anaya', expression: 'determined', text: 'Velvet ruby lips, soft gold temple dust, and warm sculpted cheeks in perfect balance.' },
          { id: '4_9_2', speaker: 'Grandma Shanti', characterId: 'shanti', expression: 'happy', text: '*Her rich, pure classical voice fills the pavilion with haunting beauty*' },
          { id: '4_9_3', speaker: 'Host', characterId: 'host', expression: 'surprised', text: 'The entire audience has risen to their feet in utter awe!' },
        ],
      },
      {
        id: 10,
        chapterId: 4,
        title: 'Standing Ovation',
        cards: [
          { id: '4_10_1', speaker: 'Host', characterId: 'host', expression: 'proud', text: 'The Rangpur Heritage Arts Trophy is awarded unanimously to... Anaya Sharma and Gulab Mahal Salon!' },
          { id: '4_10_2', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'This belongs to Kabir, Zoya, Tara-ji, Rhea, and everyone in Rangpur who believed in us!' },
          { id: '4_10_3', speaker: 'Kabir', characterId: 'kabir', expression: 'laughing', text: 'WE DID IT! GULAB MAHAL IS ETERNAL!' },
        ],
      },
      {
        id: 11,
        chapterId: 4,
        title: 'The Mentor’s Farewell Gift',
        cards: [
          { id: '4_11_1', speaker: 'Tara-ji', characterId: 'tara', expression: 'calm', text: 'This was Sharda’s first silver mirror. Now it is yours, Master Artist.' },
          { id: '4_11_2', speaker: 'Anaya', characterId: 'anaya', expression: 'proud', text: 'I will make sure every person who looks into it sees their own strength and beauty.' },
          { id: '4_11_3', speaker: 'Kajal', characterId: 'kajal', expression: 'happy', text: '*Purrr-r-r!* *Rubs against Anaya’s ankles with deep affection*' },
        ],
      },
      {
        id: 12,
        chapterId: 4,
        title: 'The Living Salon',
        unlockArea: 'Bridal Suite',
        unlockRangBookPage: 7,
        cards: [
          { id: '4_12_1', speaker: 'Anaya', characterId: 'anaya', expression: 'happy', text: 'Seven rooms restored. Seven signature looks in the Rang Book. And a lifetime of smiles ahead.' },
          { id: '4_12_2', speaker: 'Zoya', characterId: 'zoya', expression: 'laughing', text: 'Next client is already waiting at station one, boss!' },
          { id: '4_12_3', speaker: 'Anaya', characterId: 'anaya', expression: 'determined', text: 'Tell them to come in. The Gulab Mahal Salon is open!' },
        ],
      },
    ],
  },
];

// ============================================================================
// 5. Helper Query Functions
// ============================================================================

export function getChapter(chapterId: number): Chapter | undefined {
  return STORY_CHAPTERS.find(c => c.id === chapterId);
}

export function getScene(chapterId: number, sceneId: number): Scene | undefined {
  const chapter = getChapter(chapterId);
  return chapter?.scenes.find(s => s.id === sceneId);
}

export function getRangBookPage(pageId: number): RangBookPage | undefined {
  return RANG_BOOK_PAGES.find(p => p.id === pageId);
}

export function getCustomerById(customerId: string): CustomerProfile | undefined {
  return RECURRING_CUSTOMERS.find(c => c.id === customerId);
}

export function getNextStoryScene(
  currentChapter: number,
  currentScene: number
): { chapterId: number; sceneId: number; isCompleted: boolean } {
  const chapter = getChapter(currentChapter);
  if (!chapter) return { chapterId: 1, sceneId: 1, isCompleted: false };

  if (currentScene < chapter.scenes.length) {
    return { chapterId: currentChapter, sceneId: currentScene + 1, isCompleted: false };
  } else if (currentChapter < STORY_CHAPTERS.length) {
    return { chapterId: currentChapter + 1, sceneId: 1, isCompleted: false };
  } else {
    return { chapterId: currentChapter, sceneId: currentScene, isCompleted: true };
  }
}
