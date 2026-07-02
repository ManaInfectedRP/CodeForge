import { Router } from 'express';
import type { LearningPathDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { optionalAuth } from '../middleware/auth.ts';

export const pathsRouter = Router();

pathsRouter.get(
  '/',
  optionalAuth,
  h(async (req, res) => {
    const paths = await prisma.learningPath.findMany({ orderBy: { name: 'asc' } });
    const lessonCounts = await prisma.lesson.groupBy({
      by: ['courseId'],
      _count: true,
    });
    const courses = await prisma.course.findMany({ select: { id: true, pathId: true } });
    const countByCourse = new Map(lessonCounts.map((c) => [c.courseId, c._count]));

    const selected = req.auth
      ? new Set((await prisma.userPath.findMany({ where: { userId: req.auth.sub } })).map((p) => p.pathId))
      : new Set<string>();

    const body: LearningPathDto[] = paths.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      icon: p.icon,
      difficulty: p.difficulty,
      estimatedHours: p.estimatedHours,
      projectCount: p.projectCount,
      description: p.description,
      lessonCount: courses
        .filter((c) => c.pathId === p.id)
        .reduce((sum, c) => sum + (countByCourse.get(c.id) ?? 0), 0),
      selected: selected.has(p.id),
    }));
    res.json(body);
  })
);
