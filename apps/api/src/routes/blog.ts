import { Router } from 'express';
import type { BlogPostDetailDto, BlogPostSummaryDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { HttpError } from '../middleware/errors.ts';

const SITE_URL = 'https://kodstigen.se';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const blogRouter = Router();

blogRouter.get(
  '/',
  h(async (_req, res) => {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: { author: { select: { username: true } } },
      orderBy: { publishedAt: 'desc' },
    });
    const body: BlogPostSummaryDto[] = posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      coverImageUrl: p.coverImageUrl,
      authorUsername: p.author.username,
      publishedAt: (p.publishedAt ?? p.createdAt).toISOString(),
    }));
    res.json(body);
  })
);

// Registered before "/:slug" so the literal path wins, Express matches routes in
// registration order and would otherwise treat "feed.xml" as a slug.
blogRouter.get(
  '/feed.xml',
  h(async (_req, res) => {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: { author: { select: { username: true } } },
      orderBy: { publishedAt: 'desc' },
      take: 30,
    });

    const items = posts
      .map((p) => {
        const url = `${SITE_URL}/blog/${p.slug}`;
        const pubDate = (p.publishedAt ?? p.createdAt).toUTCString();
        return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(p.author.username)}</dc:creator>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`;
      })
      .join('\n');

    const lastBuildDate = (posts[0]?.publishedAt ?? posts[0]?.createdAt ?? new Date()).toUTCString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Kodstigen Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>News, deep dives, and updates from the Kodstigen team.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/api/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;

    res.set('Content-Type', 'application/rss+xml; charset=utf-8');
    res.send(xml);
  })
);

blogRouter.get(
  '/:slug',
  h(async (req, res) => {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: { author: { select: { username: true } } },
    });
    if (!post || post.status !== 'PUBLISHED') throw new HttpError(404, 'Post not found');

    const body: BlogPostDetailDto = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      coverImageUrl: post.coverImageUrl,
      authorUsername: post.author.username,
      publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
      content: post.content,
    };
    res.json(body);
  })
);
