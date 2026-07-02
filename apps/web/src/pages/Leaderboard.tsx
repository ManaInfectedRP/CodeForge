import { useEffect, useState } from 'react';
import type { LeaderboardDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<LeaderboardDto>('/leaderboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!data) return <main className="p-12 text-center text-slate-400">Loading leaderboard…</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
      <p className="mt-2 text-slate-400">Top students ranked by XP.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3 text-right">XP</th>
              <th className="px-4 py-3 text-right">Streak</th>
              <th className="px-4 py-3 text-right">Challenges</th>
            </tr>
          </thead>
          <tbody>
            {data.entries.map((e) => (
              <tr
                key={e.userId}
                className={`border-b border-slate-800/60 last:border-0 ${e.isCurrentUser ? 'bg-forge-900/30' : ''}`}
              >
                <td className="px-4 py-3 font-semibold">{medals[e.rank] ?? e.rank}</td>
                <td className="px-4 py-3">
                  {e.username}
                  {e.isCurrentUser && <span className="ml-2 text-xs text-forge-500">(you)</span>}
                </td>
                <td className="px-4 py-3 text-right text-amber-400">⚡ {e.xp}</td>
                <td className="px-4 py-3 text-right text-orange-400">🔥 {e.streak}</td>
                <td className="px-4 py-3 text-right text-slate-300">💻 {e.challengesSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
