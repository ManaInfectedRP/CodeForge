import { Router } from 'express';
import type { BlogPostDetailDto, BlogPostSummaryDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { HttpError } from '../middleware/errors.ts';

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
