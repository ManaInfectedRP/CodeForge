'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CourseSummary, LearningPath } from '@/lib/content';
import { PathCard } from './PathCard';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DEVOPS_SLUGS = ['docker', 'azure', 'kubernetes', 'aws', 'cicd', 'observability', 'grc'];
const MATH_SLUGS = [
  'linear-algebra',
  'discrete-math',
  'calculus',
  'multivariable-calculus',
  'abstract-algebra',
  'topology',
  'computer-science',
];

/** The three top-level buckets on the catalog root. `programming` is the default bucket, it
 * holds every path that isn't explicitly claimed by DevOps or Math. */
type Category = 'programming' | 'devops' | 'math';

const CATEGORIES: Record<Category, { icon: string; title: string; blurb: string; cta: string; lead: string }> = {
  programming: {
    icon: '💻',
    title: 'Programming Path',
    blurb:
      'Learn programming languages and frameworks with courses on Python, JavaScript, TypeScript, C++, C#, SQL, React, and more.',
    cta: 'Explore the Programming roadmap →',
    lead: 'Choose a language or technology to see its course roadmap.',
  },
  devops: {
    icon: '🚀',
    title: 'DevOps Path',
    blurb:
      'Master DevOps engineering by following our courses on Docker, Kubernetes, AWS, Azure, CI/CD pipelines, and observability.',
    cta: 'Explore the DevOps roadmap →',
    lead: 'Choose a technology to see its course roadmap.',
  },
  math: {
    icon: '📐',
    title: 'Math Path',
    blurb:
      'University mathematics you can actually run: linear algebra, discrete math, calculus, abstract algebra, topology, and computer science theory.',
    cta: 'Explore the Math roadmap →',
    lead: 'Choose a subject to see its course roadmap. Every calculation runs in your browser.',
  },
};

function categoryOf(pathSlug: string): Category {
  if (DEVOPS_SLUGS.includes(pathSlug)) return 'devops';
  if (MATH_SLUGS.includes(pathSlug)) return 'math';
  return 'programming';
}

function CourseListItem({ c }: { c: CourseSummary }) {
  return (
    <Link
      href={`/courses/${c.slug}`}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-slate-600"
    >
      <span className="text-xs uppercase tracking-wide text-slate-500">{c.pathName}</span>
      <h2 className="mt-2 text-lg font-bold">{c.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm text-slate-400">{c.description}</p>
      <p className="mt-4 text-sm text-slate-500">
        {c.lessonCount} lessons
        {c.quizCount > 0 && ` · ${c.quizCount} quizzes`}
      </p>
    </Link>
  );
}

interface Props {
  paths: LearningPath[];
  courses: CourseSummary[];
}

export function CoursesBrowser({ paths, courses }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activePath = searchParams.get('path') ?? '';
  const category = searchParams.get('category') ?? '';

  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  /** The catalog is fully client-side now, so filters are just query-string state. */
  function setFilter(next: Record<string, string>) {
    const qs = new URLSearchParams(next).toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const lettersWithCourses = useMemo(
    () => new Set(courses.map((c) => c.title[0]?.toUpperCase()).filter(Boolean)),
    [courses]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return courses.filter((c) => c.title.toLowerCase().includes(q));
    if (activeLetter) return courses.filter((c) => c.title[0]?.toUpperCase() === activeLetter);
    return [];
  }, [courses, query, activeLetter]);

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
            {filtered.length === 0 ? (
              <p className="text-slate-400">No courses match.</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.map((c) => (
                  <CourseListItem key={c.slug} c={c} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(CATEGORIES) as Category[]).map((key) => {
              const c = CATEGORIES[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter({ category: key })}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-left transition-all hover:border-forge-600"
                >
                  <span className="text-3xl">{c.icon}</span>
                  <h2 className="mt-3 text-xl font-bold">{c.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{c.blurb}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-forge-500">{c.cta}</span>
                </button>
              );
            })}
          </div>
        )}
      </main>
    );
  }

  // Category view: the grid of paths in one bucket
  if (!activePath && category in CATEGORIES) {
    const meta = CATEGORIES[category as Category];
    const categoryPaths = paths.filter((p) => categoryOf(p.slug) === category);
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <button type="button" onClick={() => setFilter({})} className="text-sm text-slate-400 hover:text-white">
          ← All courses
        </button>

        <h1 className="mt-4 text-3xl font-bold">
          {meta.icon} {meta.title}
        </h1>
        <p className="mt-2 text-slate-400">{meta.lead}</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryPaths.map((p) => (
            <PathCard key={p.slug} path={p} onClick={() => setFilter({ path: p.slug })} />
          ))}
        </div>
      </main>
    );
  }

  // Path view: a specific path's course list, one card per course
  const currentPath = paths.find((p) => p.slug === activePath);
  const parentCategory = categoryOf(activePath);
  const pathCourses = courses.filter((c) => c.pathSlug === activePath);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <button
        type="button"
        onClick={() => setFilter({ category: parentCategory })}
        className="text-sm text-slate-400 hover:text-white"
      >
        ← {CATEGORIES[parentCategory].title}
      </button>

      <h1 className="mt-4 text-3xl font-bold">
        {currentPath ? `${currentPath.icon} ${currentPath.name}` : 'Courses'}
      </h1>
      {currentPath && <p className="mt-2 text-slate-400">{currentPath.description}</p>}

      {pathCourses.length === 0 ? (
        <p className="mt-10 text-slate-400">No courses in this path yet.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {pathCourses.map((c) => (
            <CourseListItem key={c.slug} c={c} />
          ))}
        </div>
      )}
    </main>
  );
}
