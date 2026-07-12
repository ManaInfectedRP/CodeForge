import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { translations as aboutTranslations } from '../src/pages/About.tsx';
import { pageText as faqPageText, buildFaqStructuredData } from '../src/pages/Faq.tsx';
import { BLOG_META } from '../src/pages/Blog.tsx';

const SITE_URL = 'https://kodstigen.se';

interface RouteMeta {
  path: string;
  title?: string;
  description?: string;
  structuredData?: object;
}

const ROUTES: RouteMeta[] = [
  { path: '/' },
  { path: '/login' },
  { path: '/register' },
  { path: '/courses/sample-programming-basics' },
  { path: '/about', title: aboutTranslations.en.metaTitle, description: aboutTranslations.en.metaDescription },
  { path: '/blog', title: BLOG_META.title, description: BLOG_META.description },
  {
    path: '/faq',
    title: faqPageText.en.metaTitle,
    description: faqPageText.en.metaDescription,
    structuredData: buildFaqStructuredData('en'),
  },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(template: string, route: RouteMeta): string {
  let html = template;

  if (route.title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
  }

  if (route.description) {
    html = html.replace(
      /<meta\s+name="description"[^>]*\/?>/is,
      `<meta name="description" content="${escapeHtml(route.description)}" />`
    );
  }

  const headExtras = [`<link rel="canonical" href="${SITE_URL}${route.path}" />`];
  if (route.structuredData) {
    headExtras.push(`<script type="application/ld+json">${JSON.stringify(route.structuredData)}</script>`);
  }
  html = html.replace('</head>', `  ${headExtras.join('\n  ')}\n  </head>`);

  return html;
}

function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.resolve(__dirname, '../dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Prerender: ${templatePath} not found, run vite build first.`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  for (const route of ROUTES) {
    const html = render(template, route);
    const outPath =
      route.path === '/' ? templatePath : path.join(distDir, route.path.replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
    console.log(`Prerendered ${route.path} -> ${path.relative(distDir, outPath)}`);
  }
}

main();
