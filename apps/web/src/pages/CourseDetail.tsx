import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { CourseDetailDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { ProgressBar } from '../components/ProgressBar';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewBody, setReviewBody] = useState('');
  const [savingReview, setSavingReview] = useState(false);
  const [reviewSaved, setReviewSaved] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(() => {
    api
      .get<CourseDetailDto>(`/courses/${id}`)
      .then((res) => {
        setCourse(res.data);
        if (res.data.myReview) {
          setReviewRating(res.data.myReview.rating);
          setReviewBody(res.data.myReview.body);
        }
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  useEffect(load, [load]);

  async function submitReview(e: FormEvent) {
    e.preventDefault();
    setSavingReview(true);
    setError(null);
    setReviewSaved(false);
    try {
      await api.post('/reviews', { courseId: id, rating: reviewRating, body: reviewBody });
      setReviewSaved(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSavingReview(false);
    }
  }

  async function enroll() {
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setEnrolling(false);
    }
  }

  async function claimCertificate() {
    setClaiming(true);
    setError(null);
    try {
      const { data } = await api.post<{ id: string }>(`/courses/${id}/certificate`);
      navigate(`/certificates/${data.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setClaiming(false);
    }
  }

  if (error && !course) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!course) return <main className="p-12 text-center text-slate-400">Loading course…</main>;

  const percent =
    course.lessonCount === 0 ? 0 : Math.round(((course.completedLessons ?? 0) / course.lessonCount) * 100);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/courses" className="text-sm text-slate-400 hover:text-white">
        ← All courses
      </Link>
      <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">{course.pathName}</p>
      <h1 className="mt-1 text-3xl font-bold">{course.title}</h1>
      <p className="mt-3 text-slate-400">{course.description}</p>
      <p className="mt-2 text-sm text-slate-500">
        {course.lessonCount} lessons · taught by {course.instructorName}
      </p>

      {course.enrolled ? (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-300">Your progress</span>
            <span className="text-slate-400">
              {course.completedLessons}/{course.lessonCount} · {percent}%
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar percent={percent} />
          </div>
          {course.certificateId ? (
            <Link
              to={`/certificates/${course.certificateId}`}
              className="mt-4 inline-block rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
            >
              🎓 View your certificate
            </Link>
          ) : (
            percent === 100 && (
              <button
                onClick={claimCertificate}
                disabled={claiming}
                className="mt-4 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
              >
                {claiming ? 'Issuing…' : '🎓 Claim your certificate'}
              </button>
            )
          )}
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
      ) : null}

      {course.certificateId && (
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-semibold">{course.myReview ? 'Your review' : 'Leave a review'}</h2>
          <form onSubmit={submitReview} className="mt-3 space-y-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setReviewRating(n)}
                  aria-label={`${n} star${n === 1 ? '' : 's'}`}
                  className={`text-2xl leading-none ${n <= reviewRating ? 'text-amber-400' : 'text-slate-700'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              minLength={10}
              maxLength={2000}
              rows={4}
              required
              placeholder="What did you think of this course?"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={savingReview || reviewRating === 0}
              className="rounded-lg bg-forge-600 px-6 py-2 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
            >
              {savingReview ? 'Saving…' : course.myReview ? 'Update review' : 'Submit review'}
            </button>
            {reviewSaved && <span className="ml-3 text-sm text-emerald-400">Thanks for the review!</span>}
          </form>
        </section>
      )}

      {!course.enrolled && (
        <button
          onClick={enroll}
          disabled={enrolling}
          className="mt-6 rounded-xl bg-forge-600 px-8 py-3 font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
        >
          {enrolling ? 'Enrolling…' : 'Enroll in this course'}
        </button>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold">Curriculum</h2>
        <ol className="mt-4 space-y-2">
          {course.lessons.map((l) => {
            const clickable = course.enrolled && l.unlocked;
            return (
              <li key={l.id}>
                <Link
                  to={clickable ? `/lessons/${l.id}` : '#'}
                  onClick={(e) => {
                    if (!clickable) e.preventDefault();
                  }}
                  className={`flex items-center justify-between rounded-xl border px-5 py-4 transition-colors ${
                    clickable
                      ? 'border-slate-800 bg-slate-900 hover:border-slate-600'
                      : 'cursor-not-allowed border-slate-800/60 bg-slate-900/50 opacity-60'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        l.completed ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {l.completed ? '✓' : l.order}
                    </span>
                    <span className="font-medium">{l.title}</span>
                  </span>
                  <span className="text-sm text-slate-500">
                    {l.hasQuiz && '📝 quiz'}
                    {!clickable && ' 🔒'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        {!course.enrolled ? (
          <p className="mt-3 text-sm text-slate-500">Enroll to unlock the lessons.</p>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Lessons unlock in order, complete each one to open the next.</p>
        )}
      </section>
    </main>
  );
}
