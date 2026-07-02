import jwt from 'jsonwebtoken';
import type { Role } from '@codeforge/shared';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me-in-production';

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
