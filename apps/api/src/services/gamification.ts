import { prisma } from '../lib/prisma.ts';
import type { AchievementMetric } from '@prisma/client';

export const XP_LESSON_COMPLETED = 10;
export const XP_QUIZ_PASSED = 25;
export const XP_CHALLENGE_SOLVED = 30;

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

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xpAwarded }, streak, lastActiveAt: now },
  });

  await checkAchievements(userId, updated);
  return updated;
}

/**
 * Runs after every XP-earning action (lesson complete, quiz pass, challenge solve)
 * since they all funnel through recordActivity — one hook covers every source.
 */
async function checkAchievements(userId: string, user: { xp: number; streak: number }) {
  const [achievements, alreadyUnlocked, lessonsCompleted, quizzesPassed, challengesSolved] = await Promise.all([
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
    prisma.lessonProgress.count({ where: { userId } }),
    prisma.quizAttempt.findMany({ where: { userId, passed: true }, select: { quizId: true }, distinct: ['quizId'] }),
    prisma.challengeSubmission.findMany({
      where: { userId, passed: true },
      select: { challengeId: true },
      distinct: ['challengeId'],
    }),
  ]);

  const unlockedIds = new Set(alreadyUnlocked.map((u) => u.achievementId));
  const stats: Record<AchievementMetric, number> = {
    XP: user.xp,
    STREAK: user.streak,
    LESSONS_COMPLETED: lessonsCompleted,
    QUIZZES_PASSED: quizzesPassed.length,
    CHALLENGES_SOLVED: challengesSolved.length,
  };

  const newlyUnlocked = achievements.filter((a) => !unlockedIds.has(a.id) && stats[a.metric] >= a.threshold);
  if (newlyUnlocked.length > 0) {
    await prisma.userAchievement.createMany({
      data: newlyUnlocked.map((a) => ({ userId, achievementId: a.id })),
      skipDuplicates: true,
    });
  }
}
