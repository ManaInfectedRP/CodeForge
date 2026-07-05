import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api';

/** Collapses dynamic id segments (e.g. lesson/course ids) so the analytics dashboard
 * groups "/lessons/:id" together instead of fragmenting into one row per lesson. */
function normalizePath(pathname: string): string {
  const normalized = pathname
    .split('/')
    .map((segment) => (/^[a-z0-9]{20,}$/i.test(segment) ? ':id' : segment))
    .join('/');
  return normalized || '/';
}

/** Bumps that page's hit counter on every route change. Renders nothing, failures are silent. */
export function PageTracker() {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = normalizePath(location.pathname);
    if (lastPath.current === path) return;
    lastPath.current = path;

    api.post('/analytics/track', { path }).catch(() => {
      // tracking must never disrupt the actual page
    });
  }, [location.pathname]);

  return null;
}
