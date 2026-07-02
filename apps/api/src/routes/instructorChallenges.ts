import { Router } from 'express';
import { z } from 'zod';
import type { TeachChallengeDetailDto, TeachChallengeSummaryDto } from '@codeforge/shared';
import type { Challenge, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { HttpError } from '../middleware/errors.ts';
import type { TokenPayload } from '../lib/jwt.ts';

const challengeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  languages: z.array(z.enum(['PYTHON', 'JAVASCRIPT', 'TYPESCRIPT'])).min(1, 'Pick at least one language'),
  prompt: z.string().max(5000),
  entryPoint: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z_]\w*$/, 'Must be a valid function name'),
  starterCode: z.object({
    python: z.string().optional(),
    javascript: z.string().optional(),
    typescript: z.string().optional(),
  }),
});

const createSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  languages: z.array(z.enum(['PYTHON', 'JAVASCRIPT', 'TYPESCRIPT'])).min(1, 'Pick at least one language'),
});

const testCasesSchema = z.object({
  testCases: z
    .array(
      z.object({
        input: z.array(z.unknown()),
        expectedOutput: z.unknown(),
        isHidden: z.boolean(),
      })
    )
    .min(1, 'Add at least one test case'),
});

async function ownedChallenge(challengeId: string, auth: TokenPayload): Promise<Challenge> {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new HttpError(404, 'Challenge not found');
  if (challenge.instructorId !== auth.sub && auth.role !== 'ADMIN') {
    throw new HttpError(403, 'You do not own this challenge');
  }
  return challenge;
}

async function uniqueSlug(title: string): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'challenge';
  let slug = base;
  let suffix = 1;
  while (await prisma.challenge.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

export const instructorChallengesRouter = Router();

instructorChallengesRouter.use(requireAuth, requireRole('INSTRUCTOR', 'ADMIN'));

instructorChallengesRouter.get(
  '/',
  h(async (req, res) => {
    const challenges = await prisma.challenge.findMany({
      where: { instructorId: req.auth!.sub },
      include: { _count: { select: { testCases: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const body: TeachChallengeSummaryDto[] = challenges.map((c) => ({
      id: c.id,
      title: c.title,
      difficulty: c.difficulty,
      languages: c.languages,
      status: c.status,
      reviewNote: c.reviewNote,
      testCaseCount: c._count.testCases,
    }));
    res.json(body);
  })
);

instructorChallengesRouter.post(
  '/',
  h(async (req, res) => {
    const { title, difficulty, languages } = createSchema.parse(req.body);
    const slug = await uniqueSlug(title);

    const challenge = await prisma.challenge.create({
      data: {
        slug,
        title,
        difficulty,
        languages,
        prompt: '',
        entryPoint: 'solve',
        starterCode: {},
        instructorId: req.auth!.sub,
      },
    });
    res.status(201).json({ id: challenge.id });
  })
);

instructorChallengesRouter.get(
  '/:id',
  h(async (req, res) => {
    const challenge = await ownedChallenge(req.params.id, req.auth!);
    const testCases = await prisma.challengeTestCase.findMany({
      where: { challengeId: challenge.id },
      orderBy: { order: 'asc' },
    });

    const body: TeachChallengeDetailDto = {
      id: challenge.id,
      title: challenge.title,
      difficulty: challenge.difficulty,
      languages: challenge.languages,
      status: challenge.status,
      reviewNote: challenge.reviewNote,
      testCaseCount: testCases.length,
      prompt: challenge.prompt,
      entryPoint: challenge.entryPoint,
      starterCode: challenge.starterCode as Partial<Record<'python' | 'javascript' | 'typescript', string>>,
      testCases: testCases.map((t) => ({
        input: t.input as unknown[],
        expectedOutput: t.expectedOutput,
        isHidden: t.isHidden,
      })),
    };
    res.json(body);
  })
);

instructorChallengesRouter.put(
  '/:id',
  h(async (req, res) => {
    const challenge = await ownedChallenge(req.params.id, req.auth!);
    const { title, difficulty, languages, prompt, entryPoint, starterCode } = challengeSchema.parse(req.body);

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: { title, difficulty, languages, prompt, entryPoint, starterCode },
    });
    res.json({ updated: true });
  })
);

instructorChallengesRouter.put(
  '/:id/test-cases',
  h(async (req, res) => {
    const challenge = await ownedChallenge(req.params.id, req.auth!);
    const { testCases } = testCasesSchema.parse(req.body);

    await prisma.$transaction(async (tx) => {
      await tx.challengeTestCase.deleteMany({ where: { challengeId: challenge.id } });
      await tx.challengeTestCase.createMany({
        data: testCases.map((tc, i) => ({
          challengeId: challenge.id,
          input: tc.input as Prisma.InputJsonValue,
          expectedOutput: tc.expectedOutput as Prisma.InputJsonValue,
          isHidden: tc.isHidden,
          order: i,
        })),
      });
    });
    res.json({ saved: true });
  })
);

instructorChallengesRouter.post(
  '/:id/submit',
  h(async (req, res) => {
    const challenge = await ownedChallenge(req.params.id, req.auth!);
    if (challenge.status !== 'DRAFT') throw new HttpError(400, 'Only draft challenges can be submitted for review');

    const testCaseCount = await prisma.challengeTestCase.count({ where: { challengeId: challenge.id } });
    if (testCaseCount === 0) throw new HttpError(400, 'Add at least one test case before submitting for review');

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: 'PENDING_REVIEW', reviewNote: null },
    });
    res.json({ status: 'PENDING_REVIEW' });
  })
);
