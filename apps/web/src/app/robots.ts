import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/** Everything is public now that there are no accounts, so nothing is disallowed. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://kodstigen.se/sitemap.xml',
  };
}
