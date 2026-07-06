import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@codeforge/shared';
import { AUTH_COOKIE, verifyToken, type TokenPayload } from '../lib/jwt.ts';
import { HttpError } from './errors.ts';
import { prisma } from '../lib/prisma.ts';

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (typeof token !== 'string') throw new HttpError(401, 'Authentication required');
  let payload: TokenPayload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }
  // tokens outlive moderation actions, so bans are enforced per request and the
  // role is read fresh so promotions/demotions apply without a re-login
  prisma.user
    .findUnique({ where: { id: payload.sub }, select: { bannedAt: true, role: true } })
    .then((user) => {
      if (!user) return next(new HttpError(401, 'Account no longer exists'));
      if (user.bannedAt) return next(new HttpError(403, 'Your account has been banned'));
      req.auth = { sub: payload.sub, role: user.role };
      next();
    })
    .catch(next);
}

/** Attaches req.auth when a valid token is present, but never rejects. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (typeof token === 'string') {
    try {
      req.auth = verifyToken(token);
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
