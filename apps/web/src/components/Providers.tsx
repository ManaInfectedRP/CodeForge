'use client';

import type { ReactNode } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { CookieConsentProvider } from '@/context/CookieConsentContext';

/** Client-side context that has to wrap the whole tree. Kept in its own module so the root
 * layout can stay a server component. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CookieConsentProvider>{children}</CookieConsentProvider>
    </LanguageProvider>
  );
}
