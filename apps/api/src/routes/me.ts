import { Router } from 'express';
import { z } from 'zod';
import type { DashboardDto, EnrollmentDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h, toUserDto } from '../lib/helpers.ts';
import { requireAuth } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';

const selectPathsSchema = z.object({
  slugs: z.array(z.string()).min(1, 'Select at least one learning path'),
});

export const meRouter = Router();

meRouter.use(requireAuth);

meRouter.put(
  '/paths',
  h(async (req, res) => {
    const { slugs } = selectPathsSchema.parse(req.body);
    const paths = await prisma.learningPath.findMany({ where: { slug: { in: slugs } } });
    if (paths.length !== slugs.length) throw new HttpError(400, 'One or more learning paths do not exist');

    const userId = req.auth!.sub;
    await prisma.$transaction([
      prisma.userPath.deleteMany({ where: { userId } }),
      prisma.userPath.createMany({ data: paths.map((p) => ({ userId, pathId: p.id })) }),
    ]);
    res.json({ selected: slugs });
  })
);

meRouter.get(
  '/dashboard',
  h(async (req, res) => {
    const userId = req.auth!.sub;
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const [enrollments, recentProgress, userPaths] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: { path: true, _count: { select: { lessons: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lessonProgress.findMany({
        where: { userId },
        include: { lesson: { include: { course: { select: { title: true } } } } },
        orderBy: { completedAt: 'desc' },
        take: 5,
      }),
      prisma.userPath.findMany({
        where: { userId },
        include: { path: { include: { courses: { include: { _count: { select: { lessons: true } } } } } } },
      }),
    ]);

    const completedByCourse = await prisma.lessonProgress.groupBy({
      by: ['lessonId'],
      where: { userId },
    });
    const completedLessonIds = new Set(completedByCourse.map((p) => p.lessonId));

    const enrollmentDtos: EnrollmentDto[] = await Promise.all(
      enrollments.map(async (e) => {
        const lessons = await prisma.lesson.findMany({
          where: { courseId: e.courseId },
          select: { id: true },
        });
        const completed = lessons.filter((l) => completedLessonIds.has(l.id)).length;
        return {
          courseId: e.courseId,
          courseTitle: e.course.title,
          pathSlug: e.course.path.slug,
          pathName: e.course.path.name,
          totalLessons: e.course._count.lessons,
          completedLessons: completed,
          percentComplete: lessons.length === 0 ? 0 : Math.round((completed / lessons.length) * 100),
        };
      })
    );

    const body: DashboardDto = {
      user: toUserDto(user),
      enrollments: enrollmentDtos,
      recentLessons: recentProgress.map((p) => ({
        lessonId: p.lessonId,
        lessonTitle: p.lesson.title,
        courseTitle: p.lesson.course.title,
        completedAt: p.completedAt.toISOString(),
      })),
      paths: userPaths.map((up) => ({
        id: up.path.id,
        slug: up.path.slug,
        name: up.path.name,
        icon: up.path.icon,
        difficulty: up.path.difficulty,
        estimatedHours: up.path.estimatedHours,
        projectCount: up.path.projectCount,
        description: up.path.description,
        lessonCount: up.path.courses.reduce((sum, c) => sum + c._count.lessons, 0),
        selected: true,
      })),
    };
    res.json(body);
  })
);
