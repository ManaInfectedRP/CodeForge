import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FeaturedReviewDto, LearningPathDto } from '@codeforge/shared';
import { api } from '../lib/api';

function ReviewCard({ review }: { review: FeaturedReviewDto }) {
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
          {expanded ? 'Visa mindre' : 'Läs hela recensionen'}
        </button>
      )}
      <p className="mt-3 text-amber-400" aria-label={`${review.rating}/5 stars`}>
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

export function Landing() {
  const [paths, setPaths] = useState<LearningPathDto[]>([]);
  const [reviews, setReviews] = useState<FeaturedReviewDto[]>([]);

  useEffect(() => {
    api.get<LearningPathDto[]>('/paths').then((res) => setPaths(res.data)).catch(() => {});
    api.get<FeaturedReviewDto[]>('/reviews/featured').then((res) => setReviews(res.data)).catch(() => {});
  }, []);

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <img
          src="/logo.png"
          alt="Kodstigen"
          className="mx-auto mb-6 h-64 w-64 rounded-3xl object-cover shadow-lg shadow-forge-600/20"
        />
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          Din väg mot en karriär som <span className="bg-gradient-to-r from-forge-500 to-emerald-400 bg-clip-text text-transparent">mjukvaruutvecklare</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Kliv för kliv, från din första rad kod till din första utvecklarroll. Interaktiva kurser, verkliga
          projekt och quiz i alla möjliga programmeringsspråk.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-forge-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-forge-600/25 hover:bg-forge-500"
          >
            Börja lära dig gratis
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-8 py-3.5 font-semibold text-slate-200 hover:bg-slate-800"
          >
            Logga in
          </Link>
        </div>
        <p className="mx-auto mt-5 max-w-xl text-sm text-slate-500">
          Den här sidan visas på svenska, men efter att du registrerar dig eller loggar in fortsätter allt i
          appen på engelska.
        </p>
      </section>

      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="mb-8 text-center text-2xl font-bold">Vad våra studenter säger</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold">Välj din stig</h2>

        <div className="mx-auto flex max-w-[600px] flex-wrap justify-center gap-x-10 gap-y-8">
          {paths.map((p) => (
            <div key={p.slug} className="flex w-20 flex-col items-center gap-2.5">
              <img
                src={`/langs/${p.slug}.svg`}
                alt={`${p.name} logo`}
                className="h-14 w-14 transition-transform hover:scale-110"
              />
              <span className="text-sm font-medium text-slate-300">{p.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
