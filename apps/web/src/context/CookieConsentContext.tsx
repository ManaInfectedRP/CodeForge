import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { clearGoogleAnalyticsCookies, loadGoogleAnalytics } from '../lib/analytics';

export type ConsentStatus = 'unset' | 'granted' | 'denied';

const STORAGE_KEY = 'kodstigen-cookie-consent';

interface CookieConsentContextValue {
  status: ConsentStatus;
  /** true once the banner should be visible: no decision yet, or the user reopened settings */
  bannerOpen: boolean;
  accept: () => void;
  decline: () => void;
  /** reopens the banner so the user can change an earlier decision, e.g. from a footer link */
  openSettings: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function readStoredStatus(): ConsentStatus {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  return stored === 'granted' || stored === 'denied' ? stored : 'unset';
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>(readStoredStatus);
  const [bannerOpen, setBannerOpen] = useState(() => readStoredStatus() === 'unset');

  useEffect(() => {
    if (status === 'granted') loadGoogleAnalytics();
  }, [status]);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'granted');
    setStatus('granted');
    setBannerOpen(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'denied');
    clearGoogleAnalyticsCookies();
    setStatus('denied');
    setBannerOpen(false);
  }

  function openSettings() {
    setBannerOpen(true);
  }

  return (
    <CookieConsentContext.Provider value={{ status, bannerOpen, accept, decline, openSettings }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used inside CookieConsentProvider');
  return ctx;
}
