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

  async function toggleFeature(review: AdminReviewDto) {
    setBusyId(review.id);
    setError(null);
    try {
      await api.post(`/admin/reviews/${review.id}/feature`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function move(review: AdminReviewDto, direction: 'up' | 'down') {
    setBusyId(review.id);
    setError(null);
    try {
      await api.post(`/admin/reviews/${review.id}/move`, { direction });
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  const featuredCount = reviews?.filter((r) => r.featured).length ?? 0;
  const featuredIds = reviews?.filter((r) => r.featured).map((r) => r.id) ?? [];

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
      <p className="mt-2 text-sm text-slate-500">
        Feature up to 3 reviews ({featuredCount}/3) to show as testimonials on the landing page. Use the arrows to
        set their order.
      </p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {reviews === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No reviews yet.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((r) => {
            const featuredIndex = featuredIds.indexOf(r.id);
            return (
              <div
                key={r.id}
                className={`rounded-2xl border p-5 ${
                  r.featured ? 'border-amber-700/60 bg-amber-950/10' : 'border-slate-800 bg-slate-900'
                }`}
              >
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
                  <div className="flex shrink-0 items-start gap-2">
                    {r.featured && (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => move(r, 'up')}
                          disabled={busyId === r.id || featuredIndex <= 0}
                          aria-label="Move up"
                          className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => move(r, 'down')}
                          disabled={busyId === r.id || featuredIndex === featuredIds.length - 1}
                          aria-label="Move down"
                          className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => toggleFeature(r)}
                      disabled={busyId === r.id || (!r.featured && featuredCount >= 3)}
                      title={!r.featured && featuredCount >= 3 ? 'Un-feature another review first (max 3)' : undefined}
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-50 ${
                        r.featured
                          ? 'border-amber-600 bg-amber-600/20 text-amber-300 hover:bg-amber-600/30'
                          : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {r.featured ? '★ Featured' : '☆ Feature'}
                    </button>
                    <button
                      onClick={() => remove(r)}
                      disabled={busyId === r.id}
                      className="rounded-lg border border-red-800 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
