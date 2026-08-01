import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonMarkdown } from '@/components/LessonMarkdown';
import { QuizPlayer } from '@/components/QuizPlayer';
import { getCourse, getCourseSlugs } from '@/lib/content';

interface Props {
  params: Promise<{ course: string; lesson: string }>;
}

export function generateStaticParams() {
  return getCourseSlugs().flatMap((course) =>
    getCourse(course).lessons.map((l) => ({ course, lesson: l.slug }))
  );
}

/** The first paragraph of the lesson body, stripped of markdown, as a meta description. */
function summarize(content: string): string {
  const body = content
    .replace(/^#.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[*_`>#[\]]/g, '')
    .trim();
  const firstParagraph = body.split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ?? '';
  return firstParagraph.length > 160 ? `${firstParagraph.slice(0, 157)}…` : firstParagraph;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  if (!getCourseSlugs().includes(courseSlug)) return {};
  const course = getCourse(courseSlug);
  const lesson = course.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return {};
  return {
    title: `${lesson.title} · ${course.title}`,
    description: summarize(lesson.content) || course.description,
  };
}

export default async function LessonPage({ params }: Props) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  if (!getCourseSlugs().includes(courseSlug)) notFound();

  const course = getCourse(courseSlug);
  const index = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) notFound();

  const lesson = course.lessons[index];
  const prev = course.lessons[index - 1];
  const next = course.lessons[index + 1];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/courses/${course.slug}`} className="text-sm text-slate-400 hover:text-white">
        ← {course.title}
      </Link>

      <p className="mt-4 text-sm text-slate-500">
        Lesson {lesson.order} of {course.lessons.length}
      </p>

      {lesson.videoUrl && (
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <video src={lesson.videoUrl} controls className="h-full w-full" />
        </div>
      )}

      <article className="prose-lesson mt-2">
        <LessonMarkdown sessionKey={`${course.slug}/${lesson.slug}`}>{lesson.content}</LessonMarkdown>
      </article>

      {lesson.requiresSubmission && (
        <p className="mt-8 rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm text-slate-400">
          This lesson ends in a project. Build it on your own machine, there&apos;s nowhere to submit it here, but
          the brief above is everything you need.
        </p>
      )}

      {lesson.quiz && <QuizPlayer quiz={lesson.quiz} />}

      <nav className="mt-12 flex justify-between border-t border-slate-800 pt-6 text-sm">
        {prev ? (
          <Link href={`/courses/${course.slug}/${prev.slug}`} className="text-forge-500 hover:underline">
            ← Previous lesson
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/courses/${course.slug}/${next.slug}`}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-500"
          >
            Next lesson →
          </Link>
        ) : (
          <Link href={`/courses/${course.slug}`} className="text-emerald-400 hover:underline">
            Back to course overview →
          </Link>
        )}
      </nav>
    </main>
  );
}
