import { Router } from 'express';
import { z } from 'zod';
import type { AdminChallengeDto, AdminCourseDto, AdminReviewDto, AdminUserDto } from '@codeforge/shared';
import type { User } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';

const rejectSchema = z.object({
  note: z.string().max(1000).optional(),
});

const moveSchema = z.object({ direction: z.enum(['up', 'down']) });

const statusFilter = z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED']).optional();

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole('ADMIN'));

function toAdminUserDto(u: User): AdminUserDto {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    xp: u.xp,
    streak: u.streak,
    createdAt: u.createdAt.toISOString(),
    bannedAt: u.bannedAt?.toISOString() ?? null,
    chatBlockedAt: u.chatBlockedAt?.toISOString() ?? null,
    githubUsername: u.githubUsername,
  };
}

/** Loads the target of a moderation action; admin accounts are off-limits. */
async function moderatableUser(id: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new HttpError(404, 'User not found');
  if (user.role === 'ADMIN') throw new HttpError(400, 'Admin accounts cannot be moderated');
  return user;
}

adminRouter.get(
  '/users',
  h(async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(users.map(toAdminUserDto));
  })
);

adminRouter.post(
  '/users/:id/chat-block',
  h(async (req, res) => {
    const user = await moderatableUser(req.params.id);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { chatBlockedAt: user.chatBlockedAt ?? new Date() },
    });
    res.json(toAdminUserDto(updated));
  })
);

adminRouter.post(
  '/users/:id/chat-unblock',
  h(async (req, res) => {
    const user = await moderatableUser(req.params.id);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { chatBlockedAt: null },
    });
    res.json(toAdminUserDto(updated));
  })
);

adminRouter.post(
  '/users/:id/ban',
  h(async (req, res) => {
    const user = await moderatableUser(req.params.id);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { bannedAt: user.bannedAt ?? new Date() },
    });
    res.json(toAdminUserDto(updated));
  })
);

adminRouter.post(
  '/users/:id/unban',
  h(async (req, res) => {
    const user = await moderatableUser(req.params.id);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { bannedAt: null },
    });
    res.json(toAdminUserDto(updated));
  })
);

adminRouter.post(
  '/users/:id/promote',
  h(async (req, res) => {
    const user = await moderatableUser(req.params.id);
    if (user.role !== 'STUDENT') throw new HttpError(400, 'Only students can be promoted to instructor');
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'INSTRUCTOR' },
    });
    res.json(toAdminUserDto(updated));
  })
);

adminRouter.post(
  '/users/:id/demote',
  h(async (req, res) => {
    const user = await moderatableUser(req.params.id);
    if (user.role !== 'INSTRUCTOR') throw new HttpError(400, 'Only instructors can be demoted to student');
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'STUDENT' },
    });
    res.json(toAdminUserDto(updated));
  })
);

adminRouter.post(
  '/users/:id/reset-stats',
  h(async (req, res) => {
    const user = await moderatableUser(req.params.id);
    const [, , updated] = await prisma.$transaction([
      prisma.userAchievement.deleteMany({ where: { userId: user.id } }),
      prisma.challengeSubmission.deleteMany({ where: { userId: user.id } }),
      prisma.user.update({
        where: { id: user.id },
        data: { xp: 0, streak: 0, lastActiveAt: null },
      }),
    ]);
    res.json(toAdminUserDto(updated));
  })
);

adminRouter.get(
  '/courses',
  h(async (req, res) => {
    const status = statusFilter.parse(
      typeof req.query.status === 'string' && req.query.status !== '' ? req.query.status : undefined
    );
    const courses = await prisma.course.findMany({
      where: status ? { status } : {},
      include: {
        path: true,
        instructor: { select: { username: true } },
        _count: { select: { lessons: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const body: AdminCourseDto[] = courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      pathName: c.path.name,
      instructorName: c.instructor.username,
      status: c.status,
      reviewNote: c.reviewNote,
      lessonCount: c._count.lessons,
      createdAt: c.createdAt.toISOString(),
    }));
    res.json(body);
  })
);

adminRouter.post(
  '/courses/:id/approve',
  h(async (req, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) throw new HttpError(404, 'Course not found');
    if (course.status !== 'PENDING_REVIEW') throw new HttpError(400, 'Course is not pending review');

    await prisma.course.update({
      where: { id: course.id },
      data: { status: 'PUBLISHED', reviewNote: null },
    });
    res.json({ status: 'PUBLISHED' });
  })
);

adminRouter.post(
  '/courses/:id/reject',
  h(async (req, res) => {
    const { note } = rejectSchema.parse(req.body ?? {});
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) throw new HttpError(404, 'Course not found');
    if (course.status !== 'PENDING_REVIEW') throw new HttpError(400, 'Course is not pending review');

    await prisma.course.update({
      where: { id: course.id },
      data: { status: 'DRAFT', reviewNote: note ?? null },
    });
    res.json({ status: 'DRAFT' });
  })
);

adminRouter.post(
  '/courses/:id/unpublish',
  h(async (req, res) => {
    const { note } = rejectSchema.parse(req.body ?? {});
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) throw new HttpError(404, 'Course not found');
    if (course.status !== 'PUBLISHED') throw new HttpError(400, 'Course is not published');

    await prisma.course.update({
      where: { id: course.id },
      data: { status: 'DRAFT', reviewNote: note ?? null },
    });
    res.json({ status: 'DRAFT' });
  })
);

