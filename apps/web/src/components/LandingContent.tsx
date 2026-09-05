'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { LearningPath, Testimonial } from '@/lib/content';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  en: {
    prev: 'Previous',
    next: 'Next',
    showLess: 'Show less',
    readFullReview: 'Read full review',
    stars: 'stars',
    heroLead: 'Your path to a career as a software developer.',
    subtitle:
      'Step by step, from your first line of code to your first developer role. Interactive courses, real projects, and quizzes across all kinds of programming languages.',
    browseCourses: 'Browse the courses',
    tryChallenges: 'Try a coding challenge',
    freeLessonCta: 'New to programming? Start with the basics →',
    noAccount: 'Free and open, no account needed. Every lesson runs in your browser.',
    whatStudentsSay: 'What our students say',
    choosePath: 'Choose your path',
  },
  sv: {
    prev: 'Föregående',
    next: 'Nästa',
    showLess: 'Visa mindre',
    readFullReview: 'Läs hela recensionen',
    stars: 'stjärnor',
    heroLead: 'Din stig mot en karriär som mjukvaruutvecklare.',
    subtitle:
      'Kliv för kliv, från din första rad kod till din första utvecklarroll. Interaktiva kurser, verkliga projekt och quiz i alla möjliga programmeringsspråk.',
    browseCourses: 'Bläddra bland kurserna',
    tryChallenges: 'Prova en kodutmaning',
    freeLessonCta: 'Nybörjare? Börja med grunderna →',
    noAccount: 'Gratis och öppet, inget konto behövs. Varje lektion körs i din webbläsare.',
    whatStudentsSay: 'Vad våra studenter säger',
    choosePath: 'Välj din stig',
  },
};

function ReviewCard({ review }: { review: Testimonial }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [expanded, setExpanded] = useState(false);
  const isLong = review.body.length > 140;

  return (
    <div className="rounded-2xl border border-amber-700/50 bg-slate-900/60 p-5">
      <p className={`text-sm text-slate-300 ${expanded ? '' : 'line-clamp-3'}`}>&quot;{review.body}&quot;</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs text-slate-500 underline hover:text-slate-300"
        >
          {expanded ? t.showLess : t.readFullReview}
        </button>
      )}
      <p className="mt-3 text-amber-400" aria-label={`${review.rating}/5 ${t.stars}`}>
        {'★'.repeat(review.rating)}
        <span className="text-slate-700">{'★'.repeat(5 - review.rating)}</span>
        <span className="ml-1.5 text-xs text-slate-500">({review.rating}/5)</span>
      </p>
      <div className="mt-3 flex items-center gap-2.5">
        {review.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={review.avatarUrl} alt={review.name} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forge-600 text-sm font-bold text-white">
            {review.name[0]?.toUpperCase()}
          </span>
        )}
        <span className="font-medium text-slate-200">{review.name}</span>
      </div>
      <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{review.courseTitle}</p>
    </div>
  );
}

function ReviewsCarousel({ reviews }: { reviews: Testimonial[] }) {
  const { language } = useLanguage();
  const t = translations[language];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateScrollState();
  }, [reviews]);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => scroll(-1)}
        disabled={!canScrollLeft}
        aria-label={t.prev}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forge-600 text-lg text-white shadow-lg shadow-forge-600/25 hover:bg-forge-500 disabled:invisible"
      >
        ‹
      </button>

      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex min-w-0 flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r) => (
          <div key={r.id} className="w-full shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
            <ReviewCard review={r} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        disabled={!canScrollRight}
        aria-label={t.next}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forge-600 text-lg text-white shadow-lg shadow-forge-600/25 hover:bg-forge-500 disabled:invisible"
      >
        ›
      </button>
    </div>
  );
}

interface Props {
  paths: LearningPath[];
  reviews: Testimonial[];
}

export function LandingContent({ paths, reviews }: Props) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">{t.heroLead}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">{t.subtitle}</p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/courses"
            className="rounded-xl bg-forge-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-forge-600/25 hover:bg-forge-500"
          >
            {t.browseCourses}
          </Link>
          <Link
            href="/challenges"
            className="rounded-xl border border-slate-700 px-8 py-3.5 font-semibold text-slate-200 hover:bg-slate-800"
          >
            {t.tryChallenges}
          </Link>
        </div>
        <p className="mx-auto mt-5 max-w-xl text-sm text-slate-500">{t.noAccount}</p>
        <Link
          href="/courses/sample-programming-basics"
          className="mx-auto mt-3 inline-block text-sm font-medium text-forge-500 hover:text-forge-100 hover:underline"
        >
          {t.freeLessonCta}
        </Link>
      </section>

      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="mb-8 text-center text-2xl font-bold">{t.whatStudentsSay}</h2>
          <ReviewsCarousel reviews={reviews} />
        </section>
      )}

      {paths.length > 0 && (
        <section className="pb-20">
          <h2 className="mb-8 text-center text-2xl font-bold">{t.choosePath}</h2>

          <div className="mx-auto max-w-6xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max gap-x-12">
              {[...paths, ...paths].map((p, i) => (
                <Link
                  key={`${p.slug}-${i}`}
                  href={`/courses?path=${p.slug}`}
                  className="flex min-w-20 shrink-0 flex-col items-center gap-2.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/langs/${p.slug}.svg`}
                    alt={`${p.name} logo`}
                    className="h-14 w-14 transition-transform hover:scale-110"
                  />
                  <span className="whitespace-nowrap text-sm font-medium text-slate-300">{p.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
