import type { Metadata } from 'next';
import { AboutContent } from './AboutContent';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Kodstigen is a solo-built platform for learning programming step by step through interactive lessons, quizzes, and real projects, created by Sebastian Larsson.',
};

export default function AboutPage() {
  return <AboutContent />;
}