adminRouter.get(
  '/challenges',
  h(async (req, res) => {
    const status = statusFilter.parse(
      typeof req.query.status === 'string' && req.query.status !== '' ? req.query.status : undefined
    );
    const challenges = await prisma.challenge.findMany({
      where: status ? { status } : {},
      include: {
        instructor: { select: { username: true } },
        _count: { select: { testCases: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const body: AdminChallengeDto[] = challenges.map((c) => ({
      id: c.id,
      title: c.title,
      difficulty: c.difficulty,
      languages: c.languages,
      instructorName: c.instructor?.username ?? 'Kodstigen Team',
      status: c.status,
      reviewNote: c.reviewNote,
      testCaseCount: c._count.testCases,
      createdAt: c.createdAt.toISOString(),
    }));
    res.json(body);
  })
);

adminRouter.post(
  '/challenges/:id/approve',
  h(async (req, res) => {
    const challenge = await prisma.challenge.findUnique({ where: { id: req.params.id } });
    if (!challenge) throw new HttpError(404, 'Challenge not found');
    if (challenge.status !== 'PENDING_REVIEW') throw new HttpError(400, 'Challenge is not pending review');

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: 'PUBLISHED', reviewNote: null },
    });
    res.json({ status: 'PUBLISHED' });
  })
);

adminRouter.post(
  '/challenges/:id/reject',
  h(async (req, res) => {
    const { note } = rejectSchema.parse(req.body ?? {});
    const challenge = await prisma.challenge.findUnique({ where: { id: req.params.id } });
    if (!challenge) throw new HttpError(404, 'Challenge not found');
    if (challenge.status !== 'PENDING_REVIEW') throw new HttpError(400, 'Challenge is not pending review');

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: 'DRAFT', reviewNote: note ?? null },
    });
    res.json({ status: 'DRAFT' });
  })
);

adminRouter.post(
  '/challenges/:id/unpublish',
  h(async (req, res) => {
    const { note } = rejectSchema.parse(req.body ?? {});
    const challenge = await prisma.challenge.findUnique({ where: { id: req.params.id } });
    if (!challenge) throw new HttpError(404, 'Challenge not found');
    if (challenge.status !== 'PUBLISHED') throw new HttpError(400, 'Challenge is not published');

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: 'DRAFT', reviewNote: note ?? null },
    });
    res.json({ status: 'DRAFT' });
  })
);

adminRouter.get(
  '/reviews',
  h(async (req, res) => {
    const reviews = await prisma.courseReview.findMany({
      orderBy: [{ featured: 'desc' }, { featuredOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        user: { select: { username: true } },
        course: { select: { title: true } },
      },
    });
    const body: AdminReviewDto[] = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      username: r.user.username,
      courseTitle: r.course.title,
      createdAt: r.createdAt.toISOString(),
      featured: r.featured,
      featuredOrder: r.featuredOrder,
    }));
    res.json(body);
  })
);

adminRouter.delete(
  '/reviews/:id',
  h(async (req, res) => {
    const review = await prisma.courseReview.findUnique({ where: { id: req.params.id } });
    if (!review) throw new HttpError(404, 'Review not found');
    await prisma.courseReview.delete({ where: { id: review.id } });
    res.json({ deleted: true });
  })
);

// Toggles whether a review is one of the (at most 3) curated testimonials shown on the landing page.
adminRouter.post(
  '/reviews/:id/feature',
  h(async (req, res) => {
    const review = await prisma.courseReview.findUnique({ where: { id: req.params.id } });
    if (!review) throw new HttpError(404, 'Review not found');

    if (review.featured) {
      await prisma.courseReview.update({
        where: { id: review.id },
        data: { featured: false, featuredOrder: null },
      });
      return res.json({ featured: false });
    }

    const featuredCount = await prisma.courseReview.count({ where: { featured: true } });
    if (featuredCount >= 3) throw new HttpError(400, 'Un-feature another review first (max 3 featured)');

    const top = await prisma.courseReview.findFirst({
      where: { featured: true },
      orderBy: { featuredOrder: 'desc' },
    });
    await prisma.courseReview.update({
      where: { id: review.id },
      data: { featured: true, featuredOrder: (top?.featuredOrder ?? -1) + 1 },
    });
    res.json({ featured: true });
  })
);

// Reorders a featured review among the other featured reviews (landing page display order).
adminRouter.post(
  '/reviews/:id/move',
  h(async (req, res) => {
    const { direction } = moveSchema.parse(req.body);
    const review = await prisma.courseReview.findUnique({ where: { id: req.params.id } });
    if (!review || !review.featured) throw new HttpError(404, 'Featured review not found');

    const neighbor = await prisma.courseReview.findFirst({
      where: {
        featured: true,
        featuredOrder: direction === 'up' ? { lt: review.featuredOrder! } : { gt: review.featuredOrder! },
      },
      orderBy: { featuredOrder: direction === 'up' ? 'desc' : 'asc' },
    });
    if (!neighbor) return res.json({ moved: false });

    // swap orders via a temporary slot to satisfy the unique(featuredOrder) constraint
    await prisma.$transaction(async (tx) => {
      await tx.courseReview.update({ where: { id: review.id }, data: { featuredOrder: -1 } });
      await tx.courseReview.update({ where: { id: neighbor.id }, data: { featuredOrder: review.featuredOrder } });
      await tx.courseReview.update({ where: { id: review.id }, data: { featuredOrder: neighbor.featuredOrder } });
    });
    res.json({ moved: true });
  })
);
