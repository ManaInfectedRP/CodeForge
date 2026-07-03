import { Router } from 'express';
import { z } from 'zod';
import { slugify, type TeachCourseDetailDto, type TeachCourseSummaryDto, type TeachLessonDetailDto } from '@codeforge/shared';
import type { Course } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';
import type { TokenPayload } from '../lib/jwt.ts';
import { deleteLocalUpload, videoUpload } from '../lib/upload.ts';
import { buildCourseMarkdown } from '../lib/exportMarkdown.ts';

const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  pathSlug: z.string(),
});

const lessonCreateSchema = z.object({
  title: z.string().min(3, 'Lesson title must be at least 3 characters').max(120),
});

const lessonUpdateSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  videoUrl: z.string().url('Video URL must be a valid URL').nullable().optional(),
  content: z.string().min(1, 'Content cannot be empty').optional(),
});

const questionSchema = z
  .object({
    type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK']),
    prompt: z.string().min(3, 'Question prompt is too short'),
    options: z.array(z.string().min(1)),
    answer: z.string().min(1, 'Every question needs a correct answer'),
  })
  .superRefine((q, ctx) => {
    if (q.type === 'MULTIPLE_CHOICE') {
      if (q.options.length < 2) ctx.addIssue({ code: 'custom', message: 'Multiple choice needs at least 2 options' });
      if (!q.options.includes(q.answer))
        ctx.addIssue({ code: 'custom', message: 'The correct answer must be one of the options' });
    }
    if (q.type === 'TRUE_FALSE' && !['True', 'False'].includes(q.answer))
      ctx.addIssue({ code: 'custom', message: 'True/False answer must be "True" or "False"' });
  });

const quizSchema = z.object({
  title: z.string().min(3).max(120),
  passingScore: z.number().int().min(1).max(100),
  questions: z.array(questionSchema),
});

const moveSchema = z.object({ direction: z.enum(['up', 'down']) });

async function ownedCourse(courseId: string, auth: TokenPayload): Promise<Course> {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new HttpError(404, 'Course not found');
  if (course.instructorId !== auth.sub && auth.role !== 'ADMIN') {
    throw new HttpError(403, 'You do not own this course');
  }
  return course;
}

async function ownedLesson(lessonId: string, auth: TokenPayload) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });
  if (!lesson) throw new HttpError(404, 'Lesson not found');
  if (lesson.course.instructorId !== auth.sub && auth.role !== 'ADMIN') {
    throw new HttpError(403, 'You do not own this lesson');
  }
  return lesson;
}

export const instructorRouter = Router();

instructorRouter.use(requireAuth, requireRole('INSTRUCTOR', 'ADMIN'));

