import { useEffect } from 'react';

interface Props {
  title: string;
  description: string;
  /** optional schema.org JSON-LD object, injected as a <script type="application/ld+json"> */
  structuredData?: object;
}

/** Sets a per-page <title> and meta description (and optionally JSON-LD structured data),
 * restoring the site-wide defaults on unmount. Mirrors CanonicalLink's DOM-patching approach
 * since the app has no server-side rendering, this only helps crawlers that execute JS. */
export function PageMeta({ title, description, structuredData }: Props) {
  const structuredDataJson = structuredData ? JSON.stringify(structuredData) : null;

  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content') ?? null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);

    let script: HTMLScriptElement | null = null;
    if (structuredDataJson) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = structuredDataJson;
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription !== null) meta.setAttribute('content', prevDescription);
      if (script) document.head.removeChild(script);
    };
  }, [title, description, structuredDataJson]);

  return null;
}
