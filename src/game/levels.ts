import { createGoal } from './goals';
import type { Client, Collection, ShadeId } from '../types';

export const COLLECTIONS: Collection[] = [
  {
    id: 'everyday-glow',
    name: 'Everyday Glow',
    description:
      'Effortless daylight elegance, dewy radiance and gentle rose hues for everyday celebrations.',
    seasonStart: '03-01',
    seasonEnd: '05-31',
    palette: ['rose', 'champagne', 'gold'],
  },
  {
    id: 'haldi-day',
    name: 'Haldi Day',
    description:
      'Vibrant turmeric yellow, auspicious marigold glow and sun-kissed wedding mornings.',
    seasonStart: '06-01',
    seasonEnd: '08-31',
    palette: ['turmeric', 'gold', 'rose'],
  },
  {
    id: 'mehendi-night',
    name: 'Mehendi Night',
    description:
      'Intricate aromatic henna greens, earthy tones and festive floral garden celebrations.',
    seasonStart: '09-01',
    seasonEnd: '10-15',
    palette: ['henna', 'gold', 'turmeric'],
  },
  {
    id: 'sangeet-sparkle',
    name: 'Sangeet Sparkle',
    description:
      'Dazzling nighttime shimmer, berry tints, bold eyes and rhythmic Bollywood beats.',
    seasonStart: '10-16',
    seasonEnd: '11-15',
    palette: ['berry', 'kohl', 'gold'],
  },
  {
    id: 'bridal-red',
    name: 'Bridal Red',
    description:
      'Timeless royal sindoori crimson, intricate bridal radiance and majestic sacred pheras.',
    seasonStart: '11-16',
    seasonEnd: '12-31',
    palette: ['crimson', 'gold', 'rose'],
  },
  {
    id: 'diwali-gold',
    name: 'Diwali Gold',
    description:
      'Luminous festive gold, shimmering card party glam and regal holiday celebration.',
    seasonStart: '01-01',
    seasonEnd: '02-28',
    palette: ['gold', 'crimson', 'berry'],
  },
];