instructorRouter.get(
  '/courses',
  h(async (req, res) => {
    const courses = await prisma.course.findMany({
      where: { instructorId: req.auth!.sub },
      include: { path: true, _count: { select: { lessons: true, enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const body: TeachCourseSummaryDto[] = courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      pathSlug: c.path.slug,
      pathName: c.path.name,
      status: c.status,
      reviewNote: c.reviewNote,
      lessonCount: c._count.lessons,
      enrollmentCount: c._count.enrollments,
    }));
    res.json(body);
  })
);

instructorRouter.post(
  '/courses',
  h(async (req, res) => {
    const { title, description, pathSlug } = courseSchema.parse(req.body);
    const path = await prisma.learningPath.findUnique({ where: { slug: pathSlug } });
    if (!path) throw new HttpError(400, 'Unknown learning path');

    const course = await prisma.course.create({
      data: { title, description, pathId: path.id, instructorId: req.auth!.sub },
    });
    res.status(201).json({ id: course.id });
  })
);

instructorRouter.get(
  '/courses/:id',
  h(async (req, res) => {
    const course = await ownedCourse(req.params.id, req.auth!);
    const [path, lessons, counts] = await Promise.all([
      prisma.learningPath.findUniqueOrThrow({ where: { id: course.pathId } }),
      prisma.lesson.findMany({
        where: { courseId: course.id },
        include: { quiz: { select: { id: true } } },
        orderBy: { order: 'asc' },
      }),
      prisma.enrollment.count({ where: { courseId: course.id } }),
    ]);

    const body: TeachCourseDetailDto = {
      id: course.id,
      title: course.title,
      description: course.description,
      pathSlug: path.slug,
      pathName: path.name,
      status: course.status,
      reviewNote: course.reviewNote,
      lessonCount: lessons.length,
      enrollmentCount: counts,
      lessons: lessons.map((l) => ({ id: l.id, title: l.title, order: l.order, hasQuiz: l.quiz !== null })),
    };
    res.json(body);
  })
);

instructorRouter.get(
  '/courses/:id/export',
  h(async (req, res) => {
    const course = await ownedCourse(req.params.id, req.auth!);
    const [path, lessons] = await Promise.all([
      prisma.learningPath.findUniqueOrThrow({ where: { id: course.pathId } }),
      prisma.lesson.findMany({
        where: { courseId: course.id },
        include: { quiz: { include: { questions: { orderBy: { order: 'asc' } } } } },
        orderBy: { order: 'asc' },
      }),
    ]);

    const markdown = buildCourseMarkdown(course, path, lessons);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${slugify(course.title)}.md"`);
    res.send(markdown);
  })
);

instructorRouter.put(
  '/courses/:id',
  h(async (req, res) => {
    const course = await ownedCourse(req.params.id, req.auth!);
    const { title, description, pathSlug } = courseSchema.parse(req.body);
    const path = await prisma.learningPath.findUnique({ where: { slug: pathSlug } });
    if (!path) throw new HttpError(400, 'Unknown learning path');

    await prisma.course.update({
      where: { id: course.id },
      data: { title, description, pathId: path.id },
    });
    res.json({ updated: true });
  })
);

instructorRouter.post(
  '/courses/:id/submit',
  h(async (req, res) => {
    const course = await ownedCourse(req.params.id, req.auth!);
    if (course.status !== 'DRAFT') throw new HttpError(400, 'Only draft courses can be submitted for review');

    const lessonCount = await prisma.lesson.count({ where: { courseId: course.id } });
    if (lessonCount === 0) throw new HttpError(400, 'Add at least one lesson before submitting for review');

    await prisma.course.update({
      where: { id: course.id },
      data: { status: 'PENDING_REVIEW', reviewNote: null },
    });
    res.json({ status: 'PENDING_REVIEW' });
  })
);

instructorRouter.post(
  '/courses/:id/lessons',
  h(async (req, res) => {
    const course = await ownedCourse(req.params.id, req.auth!);
    const { title } = lessonCreateSchema.parse(req.body);

    const last = await prisma.lesson.findFirst({
      where: { courseId: course.id },
      orderBy: { order: 'desc' },
    });
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title,
        order: (last?.order ?? 0) + 1,
        content: `# ${title}\n\nWrite your lesson content here. Markdown is supported, headings, **bold**, code blocks, and tables.`,
      },
    });
    res.status(201).json({ id: lesson.id });
  })
);

