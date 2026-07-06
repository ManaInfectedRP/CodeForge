import { Router } from 'express';
import crypto from 'node:crypto';
import type { CourseDetailDto, CourseSummaryDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { optionalAuth, requireAuth } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';

export const coursesRouter = Router();

coursesRouter.get(
  '/',
  optionalAuth,
  h(async (req, res) => {
    const pathSlug = typeof req.query.path === 'string' ? req.query.path : undefined;

    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED', ...(pathSlug ? { path: { slug: pathSlug } } : {}) },
      include: {
        path: true,
        instructor: { select: { username: true } },
        _count: { select: { lessons: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const enrolledIds = req.auth
      ? new Set(
          (await prisma.enrollment.findMany({ where: { userId: req.auth.sub } })).map((e) => e.courseId)
        )
      : new Set<string>();

    const body: CourseSummaryDto[] = courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      pathSlug: c.path.slug,
      pathName: c.path.name,
      instructorName: c.instructor.username,
      lessonCount: c._count.lessons,
      enrolled: enrolledIds.has(c.id),
    }));
    res.json(body);
  })
);

coursesRouter.get(
  '/:id',
  optionalAuth,
  h(async (req, res) => {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        path: true,
        instructor: { select: { username: true } },
        lessons: { orderBy: { order: 'asc' }, include: { quiz: { select: { id: true } } } },
      },
    });
    if (!course || course.status !== 'PUBLISHED') throw new HttpError(404, 'Course not found');

    const completedIds = req.auth
      ? new Set(
          (
            await prisma.lessonProgress.findMany({
              where: { userId: req.auth.sub, lesson: { courseId: course.id } },
            })
          ).map((p) => p.lessonId)
        )
      : new Set<string>();

    const enrolled = req.auth
      ? (await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId: req.auth.sub, courseId: course.id } },
        })) !== null
      : false;

    const certificate = req.auth
      ? await prisma.certificate.findUnique({
          where: { userId_courseId: { userId: req.auth.sub, courseId: course.id } },
        })
      : null;

    const myReview = req.auth
      ? await prisma.courseReview.findUnique({
          where: { courseId_userId: { courseId: course.id, userId: req.auth.sub } },
        })
      : null;

    const body: CourseDetailDto = {
      certificateId: certificate?.id ?? null,
      myReview: myReview ? { rating: myReview.rating, body: myReview.body } : null,
      id: course.id,
      title: course.title,
      description: course.description,
      pathSlug: course.path.slug,
      pathName: course.path.name,
      instructorName: course.instructor.username,
      lessonCount: course.lessons.length,
      enrolled,
      completedLessons: completedIds.size,
      lessons: (() => {
        let previousCompleted = true;
        return course.lessons.map((l) => {
          const unlocked = previousCompleted;
          if (!completedIds.has(l.id)) previousCompleted = false;
          return {
            id: l.id,
            title: l.title,
            order: l.order,
            hasQuiz: l.quiz !== null,
            completed: completedIds.has(l.id),
            unlocked,
          };
        });
      })(),
    };
    res.json(body);
  })
);

coursesRouter.post(
  '/:id/enroll',
  requireAuth,
  h(async (req, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course || course.status !== 'PUBLISHED') throw new HttpError(404, 'Course not found');

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: req.auth!.sub, courseId: course.id } },
      update: {},
      create: { userId: req.auth!.sub, courseId: course.id },
    });
    res.status(201).json({ enrolled: true });
  })
);

coursesRouter.post(
  '/:id/certificate',
  requireAuth,
  h(async (req, res) => {
    const userId = req.auth!.sub;
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: { lessons: { include: { quiz: { select: { id: true } } } } },
    });
    if (!course || course.status !== 'PUBLISHED') throw new HttpError(404, 'Course not found');
    if (course.lessons.length === 0) throw new HttpError(400, 'This course has no lessons yet');

    const enrolled = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
    if (!enrolled) throw new HttpError(403, 'You must be enrolled in this course');

    const completed = await prisma.lessonProgress.count({
      where: { userId, lesson: { courseId: course.id } },
    });
    if (completed < course.lessons.length) {
      throw new HttpError(400, `Complete all lessons first (${completed}/${course.lessons.length} done)`);
    }

    const quizIds = course.lessons.filter((l) => l.quiz).map((l) => l.quiz!.id);
    if (quizIds.length > 0) {
      const passed = await prisma.quizAttempt.groupBy({
        by: ['quizId'],
        where: { userId, quizId: { in: quizIds }, passed: true },
      });
      if (passed.length < quizIds.length) {
        throw new HttpError(400, `Pass every quiz first (${passed.length}/${quizIds.length} passed)`);
      }
    }

    const existing = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
    if (existing) return res.json({ id: existing.id });

    const cert = await prisma.certificate.create({
      data: {
        userId,
        courseId: course.id,
        verificationCode: crypto.randomBytes(8).toString('hex'),
      },
    });
    res.status(201).json({ id: cert.id });
  })
);