export const CLIENTS: Client[] = [
  // 1-5: Everyday Glow (Easy - 1-2 simple goals)
  {
    id: 'client_01',
    name: 'Priya Sharma',
    occasion: 'College Fest Opening',
    collection: 'Everyday Glow',
    avatar: 'Young student in a pastel kurti with delicate pearl earrings',
    goals: [createGoal('clearLines', 2)],
    starThresholds: [500, 1000, 1800],
    dialogue: {
      intro: 'I want something fresh and natural for the morning inaugurals!',
      success: 'This glow is so light and perfect, thank you!',
      failure: 'Oh no, let us try that natural look again!',
    },
  },
  {
    id: 'client_02',
    name: 'Ananya Roy',
    occasion: 'Sunday Terrace Brunch',
    collection: 'Everyday Glow',
    avatar: 'Art director in linen tunic, sunlit waves and rose tint',
    goals: [createGoal('clearColor', 2, 'rose'), createGoal('score', 800)],
    starThresholds: [600, 1200, 2000],
    dialogue: {
      intro: 'A soft rose petal look for catching up with friends in the sun.',
      success: 'Subtle and chic, just what I had in mind.',
      failure: 'A bit heavier than expected, can we reset?',
    },
  },
  {
    id: 'client_03',
    name: 'Riya Sen',
    occasion: 'Startup Office Soirée',
    collection: 'Everyday Glow',
    avatar: 'Tech founder wearing tailored chic blazer and subtle glow',
    goals: [createGoal('clearLines', 3), createGoal('combo', 2)],
    starThresholds: [800, 1500, 2500],
    dialogue: {
      intro: 'Professional yet glowing for our company product launch evening.',
      success: 'Strikes the exact right balance of polished and stylish!',
      failure: 'We lost the subtle radiance, let us redo.',
    },
  },
  {
    id: 'client_04',
    name: 'Tanvi Kapoor',
    occasion: 'Art Gallery Preview',
    collection: 'Everyday Glow',
    avatar: 'Curator with silver jhumkas and soft dewy cheek highlights',
    goals: [createGoal('clearColor', 3, 'rose'), createGoal('clearLines', 4)],
    starThresholds: [1000, 1800, 3000],
    dialogue: {
      intro: 'The lighting in the gallery requires a soft, luminous base.',
      success: 'The rose undertone pairs gorgeously with the gallery ambiance.',
      failure: 'A bit mismatched, let us try once more.',
    },
  },
  {
    id: 'client_05',
    name: 'Meera Nair',
    occasion: "Sister's Graduation Dinner",
    collection: 'Everyday Glow',
    avatar: 'Joyful sister in embroidered chiffon saree and gloss lips',
    goals: [createGoal('combo', 2), createGoal('score', 1500)],
    starThresholds: [1200, 2200, 3500],
    dialogue: {
      intro: 'A celebratory glow for family photos tonight!',
      success: 'I love how natural my skin looks under the restaurant lights!',
      failure: 'Almost there, let us do a quick touch-up!',
    },
  },

  // 6-10: Haldi Day (Easy / Early Medium - 2 goals)
  {
    id: 'client_06',
    name: 'Diya Patel',
    occasion: 'Poolside Haldi Welcome',
    collection: 'Haldi Day',
    avatar: 'Cousin in marigold-printed yellow lehenga and floral tiara',
    goals: [createGoal('clearColor', 3, 'turmeric'), createGoal('clearLines', 4)],
    starThresholds: [1200, 2200, 3500],
    dialogue: {
      intro: 'Bring on the bright turmeric hues! Today is all about joy and fun.',
      success: 'Radiant like fresh marigold petals!',
      failure: 'Need more of that authentic yellow warmth!',
    },
  },
  {
    id: 'client_07',
    name: 'Simran Kaur',
    occasion: 'Haldi Ke Rang Ritual',
    collection: 'Haldi Day',
    avatar: 'Bride-to-be wearing raw silk yellow anarkali and mogra garlands',
    goals: [createGoal('clearColor', 4, 'turmeric'), createGoal('combo', 2)],
    starThresholds: [1400, 2500, 4000],
    dialogue: {
      intro: 'I want my bridal haldi ceremony to look sunshine-kissed.',
      success: 'Auspicious, glowing, and completely stunning!',
      failure: 'We need that golden paste effect to pop!',
    },
  },
  {
    id: 'client_08',
    name: 'Neha Joshi',
    occasion: 'Floral Jewellery Ceremony',
    collection: 'Haldi Day',
    avatar: 'Bestie coordinating real jasmine earrings and radiant sun-lit cheeks',
    goals: [createGoal('pureShade', 1), createGoal('score', 2000)],
    starThresholds: [1500, 2800, 4200],
    dialogue: {
      intro: 'My floral jewellery needs a pristine monochrome splash to complement it.',
      success: 'That pure shade harmony is divine!',
      failure: 'Let us try to hit that seamless monochrome line.',
    },
  },
  {
    id: 'client_09',
    name: 'Pooja Verma',
    occasion: "Cousins' Splash Fiesta",
    collection: 'Haldi Day',
    avatar: 'Playful sister with turmeric paste smears and bright festive smile',
    goals: [createGoal('clearColor', 4, 'turmeric'), createGoal('clearLines', 5)],
    starThresholds: [1600, 3000, 4500],
    dialogue: {
      intro: 'Water and yellow colour everywhere! Make it bright and lively.',
      success: 'Festive magic achieved!',
      failure: 'Too scattered, let us focus the haldi tones.',
    },
  },
  {
    id: 'client_10',
    name: 'Isha Singhal',
    occasion: 'Haldi Finale & Chooda',
    collection: 'Haldi Day',
    avatar: 'Glowing bride in embroidered mustard sharara with gold accents',
    goals: [createGoal('clearColor', 4, 'gold'), createGoal('combo', 3)],
    starThresholds: [1800, 3200, 5000],
    dialogue: {
      intro: 'Transitioning from haldi yellow to royal celebratory gold for my chooda!',
      success: 'Breathtaking transition, I feel like royalty!',
      failure: 'Keep the combo rhythm steady!',
    },
  },

  // 11-15: Mehendi Night (Medium - 2-3 goals)
  {
    id: 'client_11',
    name: 'Kavita Rao',
    occasion: 'Garden Gazebo Mehendi',
    collection: 'Mehendi Night',
    avatar: 'Maid of honour in bottle green organza lehenga and mehendi palms',
    goals: [createGoal('clearColor', 4, 'henna'), createGoal('clearLines', 6)],
    starThresholds: [2000, 3500, 5500],
    dialogue: {
      intro: 'Earthy henna undertones with lush garden green vibes, please!',
      success: 'The depth of the henna shade is extraordinary!',
      failure: 'Needs deeper henna tones across the board.',
    },
  },
  {
    id: 'client_12',
    name: 'Sneha Iyer',
    occasion: 'Aromatic Dholki Jam',
    collection: 'Mehendi Night',
    avatar: 'Cousin in olive gharara clapping rhythms with glistening green lids',
    goals: [createGoal('clearColor', 5, 'henna'), createGoal('combo', 3)],
    starThresholds: [2200, 3800, 6000],
    dialogue: {
      intro: 'The beats are loud and the henna is dark! Keep up the combo energy.',
      success: 'Rhythm and radiance in perfect alignment!',
      failure: 'Do not drop the beat—or the combo!',
    },
  },
  {
    id: 'client_13',
    name: 'Roshni Mehta',
    occasion: 'Lantern Lit Courtyard',
    collection: 'Mehendi Night',
    avatar: 'Bride’s aunt in sage silk saree with traditional antique temple gold',
    goals: [
      createGoal('pureShade', 1),
      createGoal('clearColor', 4, 'gold'),
      createGoal('clearLines', 6),
    ],
    starThresholds: [2400, 4000, 6500],
    dialogue: {
      intro: 'A blend of antique gold and rich henna lines for the night.',
      success: 'Sophisticated and utterly enchanting!',
      failure: 'The antique gold needs more clarity.',
    },
  },
  {
    id: 'client_14',
    name: 'Tara Banerjee',
    occasion: 'Marigold Terrace Henna',
    collection: 'Mehendi Night',
    avatar: 'College friend wearing mint sharara and fine henna tracings',
    goals: [createGoal('clearColor', 5, 'henna'), createGoal('pureShade', 2)],
    starThresholds: [2600, 4500, 7000],
    dialogue: {
      intro: 'Intricate patterns deserve two pristine pure shade moments.',
      success: 'Flawless precision! The pure lines are gorgeous.',
      failure: 'Line up those blocks for the pure finish!',
    },
  },
  {
    id: 'client_15',
    name: 'Alisha Merchant',
    occasion: 'Bridal Mehendi Grandeur',
    collection: 'Mehendi Night',
    avatar: 'Bride sitting on velvet divan with elaborate full bridal henna',
    goals: [
      createGoal('clearColor', 6, 'henna'),
      createGoal('combo', 3),
      createGoal('score', 3000),
    ],
    starThresholds: [2800, 4800, 7500],
    dialogue: {
      intro: 'The centerpiece bridal mehendi! Every detail must be immaculate.',
      success: 'A masterpiece worthy of a royal album!',
      failure: 'Every brush stroke counts, let us try again.',
    },
  },

  // 16-20: Sangeet Sparkle (Medium / High Medium - 2-3 goals)
  {
    id: 'client_16',
    name: 'Zara Khan',
    occasion: 'Bollywood Fusion Medley',
    collection: 'Sangeet Sparkle',
    avatar: 'Dynamic dancer in mirror-work plum lehenga and smokey eye glam',
    goals: [createGoal('clearColor', 5, 'berry'), createGoal('combo', 3)],
    starThresholds: [3000, 5000, 8000],
    dialogue: {
      intro: 'Fast choreography and high drama berry lips!',
      success: 'Stage lights are ready and this look steals the show!',
      failure: 'Keep the pace up to maintain that combo!',
    },
  },
  {
    id: 'client_17',
    name: 'Maya Deshmukh',
    occasion: 'Grand Ballroom Sangeet',
    collection: 'Sangeet Sparkle',
    avatar: 'Bride in shimmering royal amethyst gown with diamond glow',
    goals: [createGoal('pureShade', 2), createGoal('clearLines', 8)],
    starThresholds: [3200, 5500, 8500],
    dialogue: {
      intro: 'A thousand ballroom guests watching—deliver pure glamour!',
      success: 'Pure sparkle perfection! You blew everyone away.',
      failure: 'We needed two pure lines to capture the diamond shimmer.',
    },
  },
  {
    id: 'client_18',
    name: 'Shreya Menon',
    occasion: 'Cocktail & DJ Bash',
    collection: 'Sangeet Sparkle',
    avatar: 'Glam hostess in wine-coloured sequin gown with glitter lids',
    goals: [createGoal('combo', 4), createGoal('clearColor', 5, 'berry')],
    starThresholds: [3500, 6000, 9000],
    dialogue: {
      intro: 'Late night bass drop and electric berry eyes!',
      success: 'Unstoppable rhythm! That 4x combo was electric.',
      failure: 'The music stopped too early, let us run it back.',
    },
  },
  {
    id: 'client_19',
    name: 'Natasha Gupta',
    occasion: 'Family Face-off Dance',
    collection: 'Sangeet Sparkle',
    avatar: 'Groom’s sister in midnight purple saree with high-beam cheekbones',
    goals: [
      createGoal('clearColor', 6, 'berry'),
      createGoal('clearColor', 4, 'gold'),
      createGoal('pureShade', 2),
    ],
    starThresholds: [3800, 6500, 9500],
    dialogue: {
      intro: 'Our side of the family has to win this dance battle hands down!',
      success: 'Victory is ours! Unmatched shimmer and confidence.',
      failure: 'Close battle! Let us regroup and reclaim the crown.',
    },
  },
  {
    id: 'client_20',
    name: 'Kiara Chadha',
    occasion: 'Rooftop Starlight Finale',
    collection: 'Sangeet Sparkle',
    avatar: 'Bride in custom velvet lehenga with iridescent berry sparkle',
    goals: [
      createGoal('combo', 4),
      createGoal('pureShade', 2),
      createGoal('score', 4000),
    ],
    starThresholds: [4000, 7000, 10000],
    dialogue: {
      intro: 'Under the open night sky, make this bride sparkle to the heavens.',
      success: 'An unforgettable night, I feel completely dazzling!',
      failure: 'Let us build that momentum back up for the finale!',
    },
  },

  // 21-25: Bridal Red (Hard - 3 rigorous goals)
  {
    id: 'client_21',
    name: 'Radhika Agarwal',
    occasion: 'Varmala Stage Splendor',
    collection: 'Bridal Red',
    avatar: 'Royal bride in traditional crimson zardozi lehenga and kundan nath',
    goals: [
      createGoal('clearColor', 6, 'crimson'),
      createGoal('clearLines', 9),
      createGoal('pureShade', 2),
    ],
    starThresholds: [4200, 7500, 11000],
    dialogue: {
      intro: 'The varmala moment is forever. Bring out the sacred crimson depth.',
      success: 'Breathtaking elegance! Pure sindoor perfection.',
      failure: 'The sacred crimson requires steady, disciplined hands.',
    },
  },
  {
    id: 'client_22',
    name: 'Bhavna Choudhury',
    occasion: 'Palace Mandap Pheras',
    collection: 'Bridal Red',
    avatar: 'Heritage bride draped in scarlet Benarasi silk under floral canopy',
    goals: [
      createGoal('clearColor', 7, 'crimson'),
      createGoal('combo', 4),
      createGoal('pureShade', 2),
    ],
    starThresholds: [4500, 8000, 12000],
    dialogue: {
      intro: 'Seven sacred vows around the fire—this makeup must endure flawlessly.',
      success: 'Timeless beauty that honours generations of tradition!',
      failure: 'Maintain the fire of the combo through all rounds.',
    },
  },
  {
    id: 'client_23',
    name: 'Sunaina Malhotra',
    occasion: 'Sindoor Daan Moment',
    collection: 'Bridal Red',
    avatar: 'Auspicious bride with delicate mathapatti and flushed bridal glow',
    goals: [
      createGoal('clearColor', 7, 'crimson'),
      createGoal('clearColor', 5, 'gold'),
      createGoal('pureShade', 3),
    ],
    starThresholds: [4800, 8500, 13000],
    dialogue: {
      intro: 'Crimson vermilion and gold jewellery must complement in pure harmony.',
      success: 'Three pure lines of pure grace! Truly magnificent.',
      failure: 'Pure shade precision is essential for this sacred rite.',
    },
  },
  {
    id: 'client_24',
    name: 'Aarti Saxena',
    occasion: 'Royal Haveli Reception',
    collection: 'Bridal Red',
    avatar: 'Regal bride in maroon velvet ensemble with antique Polki jewelry',
    goals: [
      createGoal('pureShade', 3),
      createGoal('combo', 4),
      createGoal('clearLines', 10),
    ],
    starThresholds: [5000, 9000, 14000],
    dialogue: {
      intro: 'A grand banquet for thousand dignitaries—demand royal perfection.',
      success: 'Regal, dignified, and undeniably iconic!',
      failure: 'A royal look demands unwavering strategic planning.',
    },
  },
  {
    id: 'client_25',
    name: 'Gauri Singhania',
    occasion: 'The Grand Bidaai',
    collection: 'Bridal Red',
    avatar: 'Emotional yet luminous bride in scarlet resham with tear-resistant glam',
    goals: [
      createGoal('clearColor', 8, 'crimson'),
      createGoal('combo', 4),
      createGoal('score', 5500),
    ],
    starThresholds: [5500, 9500, 15000],
    dialogue: {
      intro: 'Tear-resistant, luminous, unforgettable as I step into my new life.',
      success: 'Pure cinematic poetry! Tears of joy and timeless radiance.',
      failure: 'Take a deep breath and let us craft this bridal crown again.',
    },
  },

  // 26-30: Diwali Gold (Hard - Master goals)
  {
    id: 'client_26',
    name: 'Divya Kapoor',
    occasion: 'Diwali Card Party Gala',
    collection: 'Diwali Gold',
    avatar: 'Socialite host in raw metallic gold tissue saree and golden shimmer eyes',
    goals: [
      createGoal('clearColor', 7, 'gold'),
      createGoal('combo', 4),
      createGoal('pureShade', 2),
    ],
    starThresholds: [5500, 10000, 15500],
    dialogue: {
      intro: 'High stakes, high glamour, pure gold leaf everywhere tonight!',
      success: 'You played every card right! Molten gold perfection.',
      failure: 'The bets were high! Rebuild your board carefully.',
    },
  },
  {
    id: 'client_27',
    name: 'Shalini Bhardwaj',
    occasion: 'Laxmi Puja Grand Aarti',
    collection: 'Diwali Gold',
    avatar: 'Matriarch in auspicious gold brocade saree with temple gold jhumkas',
    goals: [
      createGoal('clearColor', 8, 'gold'),
      createGoal('clearColor', 6, 'turmeric'),
      createGoal('pureShade', 3),
    ],
    starThresholds: [6000, 10500, 16000],
    dialogue: {
      intro: 'Welcoming prosperity into our home with sacred golden radiance.',
      success: 'Blessings of abundance! The pure gold radiance is majestic.',
      failure: 'Pure focus is needed to weave both gold and turmeric lines.',
    },
  },
  {
    id: 'client_28',
    name: 'Tanya Khanna',
    occasion: 'Fireworks Terrace Party',
    collection: 'Diwali Gold',
    avatar: 'Celebrity stylist in molten gold contemporary pantsuit and wing liner',
    goals: [
      createGoal('combo', 5),
      createGoal('pureShade', 3),
      createGoal('clearLines', 12),
    ],
    starThresholds: [6500, 11000, 17000],
    dialogue: {
      intro: 'Sky-high fireworks need a 5x combo pyrotechnic display on the board!',
      success: 'An explosive masterclass in puzzle artistry!',
      failure: 'Pushing for a 5x combo requires setting up multi-clears.',
    },
  },
  {
    id: 'client_29',
    name: 'Urvashi Mittal',
    occasion: 'Royal Haveli New Year',
    collection: 'Diwali Gold',
    avatar: 'Princess in champagne gold antique lehenga and radiant skin finish',
    goals: [
      createGoal('clearColor', 8, 'gold'),
      createGoal('pureShade', 3),
      createGoal('score', 6500),
    ],
    starThresholds: [7000, 11500, 18000],
    dialogue: {
      intro: 'Ringing in the new season from the highest parapet of the haveli.',
      success: 'Incomparable elegance! You reign supreme.',
      failure: 'Do not rush the golden hour, assemble your lines wisely.',
    },
  },
  {
    id: 'client_30',
    name: 'Maharani Gayatri',
    occasion: 'Grand Mahotsav Empress',
    collection: 'Diwali Gold',
    avatar: 'Imperial empress in 24k gold embroidered ceremonial robe and royal tiara',
    goals: [
      createGoal('clearColor', 9, 'gold'),
      createGoal('combo', 5),
      createGoal('pureShade', 4),
    ],
    starThresholds: [7500, 12500, 20000],
    dialogue: {
      intro: 'The ultimate royal coronation. The entire kingdom beholds your skill.',
      success: 'Crown achieved! You are the grand master artist of Glam Blocks!',
      failure: 'Only true masters conquer this summit. Rise and try again!',
    },
  },
];