instructorRouter.get(
  '/lessons/:id',
  h(async (req, res) => {
    const lesson = await ownedLesson(req.params.id, req.auth!);
    const quiz = await prisma.quiz.findUnique({
      where: { lessonId: lesson.id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    const body: TeachLessonDetailDto = {
      id: lesson.id,
      courseId: lesson.courseId,
      courseTitle: lesson.course.title,
      title: lesson.title,
      order: lesson.order,
      videoUrl: lesson.videoUrl,
      content: lesson.content,
      quiz: quiz
        ? {
            title: quiz.title,
            passingScore: quiz.passingScore,
            questions: quiz.questions.map((q) => ({
              type: q.type,
              prompt: q.prompt,
              options: q.options,
              answer: q.answer,
            })),
          }
        : null,
    };
    res.json(body);
  })
);

instructorRouter.put(
  '/lessons/:id',
  h(async (req, res) => {
    const lesson = await ownedLesson(req.params.id, req.auth!);
    const data = lessonUpdateSchema.parse(req.body);
    await prisma.lesson.update({ where: { id: lesson.id }, data });
    res.json({ updated: true });
  })
);

instructorRouter.delete(
  '/lessons/:id',
  h(async (req, res) => {
    const lesson = await ownedLesson(req.params.id, req.auth!);
    await prisma.$transaction(async (tx) => {
      await tx.lesson.delete({ where: { id: lesson.id } });
      // close the gap so lesson numbering stays contiguous
      const rest = await tx.lesson.findMany({
        where: { courseId: lesson.courseId, order: { gt: lesson.order } },
        orderBy: { order: 'asc' },
      });
      for (const l of rest) {
        await tx.lesson.update({ where: { id: l.id }, data: { order: l.order - 1 } });
      }
    });
    res.json({ deleted: true });
  })
);

instructorRouter.post(
  '/lessons/:id/move',
  h(async (req, res) => {
    const { direction } = moveSchema.parse(req.body);
    const lesson = await ownedLesson(req.params.id, req.auth!);

    const neighbor = await prisma.lesson.findFirst({
      where: {
        courseId: lesson.courseId,
        order: direction === 'up' ? { lt: lesson.order } : { gt: lesson.order },
      },
      orderBy: { order: direction === 'up' ? 'desc' : 'asc' },
    });
    if (!neighbor) return res.json({ moved: false });

    // swap orders via a temporary slot to satisfy the unique(courseId, order) constraint
    await prisma.$transaction(async (tx) => {
      await tx.lesson.update({ where: { id: lesson.id }, data: { order: -1 } });
      await tx.lesson.update({ where: { id: neighbor.id }, data: { order: lesson.order } });
      await tx.lesson.update({ where: { id: lesson.id }, data: { order: neighbor.order } });
    });
    res.json({ moved: true });
  })
);

instructorRouter.post(
  '/lessons/:id/video',
  videoUpload.single('video'),
  h(async (req, res) => {
    const lesson = await ownedLesson(req.params.id, req.auth!);
    if (!req.file) throw new HttpError(400, 'No video file received');

    deleteLocalUpload(lesson.videoUrl);
    const videoUrl = `/uploads/${req.file.filename}`;
    await prisma.lesson.update({ where: { id: lesson.id }, data: { videoUrl } });
    res.status(201).json({ videoUrl });
  })
);

instructorRouter.delete(
  '/lessons/:id/video',
  h(async (req, res) => {
    const lesson = await ownedLesson(req.params.id, req.auth!);
    deleteLocalUpload(lesson.videoUrl);
    await prisma.lesson.update({ where: { id: lesson.id }, data: { videoUrl: null } });
    res.json({ removed: true });
  })
);

instructorRouter.put(
  '/lessons/:id/quiz',
  h(async (req, res) => {
    const lesson = await ownedLesson(req.params.id, req.auth!);
    const quiz = quizSchema.parse(req.body);

    await prisma.$transaction(async (tx) => {
      await tx.quiz.deleteMany({ where: { lessonId: lesson.id } });
      if (quiz.questions.length > 0) {
        await tx.quiz.create({
          data: {
            lessonId: lesson.id,
            title: quiz.title,
            passingScore: quiz.passingScore,
            questions: {
              create: quiz.questions.map((q, i) => ({
                type: q.type,
                prompt: q.prompt,
                options: q.type === 'TRUE_FALSE' ? ['True', 'False'] : q.type === 'FILL_BLANK' ? [] : q.options,
                answer: q.answer,
                order: i + 1,
              })),
            },
          },
        });
      }
    });
    res.json({ saved: true, hasQuiz: quiz.questions.length > 0 });
  })
);
