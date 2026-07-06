import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { CourseSummaryDto, LearningPathDto } from '@codeforge/shared';
import { api } from '../lib/api';
import { PathCard } from '../components/PathCard';

export function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activePath = searchParams.get('path') ?? '';
  const [courses, setCourses] = useState<CourseSummaryDto[] | null>(null);
  const [paths, setPaths] = useState<LearningPathDto[] | null>(null);

  useEffect(() => {
    api.get<LearningPathDto[]>('/paths').then((res) => setPaths(res.data));
  }, []);

  useEffect(() => {
    if (!activePath) {
      setCourses(null);
      return;
    }
    setCourses(null);
    api.get<CourseSummaryDto[]>('/courses', { params: { path: activePath } }).then((res) => setCourses(res.data));
  }, [activePath]);

  if (!activePath) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">Pick a learning path</h1>
        <p className="mt-2 text-slate-400">
          Choose a language or technology to see its course roadmap, from beginner to job-ready.
        </p>

        {paths === null ? (
          <p className="mt-10 text-slate-400">Loading paths…</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map((p) => (
              <PathCard key={p.id} path={p} onClick={() => setSearchParams({ path: p.slug })} />
            ))}
          </div>
        )}
      </main>
    );
  }

  const currentPath = paths?.find((p) => p.slug === activePath);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <button
        onClick={() => setSearchParams({})}
        className="text-sm text-slate-400 hover:text-white"
      >
        ← All paths
      </button>

      <h1 className="mt-4 text-3xl font-bold">
        {currentPath ? `${currentPath.icon} ${currentPath.name}` : 'Courses'}
      </h1>
      {currentPath && <p className="mt-2 text-slate-400">{currentPath.description}</p>}

      {courses === null ? (
        <p className="mt-10 text-slate-400">Loading courses…</p>
      ) : courses.length === 0 ? (
        <p className="mt-10 text-slate-400">No courses in this path yet.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/courses/${c.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-slate-600"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-slate-500">{c.pathName}</span>
                {c.enrolled && (
                  <span className="rounded-full bg-emerald-900/50 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                    Enrolled
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-lg font-bold">{c.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-400">{c.description}</p>
              <p className="mt-4 text-sm text-slate-500">
                {c.lessonCount} lessons · by {c.instructorName}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
