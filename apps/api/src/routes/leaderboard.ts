import { Router } from 'express';
import type { LeaderboardDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { optionalAuth } from '../middleware/auth.ts';

export const leaderboardRouter = Router();

leaderboardRouter.get(
  '/',
  optionalAuth,
  h(async (req, res) => {
    const top = await prisma.user.findMany({
      orderBy: [{ xp: 'desc' }, { streak: 'desc' }, { username: 'asc' }],
      take: 50,
      select: { id: true, username: true, avatarUrl: true, xp: true, streak: true },
    });

    const solvedPairs = await prisma.challengeSubmission.findMany({
      where: { userId: { in: top.map((u) => u.id) }, passed: true },
      select: { userId: true, challengeId: true },
      distinct: ['userId', 'challengeId'],
    });
    const solvedCountByUser = new Map<string, number>();
    for (const p of solvedPairs) solvedCountByUser.set(p.userId, (solvedCountByUser.get(p.userId) ?? 0) + 1);

    const body: LeaderboardDto = {
      entries: top.map((u, i) => ({
        rank: i + 1,
        userId: u.id,
        username: u.username,
        avatarUrl: u.avatarUrl,
        xp: u.xp,
        streak: u.streak,
        challengesSolved: solvedCountByUser.get(u.id) ?? 0,
        isCurrentUser: req.auth?.sub === u.id,
      })),
    };
    res.json(body);
  })
);
