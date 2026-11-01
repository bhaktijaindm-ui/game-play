import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const LipstickIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="luxeLipGrad" x1="8" y1="3" x2="16" y2="11" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF4081" />
        <stop offset="0.6" stopColor="#E91E8C" />
        <stop offset="1" stopColor="#880E4F" />
      </linearGradient>
      <linearGradient id="goldBandGrad" x1="7" y1="11" x2="17" y2="14" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE082" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#AA7C11" />
      </linearGradient>
      <linearGradient id="tubeGrad" x1="7" y1="14" x2="17" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3A2234" />
        <stop offset="0.5" stopColor="#1E101D" />
        <stop offset="1" stopColor="#0F070E" />
      </linearGradient>
    </defs>
    {/* Lipstick angled bullet */}
    <path d="M8 8.5L12 2.5C12.5 1.8 13.5 1.8 14 2.5L15.5 8.5V11H8V8.5Z" fill="url(#luxeLipGrad)" stroke="#FFFFFF" strokeWidth="0.8" />
    <path d="M8.5 8L12 3V11H8.5V8Z" fill="#FFFFFF" fillOpacity="0.25" />
    {/* Inner gold metal collar */}
    <rect x="7.5" y="11" width="9" height="3" rx="0.8" fill="url(#goldBandGrad)" stroke="#FFFFFF" strokeWidth="0.6" />
    <line x1="8" y1="12.5" x2="16" y2="12.5" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
    {/* Outer luxury noir tube */}
    <rect x="7" y="14" width="10" height="8" rx="1.5" fill="url(#tubeGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
    {/* Sleek vertical gloss highlight */}
    <rect x="8.5" y="15" width="1.5" height="6" rx="0.75" fill="#FFFFFF" fillOpacity="0.35" />
  </svg>
);

export const EyeshadowIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="eyeshadowCaseGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E2A69A" />
        <stop offset="0.5" stopColor="#C5837B" />
        <stop offset="1" stopColor="#7E4743" />
      </linearGradient>
    </defs>
    {/* Rose gold luxury compact case */}
    <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="url(#eyeshadowCaseGrad)" stroke="#FFFFFF" strokeWidth="0.8" />
    <rect x="4" y="4" width="16" height="16" rx="2.5" fill="#1C111E" fillOpacity="0.85" />
    {/* 4 Multi-reflect shadow pans */}
    <rect x="5.5" y="5.5" width="5.5" height="5.5" rx="1.5" fill="#B388FF" stroke="#FFFFFF" strokeWidth="0.4" />
    <rect x="13" y="5.5" width="5.5" height="5.5" rx="1.5" fill="#7C4DFF" stroke="#FFFFFF" strokeWidth="0.4" />
    <rect x="5.5" y="13" width="5.5" height="5.5" rx="1.5" fill="#FF80AB" stroke="#FFFFFF" strokeWidth="0.4" />
    <rect x="13" y="13" width="5.5" height="5.5" rx="1.5" fill="#FFD166" stroke="#FFFFFF" strokeWidth="0.4" />
    {/* Diamond sparkle reflections */}
    <circle cx="8" cy="8" r="1.2" fill="#FFFFFF" fillOpacity="0.9" />
    <circle cx="15.5" cy="15.5" r="1.2" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M15.5 6L16 7.5L17.5 8L16 8.5L15.5 10L15 8.5L13.5 8L15 7.5L15.5 6Z" fill="#FFFFFF" fillOpacity="0.85" />
  </svg>
);

export const BlushIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="blushRimGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5D0C5" />
        <stop offset="0.5" stopColor="#C5837B" />
        <stop offset="1" stopColor="#8C4E47" />
      </linearGradient>
      <radialGradient id="blushPowderGrad" cx="12" cy="12" r="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFCCBC" />
        <stop offset="0.6" stopColor="#FF8A65" />
        <stop offset="1" stopColor="#E64A19" />
      </radialGradient>
    </defs>
    {/* Circular rose gold compact */}
    <circle cx="12" cy="12" r="9.5" fill="url(#blushRimGrad)" stroke="#FFFFFF" strokeWidth="0.8" />
    {/* Soft peach powder core */}
    <circle cx="12" cy="12" r="7.5" fill="url(#blushPowderGrad)" stroke="#FFE0B2" strokeWidth="0.5" />
    {/* Embossed rosette swirl */}
    <path d="M12 6.8C14.8 6.8 17.2 9.2 17.2 12C17.2 14.8 14.8 17.2 12 17.2C9.5 17.2 7.5 15.2 7.5 12.8C7.5 10.8 9.2 9.2 11.2 9.2C12.8 9.2 14 10.4 14 12C14 13.2 13 14.2 11.8 14.2" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

