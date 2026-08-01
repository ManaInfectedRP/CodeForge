import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';
import './globals.css';
import '@/styles/prism.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import { GaPageView } from '@/components/GaPageView';

export const metadata: Metadata = {
  metadataBase: new URL('https://kodstigen.se'),
  title: {
    default: 'Kodstigen',
    template: '%s | Kodstigen',
  },
  description:
    'Learn to code with Kodstigen: interactive, step-by-step lessons, quizzes, and real projects across Python, JavaScript, Java, C++, Kotlin, and more.',
  icons: { icon: '/favicon.png' },
  // resolved per route, so every page gets its own canonical without extra wiring
  alternates: { canonical: './' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Suspense>
            <GaPageView />
          </Suspense>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
