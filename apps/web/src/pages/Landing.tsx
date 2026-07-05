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
          alt="Kodstigen"
          className="mx-auto mb-6 h-64 w-64 rounded-3xl object-cover shadow-lg shadow-forge-600/20"
        />
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          Din väg mot en karriär som <span className="bg-gradient-to-r from-forge-500 to-emerald-400 bg-clip-text text-transparent">mjukvaruutvecklare</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Interaktiva kurser, praktiska kodövningar, quiz och verkliga projekt inom bland annat C++, Python,
          JavaScript, TypeScript, Node.js, Git, React, C# och SQL. Följ dina framsteg, håll din streak vid liv
          och tjäna XP medan du lär dig.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-forge-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-forge-600/25 hover:bg-forge-500"
          >
            Börja lära dig gratis
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-8 py-3.5 font-semibold text-slate-200 hover:bg-slate-800"
          >
            Logga in
          </Link>
        </div>
        <p className="mx-auto mt-5 max-w-xl text-sm text-slate-500">
          Den här sidan visas på svenska, men efter att du registrerar dig eller loggar in fortsätter allt i
          appen på engelska.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold">Välj din stig</h2>

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
        Kodstigen, byggt med Node.js, Express, React och PostgreSQL.
      </footer>
    </main>
  );
}