export const NailPolishIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="polishLacquerGrad" x1="6" y1="9" x2="18" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF5252" />
        <stop offset="0.6" stopColor="#D32F2F" />
        <stop offset="1" stopColor="#7F0000" />
      </linearGradient>
      <linearGradient id="polishCapGrad" x1="9.5" y1="1.5" x2="14.5" y2="9" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4A2838" />
        <stop offset="0.7" stopColor="#1B0C16" />
        <stop offset="1" stopColor="#080206" />
      </linearGradient>
    </defs>
    {/* Brush cap handle */}
    <rect x="9.5" y="1.5" width="5" height="7.5" rx="1.2" fill="url(#polishCapGrad)" stroke="#FFFFFF" strokeWidth="0.6" />
    {/* Rose gold collar band */}
    <rect x="9" y="8" width="6" height="1.8" rx="0.5" fill="#D4AF37" stroke="#FFFFFF" strokeWidth="0.5" />
    {/* Heavy crystal bottle */}
    <rect x="5.5" y="9.5" width="13" height="12.5" rx="3.5" fill="url(#polishLacquerGrad)" stroke="#FFFFFF" strokeWidth="0.9" />
    {/* Glass reflection beam */}
    <path d="M8 12V20" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
    <circle cx="15.5" cy="18" r="1.2" fill="#FFFFFF" fillOpacity="0.5" />
  </svg>
);

export const BrushIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="brushBristleGrad" x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF4081" />
        <stop offset="0.5" stopColor="#2A1625" />
        <stop offset="1" stopColor="#120A10" />
      </linearGradient>
      <linearGradient id="brushFerruleGrad" x1="9" y1="10" x2="15" y2="15" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5D0C5" />
        <stop offset="0.5" stopColor="#C5837B" />
        <stop offset="1" stopColor="#AA7C11" />
      </linearGradient>
    </defs>
    {/* Soft fan bristles */}
    <path d="M7 6C7 3.5 9 2 12 2C15 2 17 3.5 17 6L16 10H8L7 6Z" fill="url(#brushBristleGrad)" stroke="#FFFFFF" strokeWidth="0.6" />
    <path d="M12 2C13.5 2 14.5 3.5 14.5 6L13.8 10H10.2L9.5 6C9.5 3.5 10.5 2 12 2Z" fill="#FF80AB" fillOpacity="0.4" />
    {/* Rose gold ferrule metal */}
    <rect x="8.5" y="10" width="7" height="4.5" rx="0.8" fill="url(#brushFerruleGrad)" stroke="#FFFFFF" strokeWidth="0.5" />
    {/* Wooden lacquer handle */}
    <path d="M10 14.5L10.5 22C10.5 22.5 11 23 12 23C13 23 13.5 22.5 13.5 22L14 14.5H10Z" fill="#2A1625" stroke="#FFFFFF" strokeWidth="0.6" />
    <rect x="11.2" y="15" width="1.6" height="5" rx="0.8" fill="#FFFFFF" fillOpacity="0.3" />
  </svg>
);

export const PerfumeIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="perfumeLiquidGrad" x1="6" y1="9" x2="18" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF9C4" />
        <stop offset="0.5" stopColor="#FFD54F" />
        <stop offset="1" stopColor="#FFB300" />
      </linearGradient>
      <linearGradient id="crystalCapGrad" x1="10" y1="2" x2="14" y2="6" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#8D6E1C" />
      </linearGradient>
    </defs>
    {/* Faceted glass stopper / spray top */}
    <rect x="9.5" y="1.5" width="5" height="4" rx="1" fill="url(#crystalCapGrad)" stroke="#FFFFFF" strokeWidth="0.6" />
    <rect x="10.5" y="5.5" width="3" height="2.5" fill="#D4AF37" />
    {/* Luxury crystal flacon body */}
    <path d="M7 8H17L19 12V19.5C19 20.8 17.8 22 16.5 22H7.5C6.2 22 5 20.8 5 19.5V12L7 8Z" fill="url(#perfumeLiquidGrad)" stroke="#FFFFFF" strokeWidth="0.9" />
    {/* Crystal facet highlights */}
    <path d="M7 8L9.5 14H14.5L17 8" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.75" />
    <path d="M9.5 14L8.5 22M14.5 14L15.5 22" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.6" />
    <circle cx="12" cy="17.5" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
  </svg>
);

