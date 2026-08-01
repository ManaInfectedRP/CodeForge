import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, deep dives, and updates from the Kodstigen team.',
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-slate-400">News, deep dives, and updates from the Kodstigen team.</p>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No posts yet, check back soon.
        </p>
      ) : (
        <div className="mt-8 space-y-5">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-colors hover:border-slate-600"
            >
              {p.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImageUrl} alt="" className="h-48 w-full object-cover" />
              )}
              <div className="p-6">
                <p className="text-xs text-slate-500">
                  {new Date(p.publishedAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  · by {p.author}
                </p>
                <h2 className="mt-1.5 text-xl font-bold">{p.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-400">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