/**
 * Returns the client and goals for a specific 1-indexed level.
 * Uses CLIENTS for 1-30 and procedural generation beyond 30.
 */
export function getLevel(levelNumber: number): Client {
  if (levelNumber >= 1 && levelNumber <= CLIENTS.length) {
    return CLIENTS[levelNumber - 1];
  }
  return generateProceduralClient(levelNumber);
}

/**
 * Procedurally generates a scaled client for endless mode or levels beyond 30.
 */
export function generateProceduralClient(level: number, seed?: number): Client {
  const effectiveSeed = seed !== undefined ? seed : level * 2654435761;
  const collectionIndex = Math.abs(effectiveSeed) % COLLECTIONS.length;
  const collection = COLLECTIONS[collectionIndex];

  const primaryShade: ShadeId = collection.palette[0] ?? 'gold';
  const secondaryShade: ShadeId = collection.palette[1] ?? 'rose';

  const diff = Math.max(1, level - 30);
  const targetLines = 8 + Math.min(10, Math.floor(diff / 3));
  const targetColor = 6 + Math.min(8, Math.floor(diff / 4));
  const targetPure = 2 + Math.min(3, Math.floor(diff / 8));
  const targetCombo = Math.min(5, 3 + Math.floor(diff / 10));

  const baseScore = 4000 + diff * 250;
  const starThresholds: [number, number, number] = [
    baseScore,
    Math.round(baseScore * 1.6),
    Math.round(baseScore * 2.5),
  ];

  const proceduralNames = [
    'Samaira',
    'Ishani',
    'Avani',
    'Devika',
    'Lavanya',
    'Trisha',
    'Vaishnavi',
    'Ahana',
    'Bhavya',
    'Nandini',
  ];
  const name =
    proceduralNames[Math.abs(effectiveSeed) % proceduralNames.length] +
    ` (Master ${level})`;

  return {
    id: `procedural_lvl_${level}`,
    name,
    occasion: `Grand Gala Stage ${level}`,
    collection: collection.name,
    avatar: `High-fashion muse dressed in bespoke couture from ${collection.name}`,
    goals: [
      createGoal('clearLines', targetLines),
      createGoal('clearColor', targetColor, diff % 2 === 0 ? primaryShade : secondaryShade),
      createGoal('pureShade', targetPure),
      createGoal('combo', targetCombo),
    ],
    starThresholds,
    dialogue: {
      intro: `A masterclass challenge in the ${collection.name} couture salon!`,
      success: `Flawless artistry on Level ${level}!`,
      failure: `A challenging brief! Realign your tiles and conquer Level ${level}.`,
    },
  };
}

