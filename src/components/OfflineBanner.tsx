import { motion, AnimatePresence } from 'framer-motion';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineBanner() {
  const { isOnline } = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-stone-900 px-4 py-2 text-center text-xs font-semibold shadow-md flex items-center justify-center gap-2"
          role="status"
          aria-live="polite"
        >
          <span className="w-2 h-2 rounded-full bg-stone-900 animate-pulse" />
          <span>Offline mode — Gameplay saved locally</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
