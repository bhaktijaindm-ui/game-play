import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info' | 'glam';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-game-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-game-accent" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-game-danger" />;
      case 'glam':
        return <Sparkles className="w-5 h-5 text-game-primary animate-pulse" />;
      default:
        return <Info className="w-5 h-5 text-game-secondary" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.9 }}
              className="pointer-events-auto flex items-center gap-3 bg-game-surface border border-game-border shadow-soft-lg rounded-2xl px-4 py-3 text-sm font-medium text-game-text"
            >
              <div className="flex-shrink-0">{getIcon(toast.type)}</div>
              <div className="flex-1">{toast.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
