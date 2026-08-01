import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CoursesBrowser } from '@/components/CoursesBrowser';
import { getCourses, getPaths } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Courses',
  description:
    'Browse every Kodstigen course: Python, JavaScript, TypeScript, C++, C#, SQL, React, Docker, Kubernetes, AWS, and more. Free, interactive, and open to everyone.',
};

export default function CoursesPage() {
  return (
    // the catalog reads its filters from the query string, which is only known on the client
    <Suspense fallback={<main className="p-12 text-center text-slate-400">Loading courses…</main>}>
      <CoursesBrowser paths={getPaths()} courses={getCourses()} />
    </Suspense>
  );
}
