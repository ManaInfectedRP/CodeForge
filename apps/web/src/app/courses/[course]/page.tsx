import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourse, getCourseSlugs } from '@/lib/content';

interface Props {
  params: Promise<{ course: string }>;
}

export function generateStaticParams() {
  return getCourseSlugs().map((course) => ({ course }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourseSlugs().includes(slug) ? getCourse(slug) : null;
  if (!course) return {};
  return {
    title: course.title,
    description: course.description,
    openGraph: { title: course.title, description: course.description, type: 'article' },
  };
}

export default async function CoursePage({ params }: Props) {
  const { course: slug } = await params;
  if (!getCourseSlugs().includes(slug)) notFound();
  const course = getCourse(slug);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/courses?path=${course.pathSlug}`} className="text-sm text-slate-400 hover:text-white">
        ← All courses
      </Link>
      <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">{course.pathName}</p>
      <h1 className="mt-1 text-3xl font-bold">{course.title}</h1>
      <p className="mt-3 text-slate-400">{course.description}</p>
      <p className="mt-2 text-sm text-slate-500">{course.lessons.length} lessons</p>

      {course.lessons.length > 0 && (
        <Link
          href={`/courses/${course.slug}/${course.lessons[0].slug}`}
          className="mt-6 inline-block rounded-xl bg-forge-600 px-8 py-3 font-semibold text-white hover:bg-forge-500"
        >
          Start the first lesson
        </Link>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold">Curriculum</h2>
        <ol className="mt-4 space-y-2">
          {course.lessons.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/courses/${course.slug}/${l.slug}`}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 transition-colors hover:border-slate-600"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                    {l.order}
                  </span>
                  <span className="font-medium">{l.title}</span>
                </span>
                <span className="text-sm text-slate-500">{l.quiz && '📝 quiz'}</span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-slate-500">
          Every lesson is open, take them in order or jump straight to what you need.
        </p>
      </section>
    </main>
  );
}
