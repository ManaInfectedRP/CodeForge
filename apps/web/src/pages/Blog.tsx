import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPostSummaryDto } from '@codeforge/shared';
import { api } from '../lib/api';

export function Blog() {
  const [posts, setPosts] = useState<BlogPostSummaryDto[] | null>(null);

  useEffect(() => {
    api.get<BlogPostSummaryDto[]>('/blog').then((res) => setPosts(res.data));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Blog</h1>
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
