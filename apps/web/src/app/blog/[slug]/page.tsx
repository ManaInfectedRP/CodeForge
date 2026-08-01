import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonMarkdown } from '@/components/LessonMarkdown';
import { getBlogPost, getBlogPosts } from '@/lib/content';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(post.coverImageUrl ? { images: [post.coverImageUrl] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    mainEntityOfPage: `https://kodstigen.se/blog/${post.slug}`,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Link href="/blog" className="text-sm text-slate-400 hover:text-white">
        ← Blog
      </Link>

      <h1 className="mt-4 text-4xl font-extrabold leading-tight">{post.title}</h1>
      <p className="mt-3 text-sm text-slate-500">
        {new Date(post.publishedAt).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}{' '}
        · by {post.author}
      </p>

      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImageUrl}
          alt=""
          className="mt-6 w-full rounded-2xl border border-slate-800 object-cover"
        />
      )}

      <article className="prose-lesson mt-8">
        <LessonMarkdown sessionKey={post.slug}>{post.content}</LessonMarkdown>
      </article>
    </main>
  );
}
