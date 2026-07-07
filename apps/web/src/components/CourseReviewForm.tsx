import { useState, type FormEvent } from 'react';
import type { MyCourseReviewDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';

interface CourseReviewFormProps {
  courseId: string;
  myReview: MyCourseReviewDto | null | undefined;
  onSaved: (review: MyCourseReviewDto) => void;
}

export function CourseReviewForm({ courseId, myReview, onSaved }: CourseReviewFormProps) {
  const [rating, setRating] = useState(myReview?.rating ?? 0);
  const [body, setBody] = useState(myReview?.body ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { data } = await api.post<MyCourseReviewDto>('/reviews', { courseId, rating, body });
      setSaved(true);
      onSaved({ rating: data.rating, body: data.body });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            className={`text-2xl leading-none ${n <= rating ? 'text-amber-400' : 'text-slate-700'}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        minLength={10}
        maxLength={2000}
        rows={4}
        required
        placeholder="What did you think of this course?"
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={saving || rating === 0}
        className="rounded-lg bg-forge-600 px-6 py-2 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
      >
        {saving ? 'Saving…' : myReview ? 'Update review' : 'Submit review'}
      </button>
      {saved && <span className="ml-3 text-sm text-emerald-400">Thanks for the review!</span>}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
