import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import type { LearningPathDto, TeachCourseSummaryDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

const teachTabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${
    isActive ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`;

export function TeachCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<TeachCourseSummaryDto[] | null>(null);
  const [paths, setPaths] = useState<LearningPathDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pathSlug, setPathSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get<TeachCourseSummaryDto[]>('/instructor/courses').then((res) => setCourses(res.data));
    api.get<LearningPathDto[]>('/paths').then((res) => {
      setPaths(res.data);
      if (res.data.length > 0) setPathSlug(res.data[0].slug);
    });
  }, []);

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.pathName.toLowerCase().includes(q),
    );
  }, [courses, query]);

  async function createCourse(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.post<{ id: string }>('/instructor/courses', { title, description, pathSlug });
      navigate(`/teach/courses/${data.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav className="flex gap-2">
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

      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your courses</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-forge-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forge-500"
        >
          {showForm ? 'Cancel' : '+ New course'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createCourse} className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm text-slate-300">Course title</label>
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
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Create draft'}
          </button>
        </form>
      )}

      {courses !== null && courses.length > 0 && (
        <div className="mt-6">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your courses…"
            className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
          />
        </div>
      )}

      {courses === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : courses.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No courses yet, create your first draft.
        </p>
      ) : filteredCourses.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No courses match "{query}".
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {filteredCourses.map((c) => (
            <Link
              key={c.id}
              to={`/teach/courses/${c.id}`}
              className="block rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-600"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{c.pathName}</p>
                  <h2 className="mt-0.5 font-semibold">{c.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      c.isCreator ? 'bg-slate-800 text-slate-300' : 'bg-forge-900/50 text-forge-200'
                    }`}
                  >
                    {c.isCreator ? 'Creator' : `Co-instructor · ${c.creatorUsername}`}
                  </span>
                  <StatusBadge status={c.status} />
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {c.lessonCount} lessons · {c.enrollmentCount} students enrolled
              </p>
              {c.reviewNote && (
                <p className="mt-2 rounded-lg bg-red-950/40 px-3 py-2 text-sm text-red-300">
                  Review feedback: {c.reviewNote}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
