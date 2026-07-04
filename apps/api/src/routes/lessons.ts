import { Router } from 'express';
import { z } from 'zod';
import type { LessonDetailDto, ProjectSubmissionDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';
import { recordActivity, XP_LESSON_COMPLETED } from '../services/gamification.ts';

const submitSchema = z.object({
  submissionUrl: z.string().url('Enter a valid URL, e.g. a link to your repository'),
});

function toSubmissionDto(s: {
  id: string;
  submissionUrl: string;
  status: 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED';
  feedback: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
}): ProjectSubmissionDto {
  return {
    id: s.id,
    submissionUrl: s.submissionUrl,
    status: s.status,
    feedback: s.feedback,
    submittedAt: s.submittedAt.toISOString(),
    reviewedAt: s.reviewedAt?.toISOString() ?? null,
  };
}

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

    const [progress, siblings, submission, passingAttempt] = await Promise.all([
      prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: req.auth!.sub, lessonId: lesson.id } },
      }),
      prisma.lesson.findMany({
        where: { courseId: lesson.courseId },
        select: { id: true, order: true },
        orderBy: { order: 'asc' },
      }),
      prisma.projectSubmission.findUnique({
        where: { lessonId_userId: { lessonId: lesson.id, userId: req.auth!.sub } },
      }),
      lesson.quiz
        ? prisma.quizAttempt.findFirst({
            where: { quizId: lesson.quiz.id, userId: req.auth!.sub, passed: true },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);

    const idx = siblings.findIndex((s) => s.id === lesson.id);
    if (idx > 0) {
      const previousIds = siblings.slice(0, idx).map((s) => s.id);
      const completedPreviousCount = await prisma.lessonProgress.count({
        where: { userId: req.auth!.sub, lessonId: { in: previousIds } },
      });
      if (completedPreviousCount < previousIds.length) {
        throw new HttpError(403, 'Complete the previous lessons in this course before this one');
      }
    }

    const body: LessonDetailDto = {
      id: lesson.id,
      courseId: lesson.course.id,
      courseTitle: lesson.course.title,
      title: lesson.title,
      order: lesson.order,
      videoUrl: lesson.videoUrl,
      content: lesson.content,
      completed: progress !== null,
      quizPassed: lesson.quiz ? passingAttempt !== null : true,
      prevLessonId: idx > 0 ? siblings[idx - 1].id : null,
      nextLessonId: idx < siblings.length - 1 ? siblings[idx + 1].id : null,
      requiresSubmission: lesson.requiresSubmission,
      mySubmission: submission ? toSubmissionDto(submission) : null,
      quiz: lesson.quiz
        ? {
            id: lesson.quiz.id,
            title: lesson.quiz.title,
            passingScore: lesson.quiz.passingScore,
            // answers deliberately excluded, grading happens server-side
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
      include: {
        course: { select: { status: true } },
        quiz: { select: { id: true } },
      },
    });
    if (!lesson || lesson.course.status !== 'PUBLISHED') throw new HttpError(404, 'Lesson not found');

    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: req.auth!.sub, lessonId: lesson.id } },
    });
    if (existing) {
      return res.json({ completed: true, xpAwarded: 0 });
    }

    const previousLessons = await prisma.lesson.findMany({
      where: { courseId: lesson.courseId, order: { lt: lesson.order } },
      select: { id: true },
    });
    if (previousLessons.length > 0) {
      const completedPreviousCount = await prisma.lessonProgress.count({
        where: { userId: req.auth!.sub, lessonId: { in: previousLessons.map((l) => l.id) } },
      });
      if (completedPreviousCount < previousLessons.length) {
        throw new HttpError(400, 'Complete the previous lessons in this course before this one');
      }
    }

    if (lesson.quiz) {
      const passed = await prisma.quizAttempt.findFirst({
        where: { quizId: lesson.quiz.id, userId: req.auth!.sub, passed: true },
        select: { id: true },
      });
      if (!passed) {
        throw new HttpError(400, 'Complete and pass the quiz before marking this lesson complete');
      }
    }

    if (lesson.requiresSubmission) {
      const submission = await prisma.projectSubmission.findUnique({
        where: { lessonId_userId: { lessonId: lesson.id, userId: req.auth!.sub } },
      });
      if (submission?.status !== 'APPROVED') {
        throw new HttpError(400, 'Submit your project and get it approved by an instructor before completing this lesson');
      }
    }

    await prisma.lessonProgress.create({
      data: { userId: req.auth!.sub, lessonId: lesson.id },
    });
    await recordActivity(req.auth!.sub, XP_LESSON_COMPLETED);
    res.json({ completed: true, xpAwarded: XP_LESSON_COMPLETED });
  })
);

lessonsRouter.post(
  '/:id/submit',
  requireAuth,
  h(async (req, res) => {
    const { submissionUrl } = submitSchema.parse(req.body);
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { course: { select: { status: true } } },
    });
    if (!lesson || lesson.course.status !== 'PUBLISHED') throw new HttpError(404, 'Lesson not found');
    if (!lesson.requiresSubmission) throw new HttpError(400, 'This lesson does not accept project submissions');

    const submission = await prisma.projectSubmission.upsert({
      where: { lessonId_userId: { lessonId: lesson.id, userId: req.auth!.sub } },
      update: { submissionUrl, status: 'PENDING', feedback: null, reviewedAt: null, submittedAt: new Date() },
      create: { lessonId: lesson.id, userId: req.auth!.sub, submissionUrl },
    });
    res.status(201).json(toSubmissionDto(submission));
  })
);
