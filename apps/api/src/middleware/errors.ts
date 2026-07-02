import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.issues.map((i) => i.message).join('; ') });
  }
  if (err instanceof MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Video is too large (max 200 MB)' : err.message;
    return res.status(400).json({ error: message });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}
