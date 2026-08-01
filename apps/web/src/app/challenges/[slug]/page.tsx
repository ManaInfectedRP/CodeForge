import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChallengeSolver } from '@/components/ChallengeSolver';
import { getChallenge, getChallenges } from '@/lib/content';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getChallenges().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const challenge = getChallenge(slug);
  if (!challenge) return {};
  return {
    title: `${challenge.title} · Coding Challenge`,
    description: `${challenge.difficulty} coding challenge: ${challenge.title}. Solve it in ${challenge.languages
      .map((l) => l[0] + l.slice(1).toLowerCase())
      .join(', ')}, right in your browser.`,
  };
}

export default async function ChallengePage({ params }: Props) {
  const { slug } = await params;
  const challenge = getChallenge(slug);
  if (!challenge) notFound();
  return <ChallengeSolver challenge={challenge} />;
}
