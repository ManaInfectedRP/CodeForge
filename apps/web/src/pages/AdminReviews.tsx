import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { AdminReviewDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

const adminTabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${
    isActive ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`;

export function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReviewDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .get<AdminReviewDto[]>('/admin/reviews')
      .then((res) => setReviews(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  useEffect(load, [load]);

  async function remove(review: AdminReviewDto) {
    if (!confirm(`Remove ${review.username}'s review of "${review.courseTitle}"? This cannot be undone.`)) return;
    setBusyId(review.id);
    setError(null);
    try {
      await api.delete(`/admin/reviews/${review.id}`);
      setReviews((list) => list?.filter((r) => r.id !== review.id) ?? null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

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
        <NavLink to="/admin/reviews" className={adminTabClass}>
          Reviews
        </NavLink>
        <NavLink to="/admin/analytics" className={adminTabClass}>
          Analytics
        </NavLink>
      </nav>

      <h1 className="mt-6 text-3xl font-bold">Course reviews</h1>
      <p className="mt-2 text-sm text-slate-500">These also appear as testimonials on the landing page.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {reviews === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No reviews yet.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {r.courseTitle} · by {r.username} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-amber-400">
                    {'★'.repeat(r.rating)}
                    <span className="text-slate-700">{'★'.repeat(5 - r.rating)}</span>
                    <span className="ml-1.5 text-xs text-slate-500">({r.rating}/5)</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-300">"{r.body}"</p>
                </div>
                <button
                  onClick={() => remove(r)}
                  disabled={busyId === r.id}
                  className="shrink-0 rounded-lg border border-red-800 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
