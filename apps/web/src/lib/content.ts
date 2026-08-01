import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Build-time access to the JSON content bundle in `apps/web/content`, the static site's
 * replacement for the old API + database. Everything here runs on the server during
 * `next build`; never import this from a `'use client'` module, pass the data down as
 * props instead.
 */

/** Next resolves file paths against the working directory it was started from, which is
 * apps/web for `yarn build`/`yarn dev` but the repo root if you invoke `next` yourself
 * with a project-dir argument. Accept both rather than 500 on the second one. */
function resolveContentDir(): string {
  const candidates = [join(process.cwd(), 'content'), join(process.cwd(), 'apps', 'web', 'content')];
  const found = candidates.find((dir) => existsSync(join(dir, 'paths.json')));
  if (!found) throw new Error(`Content bundle not found, looked in: ${candidates.join(', ')}`);
  return found;
}

const CONTENT_DIR = resolveContentDir();

function readJson<T>(...segments: string[]): T {
  return JSON.parse(readFileSync(join(CONTENT_DIR, ...segments), 'utf8')) as T;
}

// --- types -------------------------------------------------------------------------------

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';

export interface LearningPath {
  slug: string;
  name: string;
  icon: string;
  /** 1-5 */
  difficulty: number;
  estimatedHours: number;
  projectCount: number;
  description: string;
  lessonCount: number;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  /** empty for FILL_BLANK */
  options: string[];
  /** the expected answer; quizzes are graded in the browser now, so it ships with the page */
  answer: string;
}

export interface Quiz {
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Lesson {
  slug: string;
  title: string;
  order: number;
  content: string;
  videoUrl?: string;
  requiresSubmission?: boolean;
  quiz?: Quiz;
}

export interface CourseSummary {
  slug: string;
  title: string;
  description: string;
  pathSlug: string;
  pathName: string;
  lessonCount: number;
  quizCount: number;
  isPublic: boolean;
}

export interface Course extends Omit<CourseSummary, 'quizCount'> {
  lessons: Lesson[];
}

export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ChallengeLanguage = 'PYTHON' | 'JAVASCRIPT' | 'TYPESCRIPT' | 'LUA' | 'HTML' | 'C';
export type StarterCodeKey = 'python' | 'javascript' | 'typescript' | 'lua' | 'html' | 'c';

export interface ChallengeTestCase {
  id: string;
  input: unknown[];
  expectedOutput: unknown;
  isHidden: boolean;
}

export interface Challenge {
  slug: string;
  title: string;
  difficulty: ChallengeDifficulty;
  languages: ChallengeLanguage[];
  prompt: string;
  entryPoint: string;
  starterCode: Partial<Record<StarterCodeKey, string>>;
  order: number;
  testCases: ChallengeTestCase[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  author: string;
  publishedAt: string;
}

export type BlogPostSummary = Omit<BlogPost, 'content'>;

export interface Testimonial {
  id: string;
  /** 1-5 */
  rating: number;
  body: string;
  name: string;
  avatarUrl: string | null;
  courseTitle: string;
}

// --- readers -----------------------------------------------------------------------------

export function getPaths(): LearningPath[] {
  return readJson<LearningPath[]>('paths.json');
}

export function getCourses(): CourseSummary[] {
  return readJson<CourseSummary[]>('courses.json');
}

export function getCourse(slug: string): Course {
  return readJson<Course>('courses', `${slug}.json`);
}

export function getCourseSlugs(): string[] {
  return readdirSync(join(CONTENT_DIR, 'courses'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

export function getChallenges(): Challenge[] {
  return readJson<Challenge[]>('challenges.json').sort((a, b) => a.order - b.order);
}

export function getChallenge(slug: string): Challenge | undefined {
  return getChallenges().find((c) => c.slug === slug);
}

export function getBlogPosts(): BlogPostSummary[] {
  return readJson<BlogPost[]>('blog.json')
    .map(({ content: _content, ...summary }) => summary)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return readJson<BlogPost[]>('blog.json').find((p) => p.slug === slug);
}

export function getTestimonials(): Testimonial[] {
  return readJson<Testimonial[]>('testimonials.json');
}
