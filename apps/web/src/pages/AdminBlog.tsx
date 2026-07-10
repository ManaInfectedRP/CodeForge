import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AdminBlogPostSummaryDto, BlogPostStatus } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

const statusStyles: Record<BlogPostStatus, string> = {
  DRAFT: 'bg-slate-800 text-slate-300',
  PUBLISHED: 'bg-emerald-900/50 text-emerald-300',
};

const statusLabels: Record<BlogPostStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
};

export function AdminBlog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<AdminBlogPostSummaryDto[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<AdminBlogPostSummaryDto[]>('/admin/blog').then((res) => setPosts(res.data));
  }, []);

  async function createPost(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.post<{ id: string }>('/admin/blog', { title });
      navigate(`/admin/blog/${data.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog posts</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-forge-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forge-500"
        >
          {showForm ? 'Cancel' : '+ New post'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createPost} className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm text-slate-300">Title</label>
            <input
              id="title"
              required
              minLength={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Create draft'}
          </button>
        </form>
      )}

      {posts === null ? (
        <p className="mt-10 text-slate-400">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          No posts yet, create your first draft.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/admin/blog/${p.id}`}
              className="block rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-600"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold">{p.title}</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[p.status]}`}>
                  {statusLabels[p.status]}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                by {p.authorUsername} ·{' '}
                {p.publishedAt
                  ? `published ${new Date(p.publishedAt).toLocaleDateString()}`
                  : `created ${new Date(p.createdAt).toLocaleDateString()}`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
