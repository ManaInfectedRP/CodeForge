import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import type { ChallengeDifficulty, ChallengeLanguage, TeachChallengeSummaryDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

const teachTabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${
    isActive ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`;

const allLanguages: ChallengeLanguage[] = ['PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'LUA', 'HTML', 'C'];
const languageLabels: Record<ChallengeLanguage, string> = {
  PYTHON: 'Python',
  JAVASCRIPT: 'JavaScript',
  TYPESCRIPT: 'TypeScript',
  LUA: 'Lua',
  HTML: 'HTML',
  C: 'C',
};

export function TeachChallenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<TeachChallengeSummaryDto[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>('EASY');
  const [languages, setLanguages] = useState<ChallengeLanguage[]>(['PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'LUA']);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<TeachChallengeSummaryDto[]>('/instructor/challenges').then((res) => setChallenges(res.data));
  }, []);

  function toggleLanguage(lang: ChallengeLanguage) {
    setLanguages((ls) => (ls.includes(lang) ? ls.filter((l) => l !== lang) : [...ls, lang]));
  }

  async function createChallenge(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.post<{ id: string }>('/instructor/challenges', { title, difficulty, languages });
      navigate(`/teach/challenges/${data.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav className="flex gap-2">
        <NavLink to="/teach" end className={teachTabClass}>
          Courses
        </NavLink>
        <NavLink to="/teach/challenges" className={teachTabClass}>
          Challenges
        </NavLink>
        <NavLink to="/teach/guide" className={teachTabClass}>
          Guide
        </NavLink>
        <NavLink to="/teach/submissions" className={teachTabClass}>
          Submissions
        </NavLink>
      </nav>

      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your challenges</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-forge-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forge-500"
        >
          {showForm ? 'Cancel' : '+ New challenge'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createChallenge} className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm text-slate-300">Title</label>
            <input
              id="title"
              required
              minLength={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="difficulty" className="mb-1.5 block text-sm text-slate-300">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as ChallengeDifficulty)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-sm text-slate-300">Languages</p>
            <div className="flex gap-4">
              {allLanguages.map((lang) => (
                <label key={lang} className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={languages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                    className="accent-forge-500"
                  />
                  {languageLabels[lang]}
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy || languages.length === 0}
            className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Create draft'}
          </button>
        </form>
      )}

      {challenges === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : challenges.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No challenges yet, create your first draft.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {challenges.map((c) => (
            <Link
              key={c.id}
              to={`/teach/challenges/${c.id}`}
              className="block rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-600"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{c.difficulty}</p>
                  <h2 className="mt-0.5 font-semibold">{c.title}</h2>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {c.languages.map((l) => languageLabels[l]).join(', ')} · {c.testCaseCount} test cases
              </p>
              {c.reviewNote && (
                <p className="mt-2 rounded-lg bg-red-950/40 px-3 py-2 text-sm text-red-300">
                  Review feedback: {c.reviewNote}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
