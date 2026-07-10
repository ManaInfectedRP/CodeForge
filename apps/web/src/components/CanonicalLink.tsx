import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://kodstigen.se';

/** Keeps a single <link rel="canonical"> in <head> pointing at the current route (query
 * strings stripped), so search engines don't treat filtered/paginated URLs as duplicate
 * content. Renders nothing. */
export function CanonicalLink() {
  const location = useLocation();

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = `${SITE_URL}${location.pathname}`;
  }, [location.pathname]);

  return null;
}
