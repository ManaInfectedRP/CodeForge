import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FeaturedReviewDto, LearningPathDto } from '@codeforge/shared';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  en: {
    copied: 'Copied!',
    copyLink: 'Copy link',
    prev: 'Previous',
    next: 'Next',
    showLess: 'Show less',
    readFullReview: 'Read full review',
    stars: 'stars',
    heroLead: 'Your path to a career as a',
    heroHighlight: 'software developer',
    subtitle:
      'Step by step, from your first line of code to your first developer role. Interactive courses, real projects, and quizzes across all kinds of programming languages.',
    inviteFriend: 'Invite a friend with your link below.',
    startFree: 'Start learning for free',
    login: 'Log in',
    languageNote: null as string | null,
    freeLessonCta: 'Or try a free lesson right now, no account needed →',
    whatStudentsSay: 'What our students say',
    choosePath: 'Choose your path',
  },
  sv: {
    copied: 'Kopierad!',
    copyLink: 'Kopiera länk',
    prev: 'Föregående',
    next: 'Nästa',
    showLess: 'Visa mindre',
    readFullReview: 'Läs hela recensionen',
    stars: 'stjärnor',
    heroLead: 'Din väg mot en karriär som',
    heroHighlight: 'mjukvaruutvecklare',
    subtitle:
      'Kliv för kliv, från din första rad kod till din första utvecklarroll. Interaktiva kurser, verkliga projekt och quiz i alla möjliga programmeringsspråk.',
    inviteFriend: 'Bjud in en vän med din länk nedan.',
    startFree: 'Börja lära dig gratis',
    login: 'Logga in',
    languageNote: 'Appen fortsätter på engelska efter att du registrerar dig eller loggar in.',
    freeLessonCta: 'Eller prova en gratis lektion direkt, inget konto behövs →',
    whatStudentsSay: 'Vad våra studenter säger',
    choosePath: 'Välj din stig',
  },
};

function ReferralLink({ username }: { username: string }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const referralUrl = `https://kodstigen.se/register?ref=${encodeURIComponent(username)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied, silently ignore
    }
  }

  return (
    <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 sm:flex-row">
      <input
        readOnly
        value={referralUrl}
        onFocus={(e) => e.currentTarget.select()}
        className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-sm text-slate-300"
      />
      <button
        type="button"
        onClick={copy}
        className="w-full shrink-0 rounded-xl bg-forge-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-forge-600/25 hover:bg-forge-500 sm:w-auto"
      >
        {copied ? t.copied : t.copyLink}
      </button>
    </div>
  );
}

function ReviewCard({ review }: { review: FeaturedReviewDto }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [expanded, setExpanded] = useState(false);
  const isLong = review.body.length > 140;

  return (
    <div className="rounded-2xl border border-amber-700/50 bg-slate-900/60 p-5">
      <p className={`text-sm text-slate-300 ${expanded ? '' : 'line-clamp-3'}`}>"{review.body}"</p>
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
          <img src={review.avatarUrl} alt={review.username} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forge-600 text-sm font-bold text-white">
            {review.username[0]?.toUpperCase()}
          </span>
        )}
        <span className="font-medium text-slate-200">{review.username}</span>
      </div>
      <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{review.courseTitle}</p>
    </div>
  );
}

function ReviewsCarousel({ reviews }: { reviews: FeaturedReviewDto[] }) {
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

export function Landing() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const [paths, setPaths] = useState<LearningPathDto[]>([]);
  const [reviews, setReviews] = useState<FeaturedReviewDto[]>([]);

  useEffect(() => {
    api
      .get<LearningPathDto[]>('/paths')
      .then((res) => setPaths(res.data.filter((p) => p.slug !== 'public')))
      .catch(() => {});
    api
      .get<FeaturedReviewDto[]>('/reviews/featured')
      .then((res) => setReviews(res.data))
      .catch(() => {});
  }, []);

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          {t.heroLead}{' '}
          <span className="bg-gradient-to-r from-forge-500 to-emerald-400 bg-clip-text text-transparent">
            {t.heroHighlight}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">{t.subtitle}</p>
        {user ? (
          <>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">{t.inviteFriend}</p>
            <ReferralLink username={user.username} />
          </>
        ) : (
          <>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/register"
                className="rounded-xl bg-forge-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-forge-600/25 hover:bg-forge-500"
              >
                {t.startFree}
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-700 px-8 py-3.5 font-semibold text-slate-200 hover:bg-slate-800"
              >
                {t.login}
              </Link>
            </div>
            {t.languageNote && (
              <p className="mx-auto mt-5 max-w-xl text-sm text-slate-500">{t.languageNote}</p>
            )}
            <Link
              to="/courses/sample-programming-basics"
              className="mx-auto mt-3 inline-block text-sm font-medium text-forge-500 hover:text-forge-100 hover:underline"
            >
              {t.freeLessonCta}
            </Link>
          </>
        )}
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
              {[...paths, ...paths].map((p, i) =>
                user ? (
                  <Link
                    key={`${p.slug}-${i}`}
                    to={`/courses?path=${p.slug}`}
                    className="flex w-20 shrink-0 flex-col items-center gap-2.5"
                  >
                    <img
                      src={`/langs/${p.slug}.svg`}
                      alt={`${p.name} logo`}
                      className="h-14 w-14 transition-transform hover:scale-110"
                    />
                    <span className="whitespace-nowrap text-sm font-medium text-slate-300">{p.name}</span>
                  </Link>
                ) : (
                  <div key={`${p.slug}-${i}`} className="flex w-20 shrink-0 flex-col items-center gap-2.5">
                    <img src={`/langs/${p.slug}.svg`} alt={`${p.name} logo`} className="h-14 w-14" />
                    <span className="whitespace-nowrap text-sm font-medium text-slate-300">{p.name}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
