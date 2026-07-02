import { Router } from 'express';
import { z } from 'zod';
import type { QuizResultDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';
import { recordActivity, XP_QUIZ_PASSED } from '../services/gamification.ts';

const attemptSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export const quizzesRouter = Router();

quizzesRouter.post(
  '/:id/attempts',
  requireAuth,
  h(async (req, res) => {
    const { answers } = attemptSchema.parse(req.body);

    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: true },
    });
    if (!quiz || quiz.questions.length === 0) throw new HttpError(404, 'Quiz not found');

    const incorrectQuestionIds: string[] = [];
    for (const q of quiz.questions) {
      const given = (answers[q.id] ?? '').trim();
      const correct =
        q.type === 'FILL_BLANK'
          ? given.toLowerCase() === q.answer.trim().toLowerCase()
          : given === q.answer;
      if (!correct) incorrectQuestionIds.push(q.id);
    }

    const correctCount = quiz.questions.length - incorrectQuestionIds.length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const priorPass = await prisma.quizAttempt.findFirst({
      where: { quizId: quiz.id, userId: req.auth!.sub, passed: true },
    });

    await prisma.quizAttempt.create({
      data: { quizId: quiz.id, userId: req.auth!.sub, score, passed, answers },
    });

    let xpAwarded = 0;
    if (passed && !priorPass) {
      xpAwarded = XP_QUIZ_PASSED;
      await recordActivity(req.auth!.sub, xpAwarded);
    }

    const body: QuizResultDto = {
      score,
      passed,
      passingScore: quiz.passingScore,
      correctCount,
      totalQuestions: quiz.questions.length,
      incorrectQuestionIds,
      xpAwarded,
    };
    res.json(body);
  })
);
