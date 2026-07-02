import { Router } from 'express';
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

    const body: CourseDetailDto = {
      id: course.id,
      title: course.title,
      description: course.description,
      pathSlug: course.path.slug,
      pathName: course.path.name,
      instructorName: course.instructor.username,
      lessonCount: course.lessons.length,
      enrolled,
      completedLessons: completedIds.size,
      lessons: course.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        order: l.order,
        hasQuiz: l.quiz !== null,
        completed: completedIds.has(l.id),
      })),
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
