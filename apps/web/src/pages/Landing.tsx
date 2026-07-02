import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LearningPathDto } from '@codeforge/shared';
import { api } from '../lib/api';

export function Landing() {
  const [paths, setPaths] = useState<LearningPathDto[]>([]);

  useEffect(() => {
    api.get<LearningPathDto[]>('/paths').then((res) => setPaths(res.data)).catch(() => {});
  }, []);

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <img
          src="/logo.png"
          alt="CodeForge Academy"
          className="mx-auto mb-6 h-32 w-32 rounded-3xl object-cover shadow-lg shadow-forge-600/20"
        />
        <p className="mb-4 inline-block rounded-full border border-forge-500/40 bg-forge-900/30 px-4 py-1.5 text-sm text-forge-100">
          🎓 Learn to code, one forge at a time
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          Forge your future as a <span className="bg-gradient-to-r from-forge-500 to-emerald-400 bg-clip-text text-transparent">software developer</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Interactive courses, hands-on coding exercises, quizzes, and real projects across C++, Python,
          JavaScript, TypeScript, and Node.js. Track your progress, keep your streak alive, and earn XP as
          you learn.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-forge-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-forge-600/25 hover:bg-forge-500"
          >
            Start learning free
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-8 py-3.5 font-semibold text-slate-200 hover:bg-slate-800"
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold">Choose your path</h2>

        <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {paths.map((p) => (
            <div key={p.slug} className="flex w-20 flex-col items-center gap-2.5">
              <img
                src={`/langs/${p.slug}.svg`}
                alt={`${p.name} logo`}
                className="h-14 w-14 transition-transform hover:scale-110"
              />
              <span className="text-sm font-medium text-slate-300">{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        CodeForge Academy, built with Node.js, Express, React & PostgreSQL.
      </footer>
    </main>
  );
}
