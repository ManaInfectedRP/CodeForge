import { useState } from 'react';
import type { ProjectSubmissionDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

const statusBadge: Record<ProjectSubmissionDto['status'], { label: string; className: string }> = {
  PENDING: { label: '⏳ Pending review', className: 'bg-amber-900/50 text-amber-300' },
  APPROVED: { label: '✅ Approved', className: 'bg-emerald-900/50 text-emerald-300' },
  CHANGES_REQUESTED: { label: '⚠️ Changes requested', className: 'bg-red-900/50 text-red-300' },
};

interface Props {
  lessonId: string;
  submission: ProjectSubmissionDto | null;
  onSubmitted: (submission: ProjectSubmissionDto) => void;
}

export function ProjectSubmissionPanel({ lessonId, submission, onSubmitted }: Props) {
  const [url, setUrl] = useState(submission?.submissionUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.post<ProjectSubmissionDto>(`/lessons/${lessonId}/submit`, { submissionUrl: url });
      onSubmitted(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">📤 Project submission</h2>
        {submission && (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge[submission.status].className}`}>
            {statusBadge[submission.status].label}
          </span>
        )}
      </div>

      {submission?.status === 'CHANGES_REQUESTED' && submission.feedback && (
        <p className="mt-3 rounded-lg bg-red-950/40 px-4 py-3 text-sm text-red-300">
          Instructor feedback: {submission.feedback}
        </p>
      )}

      {submission?.status === 'APPROVED' ? (
        <p className="mt-3 text-sm text-emerald-300">
          Your submission was approved, you can mark this lesson complete.
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-400">
          Submit a link (e.g. your repository) for an instructor to review before you can mark this lesson complete.
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/you/project"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
        />
        <button
          onClick={submit}
          disabled={busy || url.trim() === ''}
          className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
        >
          {busy ? 'Submitting…' : submission ? 'Resubmit' : 'Submit'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </section>
  );
}
