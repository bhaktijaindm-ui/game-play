import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export type SkeletonRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | string;

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: SkeletonRounded;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = '',
}: SkeletonProps) {
  const reducedMotion = useReducedMotion();

  const roundedClasses: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  const roundedClass = roundedClasses[rounded] ?? (typeof rounded === 'string' && !rounded.startsWith('round') ? `rounded-[${rounded}]` : rounded);

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      role="status"
      aria-hidden="true"
      style={style}
      className={`relative overflow-hidden bg-zinc-200/80 dark:bg-zinc-800/80 ${roundedClass} ${className}`}
    >
      {!reducedMotion && (
        <div
          className="absolute inset-0 w-full h-full animate-shimmer"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}
    </div>
  );
}
