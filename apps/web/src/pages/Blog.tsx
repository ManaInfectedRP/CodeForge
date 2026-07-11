import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPostSummaryDto } from '@codeforge/shared';
import { PageMeta } from '../components/PageMeta';
import { api } from '../lib/api';

export function Blog() {
  const [posts, setPosts] = useState<BlogPostSummaryDto[] | null>(null);

  useEffect(() => {
    api.get<BlogPostSummaryDto[]>('/blog').then((res) => setPosts(res.data));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <PageMeta
        title="Blog | Kodstigen"
        description="News, deep dives, and updates from the Kodstigen team."
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog</h1>
        <a
          href="/api/blog/feed.xml"
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
          title="RSS feed"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M4 4v3.5C12.5 7.5 16.5 11.5 16.5 20H20C20 9.5 14.5 4 4 4Z" />
            <path d="M4 11v3.5C7.5 14.5 9.5 16.5 9.5 20H13C13 14 8.5 11 4 11Z" />
            <circle cx="6" cy="18" r="2" />
          </svg>
          RSS
        </a>
      </div>
      <p className="mt-2 text-slate-400">News, deep dives, and updates from the Kodstigen team.</p>

      {posts === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No posts yet, check back soon.
        </p>
      ) : (
        <div className="mt-8 space-y-5">
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/blog/${p.slug}`}
              className="block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-colors hover:border-slate-600"
            >
              {p.coverImageUrl && (
                <img src={p.coverImageUrl} alt="" className="h-48 w-full object-cover" />
              )}
              <div className="p-6">
                <p className="text-xs text-slate-500">
                  {new Date(p.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  · by {p.authorUsername}
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
