import type { Metadata } from 'next';
import { PrivacyContent } from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Kodstigen handles your data: no accounts, no tracking beyond opt-in Google Analytics, and your rights under GDPR.',
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
