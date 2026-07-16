export const GA_MEASUREMENT_ID = 'G-P9YBE3DENC';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

/** Injects the gtag.js script and initializes GA4. Only ever runs once, and only after the
 * user has granted cookie consent, never on initial page load. */
export function loadGoogleAnalytics() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/** Best-effort removal of any GA cookies set before consent was withdrawn or declined,
 * GA cookies are readable/writable from JS (not httpOnly), so this covers the common cases. */
export function clearGoogleAnalyticsCookies() {
  if (typeof document === 'undefined') return;
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_') || name === '_gid' || name === '_gat');

  const domainParts = window.location.hostname.split('.');
  const domains = [window.location.hostname, `.${window.location.hostname}`];
  if (domainParts.length > 2) domains.push(`.${domainParts.slice(-2).join('.')}`);

  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    }
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
}
