import React from 'react';

interface PriceButtonProps {
  label: string;
  price?: string;
  currencyIcon?: React.ReactNode;
  variant?: 'green' | 'purple' | 'gold' | 'blue' | 'pink';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PriceButton: React.FC<PriceButtonProps> = ({
  label,
  price,
  currencyIcon,
  variant = 'green',
  disabled = false,
  loading = false,
  onClick,
  className = '',
}) => {
  const variantClass = {
    green: 'btn-3d-green text-white',
    purple: 'btn-3d-purple text-white',
    gold: 'btn-3d-gold text-[#2A1630]',
    blue: 'btn-3d-blue text-white',
    pink: 'btn-3d-pink text-white',
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[18px] font-heading font-bold text-base select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
    >
      {/* Top Gloss Highlight */}
      <span className="absolute top-0 left-2 right-2 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[16px] pointer-events-none" />

      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {currencyIcon && <span className="text-lg">{currencyIcon}</span>}
          <span>{label}</span>
          {price && <span className="ml-1 opacity-95">({price})</span>}
        </>
      )}
    </button>
  );
};
