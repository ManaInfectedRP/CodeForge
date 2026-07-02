import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { UserDto } from '@codeforge/shared';
import type { User } from '@prisma/client';

/** Express 4 does not forward rejected promises to the error handler. */
export function h(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    xp: user.xp,
    streak: user.streak,
  };
}
