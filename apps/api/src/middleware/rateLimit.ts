import rateLimit from 'express-rate-limit';

// Login/register are the only unauthenticated endpoints that cost a bcrypt compare or a DB
// write, so they're the ones worth throttling per-IP against brute-force/spam.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: 'Too many attempts, try again in a few minutes' });
  },
});
