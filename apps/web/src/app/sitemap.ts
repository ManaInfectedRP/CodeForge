import type { MetadataRoute } from 'next';
import { getBlogPosts, getChallenges, getCourse, getCourseSlugs } from '@/lib/content';

const SITE_URL = 'https://kodstigen.se';

/** Metadata routes are dynamic by default; `output: 'export'` needs them pinned to static. */
export const dynamic = 'force-static';

/** Generated at build time from the JSON content bundle, so new courses, lessons, and
 * challenges show up in the sitemap without anyone remembering to edit it. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/courses/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/challenges/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog/`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/faq/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about/`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy/`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const courses = getCourseSlugs().flatMap((slug) => {
    const course = getCourse(slug);
    return [
      { url: `${SITE_URL}/courses/${slug}/`, changeFrequency: 'monthly' as const, priority: 0.8 },
      ...course.lessons.map((l) => ({
        url: `${SITE_URL}/courses/${slug}/${l.slug}/`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ];
  });

  const challenges = getChallenges().map((c) => ({
    url: `${SITE_URL}/challenges/${c.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const posts = getBlogPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}/`,
    lastModified: p.publishedAt,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...courses, ...challenges, ...posts];
}
