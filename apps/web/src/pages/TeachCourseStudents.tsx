import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { InstructorStudentProgressDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

export function TeachCourseStudents() {
  const { id } = useParams<{ id: string }>();
  const [students, setStudents] = useState<InstructorStudentProgressDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .get<InstructorStudentProgressDto[]>(`/instructor/courses/${id}/students`)
      .then((res) => setStudents(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  useEffect(load, [load]);

  async function resetStudent(studentId: string, username: string) {
    if (
      !confirm(
        `Reset ${username}'s progress on this course? This deletes their completed lessons, quiz attempts, project submissions, and certificate, so they can retry the whole course from scratch.`
      )
    ) {
      return;
    }
    setBusyId(studentId);
    setError(null);
    try {
      await api.post(`/instructor/courses/${id}/students/${studentId}/reset`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link to={`/teach/courses/${id}`} className="text-sm text-slate-400 hover:text-white">
        ← Back to course
      </Link>

      <h1 className="mt-4 text-3xl font-bold">Student progress</h1>
      <p className="mt-2 text-slate-400">
        See each student's lesson progress and quiz results, and reset a student's progress if they need to retry the
        whole course.
      </p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {students === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : students.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No students enrolled yet.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {students.map((s) => {
            const percent = s.totalLessons > 0 ? Math.round((s.completedLessons / s.totalLessons) * 100) : 0;
            return (
              <div key={s.userId} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{s.username}</h2>
                    <p className="text-xs text-slate-500">Enrolled {new Date(s.enrolledAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.certificateIssued && (
                      <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-xs font-medium text-emerald-300">
                        🎓 Certified
                      </span>
                    )}
                    <span className="text-sm text-slate-400">
                      {s.completedLessons}/{s.totalLessons} lessons ({percent}%)
                    </span>
                  </div>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-forge-600" style={{ width: `${percent}%` }} />
                </div>

                {s.quizzes.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {s.quizzes.map((q) => (
                      <li
                        key={q.lessonId}
                        className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ${
                          q.passed
                            ? 'border-emerald-500/30 bg-emerald-950/20'
                            : q.attemptCount > 0
                              ? 'border-red-500/30 bg-red-950/20'
                              : 'border-slate-800'
                        }`}
                      >
                        <span className="text-slate-300">
                          {q.lessonTitle} <span className="text-slate-500">· {q.quizTitle}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          {q.attemptCount === 0 ? (
                            <span className="text-slate-500">Not attempted</span>
                          ) : (
                            <>
                              <span className="text-slate-400">
                                {q.attemptCount} attempt{q.attemptCount === 1 ? '' : 's'}, best {q.bestScore}% (need{' '}
                                {q.passingScore}%)
                              </span>
                              <span className={q.passed ? 'text-emerald-400' : 'text-red-400'}>
                                {q.passed ? '✅ Passed' : '❌ Not passed'}
                              </span>
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => resetStudent(s.userId, s.username)}
                  disabled={busyId === s.userId}
                  className="mt-4 rounded-lg border border-red-800 px-4 py-1.5 text-sm font-medium text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                >
                  ↺ Reset progress (allow full course retry)
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
