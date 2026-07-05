import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { AnalyticsDayDto, AnalyticsSummaryDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

const adminTabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${
    isActive ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`;

function ViewsChart({ data }: { data: AnalyticsDayDto[] }) {
  const max = Math.max(1, ...data.map((d) => d.views));
  return (
    <div className="flex h-40 items-end gap-[3px]">
      {data.map((d) => (
        <div key={d.date} className="group relative flex-1">
          <div
            className="rounded-t bg-forge-600 transition-colors group-hover:bg-forge-400"
            style={{ height: `${Math.max(2, Math.round((d.views / max) * 160))}px` }}
          />
          <div className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2 py-1 text-xs shadow-lg group-hover:block">
            {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {d.views} view
            {d.views === 1 ? '' : 's'}
          </div>
        </div>
      ))}
    </div>
  );
}

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
      <p className="mt-2 text-slate-400">Page views and visitor activity across the whole site.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {summary === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Total page views</p>
              <p className="mt-1 text-3xl font-bold">{summary.totalViews.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Views, last 30 days</p>
              <p className="mt-1 text-3xl font-bold">{summary.viewsLast30Days.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Unique visitors, last 30 days</p>
              <p className="mt-1 text-3xl font-bold">{summary.uniqueVisitorsLast30Days.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">New visitors today</p>
              <p className="mt-1 text-3xl font-bold">{summary.newVisitorsToday.toLocaleString()}</p>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-bold">Views per day (last 30 days)</h2>
            <div className="mt-6">
              <ViewsChart data={summary.viewsPerDay} />
            </div>
          </section>

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
