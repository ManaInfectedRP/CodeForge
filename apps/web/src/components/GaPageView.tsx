'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** gtag.js only reports the page view it was loaded on, so client-side navigations would
 * otherwise be invisible to GA4. Reports one on every route change. gtag is only ever
 * defined after the visitor accepts cookies, so this is a no-op until then. Renders nothing. */
export function GaPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    const query = searchParams.toString();
    window.gtag('event', 'page_view', {
      page_path: pathname + (query ? `?${query}` : ''),
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams]);

  return null;
}
