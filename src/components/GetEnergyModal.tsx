import React from 'react';
import { OrnateModal } from './OrnateModal';
import { PriceButton } from './PriceButton';

interface GetEnergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefillWithGems: () => void;
  onWatchAd?: () => void;
  onOpenPass?: () => void;
  gemCost?: number;
  userGems: number;
}

export const GetEnergyModal: React.FC<GetEnergyModalProps> = ({
  isOpen,
  onClose,
  onRefillWithGems,
  onWatchAd,
  onOpenPass,
  gemCost = 20,
  userGems,
}) => {
  const canAfford = userGems >= gemCost;

  return (
    <OrnateModal
      isOpen={isOpen}
      onClose={onClose}
      title="Get Energy"
      themeColor="blue"
      maxWidth="max-w-xs"
    >
      <div className="flex flex-col items-center text-center p-2 space-y-4">
        {/* Big Energy Illustration */}
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#3DA9FC]/30 to-[#70C5FF]/10 flex items-center justify-center border-4 border-[#3DA9FC] shadow-inner">
          <span className="text-6xl filter drop-shadow-[0_4px_8px_rgba(61,169,252,0.5)]">
            ⚡
          </span>
          <div className="absolute -bottom-2 px-3 py-1 bg-[#3DA9FC] border-2 border-white rounded-full font-heading font-bold text-white text-xs game-stroke-sm">
            +30 Full Energy
          </div>
        </div>

        <p className="text-xs text-[var(--text,#2A1630)] dark:text-gray-200 font-medium max-w-[220px]">
          Refill your Sparkle Energy to keep serving clients at Gulab Mahal Salon!
        </p>

        {/* Refill Button with Gem Cost */}
        <div className="w-full space-y-2">
          <PriceButton
            label="Instant Refill"
            price={`${gemCost} Gems`}
            variant="green"
            disabled={!canAfford}
            onClick={() => {
              onRefillWithGems();
              onClose();
            }}
            className="w-full text-sm"
          />

          {onWatchAd && (
            <button
              onClick={() => {
                onWatchAd();
                onClose();
              }}
              className="btn-3d-gold w-full py-2 rounded-[18px] font-heading font-bold text-xs text-[#2A1630] flex items-center justify-center gap-1.5"
            >
              <span>📺 Free Refill (+10 Energy)</span>
            </button>
          )}
        </div>

        {/* Purple Premium Pass Banner */}
        <div
          onClick={() => {
            onClose();
            onOpenPass && onOpenPass();
          }}
          className="w-full mt-2 p-2.5 rounded-2xl bg-gradient-to-r from-[#6A3FC8] to-[#A774F0] border border-[#F5B53C] shadow-md cursor-pointer active:scale-95 transition-transform flex items-center justify-between text-left"
        >
          <div>
            <div className="text-[11px] font-heading font-bold text-white game-stroke-sm">
              👑 Glam Pass Member?
            </div>
            <div className="text-[9px] text-[#FDE68A] font-medium leading-tight">
              2x faster refill + unlimited play!
            </div>
          </div>
          <span className="text-xs text-white bg-black/30 px-2 py-1 rounded-full font-bold">
            View ▶
          </span>
        </div>
      </div>
    </OrnateModal>
  );
};