/**
 * Deterministically generates or selects the daily client for a given date.
 */
export function getDailyClient(date: string | Date): Client {
  const dateStr =
    typeof date === 'string'
      ? date
      : date.toISOString().slice(0, 10);

  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const collectionIndex = positiveHash % COLLECTIONS.length;
  const collection = COLLECTIONS[collectionIndex];
  const primaryShade = collection.palette[positiveHash % collection.palette.length];

  const dailyNames = [
    'Princess Aditi',
    'Sultana Farah',
    'Countess Rohini',
    'Baroness Alizeh',
    'Empress Revati',
    'Lady Tarini',
  ];
  const chosenName = dailyNames[positiveHash % dailyNames.length];

  return {
    id: `daily_${dateStr}`,
    name: `${chosenName} - Daily Brief`,
    occasion: `Daily Spotlight (${dateStr})`,
    collection: collection.name,
    avatar: `Featured client of the day in seasonal attire from ${collection.name}`,
    goals: [
      createGoal('clearLines', 6 + (positiveHash % 4)),
      createGoal('clearColor', 5 + (positiveHash % 3), primaryShade),
      createGoal('pureShade', 1 + (positiveHash % 2)),
      createGoal('combo', 3 + (positiveHash % 2)),
    ],
    starThresholds: [2500, 5000, 8500],
    dialogue: {
      intro: `Welcome to today's Daily Brief (${dateStr})! Complete today's makeup challenge.`,
      success: `Congratulations on conquering the Daily Challenge for ${dateStr}!`,
      failure: `Try again! The Daily Challenge is available all day.`,
    },
  };
}

