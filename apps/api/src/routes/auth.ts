import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { AuthResponseDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { signToken } from '../lib/jwt.ts';
import { h, toUserDto } from '../lib/helpers.ts';
import { HttpError } from '../middleware/errors.ts';
import { requireAuth } from '../middleware/auth.ts';
import { sendVerificationEmail } from '../lib/mailer.ts';

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function newVerifyToken() {
  return {
    emailVerifyToken: crypto.randomBytes(32).toString('hex'),
    emailVerifyExpires: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
  };
}

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const authRouter = Router();

authRouter.post(
  '/register',
  h(async (req, res) => {
    const { username, email, password } = registerSchema.parse(req.body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      throw new HttpError(409, existing.email === email ? 'Email already registered' : 'Username already taken');
    }

    const user = await prisma.user.create({
      data: { username, email, passwordHash: await bcrypt.hash(password, 10), ...newVerifyToken() },
    });

    // fire-and-forget: registration should not fail if the mail provider is down
    sendVerificationEmail(user.email, user.username, user.emailVerifyToken!).catch((err) =>
      console.error('[mailer] failed to send verification email:', err)
    );

    const body: AuthResponseDto = {
      token: signToken({ sub: user.id, role: user.role }),
      user: toUserDto(user),
    };
    res.status(201).json(body);
  })
);

authRouter.post(
  '/verify-email',
  h(async (req, res) => {
    const { token } = z.object({ token: z.string().min(1, 'Verification token is required') }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { emailVerifyToken: token } });
    if (!user) throw new HttpError(400, 'Invalid or already-used verification link');
    if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
      throw new HttpError(400, 'This verification link has expired — request a new one from your dashboard');
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpires: null },
    });
    res.json(toUserDto(updated));
  })
);

authRouter.post(
  '/resend-verification',
  requireAuth,
  h(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.auth!.sub } });
    if (user.emailVerified) throw new HttpError(400, 'Your email is already verified');

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: newVerifyToken(),
    });
    await sendVerificationEmail(updated.email, updated.username, updated.emailVerifyToken!);
    res.json({ sent: true });
  })
);

authRouter.post(
  '/login',
  h(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const body: AuthResponseDto = {
      token: signToken({ sub: user.id, role: user.role }),
      user: toUserDto(user),
    };
    res.json(body);
  })
);

authRouter.get(
  '/me',
  requireAuth,
  h(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.auth!.sub } });
    if (!user) throw new HttpError(404, 'User not found');
    res.json(toUserDto(user));
  })
);
