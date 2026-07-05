import { Router } from 'express';
import { z } from 'zod';
import type { AnalyticsSummaryDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';

const trackSchema = z.object({
  path: z.string().min(1).max(300),
});

const TREND_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const analyticsRouter = Router();

analyticsRouter.post(
  '/track',
  h(async (req, res) => {
    const { path } = trackSchema.parse(req.body);
    const date = todayKey();
    await prisma.$transaction([
      prisma.pageViewCount.upsert({
        where: { path },
        update: { views: { increment: 1 } },
        create: { path, views: 1 },
      }),
      prisma.pageViewDaily.upsert({
        where: { path_date: { path, date } },
        update: { views: { increment: 1 } },
        create: { path, date, views: 1 },
      }),
    ]);
    res.status(201).json({ tracked: true });
  })
);

analyticsRouter.get(
  '/summary',
  requireAuth,
  requireRole('ADMIN'),
  h(async (_req, res) => {
    const pages = await prisma.pageViewCount.findMany({ orderBy: { views: 'desc' } });
    const topPages = pages.slice(0, 10);

    const windowStart = new Date(Date.now() - (TREND_DAYS - 1) * DAY_MS);
    const dayKeys = Array.from({ length: TREND_DAYS }, (_, i) =>
      new Date(windowStart.getTime() + i * DAY_MS).toISOString().slice(0, 10)
    );

    const daily =
      topPages.length > 0
        ? await prisma.pageViewDaily.findMany({
            where: { path: { in: topPages.map((p) => p.path) }, date: { in: dayKeys } },
          })
        : [];

    const body: AnalyticsSummaryDto = {
      totalViews: pages.reduce((sum, p) => sum + p.views, 0),
      pagesTracked: pages.length,
      topPages: topPages.map((p) => ({
        path: p.path,
        views: p.views,
        trend: dayKeys.map((date) => daily.find((d) => d.path === p.path && d.date === date)?.views ?? 0),
      })),
    };
    res.json(body);
  })
);
