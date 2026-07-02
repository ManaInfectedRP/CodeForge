import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ChallengeDifficulty, ChallengeSummaryDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

const difficultyStyles: Record<ChallengeDifficulty, string> = {
  EASY: 'bg-emerald-900/50 text-emerald-300',
  MEDIUM: 'bg-amber-900/50 text-amber-300',
  HARD: 'bg-red-900/50 text-red-300',
};

const languageLabels: Record<string, string> = {
  PYTHON: 'Python',
  JAVASCRIPT: 'JavaScript',
  TYPESCRIPT: 'TypeScript',
};

export function Challenges() {
  const [challenges, setChallenges] = useState<ChallengeSummaryDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ChallengeSummaryDto[]>('/challenges')
      .then((res) => setChallenges(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!challenges) return <main className="p-12 text-center text-slate-400">Loading challenges…</main>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">💻 Coding Challenges</h1>
      <p className="mt-2 text-slate-400">Solve problems, earn XP, and climb the leaderboard.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((c) => (
          <Link
            key={c.id}
            to={`/challenges/${c.id}`}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-600"
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[c.difficulty]}`}>
                {c.difficulty}
              </span>
              {c.solved && <span className="text-emerald-400" title="Solved">✓</span>}
            </div>
            <h3 className="mt-3 font-semibold">{c.title}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.languages.map((lang) => (
                <span key={lang} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  {languageLabels[lang] ?? lang}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
