import { Router } from 'express';
import { z } from 'zod';
import type { AdminCourseDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';

const rejectSchema = z.object({
  note: z.string().max(1000).optional(),
});

const statusFilter = z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED']).optional();

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole('ADMIN'));

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
