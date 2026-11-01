import { COLLECTIBLE_LOOKS } from '../../config/product.config';
import type { CollectibleLook } from '../../config/product.config';

export interface GlamAvatarProps {
  lookId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGoldenFrame?: boolean;
  className?: string;
}

export const GlamAvatar: React.FC<GlamAvatarProps> = ({
  lookId = 'look_natural_glow',
  size = 'md',
  showGoldenFrame = false,
  className = '',
}) => {
  const currentLook: CollectibleLook =
    COLLECTIBLE_LOOKS.find((l) => l.id === lookId) || COLLECTIBLE_LOOKS[0];

  const {
    skinTone,
    lipColor,
    eyeColor,
    eyeshadowColor,
    blushColor,
    eyelinerStyle,
    highlighterGlow,
    accessory,
    hairColor,
    backgroundAura,
  } = currentLook.avatarConfig;

  const sizePixels = {
    sm: 40,
    md: 56,
    lg: 80,
    xl: 120,
  }[size];

  return (
    <div
      style={{
        width: sizePixels,
        height: sizePixels,
        background: backgroundAura,
      }}
      className={`
        relative rounded-full overflow-hidden flex items-center justify-center shadow-soft flex-shrink-0
        ${showGoldenFrame ? 'ring-4 ring-amber-400 shadow-glossy-gold' : 'border-2 border-white/80'}
        ${className}
      `}
    >
      <svg
        viewBox="0 0 100 100"
        width={sizePixels}
        height={sizePixels}
        className="w-full h-full"
      >
        <defs>
          {/* Highlighter Soft Glow */}
          <radialGradient id={`glow-${lookId}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={highlighterGlow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={highlighterGlow} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Hair Background Layer */}
        <path
          d="M 20 60 C 15 30, 20 10, 50 10 C 80 10, 85 30, 80 60 C 80 85, 20 85, 20 60 Z"
          fill={hairColor}
        />

        {/* Neck */}
        <rect x="42" y="68" width="16" height="20" rx="4" fill={skinTone} />

        {/* Head Shape */}
        <ellipse cx="50" cy="50" rx="26" ry="29" fill={skinTone} />

        {/* Hair Front / Bangs / Waves */}
        <path
          d="M 24 45 C 24 22, 35 15, 50 15 C 65 15, 76 22, 76 45 C 70 32, 60 28, 50 28 C 40 28, 30 32, 24 45 Z"
          fill={hairColor}
        />

        {/* Cheek Blush (Left & Right) */}
        <circle cx="34" cy="56" r="7" fill={blushColor} opacity="0.45" />
        <circle cx="66" cy="56" r="7" fill={blushColor} opacity="0.45" />

        {/* Highlighter Cheeks Glow */}
        <circle cx="33" cy="52" r="4.5" fill={`url(#glow-${lookId})`} />
        <circle cx="67" cy="52" r="4.5" fill={`url(#glow-${lookId})`} />

        {/* Eyeshadow */}
        <ellipse cx="38" cy="46" rx="6.5" ry="4" fill={eyeshadowColor} opacity="0.8" />
        <ellipse cx="62" cy="46" rx="6.5" ry="4" fill={eyeshadowColor} opacity="0.8" />

        {/* Eyes (Sclera & Pupil) */}
        <ellipse cx="38" cy="47" rx="4.5" ry="3" fill="#FFFFFF" />
        <ellipse cx="62" cy="47" rx="4.5" ry="3" fill="#FFFFFF" />
        <circle cx="38.5" cy="47" r="2.2" fill={eyeColor} />
        <circle cx="62.5" cy="47" r="2.2" fill={eyeColor} />
        <circle cx="37.5" cy="46" r="0.8" fill="#FFFFFF" />
        <circle cx="61.5" cy="46" r="0.8" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path d="M 33 42 Q 38 40 43 43" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 57 43 Q 62 40 67 42" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Eyeliner Wing Styles */}
        {eyelinerStyle === 'cat-eye' && (
          <>
            <path d="M 33 46 Q 38 44 43 46 L 31 43" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 57 46 Q 62 44 67 46 L 69 43" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </>
        )}
        {eyelinerStyle === 'bold-wing' && (
          <>
            <path d="M 33 46 Q 38 43 43 46 L 29 41" stroke="#111111" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 57 46 Q 62 43 67 46 L 71 41" stroke="#111111" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        )}
        {eyelinerStyle === 'glam-star' && (
          <>
            <path d="M 33 46 Q 38 43 43 46 L 28 41" stroke="#111111" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 57 46 Q 62 43 67 46 L 72 41" stroke="#111111" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="28" cy="41" r="1.5" fill="#FFD700" />
            <circle cx="72" cy="41" r="1.5" fill="#FFD700" />
          </>
        )}
        {eyelinerStyle === 'natural' && (
          <>
            <path d="M 34 46 Q 38 44.5 42 46" stroke="#333333" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 58 46 Q 62 44.5 66 46" stroke="#333333" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Nose Tip */}
        <path d="M 50 50 Q 51 54 48 55" stroke="#C49176" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* Lipstick / Lips */}
        <path
          d="M 44 62 Q 50 60 56 62 Q 50 67 44 62 Z"
          fill={lipColor}
          stroke="#FFFFFF"
          strokeWidth="0.4"
        />
        {/* Lip gloss shine */}
        <ellipse cx="50" cy="62.5" rx="3" ry="0.8" fill="#FFFFFF" opacity="0.5" />

        {/* Accessories */}
        {accessory === 'pearl-earrings' && (
          <>
            <circle cx="23" cy="54" r="3.2" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.8" />
            <circle cx="77" cy="54" r="3.2" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.8" />
          </>
        )}
        {accessory === 'gold-hoops' && (
          <>
            <circle cx="23" cy="55" r="4.5" fill="none" stroke="#F5B700" strokeWidth="1.8" />
            <circle cx="77" cy="55" r="4.5" fill="none" stroke="#F5B700" strokeWidth="1.8" />
          </>
        )}
        {accessory === 'diamond-tiara' && (
          <path
            d="M 35 22 L 42 14 L 50 20 L 58 14 L 65 22 Z"
            fill="#FFD700"
            stroke="#FFFFFF"
            strokeWidth="1"
          />
        )}
        {accessory === 'flower-pin' && (
          <g transform="translate(68, 24)">
            <circle cx="0" cy="0" r="4.5" fill="#FF80AB" />
            <circle cx="0" cy="0" r="2" fill="#FFFF00" />
          </g>
        )}
        {accessory === 'choker' && (
          <path d="M 42 74 Q 50 78 58 74" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </div>
  );
};
