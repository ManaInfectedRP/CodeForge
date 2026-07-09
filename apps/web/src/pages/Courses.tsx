import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { CourseSummaryDto, LearningPathDto } from '@codeforge/shared';
import { api } from '../lib/api';
import { PathCard } from '../components/PathCard';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function CourseListItem({ c }: { c: CourseSummaryDto }) {
  return (
    <Link
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
  );
}

export function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activePath = searchParams.get('path') ?? '';
  const category = searchParams.get('category') ?? '';

  const [courses, setCourses] = useState<CourseSummaryDto[] | null>(null);
  const [allCourses, setAllCourses] = useState<CourseSummaryDto[] | null>(null);
  const [paths, setPaths] = useState<LearningPathDto[] | null>(null);
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    api.get<LearningPathDto[]>('/paths').then((res) => setPaths(res.data));
    api.get<CourseSummaryDto[]>('/courses').then((res) => setAllCourses(res.data));
  }, []);

  useEffect(() => {
    if (!activePath) {
      setCourses(null);
      return;
    }
    setCourses(null);
    api.get<CourseSummaryDto[]>('/courses', { params: { path: activePath } }).then((res) => setCourses(res.data));
  }, [activePath]);

  const lettersWithCourses = useMemo(
    () => new Set((allCourses ?? []).map((c) => c.title[0]?.toUpperCase()).filter(Boolean)),
    [allCourses]
  );

  const filtered = useMemo(() => {
    if (!allCourses) return [];
    const q = query.trim().toLowerCase();
    if (q) return allCourses.filter((c) => c.title.toLowerCase().includes(q));
    if (activeLetter) return allCourses.filter((c) => c.title[0]?.toUpperCase() === activeLetter);
    return [];
  }, [allCourses, query, activeLetter]);

  const searching = query.trim() !== '' || activeLetter !== null;

  function clearFilters() {
    setQuery('');
    setActiveLetter(null);
  }

  // Root view: no path or category chosen, search box + A-Z strip + the two category cards
  if (!activePath && !category) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="mt-2 text-slate-400">Search for a course, or pick a path below.</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) setActiveLetter(null);
            }}
            placeholder="Search courses…"
            className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
          />
          {searching && (
            <button type="button" onClick={clearFilters} className="text-sm text-slate-400 hover:text-white">
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {ALPHABET.map((letter) => {
            const enabled = lettersWithCourses.has(letter);
            const active = activeLetter === letter;
            return (
              <button
                key={letter}
                type="button"
                disabled={!enabled}
                onClick={() => {
                  setActiveLetter(active ? null : letter);
                  setQuery('');
                }}
                className={`h-8 w-8 rounded-lg text-xs font-semibold ${
                  active
                    ? 'bg-forge-600 text-white'
                    : enabled
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'cursor-not-allowed text-slate-700'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {searching ? (
          <div className="mt-8">
            {allCourses === null ? (
              <p className="text-slate-400">Searching…</p>
            ) : filtered.length === 0 ? (
              <p className="text-slate-400">No courses match.</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.map((c) => (
                  <CourseListItem key={c.id} c={c} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSearchParams({ category: 'programming' })}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-left transition-all hover:border-forge-600"
            >
              <span className="text-3xl">💻</span>
              <h2 className="mt-3 text-xl font-bold">Programming Path</h2>
              <p className="mt-2 text-sm text-slate-400">
                Learn programming languages and frameworks with courses on Python, JavaScript, TypeScript, C++, C#,
                SQL, React, and more.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-forge-500">
                Explore the Programming roadmap →
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSearchParams({ path: 'devops' })}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-left transition-all hover:border-forge-600"
            >
              <span className="text-3xl">🚀</span>
              <h2 className="mt-3 text-xl font-bold">DevOps Path</h2>
              <p className="mt-2 text-sm text-slate-400">
                Master DevOps engineering by following our courses on Docker, Kubernetes, AWS, Azure, CI/CD
                pipelines, and observability.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-forge-500">
                Explore the DevOps roadmap →
              </span>
            </button>
          </div>
        )}
      </main>
    );
  }

  // Category view: the language grid, everything except DevOps
  if (!activePath && category === 'programming') {
    const programmingPaths = (paths ?? []).filter((p) => p.slug !== 'devops');
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <button type="button" onClick={() => setSearchParams({})} className="text-sm text-slate-400 hover:text-white">
          ← All courses
        </button>

        <h1 className="mt-4 text-3xl font-bold">💻 Programming Path</h1>
        <p className="mt-2 text-slate-400">Choose a language or technology to see its course roadmap.</p>

        {paths === null ? (
          <p className="mt-10 text-slate-400">Loading paths…</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programmingPaths.map((p) => (
              <PathCard key={p.id} path={p} onClick={() => setSearchParams({ path: p.slug })} />
            ))}
          </div>
        )}
      </main>
    );
  }

  // Path view: a specific path's course list, one card per course
  const currentPath = paths?.find((p) => p.slug === activePath);
  const isDevops = activePath === 'devops';

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <button
        type="button"
        onClick={() => setSearchParams(isDevops ? {} : { category: 'programming' })}
        className="text-sm text-slate-400 hover:text-white"
      >
        ← {isDevops ? 'All courses' : 'Programming Path'}
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
            <CourseListItem key={c.id} c={c} />
          ))}
        </div>
      )}
    </main>
  );
}
