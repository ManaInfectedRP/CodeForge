import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { AnalyticsSummaryDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

const adminTabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${
    isActive ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`;

export function AdminAnalytics() {
  const [summary, setSummary] = useState<AnalyticsSummaryDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<AnalyticsSummaryDto>('/analytics/summary')
      .then((res) => setSummary(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav className="flex gap-2">
        <NavLink to="/admin" end className={adminTabClass}>
          Courses
        </NavLink>
        <NavLink to="/admin/challenges" className={adminTabClass}>
          Challenges
        </NavLink>
        <NavLink to="/admin/users" className={adminTabClass}>
          Users
        </NavLink>
        <NavLink to="/admin/analytics" className={adminTabClass}>
          Analytics
        </NavLink>
      </nav>

      <h1 className="mt-6 text-3xl font-bold">Page analytics</h1>
      <p className="mt-2 text-slate-400">Page view counts across the whole site.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {summary === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Total page views</p>
              <p className="mt-1 text-3xl font-bold">{summary.totalViews.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Pages tracked</p>
              <p className="mt-1 text-3xl font-bold">{summary.pagesTracked.toLocaleString()}</p>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-bold">Top pages</h2>
            {summary.topPages.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No page views recorded yet.</p>
            ) : (
              <ol className="mt-4 space-y-2">
                {summary.topPages.map((p, i) => (
                  <li
                    key={p.path}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                        {i + 1}
                      </span>
                      <span className="font-mono text-sm text-slate-300">{p.path}</span>
                    </span>
                    <span className="text-sm text-slate-400">
                      {p.views.toLocaleString()} view{p.views === 1 ? '' : 's'}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      )}
    </main>
  );
}
