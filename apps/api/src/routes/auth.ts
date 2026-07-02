import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { AuthResponseDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { signToken } from '../lib/jwt.ts';
import { h, toUserDto } from '../lib/helpers.ts';
import { HttpError } from '../middleware/errors.ts';
import { requireAuth } from '../middleware/auth.ts';

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
      data: { username, email, passwordHash: await bcrypt.hash(password, 10) },
    });

    const body: AuthResponseDto = {
      token: signToken({ sub: user.id, role: user.role }),
      user: toUserDto(user),
    };
    res.status(201).json(body);
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
