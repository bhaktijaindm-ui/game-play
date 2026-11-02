import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export type StarRatingSize = 'sm' | 'md' | 'lg';

export interface StarRatingProps {
  stars: number; // 0 to 3
  maxStars?: number;
  animated?: boolean;
  size?: StarRatingSize;
  className?: string;
}

export function StarRating({
  stars,
  maxStars = 3,
  animated = true,
  size = 'md',
  className = '',
}: StarRatingProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animated && !reducedMotion;

  const starIndices = Array.from({ length: maxStars }, (_, i) => i + 1);

  const sizeClasses: Record<StarRatingSize, { star: string; middleOffset: string; gap: string }> = {
    sm: { star: 'w-6 h-6', middleOffset: '-translate-y-1', gap: 'gap-1.5' },
    md: { star: 'w-10 h-10', middleOffset: '-translate-y-2', gap: 'gap-2.5' },
    lg: { star: 'w-14 h-14', middleOffset: '-translate-y-3', gap: 'gap-3.5' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      role="img"
      aria-label={`${Math.min(stars, maxStars)} of ${maxStars} stars`}
      className={`inline-flex items-center justify-center ${currentSize.gap} ${className}`}
    >
      {starIndices.map((index) => {
        const isEarned = index <= stars;
        const isMiddle = index === 2 && maxStars === 3;

        return (
          <motion.div
            key={index}
            initial={shouldAnimate ? { scale: 0, rotate: -60, opacity: 0 } : false}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={
              shouldAnimate
                ? {
                    type: 'spring',
                    stiffness: 300,
                    damping: 14,
                    delay: isEarned ? (index - 1) * 0.22 : 0,
                  }
                : { duration: 0 }
            }
            className={`relative flex items-center justify-center ${isMiddle ? currentSize.middleOffset : ''}`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`${currentSize.star} drop-shadow-md select-none`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={`starEarnedGrad-${index}`} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fef08a" />
                  <stop offset="0.45" stopColor="#facc15" />
                  <stop offset="1" stopColor="#ca8a04" />
                </linearGradient>
                <filter id={`starGlow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {isEarned ? (
                <>
                  {/* Glowing background */}
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="url(#starEarnedGrad-1)"
                    filter={`url(#starGlow-${index})`}
                    stroke="#eab308"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  {/* Front star */}
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill={`url(#starEarnedGrad-${index})`}
                    stroke="#a16207"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  {/* Star Specular Highlights */}
                  <polygon
                    points="12,2 15.09,8.26 12,11.5 8.91,8.26"
                    fill="#ffffff"
                    fillOpacity="0.4"
                  />
                  <polygon
                    points="12,11.5 17,14.14 12,17.77"
                    fill="#ffffff"
                    fillOpacity="0.2"
                  />
                </>
              ) : (
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-700"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
