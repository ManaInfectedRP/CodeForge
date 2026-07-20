import { Router } from 'express';
import { z } from 'zod';
import type { FeaturedReviewDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';

const reviewSchema = z.object({
  courseId: z.string(),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(10, 'Write at least 10 characters').max(2000),
});

export const reviewsRouter = Router();

// Public: powers the testimonials section on the landing page, no auth required.
reviewsRouter.get(
  '/featured',
  h(async (req, res) => {
    // At most 3 reviews can ever be featured (enforced in the admin feature-toggle route).
    const limit = Math.min(Math.max(Number(req.query.limit) || 3, 1), 3);
    const reviews = await prisma.courseReview.findMany({
      where: { featured: true },
      orderBy: { featuredOrder: 'asc' },
      take: limit,
      include: {
        user: { select: { username: true, avatarUrl: true } },
        course: { select: { title: true } },
      },
    });

    const body: FeaturedReviewDto[] = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      username: r.user.username,
      avatarUrl: r.user.avatarUrl,
      courseTitle: r.course.title,
      createdAt: r.createdAt.toISOString(),
    }));
    res.json(body);
  })
);

reviewsRouter.post(
  '/',
  requireAuth,
  h(async (req, res) => {
    const { courseId, rating, body } = reviewSchema.parse(req.body);
    const userId = req.auth!.sub;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.status !== 'PUBLISHED') throw new HttpError(404, 'Course not found');

    // A certificate already implies every lesson is complete, every quiz passed, and any
    // submission-gated lesson has an instructor-approved submission - the exact bar for a review.
    const certificate = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!certificate) {
      throw new HttpError(403, 'Complete this course and claim your certificate before leaving a review');
    }

    const review = await prisma.courseReview.upsert({
      where: { courseId_userId: { courseId, userId } },
      update: { rating, body },
      create: { courseId, userId, rating, body },
    });
    res.status(201).json({ id: review.id, rating: review.rating, body: review.body });
  })
);
