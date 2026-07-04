import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { slugify, type LearningPathDto, type TeachCourseDetailDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

export function TeachCourseEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<TeachCourseDetailDto | null>(null);
  const [paths, setPaths] = useState<LearningPathDto[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pathSlug, setPathSlug] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api
      .get<TeachCourseDetailDto>(`/instructor/courses/${id}`)
      .then((res) => {
        setCourse(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setPathSlug(res.data.pathSlug);
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  useEffect(() => {
    load();
    api.get<LearningPathDto[]>('/paths').then((res) => setPaths(res.data));
  }, [load]);

  async function run(action: () => Promise<unknown>, successNotice?: string) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
      if (successNotice) setNotice(successNotice);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function saveMeta(e: FormEvent) {
    e.preventDefault();
    void run(() => api.put(`/instructor/courses/${id}`, { title, description, pathSlug }), 'Course details saved.');
  }

  function addLesson(e: FormEvent) {
    e.preventDefault();
    const lessonTitle = newLessonTitle;
    setNewLessonTitle('');
    void run(async () => {
      const { data } = await api.post<{ id: string }>(`/instructor/courses/${id}/lessons`, { title: lessonTitle });
      navigate(`/teach/lessons/${data.id}`);
    });
  }

  async function exportMarkdown() {
    if (!course) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.get<string>(`/instructor/courses/${id}/export`, { responseType: 'text' });
      const blob = new Blob([res.data], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slugify(course.title)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (error && !course) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!course) return <main className="p-12 text-center text-slate-400">Loading…</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/teach" className="text-sm text-slate-400 hover:text-white">
        ← Your courses
      </Link>

      <div className="mt-4 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <StatusBadge status={course.status} />
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {course.enrollmentCount} students enrolled · {course.lessonCount} lessons
        </p>
        <div className="flex items-center gap-2">
          <Link
            to={`/teach/courses/${id}/students`}
            className="rounded-lg border border-slate-700 px-4 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            📊 View students
          </Link>
          <button
            onClick={exportMarkdown}
            disabled={busy}
            className="rounded-lg border border-slate-700 px-4 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            ⬇️ Export as Markdown
          </button>
        </div>
      </div>

      {course.reviewNote && (
        <p className="mt-4 rounded-xl bg-red-950/40 px-4 py-3 text-sm text-red-300">
          Review feedback: {course.reviewNote}
        </p>
      )}

      {course.status === 'DRAFT' && (
        <button
          onClick={() => run(() => api.post(`/instructor/courses/${id}/submit`), 'Submitted for review, an admin will approve or send feedback.')}
          disabled={busy}
          className="mt-5 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
        >
          Submit for review
        </button>
      )}
      {course.status === 'PENDING_REVIEW' && (
        <p className="mt-5 rounded-xl border border-amber-700/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          ⏳ Waiting for admin review. You can keep editing in the meantime.
        </p>
      )}

      {notice && <p className="mt-4 text-sm text-emerald-400">{notice}</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <form onSubmit={saveMeta} className="mt-8 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-bold">Course details</h2>
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm text-slate-300">Title</label>
          <input
            id="title"
            required
            minLength={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm text-slate-300">Description</label>
          <textarea
            id="description"
            required
            minLength={10}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="path" className="mb-1.5 block text-sm text-slate-300">Learning path</label>
          <select
            id="path"
            value={pathSlug}
            onChange={(e) => setPathSlug(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
          >
            {paths.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
        >
          Save details
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Lessons</h2>
        {course.lessons.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No lessons yet, add the first one below.</p>
        ) : (
          <ol className="mt-4 space-y-2">
            {course.lessons.map((l, i) => (
              <li
                key={l.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
              >
                <Link to={`/teach/lessons/${l.id}`} className="flex items-center gap-3 hover:underline">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                    {l.order}
                  </span>
                  <span className="font-medium">{l.title}</span>
                  {l.hasQuiz && <span className="text-sm text-slate-500">📝</span>}
                </Link>
                <span className="flex items-center gap-1">
                  <button
                    onClick={() => run(() => api.post(`/instructor/lessons/${l.id}/move`, { direction: 'up' }))}
                    disabled={busy || i === 0}
                    title="Move up"
                    className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => run(() => api.post(`/instructor/lessons/${l.id}/move`, { direction: 'down' }))}
                    disabled={busy || i === course.lessons.length - 1}
                    title="Move down"
                    className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete lesson "${l.title}"? Student progress on it will be lost.`)) {
                        void run(() => api.delete(`/instructor/lessons/${l.id}`));
                      }
                    }}
                    disabled={busy}
                    title="Delete lesson"
                    className="rounded-lg px-2 py-1 text-red-400/70 hover:bg-red-950/40 hover:text-red-300 disabled:opacity-30"
                  >
                    ✕
                  </button>
                </span>
              </li>
            ))}
          </ol>
        )}

        <form onSubmit={addLesson} className="mt-4 flex gap-2">
          <input
            required
            minLength={3}
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            placeholder="New lesson title…"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            + Add lesson
          </button>
        </form>
      </section>
    </main>
  );
}
