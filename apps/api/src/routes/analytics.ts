import { Router } from 'express';
import { z } from 'zod';
import type { AnalyticsSummaryDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';

const trackSchema = z.object({
  path: z.string().min(1).max(300),
});

export const analyticsRouter = Router();

analyticsRouter.post(
  '/track',
  h(async (req, res) => {
    const { path } = trackSchema.parse(req.body);
    await prisma.pageViewCount.upsert({
      where: { path },
      update: { views: { increment: 1 } },
      create: { path, views: 1 },
    });
    res.status(201).json({ tracked: true });
  })
);

analyticsRouter.get(
  '/summary',
  requireAuth,
  requireRole('ADMIN'),
  h(async (_req, res) => {
    const pages = await prisma.pageViewCount.findMany({ orderBy: { views: 'desc' } });

    const body: AnalyticsSummaryDto = {
      totalViews: pages.reduce((sum, p) => sum + p.views, 0),
      pagesTracked: pages.length,
      topPages: pages.slice(0, 10).map((p) => ({ path: p.path, views: p.views })),
    };
    res.json(body);
  })
);
