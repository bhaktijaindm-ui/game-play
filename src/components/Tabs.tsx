import { type KeyboardEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

export interface TabItem {
  label: string;
  value: string;
  icon?: ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  className?: string;
  variant?: 'pill' | 'underline';
}

export function Tabs({
  tabs,
  active,
  onChange,
  fullWidth = true,
  className = '',
  variant = 'pill',
}: TabsProps) {
  const reducedMotion = useReducedMotion();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else {
      return;
    }

    e.preventDefault();
    onChange(tabs[nextIndex].value);
  };

  if (variant === 'underline') {
    return (
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={`flex border-b border-[var(--border)] gap-2 ${className}`}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.value === active;
          return (
            <button
              key={tab.value}
              role="tab"
              type="button"
              id={`tab-${tab.value}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.value)}
              onKeyDown={(e) => handleKeyDown(e as unknown as KeyboardEvent<HTMLDivElement>, idx)}
              className={`relative py-3 px-4 font-semibold text-sm transition-colors flex items-center justify-center gap-2 outline-none focus-visible:text-[var(--primary)] ${
                fullWidth ? 'flex-1' : ''
              } ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[var(--text)]">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId={reducedMotion ? undefined : 'glamActiveTabUnderline'}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`p-1.5 bg-zinc-200/70 dark:bg-zinc-800/70 rounded-2xl flex items-center gap-1 backdrop-blur-sm ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            id={`tab-${tab.value}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(e) => handleKeyDown(e as unknown as KeyboardEvent<HTMLDivElement>, idx)}
            className={`relative z-10 py-2 px-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${
              fullWidth ? 'flex-1' : ''
            } ${isActive ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
          >
            {isActive && (
              <motion.div
                layoutId={reducedMotion ? undefined : 'glamActiveTabPill'}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light, #f472b6) 100%)',
                }}
                className="absolute inset-0 rounded-xl shadow-md shadow-pink-500/20 -z-10"
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold relative z-10 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-zinc-300 dark:bg-zinc-700 text-[var(--text)]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
