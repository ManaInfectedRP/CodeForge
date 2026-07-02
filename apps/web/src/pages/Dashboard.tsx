import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DashboardDto } from '@codeforge/shared';
import { api } from '../lib/api';
import { ProgressBar } from '../components/ProgressBar';

export function Dashboard() {
  const [data, setData] = useState<DashboardDto | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.get<DashboardDto>('/me/dashboard').then((res) => setData(res.data)).catch(() => setFailed(true));
  }, []);

  if (failed) return <main className="p-12 text-center text-red-400">Could not load your dashboard.</main>;
  if (!data) return <main className="p-12 text-center text-slate-400">Loading your dashboard…</main>;

  const { user, enrollments, recentLessons, paths } = data;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Welcome back, {user.username} 👋</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total XP</p>
          <p className="mt-1 text-3xl font-bold text-amber-400">⚡ {user.xp}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Daily streak</p>
          <p className="mt-1 text-3xl font-bold text-orange-400">🔥 {user.streak} day{user.streak === 1 ? '' : 's'}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Active courses</p>
          <p className="mt-1 text-3xl font-bold text-forge-500">📚 {enrollments.length}</p>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your courses</h2>
          <Link to="/courses" className="text-sm text-forge-500 hover:underline">
            Browse catalog →
          </Link>
        </div>
        {enrollments.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
            You haven't enrolled in any courses yet.{' '}
            <Link to="/courses" className="text-forge-500 hover:underline">
              Find your first course
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {enrollments.map((e) => (
              <Link
                key={e.courseId}
                to={`/courses/${e.courseId}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-600"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">{e.pathName}</p>
                <h3 className="mt-1 font-semibold">{e.courseTitle}</h3>
                <div className="mt-4">
                  <ProgressBar percent={e.percentComplete} />
                  <p className="mt-1.5 text-sm text-slate-400">
                    {e.completedLessons}/{e.totalLessons} lessons · {e.percentComplete}% complete
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold">Recent activity</h2>
          {recentLessons.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Complete your first lesson to see activity here.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {recentLessons.map((l) => (
                <li key={l.lessonId} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
                  <span className="text-emerald-400">✓</span>{' '}
                  <Link to={`/lessons/${l.lessonId}`} className="font-medium hover:underline">
                    {l.lessonTitle}
                  </Link>
                  <span className="text-slate-500">, {l.courseTitle}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your paths</h2>
            <Link to="/paths" className="text-sm text-forge-500 hover:underline">
              Edit →
            </Link>
          </div>
          {paths.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No learning paths selected.{' '}
              <Link to="/paths" className="text-forge-500 hover:underline">
                Choose yours
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {paths.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
                  <span>
                    {p.icon} <span className="ml-1 font-medium">{p.name}</span>
                  </span>
                  <Link to={`/courses?path=${p.slug}`} className="text-forge-500 hover:underline">
                    View courses
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
