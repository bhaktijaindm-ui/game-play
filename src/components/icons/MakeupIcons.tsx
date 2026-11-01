import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const LipstickIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Lipstick bullet */}
    <path d="M8 9L12 3L16 9V11H8V9Z" fill="#FF4081" stroke="#FFFFFF" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M8 9L12 3V11H8V9Z" fill="#F50057" />
    {/* Inner metal sheath */}
    <rect x="7.5" y="11" width="9" height="3" rx="0.8" fill="#FFD700" stroke="#FFFFFF" strokeWidth="1" />
    {/* Base holder */}
    <rect x="7" y="14" width="10" height="8" rx="1.5" fill="#2B1B2E" stroke="#FFFFFF" strokeWidth="1.2" />
    <rect x="9" y="15.5" width="2" height="5" rx="0.5" fill="#FFFFFF" opacity="0.3" />
  </svg>
);

export const EyeshadowIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Compact base */}
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#2B1B2E" stroke="#FFFFFF" strokeWidth="1.2" />
    {/* Four eyeshadow pans */}
    <rect x="5.5" y="5.5" width="5.5" height="5.5" rx="1.5" fill="#B388FF" />
    <rect x="13" y="5.5" width="5.5" height="5.5" rx="1.5" fill="#7C4DFF" />
    <rect x="5.5" y="13" width="5.5" height="5.5" rx="1.5" fill="#E1BEE7" />
    <rect x="13" y="13" width="5.5" height="5.5" rx="1.5" fill="#D1C4E9" />
    {/* Sparkle highlights on pans */}
    <circle cx="8" cy="8" r="1" fill="#FFFFFF" opacity="0.8" />
    <circle cx="15.5" cy="15.5" r="1" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

export const BlushIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Circular compact */}
    <circle cx="12" cy="12" r="9.5" fill="#2B1B2E" stroke="#FFFFFF" strokeWidth="1.2" />
    {/* Powder pan */}
    <circle cx="12" cy="12" r="7.5" fill="#FF8A65" stroke="#FFCCBC" strokeWidth="0.8" />
    {/* Swirl rosette texture */}
    <path d="M12 7.5C14.5 7.5 16.5 9.5 16.5 12C16.5 14.5 14.5 16.5 12 16.5C10 16.5 8.5 15 8.5 13.5C8.5 12.3 9.5 11.5 10.5 11.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
  </svg>
);

export const NailPolishIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cap handle */}
    <rect x="10" y="2" width="4" height="8" rx="1" fill="#2B1B2E" stroke="#FFFFFF" strokeWidth="1.2" />
    {/* Polish Glass Bottle */}
    <rect x="6" y="9.5" width="12" height="12.5" rx="3" fill="#E5484D" stroke="#FFFFFF" strokeWidth="1.2" />
    {/* Gloss reflection line */}
    <path d="M8.5 12V19.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <circle cx="15" cy="16" r="1.2" fill="#FFFFFF" opacity="0.5" />
  </svg>
);

export const HighlighterIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Gold compact base */}
    <circle cx="12" cy="12" r="9.5" fill="#FFD166" stroke="#FFFFFF" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="7" fill="#F5B700" />
    {/* Sunburst shimmer rays */}
    <path d="M12 6V8M12 16V18M6 12H8M16 12H18M7.8 7.8L9.2 9.2M14.8 14.8L16.2 16.2M16.2 7.8L14.8 9.2M9.2 14.8L7.8 16.2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2.5" fill="#FFF9C4" />
  </svg>
);

export const EyelinerIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Precision Pen barrel */}
    <path d="M4 20L18 6L15 3L1 17L4 20Z" fill="#2B1B2E" stroke="#FFFFFF" strokeWidth="1.2" />
    <line x1="13.5" y1="4.5" x2="16.5" y2="7.5" stroke="#FFD700" strokeWidth="1.5" />
    {/* Felt tip nib */}
    <path d="M1 17L0 24L7 23L4 20L1 17Z" fill="#111111" stroke="#FFFFFF" strokeWidth="1" />
    {/* Wing flourish */}
    <path d="M16 14C18 13 21 15 22 13" stroke="#2B1B2E" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const MintSkincareIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Dropper pipette / bottle */}
    <rect x="7" y="10" width="10" height="11.5" rx="2.5" fill="#2FBF71" stroke="#FFFFFF" strokeWidth="1.2" />
    <rect x="9.5" y="6" width="5" height="4" fill="#E0F2F1" stroke="#FFFFFF" strokeWidth="1" />
    <path d="M10 6C10 4.5 11 3 12 3C13 3 14 4.5 14 6H10Z" fill="#2B1B2E" stroke="#FFFFFF" strokeWidth="1" />
    {/* Botanical leaf icon on bottle */}
    <path d="M12 12C14 12 15 13.5 15 15.5C13 15.5 12 14.5 12 12Z" fill="#FFFFFF" />
    <path d="M12 12C10 12 9 13.5 9 15.5C11 15.5 12 14.5 12 12Z" fill="#C8E6C9" />
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
