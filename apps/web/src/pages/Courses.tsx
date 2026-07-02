import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { CourseSummaryDto, LearningPathDto } from '@codeforge/shared';
import { api } from '../lib/api';

export function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activePath = searchParams.get('path') ?? '';
  const [courses, setCourses] = useState<CourseSummaryDto[] | null>(null);
  const [paths, setPaths] = useState<LearningPathDto[]>([]);

  useEffect(() => {
    api.get<LearningPathDto[]>('/paths').then((res) => setPaths(res.data));
  }, []);

  useEffect(() => {
    setCourses(null);
    api
      .get<CourseSummaryDto[]>('/courses', { params: activePath ? { path: activePath } : {} })
      .then((res) => setCourses(res.data));
  }, [activePath]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Course catalog</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSearchParams({})}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            activePath === '' ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {paths.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSearchParams({ path: p.slug })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              activePath === p.slug ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {p.icon} {p.name}
          </button>
        ))}
      </div>

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