export interface CustomerOrder {
  id: string;
  customerId: string;
  customerName: string;
  avatarKey: string;
  goalType: string;
  shade?: ShadeId;
  target: number;
  rewardCoins: number;
  description: string;
}

export interface HandcraftedLevel {
  level: number;
  title: string;
  maxMoves: number;
  customers: CustomerOrder[];
  starThresholds: [number, number, number];
  difficulty: 'gentle' | 'easy' | 'medium' | 'festive' | 'expert';
}

import levelsData from '../data/levels.json';

export const HANDCRAFTED_LEVELS: HandcraftedLevel[] = levelsData as HandcraftedLevel[];

export function getLevelData(levelNum: number): HandcraftedLevel {
  const found = HANDCRAFTED_LEVELS.find((l) => l.level === levelNum);
  if (found) return found;

  // Procedural generator for levels > 60
  const maxMoves = Math.max(16, 26 - (levelNum % 6));
  const baseTarget = 600 + levelNum * 150;
  return {
    level: levelNum,
    title: `Salon Prestige ${levelNum}`,
    maxMoves,
    customers: [
      {
        id: 'o1',
        customerId: 'priya',
        customerName: 'Priya',
        avatarKey: 'customer_2',
        goalType: 'clearLines',
        target: 4,
        rewardCoins: 120 + levelNum,
        description: 'Clear 4 puzzle lines',
      },
      {
        id: 'o2',
        customerId: 'simran',
        customerName: 'Simran',
        avatarKey: 'customer_3',
        goalType: 'score',
        target: baseTarget,
        rewardCoins: 150 + levelNum,
        description: `Score ${baseTarget} points`,
      },
      {
        id: 'o3',
        customerId: 'mrs_kapoor',
        customerName: 'Mrs. Kapoor',
        avatarKey: 'customer_1',
        goalType: 'pureShade',
        target: 1,
        rewardCoins: 180 + levelNum,
        description: 'Make 1 Pure Shade line',
      },
    ],
    starThresholds: [baseTarget, Math.round(baseTarget * 1.8), Math.round(baseTarget * 2.8)],
    difficulty: 'expert',
  };
}
