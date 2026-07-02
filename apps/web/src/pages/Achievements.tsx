import { useEffect, useState } from 'react';
import type { AchievementDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

const metricHints: Record<AchievementDto['metric'], (threshold: number) => string> = {
  XP: (t) => `Earn ${t} XP`,
  STREAK: (t) => `Reach a ${t}-day streak`,
  LESSONS_COMPLETED: (t) => `Complete ${t} lesson${t === 1 ? '' : 's'}`,
  QUIZZES_PASSED: (t) => `Pass ${t} quiz${t === 1 ? '' : 'zes'}`,
  CHALLENGES_SOLVED: (t) => `Solve ${t} challenge${t === 1 ? '' : 's'}`,
};

export function Achievements() {
  const [achievements, setAchievements] = useState<AchievementDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<AchievementDto[]>('/achievements')
      .then((res) => setAchievements(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!achievements) return <main className="p-12 text-center text-slate-400">Loading achievements…</main>;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">🎖️ Achievements</h1>
      <p className="mt-2 text-slate-400">
        {unlockedCount} of {achievements.length} unlocked
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`rounded-2xl border p-5 ${
              a.unlocked ? 'border-slate-800 bg-slate-900' : 'border-slate-800/60 bg-slate-900/40 opacity-60 grayscale'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{a.icon}</span>
              {a.unlocked && <span className="text-emerald-400" title="Unlocked">✓</span>}
            </div>
            <h3 className="mt-3 font-semibold">{a.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{a.description}</p>
            {a.unlocked && a.unlockedAt ? (
              <p className="mt-3 text-xs text-slate-500">Unlocked {new Date(a.unlockedAt).toLocaleDateString()}</p>
            ) : (
              <p className="mt-3 text-xs text-slate-500">{metricHints[a.metric](a.threshold)}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
