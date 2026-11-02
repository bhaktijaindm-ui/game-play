import { useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  showHandle?: boolean;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className = '',
  showHandle = true,
}: BottomSheetProps) {
  const reducedMotion = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Dismiss if dragged down more than 100px or swiped down with velocity
    if (info.offset.y > 100 || info.velocity.y > 400) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'glam-sheet-title' : undefined}
            drag={reducedMotion ? false : 'y'}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.55 }}
            onDragEnd={handleDragEnd}
            initial={reducedMotion ? { opacity: 0 } : { y: '100%' }}
            animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { y: '100%' }}
            transition={{
              type: reducedMotion ? 'tween' : 'spring',
              duration: reducedMotion ? 0.25 : undefined,
              damping: 32,
              stiffness: 350,
            }}
            className={`relative w-full max-w-lg max-h-[85vh] bg-[var(--surface)] text-[var(--text)] rounded-t-[32px] border-t border-x border-[var(--border)] shadow-2xl flex flex-col z-10 touch-none select-none ${className}`}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div className="pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing">
                <span
                  aria-label="Drag down to dismiss"
                  className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full transition-colors hover:bg-zinc-400 dark:hover:bg-zinc-500"
                />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="px-6 py-2 border-b border-[var(--border)] shrink-0">
                <h3 id="glam-sheet-title" className="text-xl font-bold tracking-tight text-center text-[var(--text)] m-0">
                  {title}
                </h3>
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto overscroll-contain touch-auto select-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
