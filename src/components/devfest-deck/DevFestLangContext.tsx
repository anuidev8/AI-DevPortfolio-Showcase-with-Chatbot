'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEVFEST_LANG_KEY, devfestCopy, type DevFestCopy, type DevFestLang } from './devfest-copy';

type DevFestLangContextValue = {
  lang: DevFestLang;
  setLang: (lang: DevFestLang) => void;
  copyMap: Record<DevFestLang, DevFestCopy>;
  showLangToggle: boolean;
};

const DevFestLangContext = createContext<DevFestLangContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
  /** Default language before localStorage (DevFest: es, services: en). */
  initialLang?: DevFestLang;
  /** Swap the whole copy map (e.g. services deck). Defaults to DevFest talk copy. */
  copyMap?: Record<DevFestLang, DevFestCopy>;
  /** Persist key — isolate services vs DevFest preferences. */
  storageKey?: string;
  showLangToggle?: boolean;
};

export function DevFestLangProvider({
  children,
  initialLang = 'es',
  copyMap = devfestCopy,
  storageKey = DEVFEST_LANG_KEY,
  showLangToggle = true,
}: ProviderProps) {
  const [lang, setLangState] = useState<DevFestLang>(initialLang);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey) as DevFestLang | null;
      if (saved === 'es' || saved === 'en') setLangState(saved);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const setLang = (next: DevFestLang) => {
    setLangState(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <DevFestLangContext.Provider value={{ lang, setLang, copyMap, showLangToggle }}>
      {children}
    </DevFestLangContext.Provider>
  );
}

export function useDevFestLang() {
  const ctx = useContext(DevFestLangContext);
  if (!ctx) throw new Error('useDevFestLang must be used within DevFestLangProvider');
  return ctx;
}

export function useDevFestCopy(): DevFestCopy {
  const { lang, copyMap } = useDevFestLang();
  return copyMap[lang];
}
