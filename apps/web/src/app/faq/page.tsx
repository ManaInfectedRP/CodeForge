import type { Metadata } from 'next';
import { FaqContent } from './FaqContent';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers to common questions about learning on Kodstigen: pricing, how courses and quizzes work, coding challenges, and how code runs in your browser.',
};

export default function FaqPage() {
  return <FaqContent />;
}
