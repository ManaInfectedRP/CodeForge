import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-400">That page doesn&apos;t exist, or it moved when the site went static.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-forge-600 px-6 py-3 font-semibold text-white hover:bg-forge-500"
        >
          Back home
        </Link>
        <Link
          href="/courses"
          className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-800"
        >
          Browse courses
        </Link>
      </div>
    </main>
  );
}
