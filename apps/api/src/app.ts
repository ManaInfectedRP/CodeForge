import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.ts';
import { pathsRouter } from './routes/paths.ts';
import { coursesRouter } from './routes/courses.ts';
import { lessonsRouter } from './routes/lessons.ts';
import { quizzesRouter } from './routes/quizzes.ts';
import { meRouter } from './routes/me.ts';
import { instructorRouter } from './routes/instructor.ts';
import { instructorChallengesRouter } from './routes/instructorChallenges.ts';
import { adminRouter } from './routes/admin.ts';
import { challengesRouter } from './routes/challenges.ts';
import { leaderboardRouter } from './routes/leaderboard.ts';
import { achievementsRouter } from './routes/achievements.ts';
import { certificatesRouter } from './routes/certificates.ts';
import { reviewsRouter } from './routes/reviews.ts';
import { chatRouter } from './routes/chat.ts';
import { analyticsRouter } from './routes/analytics.ts';
import { blogRouter } from './routes/blog.ts';
import { adminBlogRouter } from './routes/adminBlog.ts';
import { errorHandler } from './middleware/errors.ts';
import { UPLOADS_DIR } from './lib/upload.ts';
import path from 'node:path';
import fs from 'node:fs';

export function createApp() {
  const app = express();

  // CSP is left off: Pyodide/wasmoon load their runtimes from a CDN via injected <script>
  // tags and the JS sandbox runs code via a Blob-sourced worker + eval, so a correct policy
  // needs careful script-src/worker-src allowances that are easy to get wrong and would
  // silently break the code playgrounds. The other headers below are safe defaults.
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use('/uploads', express.static(UPLOADS_DIR));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRouter);
  app.use('/api/paths', pathsRouter);
  app.use('/api/courses', coursesRouter);
  app.use('/api/lessons', lessonsRouter);
  app.use('/api/quizzes', quizzesRouter);
  app.use('/api/me', meRouter);
  app.use('/api/instructor', instructorRouter);
  app.use('/api/instructor/challenges', instructorChallengesRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/challenges', challengesRouter);
  app.use('/api/leaderboard', leaderboardRouter);
  app.use('/api/achievements', achievementsRouter);
  app.use('/api/certificates', certificatesRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/blog', blogRouter);
  app.use('/api/admin/blog', adminBlogRouter);

  // In production (single-service deploys like Render) the API also serves the
  // built frontend; in dev, Vite serves it and this block is skipped.
  const webDist = path.resolve(process.cwd(), '../web/dist');
  if (fs.existsSync(webDist)) {
    app.use(express.static(webDist));
    app.use((req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
      res.sendFile(path.join(webDist, 'index.html'));
    });
  }

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use(errorHandler);

  return app;
}
