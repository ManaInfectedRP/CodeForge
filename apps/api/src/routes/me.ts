import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { CertificateDto, DashboardDto, EnrollmentDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h, toUserDto } from '../lib/helpers.ts';
import { requireAuth } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';
import { deleteLocalUpload, imageUpload } from '../lib/upload.ts';

const selectPathsSchema = z.object({
  slugs: z.array(z.string()).min(1, 'Select at least one learning path'),
});

const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores'),
  bio: z.string().max(500, 'Bio must be at most 500 characters').nullable(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
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

meRouter.put(
  '/profile',
  h(async (req, res) => {
    const { username, bio } = profileSchema.parse(req.body);
    const userId = req.auth!.sub;

    const taken = await prisma.user.findFirst({
      where: { username, id: { not: userId } },
    });
    if (taken) throw new HttpError(409, 'Username already taken');

    const user = await prisma.user.update({
      where: { id: userId },
      data: { username, bio: bio?.trim() || null },
    });
    res.json(toUserDto(user));
  })
);

meRouter.put(
  '/password',
  h(async (req, res) => {
    const { currentPassword, newPassword } = passwordSchema.parse(req.body);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.auth!.sub } });

    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new HttpError(401, 'Current password is incorrect');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(newPassword, 10) },
    });
    res.json({ changed: true });
  })
);

meRouter.post(
  '/avatar',
  imageUpload.single('avatar'),
  h(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'No image file received');
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.auth!.sub } });

    deleteLocalUpload(user.avatarUrl);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: `/uploads/${req.file.filename}` },
    });
    res.status(201).json(toUserDto(updated));
  })
);

meRouter.delete(
  '/avatar',
  h(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.auth!.sub } });
    deleteLocalUpload(user.avatarUrl);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: null },
    });
    res.json(toUserDto(updated));
  })
);

meRouter.get(
  '/certificates',
  h(async (req, res) => {
    const certs = await prisma.certificate.findMany({
      where: { userId: req.auth!.sub },
      include: {
        user: { select: { username: true } },
        course: { include: { path: true, instructor: { select: { username: true } } } },
      },
      orderBy: { issuedAt: 'desc' },
    });
    const body: CertificateDto[] = certs.map((c) => ({
      id: c.id,
      courseId: c.courseId,
      courseTitle: c.course.title,
      pathName: c.course.path.name,
      studentName: c.user.username,
      instructorName: c.course.instructor.username,
      verificationCode: c.verificationCode,
      issuedAt: c.issuedAt.toISOString(),
    }));
    res.json(body);
  })
);

meRouter.get(
  '/certificates/:id',
  h(async (req, res) => {
    const c = await prisma.certificate.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { username: true } },
        course: { include: { path: true, instructor: { select: { username: true } } } },
      },
    });
    if (!c || c.userId !== req.auth!.sub) throw new HttpError(404, 'Certificate not found');

    const body: CertificateDto = {
      id: c.id,
      courseId: c.courseId,
      courseTitle: c.course.title,
      pathName: c.course.path.name,
      studentName: c.user.username,
      instructorName: c.course.instructor.username,
      verificationCode: c.verificationCode,
      issuedAt: c.issuedAt.toISOString(),
    };
    res.json(body);
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
