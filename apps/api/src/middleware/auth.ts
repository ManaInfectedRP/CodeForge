import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@codeforge/shared';
import { verifyToken, type TokenPayload } from '../lib/jwt.ts';
import { HttpError } from './errors.ts';

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new HttpError(401, 'Authentication required');
  try {
    req.auth = verifyToken(header.slice('Bearer '.length));
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }
  next();
}

/** Attaches req.auth when a valid token is present, but never rejects. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.auth = verifyToken(header.slice('Bearer '.length));
    } catch {
      // anonymous access is fine
    }
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) throw new HttpError(401, 'Authentication required');
    if (!roles.includes(req.auth.role)) throw new HttpError(403, 'Insufficient permissions');
    next();
  };
}
