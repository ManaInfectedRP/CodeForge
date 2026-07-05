import { Router } from 'express';
import { z } from 'zod';
import type { AnalyticsSummaryDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.ts';

const trackSchema = z.object({
  path: z.string().min(1).max(300),
  visitorId: z.string().min(1).max(100),
  referrer: z.string().max(500).nullable().optional(),
});

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 30;

export const analyticsRouter = Router();

analyticsRouter.post(
  '/track',
  optionalAuth,
  h(async (req, res) => {
    const { path, visitorId, referrer } = trackSchema.parse(req.body);
    await prisma.pageView.create({
      data: {
        path,
        visitorId,
        referrer: referrer || null,
        userId: req.auth?.sub ?? null,
      },
    });
    res.status(201).json({ tracked: true });
  })
);

analyticsRouter.get(
  '/summary',
  requireAuth,
  requireRole('ADMIN'),
  h(async (_req, res) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const windowStart = new Date(startOfToday.getTime() - (WINDOW_DAYS - 1) * DAY_MS);

    const [totalViews, viewsLast30Days, recentViews, topPagesRaw, visitorFirstSeen] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: windowStart } } }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: windowStart } },
        select: { createdAt: true, visitorId: true },
      }),
      prisma.pageView.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      }),
      prisma.pageView.groupBy({
        by: ['visitorId'],
        _min: { createdAt: true },
      }),
    ]);

    const uniqueVisitorsLast30Days = new Set(recentViews.map((v) => v.visitorId)).size;
    const newVisitorsToday = visitorFirstSeen.filter(
      (v) => v._min.createdAt && v._min.createdAt >= startOfToday
    ).length;

    const dayBuckets = new Map<string, { views: number; visitors: Set<string> }>();
    for (const v of recentViews) {
      const day = v.createdAt.toISOString().slice(0, 10);
      const bucket = dayBuckets.get(day) ?? { views: 0, visitors: new Set<string>() };
      bucket.views += 1;
      bucket.visitors.add(v.visitorId);
      dayBuckets.set(day, bucket);
    }
    const viewsPerDay = Array.from({ length: WINDOW_DAYS }, (_, i) => {
      const key = new Date(windowStart.getTime() + i * DAY_MS).toISOString().slice(0, 10);
      const bucket = dayBuckets.get(key);
      return { date: key, views: bucket?.views ?? 0, visitors: bucket?.visitors.size ?? 0 };
    });

    const body: AnalyticsSummaryDto = {
      totalViews,
      viewsLast30Days,
      uniqueVisitorsLast30Days,
      newVisitorsToday,
      viewsPerDay,
      topPages: topPagesRaw.map((p) => ({ path: p.path, views: p._count.path })),
    };
    res.json(body);
  })
);
