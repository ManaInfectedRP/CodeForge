import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.ts';
import { pathsRouter } from './routes/paths.ts';
import { coursesRouter } from './routes/courses.ts';
import { lessonsRouter } from './routes/lessons.ts';
import { quizzesRouter } from './routes/quizzes.ts';
import { meRouter } from './routes/me.ts';
import { instructorRouter } from './routes/instructor.ts';
import { adminRouter } from './routes/admin.ts';
import { errorHandler } from './middleware/errors.ts';
import { UPLOADS_DIR } from './lib/upload.ts';

export function createApp() {
  const app = express();

  app.use(cors());
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
  app.use('/api/admin', adminRouter);

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use(errorHandler);

  return app;
}
