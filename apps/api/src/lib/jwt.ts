import jwt from 'jsonwebtoken';
import type { CookieOptions } from 'express';
import type { Role } from '@codeforge/shared';

const JWT_SECRET: string =
  process.env.JWT_SECRET ??
  (() => {
    throw new Error('JWT_SECRET is not set, refusing to start with an insecure default');
  })();

export const AUTH_COOKIE = 'cf_token';
const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
  };
}

export interface TokenPayload {
  sub: string;
  role: Role;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === 'string' || !decoded.sub) throw new Error('Invalid token payload');
  return { sub: decoded.sub, role: decoded.role as Role };
}
