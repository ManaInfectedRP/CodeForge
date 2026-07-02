import { prisma } from '../lib/prisma.ts';

export const XP_LESSON_COMPLETED = 10;
export const XP_QUIZ_PASSED = 25;

function startOfDay(d: Date): number {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

/**
 * Awards XP and advances the daily streak: consecutive-day activity
 * increments it, a gap resets it to 1, same-day activity leaves it alone.
 */
export async function recordActivity(userId: string, xpAwarded: number) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const now = new Date();
  const today = startOfDay(now);
  const lastDay = user.lastActiveAt ? startOfDay(user.lastActiveAt) : null;
  const oneDayMs = 24 * 60 * 60 * 1000;

  let streak = user.streak;
  if (lastDay === null || today - lastDay > oneDayMs) streak = 1;
  else if (today - lastDay === oneDayMs) streak += 1;

  return prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xpAwarded }, streak, lastActiveAt: now },
  });
}
