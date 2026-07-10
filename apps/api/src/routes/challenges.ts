import { Router } from 'express';
import { z } from 'zod';
import type { ChallengeDetailDto, ChallengeSubmissionDto, ChallengeSummaryDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { optionalAuth, requireAuth } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';
import { deepEqual } from '../lib/deepEqual.ts';
import { recordActivity, XP_CHALLENGE_SOLVED } from '../services/gamification.ts';

export const challengesRouter = Router();

challengesRouter.get(
  '/',
  optionalAuth,
  h(async (req, res) => {
    const challenges = await prisma.challenge.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
    const solvedIds = req.auth
      ? new Set(
          (
            await prisma.challengeSubmission.findMany({
              where: { userId: req.auth.sub, passed: true },
              select: { challengeId: true },
              distinct: ['challengeId'],
            })
          ).map((s) => s.challengeId)
        )
      : new Set<string>();

    const body: ChallengeSummaryDto[] = challenges.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      difficulty: c.difficulty,
      languages: c.languages,
      solved: solvedIds.has(c.id),
    }));
    res.json(body);
  })
);

challengesRouter.get(
  '/:id',
  optionalAuth,
  h(async (req, res) => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
      include: { testCases: { orderBy: { order: 'asc' } } },
    });
    if (!challenge || challenge.status !== 'PUBLISHED') throw new HttpError(404, 'Challenge not found');

    const solved = req.auth
      ? (await prisma.challengeSubmission.findFirst({
          where: { challengeId: challenge.id, userId: req.auth.sub, passed: true },
        })) !== null
      : false;

    const body: ChallengeDetailDto = {
      id: challenge.id,
      slug: challenge.slug,
      title: challenge.title,
      difficulty: challenge.difficulty,
      languages: challenge.languages,
      solved,
      prompt: challenge.prompt,
      entryPoint: challenge.entryPoint,
      starterCode: challenge.starterCode as Partial<Record<'python' | 'javascript' | 'typescript' | 'lua' | 'html', string>>,
      examples: challenge.testCases
        .filter((t) => !t.isHidden)
        .map((t) => ({ input: t.input as unknown[], expectedOutput: t.expectedOutput })),
      testCases: challenge.testCases.map((t) => ({ id: t.id, input: t.input as unknown[], isHidden: t.isHidden })),
    };
    res.json(body);
  })
);

const submitSchema = z.object({
  language: z.enum(['PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'LUA', 'HTML', 'C']),
  results: z.array(
    z.object({
      testCaseId: z.string(),
      actualOutput: z.unknown(),
      errored: z.boolean(),
      errorMessage: z.string().nullable(),
    })
  ),
});

challengesRouter.post(
  '/:id/submit',
  requireAuth,
  h(async (req, res) => {
    const { language, results } = submitSchema.parse(req.body);

    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
      include: { testCases: true },
    });
    if (!challenge || challenge.status !== 'PUBLISHED') throw new HttpError(404, 'Challenge not found');
    if (!challenge.languages.includes(language)) throw new HttpError(400, 'Unsupported language for this challenge');

    const byId = new Map(results.map((r) => [r.testCaseId, r]));
    const failedTestCaseIds: string[] = [];
    for (const tc of challenge.testCases) {
      const r = byId.get(tc.id);
      const ok = r !== undefined && !r.errored && deepEqual(r.actualOutput, tc.expectedOutput);
      if (!ok) failedTestCaseIds.push(tc.id);
    }
    const testsTotal = challenge.testCases.length;
    const testsPassed = testsTotal - failedTestCaseIds.length;
    const passed = failedTestCaseIds.length === 0;

    const priorPass = await prisma.challengeSubmission.findFirst({
      where: { challengeId: challenge.id, userId: req.auth!.sub, passed: true },
    });

    await prisma.challengeSubmission.create({
      data: {
        challengeId: challenge.id,
        userId: req.auth!.sub,
        language,
        passed,
        testsPassed,
        testsTotal,
        results: challenge.testCases.map((tc) => ({
          testCaseId: tc.id,
          passed: !failedTestCaseIds.includes(tc.id),
        })),
      },
    });

    let xpAwarded = 0;
    if (passed && !priorPass) {
      xpAwarded = XP_CHALLENGE_SOLVED;
      await recordActivity(req.auth!.sub, xpAwarded);
    }

    const body: ChallengeSubmissionDto = { passed, testsPassed, testsTotal, failedTestCaseIds, xpAwarded };
    res.json(body);
  })
);
