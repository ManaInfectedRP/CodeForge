import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { AdminChallengeDto, ChallengeStatus } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

const adminTabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${
    isActive ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`;

const filters: { label: string; value: ChallengeStatus | '' }[] = [
  { label: 'Pending review', value: 'PENDING_REVIEW' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Drafts', value: 'DRAFT' },
  { label: 'All', value: '' },
];

export function AdminChallengeReview() {
  const [filter, setFilter] = useState<ChallengeStatus | ''>('PENDING_REVIEW');
  const [challenges, setChallenges] = useState<AdminChallengeDto[] | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setChallenges(null);
    api
      .get<AdminChallengeDto[]>('/admin/challenges', { params: filter ? { status: filter } : {} })
      .then((res) => setChallenges(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, [filter]);

  useEffect(load, [load]);

  async function act(challengeId: string, action: 'approve' | 'reject' | 'unpublish') {
    setBusy(true);
    setError(null);
    try {
      await api.post(
        `/admin/challenges/${challengeId}/${action}`,
        action === 'approve' ? {} : { note: notes[challengeId] || undefined }
      );
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
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
      </nav>

      <h1 className="mt-6 text-3xl font-bold">Challenge review</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              filter === f.value ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {challenges === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : challenges.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          Nothing here.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {challenges.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {c.difficulty} · by {c.instructorName}
                  </p>
                  <h2 className="mt-0.5 font-semibold">{c.title}</h2>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {c.languages.join(', ')} · {c.testCaseCount} test cases · created{' '}
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
              {c.reviewNote && (
                <p className="mt-2 rounded-lg bg-red-950/40 px-3 py-2 text-sm text-red-300">
                  Last feedback: {c.reviewNote}
                </p>
              )}

              {c.status === 'PENDING_REVIEW' && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => act(c.id, 'approve')}
                    disabled={busy}
                    className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    ✓ Approve & publish
                  </button>
                  <input
                    value={notes[c.id] ?? ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [c.id]: e.target.value }))}
                    placeholder="Feedback for the instructor (optional)…"
                    className="min-w-64 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-forge-500 focus:outline-none"
                  />
                  <button
                    onClick={() => act(c.id, 'reject')}
                    disabled={busy}
                    className="rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    ✗ Send back
                  </button>
                </div>
              )}

              {c.status === 'PUBLISHED' && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <input
                    value={notes[c.id] ?? ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [c.id]: e.target.value }))}
                    placeholder="Reason (optional)…"
                    className="min-w-64 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-forge-500 focus:outline-none"
                  />
                  <button
                    onClick={() => act(c.id, 'unpublish')}
                    disabled={busy}
                    className="rounded-lg border border-red-800 px-5 py-2 text-sm font-semibold text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                  >
                    Unpublish
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
