import { Router } from 'express';
import { z } from 'zod';
import type { AdminBlogPostDetailDto, AdminBlogPostSummaryDto } from '@codeforge/shared';
import type { BlogPost } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';

const createSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(160),
});

const updateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(160),
  excerpt: z.string().max(300),
  content: z.string(),
  coverImageUrl: z.string().url().max(2000).nullable(),
});

async function uniqueSlug(title: string): Promise<string> {
  const base =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'post';
  let slug = base;
  let suffix = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

async function findPost(id: string): Promise<BlogPost> {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw new HttpError(404, 'Post not found');
  return post;
}

function toSummaryDto(p: BlogPost & { author: { username: string } }): AdminBlogPostSummaryDto {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    status: p.status,
    authorUsername: p.author.username,
    createdAt: p.createdAt.toISOString(),
    publishedAt: p.publishedAt?.toISOString() ?? null,
  };
}

export const adminBlogRouter = Router();

adminBlogRouter.use(requireAuth, requireRole('ADMIN'));

adminBlogRouter.get(
  '/',
  h(async (_req, res) => {
    const posts = await prisma.blogPost.findMany({
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const body: AdminBlogPostSummaryDto[] = posts.map(toSummaryDto);
    res.json(body);
  })
);

adminBlogRouter.post(
  '/',
  h(async (req, res) => {
    const { title } = createSchema.parse(req.body);
    const slug = await uniqueSlug(title);

    const post = await prisma.blogPost.create({
      data: { slug, title, excerpt: '', content: '', authorId: req.auth!.sub },
    });
    res.status(201).json({ id: post.id });
  })
);

adminBlogRouter.get(
  '/:id',
  h(async (req, res) => {
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
      include: { author: { select: { username: true } } },
    });
    if (!post) throw new HttpError(404, 'Post not found');

    const body: AdminBlogPostDetailDto = {
      ...toSummaryDto(post),
      content: post.content,
      coverImageUrl: post.coverImageUrl,
    };
    res.json(body);
  })
);

adminBlogRouter.put(
  '/:id',
  h(async (req, res) => {
    const post = await findPost(req.params.id);
    const { title, excerpt, content, coverImageUrl } = updateSchema.parse(req.body);

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { title, excerpt, content, coverImageUrl },
    });
    res.json({ updated: true });
  })
);

adminBlogRouter.delete(
  '/:id',
  h(async (req, res) => {
    await findPost(req.params.id);
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  })
);

adminBlogRouter.post(
  '/:id/publish',
  h(async (req, res) => {
    const post = await findPost(req.params.id);
    if (!post.excerpt.trim() || !post.content.trim()) {
      throw new HttpError(400, 'Add an excerpt and content before publishing');
    }
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { status: 'PUBLISHED', publishedAt: post.publishedAt ?? new Date() },
    });
    res.json({ status: 'PUBLISHED' });
  })
);

adminBlogRouter.post(
  '/:id/unpublish',
  h(async (req, res) => {
    const post = await findPost(req.params.id);
    await prisma.blogPost.update({ where: { id: post.id }, data: { status: 'DRAFT' } });
    res.json({ status: 'DRAFT' });
  })
);
