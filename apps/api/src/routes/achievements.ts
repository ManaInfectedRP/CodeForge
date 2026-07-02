import { Router } from 'express';
import type { AchievementDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth } from '../middleware/auth.ts';

export const achievementsRouter = Router();

achievementsRouter.get(
  '/',
  requireAuth,
  h(async (req, res) => {
    const [all, unlocked] = await Promise.all([
      prisma.achievement.findMany({ orderBy: { threshold: 'asc' } }),
      prisma.userAchievement.findMany({ where: { userId: req.auth!.sub } }),
    ]);
    const unlockedMap = new Map(unlocked.map((u) => [u.achievementId, u.unlockedAt]));

    const body: AchievementDto[] = all.map((a) => ({
      id: a.id,
      key: a.key,
      name: a.name,
      description: a.description,
      icon: a.icon,
      metric: a.metric,
      threshold: a.threshold,
      unlocked: unlockedMap.has(a.id),
      unlockedAt: unlockedMap.get(a.id)?.toISOString() ?? null,
    }));
    res.json(body);
  })
);
