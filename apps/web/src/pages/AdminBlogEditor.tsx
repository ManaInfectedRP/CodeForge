import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { AdminBlogPostDetailDto } from '@codeforge/shared';
import { LessonMarkdown } from '../components/LessonMarkdown';
import { api, errorMessage } from '../lib/api';

export function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<AdminBlogPostDetailDto | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api
      .get<AdminBlogPostDetailDto>(`/admin/blog/${id}`)
      .then((res) => {
        const p = res.data;
        setPost(p);
        setTitle(p.title);
        setExcerpt(p.excerpt);
        setContent(p.content);
        setCoverImageUrl(p.coverImageUrl ?? '');
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  useEffect(load, [load]);

  async function run(action: () => Promise<unknown>, successNotice?: string) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
      if (successNotice) setNotice(successNotice);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function save(e: FormEvent) {
    e.preventDefault();
    void run(
      () => api.put(`/admin/blog/${id}`, { title, excerpt, content, coverImageUrl: coverImageUrl || null }),
      'Post saved.'
    );
  }

  async function deletePost() {
    if (!post) return;
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setBusy(true);
    setError(null);
    try {
      await api.delete(`/admin/blog/${id}`);
      navigate('/admin/blog');
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  if (error && !post) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!post) return <main className="p-12 text-center text-slate-400">Loading…</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/admin/blog" className="text-sm text-slate-400 hover:text-white">
        ← Blog posts
      </Link>

      <div className="mt-4 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            post.status === 'PUBLISHED' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-slate-800 text-slate-300'
          }`}
        >
          {post.status === 'PUBLISHED' ? 'Published' : 'Draft'}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">/blog/{post.slug}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {post.status === 'DRAFT' ? (
          <button
            onClick={() => run(() => api.post(`/admin/blog/${id}/publish`), 'Post published.')}
            disabled={busy}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            Publish
          </button>
        ) : (
          <button
            onClick={() => run(() => api.post(`/admin/blog/${id}/unpublish`), 'Post unpublished.')}
            disabled={busy}
            className="rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            Unpublish
          </button>
        )}
        <button
          onClick={deletePost}
          disabled={busy}
          className="rounded-xl px-6 py-2.5 text-sm font-semibold text-red-400/80 hover:bg-red-950/40 hover:text-red-300 disabled:opacity-50"
        >
          Delete post
        </button>
      </div>

      {notice && <p className="mt-4 text-sm text-emerald-400">{notice}</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <form onSubmit={save} className="mt-8 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-bold">Post details</h2>
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
        <div>
          <label htmlFor="coverImageUrl" className="mb-1.5 block text-sm text-slate-300">Cover image URL (optional)</label>
          <input
            id="coverImageUrl"
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="mb-1.5 block text-sm text-slate-300">Excerpt</label>
          <textarea
            id="excerpt"
            rows={2}
            maxLength={300}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short summary shown on the blog list page…"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm leading-relaxed focus:border-forge-500 focus:outline-none"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="content" className="text-sm text-slate-300">Content (Markdown)</label>
            <button
              type="button"
              onClick={() => setPreview((v) => !v)}
              className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div className="prose-lesson min-h-64 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2">
              <LessonMarkdown sessionKey={`blog-edit-${id}`}>{content}</LessonMarkdown>
            </div>
          ) : (
            <textarea
              id="content"
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={'Write your post in Markdown…\n\n```python\nprint("code blocks are interactive")\n```'}
              spellCheck={false}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm leading-relaxed focus:border-forge-500 focus:outline-none"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
        >
          Save
        </button>
      </form>
    </main>
  );
}
