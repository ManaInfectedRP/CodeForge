import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.ts';
import { AUTH_COOKIE, cookieOptions, signToken } from '../lib/jwt.ts';
import { h, toUserDto } from '../lib/helpers.ts';
import { HttpError } from '../middleware/errors.ts';
import { optionalAuth, requireAuth } from '../middleware/auth.ts';
import { authLimiter } from '../middleware/rateLimit.ts';
import { appUrl, isMailerConfigured, sendVerificationEmail } from '../lib/mailer.ts';

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
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$/,
      'Username may only contain letters, numbers, underscores, and single spaces between words'
    ),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_LOGIN_STATE_COOKIE = 'gh_oauth_state';
const GITHUB_CONNECT_STATE_COOKIE = 'gh_oauth_connect_state';

function githubStateCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000,
  };
}

// A classic GitHub OAuth App only supports ONE registered callback URL, so login and
// "connect to an existing account" both redirect back here and are told apart by which
// state cookie matches, rather than using two different callback paths.
function githubCallbackUrl(): string {
  return `${appUrl()}/api/auth/github/callback`;
}

/** Turns a GitHub login into a username matching our format, adding a numeric suffix if taken. */
async function uniqueUsernameFromGithubLogin(base: string): Promise<string> {
  const cleaned = base.replace(/[^a-zA-Z0-9_]+/g, '_').slice(0, 30) || 'user';
  const padded = cleaned.length < 3 ? cleaned.padEnd(3, '0') : cleaned;
  let username = padded;
  let suffix = 1;
  while (await prisma.user.findUnique({ where: { username } })) {
    suffix += 1;
    username = `${padded}${suffix}`.slice(0, 30);
  }
  return username;
}

interface GithubProfile {
  githubId: string;
  login: string;
  avatarUrl: string | null;
  email: string | null;
}

/** Exchanges an OAuth code for the caller's GitHub id/login/avatar and best verified email. */
async function exchangeGithubCode(code: string, redirectUri: string): Promise<GithubProfile> {
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });
  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) throw new Error('GitHub did not return an access token');

  const [profileRes, emailsRes] = await Promise.all([
    fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/vnd.github+json' },
    }),
    fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/vnd.github+json' },
    }),
  ]);
  const profile = (await profileRes.json()) as { id: number; login: string; email: string | null; avatar_url?: string };
  const emails: { email: string; primary: boolean; verified: boolean }[] = emailsRes.ok ? await emailsRes.json() : [];
  const primaryEmail = emails.find((e) => e.primary && e.verified)?.email ?? profile.email;

  return {
    githubId: String(profile.id),
    login: profile.login,
    avatarUrl: profile.avatar_url ?? null,
    email: primaryEmail,
  };
}

export const authRouter = Router();

authRouter.post(
  '/register',
  authLimiter,
  h(async (req, res) => {
    const { username, email, password } = registerSchema.parse(req.body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      throw new HttpError(409, existing.email === email ? 'Email already registered' : 'Username already taken');
    }

    // without a mail provider there is no way to complete verification,
    // so accounts are verified immediately until SMTP_* is configured
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        ...(isMailerConfigured ? newVerifyToken() : { emailVerified: true }),
      },
    });

    if (isMailerConfigured) {
      // fire-and-forget: registration should not fail if the mail provider is down
      sendVerificationEmail(user.email, user.username, user.emailVerifyToken!).catch((err) =>
        console.error('[mailer] failed to send verification email:', err)
      );
    }

    res.cookie(AUTH_COOKIE, signToken({ sub: user.id, role: user.role }), cookieOptions());
    res.status(201).json(toUserDto(user));
  })
);

authRouter.post(
  '/verify-email',
  h(async (req, res) => {
    const { token } = z.object({ token: z.string().min(1, 'Verification token is required') }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { emailVerifyToken: token } });
    if (!user) throw new HttpError(400, 'Invalid or already-used verification link');
    if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
      throw new HttpError(400, 'This verification link has expired, request a new one from your dashboard');
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
  authLimiter,
  h(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpError(401, 'Invalid email or password');
    }
    if (user.bannedAt) throw new HttpError(403, 'Your account has been banned');

    res.cookie(AUTH_COOKIE, signToken({ sub: user.id, role: user.role }), cookieOptions());
    res.json(toUserDto(user));
  })
);

