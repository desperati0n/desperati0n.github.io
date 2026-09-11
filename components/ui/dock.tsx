'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { createContext, useContext, useId, useMemo, type ReactNode } from 'react';

type DockContextValue = {
  size: number;
  pillLayoutId: string;
};

const DockContext = createContext<DockContextValue | null>(null);

export function Dock({
  children,
  size = 44,
  className = '',
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  const pillLayoutId = useId();
  const value = useMemo(() => ({ size, pillLayoutId }), [size, pillLayoutId]);

  return (
    <DockContext.Provider value={value}>
      <div
        className={`relative isolate inline-flex items-end gap-1.5 rounded-2xl border border-white/12 bg-black/72 px-2 py-1 shadow-[0_20px_55px_rgba(0,0,0,.48)] backdrop-blur-xl ${className}`}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
}

export function DockItem({
  children,
  active = false,
  label,
}: {
  children: ReactNode;
  active?: boolean;
  label: string;
}) {
  const dock = useContext(DockContext);
  const reduceMotion = useReducedMotion();
  const size = dock?.size ?? 44;
  const pillLayoutId = dock?.pillLayoutId ?? 'portfolio-dock-pill';

  return (
    <div
      style={{ width: size, height: size }}
      className="group relative flex shrink-0 items-center justify-center rounded-full text-white/55"
    >
      {active && (
        <motion.span
          layoutId={pillLayoutId}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32, mass: 0.6 }}
          className="absolute inset-0.5 -z-10 rounded-xl bg-white/10 ring-1 ring-inset ring-white/8"
        />
      )}
      {children}
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.7rem)] -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2 py-1 text-xs text-white/70 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </span>
    </div>
  );
}
