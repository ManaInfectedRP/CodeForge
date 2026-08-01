'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'en' | 'sv';

const STORAGE_KEY = 'kodstigen-language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Pages are prerendered at build time with the default language, so the stored
  // preference can only be applied after hydration, reading it during render would
  // make the first client paint disagree with the served HTML.
  const [language, setLanguageState] = useState<Language>('sv');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'sv') setLanguageState(stored);
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
