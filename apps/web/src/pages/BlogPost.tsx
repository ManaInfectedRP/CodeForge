import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { BlogPostDetailDto } from '@codeforge/shared';
import { LessonMarkdown } from '../components/LessonMarkdown';
import { PageMeta } from '../components/PageMeta';
import { api, errorMessage } from '../lib/api';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPost(null);
    setError(null);
    api
      .get<BlogPostDetailDto>(`/blog/${slug}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, [slug]);

  if (error) {
    return (
      <main className="p-12 text-center">
        <p className="text-red-400">{error}</p>
        <Link to="/blog" className="mt-4 inline-block text-sm text-forge-500 hover:underline">
          ← Back to blog
        </Link>
      </main>
    );
  }
  if (!post) return <main className="p-12 text-center text-slate-400">Loading post…</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <PageMeta
        title={`${post.title} | Kodstigen Blog`}
        description={post.excerpt}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
          datePublished: post.publishedAt,
          author: { '@type': 'Person', name: post.authorUsername },
          mainEntityOfPage: `https://kodstigen.se/blog/${post.slug}`,
        }}
      />

      <Link to="/blog" className="text-sm text-slate-400 hover:text-white">
        ← Blog
      </Link>

      <h1 className="mt-4 text-4xl font-extrabold leading-tight">{post.title}</h1>
      <p className="mt-3 text-sm text-slate-500">
        {new Date(post.publishedAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}{' '}
        · by {post.authorUsername}
      </p>

      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt=""
          className="mt-6 w-full rounded-2xl border border-slate-800 object-cover"
        />
      )}

      <article className="prose-lesson mt-8">
        <LessonMarkdown sessionKey={post.id}>{post.content}</LessonMarkdown>
      </article>
    </main>
  );
}
