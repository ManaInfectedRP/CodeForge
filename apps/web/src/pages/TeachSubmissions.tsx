import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { InstructorQuizAttemptDetailDto, InstructorSubmissionDto, SubmissionStatus } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

function QuizAttemptDetail({ attemptId, onClose }: { attemptId: string; onClose: () => void }) {
  const [detail, setDetail] = useState<InstructorQuizAttemptDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<InstructorQuizAttemptDetailDto>(`/instructor/quiz-attempts/${attemptId}`)
      .then((res) => setDetail(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, [attemptId]);

  return (
    <div className="mt-2 rounded-lg border border-slate-700 bg-slate-900 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-300">
          {detail ? `${detail.quizTitle} · ${new Date(detail.createdAt).toLocaleString()}` : 'Loading attempt…'}
        </p>
        <button onClick={onClose} className="text-xs text-slate-500 hover:text-white">
          ✕ Close
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {detail && (
        <ul className="mt-2 space-y-2">
          {detail.answers.map((a) => (
            <li key={a.questionId} className={`rounded-md px-2.5 py-2 text-xs ${a.isCorrect ? 'bg-emerald-950/40' : 'bg-red-950/40'}`}>
              <p className="text-slate-300">{a.prompt}</p>
              <p className={a.isCorrect ? 'mt-1 text-emerald-400' : 'mt-1 text-red-400'}>
                {a.isCorrect ? '✅' : '❌'} Picked: {a.givenAnswer ?? '(no answer)'}
              </p>
              {!a.isCorrect && <p className="mt-0.5 text-slate-500">Correct answer: {a.correctAnswer}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const teachTabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${
    isActive ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`;

const filters: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'Pending review', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Changes requested', value: 'CHANGES_REQUESTED' },
  { label: 'All', value: '' },
];

const statusBadge: Record<SubmissionStatus, string> = {
  PENDING: 'bg-amber-900/50 text-amber-300',
  APPROVED: 'bg-emerald-900/50 text-emerald-300',
  CHANGES_REQUESTED: 'bg-red-900/50 text-red-300',
};

export function TeachSubmissions() {
  const [filter, setFilter] = useState<SubmissionStatus | ''>('PENDING');
  const [submissions, setSubmissions] = useState<InstructorSubmissionDto[] | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openAttemptId, setOpenAttemptId] = useState<string | null>(null);

  const load = useCallback(() => {
    setSubmissions(null);
    api
      .get<InstructorSubmissionDto[]>('/instructor/submissions', { params: filter ? { status: filter } : {} })
      .then((res) => setSubmissions(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, [filter]);

  useEffect(load, [load]);

  async function approve(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await api.post(`/instructor/submissions/${id}/approve`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function requestChanges(id: string) {
    const text = feedback[id]?.trim();
    if (!text) {
      setError('Add feedback before requesting changes.');
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      await api.post(`/instructor/submissions/${id}/request-changes`, { feedback: text });
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav className="flex flex-wrap gap-2">
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

      <h1 className="mt-6 text-3xl font-bold">Project submissions</h1>
      <p className="mt-2 text-slate-400">Review project links students submit on lessons that require approval.</p>

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

      {submissions === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : submissions.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          Nothing here.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {s.courseTitle} · {s.lessonTitle}
                  </p>
                  <h2 className="mt-0.5 font-semibold">{s.studentUsername}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge[s.status]}`}>
                  {s.status.replace('_', ' ').toLowerCase()}
                </span>
              </div>

              <a
                href={s.submissionUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block truncate text-sm text-forge-500 hover:underline"
              >
                {s.submissionUrl}
              </a>
              <p className="mt-2 text-sm text-slate-500">
                Submitted {new Date(s.submittedAt).toLocaleString()}
              </p>
              {s.feedback && (
                <p className="mt-2 rounded-lg bg-red-950/40 px-3 py-2 text-sm text-red-300">
                  Feedback sent: {s.feedback}
                </p>
              )}

              {s.quizzes.length > 0 && (
                <details className="mt-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm">
                  <summary className="cursor-pointer font-medium text-slate-300">
                    Quiz attempts across this course ({s.quizzes.filter((q) => q.passed).length}/{s.quizzes.length} passed)
                  </summary>
                  <ul className="mt-2 space-y-3">
                    {s.quizzes.map((q) => (
                      <li key={q.lessonId}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-slate-400">
                            {q.lessonTitle} <span className="text-slate-600">· {q.quizTitle}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            {q.attemptCount === 0 ? (
                              <span className="text-slate-500">Not attempted</span>
                            ) : (
                              <>
                                <span className="text-slate-500">
                                  {q.attemptCount} attempt{q.attemptCount === 1 ? '' : 's'}, best {q.bestScore}%
                                </span>
                                <span className={q.passed ? 'text-emerald-400' : 'text-red-400'}>
                                  {q.passed ? '✅' : '❌'}
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                        {q.attempts.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {q.attempts.map((a, i) => (
                              <button
                                key={a.id}
                                onClick={() => setOpenAttemptId(openAttemptId === a.id ? null : a.id)}
                                className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                                  openAttemptId === a.id
                                    ? 'bg-forge-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                Attempt {i + 1}: {a.score}% {a.passed ? '✅' : '❌'}
                              </button>
                            ))}
                          </div>
                        )}
                        {q.attempts.some((a) => a.id === openAttemptId) && (
                          <QuizAttemptDetail attemptId={openAttemptId!} onClose={() => setOpenAttemptId(null)} />
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {s.status === 'PENDING' && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => approve(s.id)}
                    disabled={busyId === s.id}
                    className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    ✓ Approve
                  </button>
                  <input
                    value={feedback[s.id] ?? ''}
                    onChange={(e) => setFeedback((f) => ({ ...f, [s.id]: e.target.value }))}
                    placeholder="Feedback for changes requested…"
                    className="min-w-64 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-forge-500 focus:outline-none"
                  />
                  <button
                    onClick={() => requestChanges(s.id)}
                    disabled={busyId === s.id}
                    className="rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    ✗ Request changes
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