export const HighlighterIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="goldCompactGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF59D" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#8D6E1C" />
      </linearGradient>
    </defs>
    {/* Gold metal compact */}
    <circle cx="12" cy="12" r="9.5" fill="url(#goldCompactGrad)" stroke="#FFFFFF" strokeWidth="0.8" />
    <circle cx="12" cy="12" r="7.5" fill="#FFF8E1" stroke="#F5B700" strokeWidth="0.6" />
    {/* Sunburst shimmer rays */}
    <path d="M12 5.5V7.5M12 16.5V18.5M5.5 12H7.5M16.5 12H18.5M7.5 7.5L9 9M15 15L16.5 16.5M16.5 7.5L15 9M9 15L7.5 16.5" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
    {/* Radiant center pearl */}
    <circle cx="12" cy="12" r="3" fill="#FFFFFF" stroke="#F5B700" strokeWidth="0.8" />
    <circle cx="11.2" cy="11.2" r="1" fill="#FFFFFF" />
  </svg>
);

export const EyelinerIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Precision Pen barrel */}
    <path d="M4 20L18 6L15 3L1 17L4 20Z" fill="#1C101E" stroke="#FFFFFF" strokeWidth="0.8" />
    <line x1="13" y1="4.5" x2="16.5" y2="8" stroke="#D4AF37" strokeWidth="1.6" />
    {/* Felt tip nib */}
    <path d="M1 17L0 24L7 23L4 20L1 17Z" fill="#0B050C" stroke="#FFFFFF" strokeWidth="0.8" />
    {/* Precision wing flick */}
    <path d="M15 15C17.5 13.5 21 16 22.5 13.5" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="5.5" y="11" width="1.5" height="5" rx="0.75" transform="rotate(-45 5.5 11)" fill="#FFFFFF" fillOpacity="0.4" />
  </svg>
);

export const MintSkincareIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="skincareGlassGrad" x1="6" y1="9" x2="18" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A7F3D0" />
        <stop offset="0.6" stopColor="#34D399" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Dropper bulb & pipette */}
    <path d="M10 5C10 3.5 11 2 12 2C13 2 14 3.5 14 5H10Z" fill="#2A1625" stroke="#FFFFFF" strokeWidth="0.6" />
    <rect x="9.5" y="5" width="5" height="4" fill="#E2E8F0" stroke="#D4AF37" strokeWidth="0.8" />
    {/* Frosted emerald bottle */}
    <rect x="6.5" y="9" width="11" height="12.5" rx="3" fill="url(#skincareGlassGrad)" stroke="#FFFFFF" strokeWidth="0.9" />
    {/* Dewdrop botanical emblem */}
    <path d="M12 12C13.8 12 15 13.6 15 15.5C15 17 13.7 18 12 18C10.3 18 9 17 9 15.5C9 13.6 10.2 12 12 12Z" fill="#FFFFFF" fillOpacity="0.85" />
    <circle cx="12" cy="15.5" r="1.2" fill="#34D399" />
  </svg>
);

export const RenderMakeupIcon: React.FC<{ type: string; size?: number; className?: string }> = ({
  type,
  size = 20,
  className = '',
}) => {
  switch (type) {
    case 'lipstick':
      return <LipstickIcon size={size} className={className} />;
    case 'eyeshadow':
      return <EyeshadowIcon size={size} className={className} />;
    case 'blush':
      return <BlushIcon size={size} className={className} />;
    case 'brush':
      return <BrushIcon size={size} className={className} />;
    case 'perfume':
      return <PerfumeIcon size={size} className={className} />;
    case 'nail_polish':
      return <NailPolishIcon size={size} className={className} />;
    case 'highlighter':
      return <HighlighterIcon size={size} className={className} />;
    case 'eyeliner':
      return <EyelinerIcon size={size} className={className} />;
    case 'mint_skincare':
      return <MintSkincareIcon size={size} className={className} />;
    default:
      return <LipstickIcon size={size} className={className} />;
  }
};
