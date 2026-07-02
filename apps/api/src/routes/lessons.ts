import { Router } from 'express';
import type { LessonDetailDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';
import { recordActivity, XP_LESSON_COMPLETED } from '../services/gamification.ts';

export const lessonsRouter = Router();

lessonsRouter.get(
  '/:id',
  requireAuth,
  h(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        course: { select: { id: true, title: true, status: true } },
        quiz: { include: { questions: { orderBy: { order: 'asc' } } } },
      },
    });
    if (!lesson || lesson.course.status !== 'PUBLISHED') throw new HttpError(404, 'Lesson not found');

    const [progress, siblings] = await Promise.all([
      prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: req.auth!.sub, lessonId: lesson.id } },
      }),
      prisma.lesson.findMany({
        where: { courseId: lesson.courseId },
        select: { id: true, order: true },
        orderBy: { order: 'asc' },
      }),
    ]);

    const idx = siblings.findIndex((s) => s.id === lesson.id);
    const body: LessonDetailDto = {
      id: lesson.id,
      courseId: lesson.course.id,
      courseTitle: lesson.course.title,
      title: lesson.title,
      order: lesson.order,
      videoUrl: lesson.videoUrl,
      content: lesson.content,
      completed: progress !== null,
      prevLessonId: idx > 0 ? siblings[idx - 1].id : null,
      nextLessonId: idx < siblings.length - 1 ? siblings[idx + 1].id : null,
      quiz: lesson.quiz
        ? {
            id: lesson.quiz.id,
            title: lesson.quiz.title,
            passingScore: lesson.quiz.passingScore,
            // answers deliberately excluded — grading happens server-side
            questions: lesson.quiz.questions.map((q) => ({
              id: q.id,
              type: q.type,
              prompt: q.prompt,
              options: q.options,
              order: q.order,
            })),
          }
        : null,
    };
    res.json(body);
  })
);

lessonsRouter.post(
  '/:id/complete',
  requireAuth,
  h(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { course: { select: { status: true } } },
    });
    if (!lesson || lesson.course.status !== 'PUBLISHED') throw new HttpError(404, 'Lesson not found');

    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: req.auth!.sub, lessonId: lesson.id } },
    });
    if (existing) {
      return res.json({ completed: true, xpAwarded: 0 });
    }

    await prisma.lessonProgress.create({
      data: { userId: req.auth!.sub, lessonId: lesson.id },
    });
    await recordActivity(req.auth!.sub, XP_LESSON_COMPLETED);
    res.json({ completed: true, xpAwarded: XP_LESSON_COMPLETED });
  })
);
