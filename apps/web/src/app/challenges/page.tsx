import type { Metadata } from 'next';
import { ChallengesBrowser } from '@/components/ChallengesBrowser';
import { getChallenges } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Coding Challenges',
  description:
    'Practice programming with browser-based coding challenges in Python, JavaScript, TypeScript, Lua, C, and HTML. No setup, no account.',
};

export default function ChallengesPage() {
  const challenges = getChallenges().map(({ slug, title, difficulty, languages }) => ({
    slug,
    title,
    difficulty,
    languages,
  }));
  return <ChallengesBrowser challenges={challenges} />;
}
