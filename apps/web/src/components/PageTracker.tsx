import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api';

const VISITOR_ID_KEY = 'kodstigen_visitor_id';

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

/** Collapses dynamic id segments (e.g. lesson/course ids) so the analytics dashboard
 * groups "/lessons/:id" together instead of fragmenting into one row per lesson. */
function normalizePath(pathname: string): string {
  const normalized = pathname
    .split('/')
    .map((segment) => (/^[a-z0-9]{20,}$/i.test(segment) ? ':id' : segment))
    .join('/');
  return normalized || '/';
}

/** Fires a page-view event on every route change. Renders nothing, failures are silent. */
export function PageTracker() {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = normalizePath(location.pathname);
    if (lastPath.current === path) return;
    lastPath.current = path;

    api
      .post('/analytics/track', {
        path,
        visitorId: getVisitorId(),
        referrer: document.referrer || null,
      })
      .catch(() => {
        // tracking must never disrupt the actual page
      });
  }, [location.pathname]);

  return null;
}