authRouter.post(
  '/logout',
  h(async (_req, res) => {
    res.clearCookie(AUTH_COOKIE, cookieOptions());
    res.json({ loggedOut: true });
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

authRouter.get(
  '/github',
  h(async (_req, res) => {
    if (!GITHUB_CLIENT_ID) {
      return res.redirect(`${appUrl()}/login?error=github_not_configured`);
    }
    const state = crypto.randomBytes(16).toString('hex');
    res.cookie(GITHUB_LOGIN_STATE_COOKIE, state, githubStateCookieOptions());
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: githubCallbackUrl(),
      scope: 'read:user user:email',
      state,
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  })
);

// --- Connect GitHub to an already-logged-in account (Settings page) ---

authRouter.get(
  '/github/connect',
  requireAuth,
  h(async (_req, res) => {
    if (!GITHUB_CLIENT_ID) {
      return res.redirect(`${appUrl()}/settings?github=error&reason=not_configured`);
    }
    const state = crypto.randomBytes(16).toString('hex');
    res.cookie(GITHUB_CONNECT_STATE_COOKIE, state, githubStateCookieOptions());
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: githubCallbackUrl(),
      scope: 'read:user user:email',
      state,
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  })
);

// Shared by both flows above (one GitHub OAuth App = one callback URL); which cookie's
// state matches tells us whether this is a fresh login/signup or connecting an existing session.
authRouter.get(
  '/github/callback',
  optionalAuth,
  h(async (req, res) => {
    const loginCookieState = req.cookies[GITHUB_LOGIN_STATE_COOKIE];
    const connectCookieState = req.cookies[GITHUB_CONNECT_STATE_COOKIE];
    res.clearCookie(GITHUB_LOGIN_STATE_COOKIE, githubStateCookieOptions());
    res.clearCookie(GITHUB_CONNECT_STATE_COOKIE, githubStateCookieOptions());

    const { code, state } = req.query;
    const isConnect = typeof state === 'string' && !!connectCookieState && state === connectCookieState;
    const isLogin = typeof state === 'string' && !!loginCookieState && state === loginCookieState;
    const failureRedirect = isConnect ? `${appUrl()}/settings?github=error&reason=` : `${appUrl()}/login?error=github_`;

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      return res.redirect(`${failureRedirect}not_configured`);
    }
    if (typeof code !== 'string' || (!isConnect && !isLogin)) {
      return res.redirect(`${failureRedirect}failed`);
    }
    if (isConnect && !req.auth) {
      // session expired mid-flow, there's no account left to attach this to
      return res.redirect(`${appUrl()}/login?error=github_failed`);
    }

    try {
      const profile = await exchangeGithubCode(code, githubCallbackUrl());

      if (isConnect) {
        const existing = await prisma.user.findUnique({ where: { githubId: profile.githubId } });
        if (existing && existing.id !== req.auth!.sub) {
          return res.redirect(`${appUrl()}/settings?github=error&reason=already_linked`);
        }
        await prisma.user.update({
          where: { id: req.auth!.sub },
          data: { githubId: profile.githubId, githubUsername: profile.login },
        });
        return res.redirect(`${appUrl()}/settings?github=connected`);
      }

      if (!profile.email) {
        return res.redirect(`${appUrl()}/login?error=github_no_email`);
      }

      let user = await prisma.user.findUnique({ where: { githubId: profile.githubId } });
      if (!user) {
        // A verified GitHub email matching an existing account links the two instead of erroring,
        // this account may have registered with a password first and is now adding GitHub login.
        const existing = await prisma.user.findUnique({ where: { email: profile.email } });
        user = existing
          ? await prisma.user.update({
              where: { id: existing.id },
              data: { githubId: profile.githubId, githubUsername: profile.login },
            })
          : await prisma.user.create({
              data: {
                username: await uniqueUsernameFromGithubLogin(profile.login),
                email: profile.email,
                githubId: profile.githubId,
                githubUsername: profile.login,
                avatarUrl: profile.avatarUrl,
                emailVerified: true,
              },
            });
      }

      if (user.bannedAt) {
        return res.redirect(`${appUrl()}/login?error=banned`);
      }

      res.cookie(AUTH_COOKIE, signToken({ sub: user.id, role: user.role }), cookieOptions());
      res.redirect(`${appUrl()}/dashboard`);
    } catch (err) {
      console.error('[auth] GitHub OAuth failed:', err);
      res.redirect(`${failureRedirect}failed`);
    }
  })
);
