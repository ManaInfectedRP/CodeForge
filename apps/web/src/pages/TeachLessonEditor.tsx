import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { QuestionType, QuizQuestionEditDto, TeachLessonDetailDto } from '@codeforge/shared';
import { LessonMarkdown } from '../components/LessonMarkdown';
import { api, errorMessage } from '../lib/api';

const emptyQuestion: QuizQuestionEditDto = {
  type: 'MULTIPLE_CHOICE',
  prompt: '',
  options: ['', ''],
  answer: '',
};

export function TeachLessonEditor() {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<TeachLessonDetailDto | null>(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestionEditDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);

  useEffect(() => {
    api
      .get<TeachLessonDetailDto>(`/instructor/lessons/${id}`)
      .then((res) => {
        const l = res.data;
        setLesson(l);
        setTitle(l.title);
        setVideoUrl(l.videoUrl ?? '');
        setContent(l.content);
        setQuizTitle(l.quiz?.title ?? `${l.title} Quiz`);
        setPassingScore(l.quiz?.passingScore ?? 70);
        setQuestions(l.quiz?.questions ?? []);
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  async function run(action: () => Promise<unknown>, successNotice: string) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(successNotice);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function saveLesson() {
    void run(
      () =>
        api.put(`/instructor/lessons/${id}`, {
          title,
          videoUrl: videoUrl.trim() === '' ? null : videoUrl.trim(),
          content,
        }),
      'Lesson saved.'
    );
  }

  async function uploadVideo(file: File) {
    setBusy(true);
    setError(null);
    setNotice(null);
    setUploadPercent(0);
    try {
      const form = new FormData();
      form.append('video', file);
      const { data } = await api.post<{ videoUrl: string }>(`/instructor/lessons/${id}/video`, form, {
        onUploadProgress: (e) => {
          if (e.total) setUploadPercent(Math.round((e.loaded / e.total) * 100));
        },
      });
      setVideoUrl(data.videoUrl);
      setNotice('Video uploaded.');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
      setUploadPercent(null);
    }
  }

  function removeVideo() {
    void run(async () => {
      await api.delete(`/instructor/lessons/${id}/video`);
      setVideoUrl('');
    }, 'Video removed.');
  }

  function saveQuiz() {
    void run(
      () => api.put(`/instructor/lessons/${id}/quiz`, { title: quizTitle, passingScore, questions }),
      questions.length > 0 ? 'Quiz saved.' : 'Quiz removed.'
    );
  }

  function updateQuestion(index: number, patch: Partial<QuizQuestionEditDto>) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function changeType(index: number, type: QuestionType) {
    updateQuestion(index, {
      type,
      options: type === 'MULTIPLE_CHOICE' ? ['', ''] : type === 'TRUE_FALSE' ? ['True', 'False'] : [],
      answer: '',
    });
  }

  if (error && !lesson) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!lesson) return <main className="p-12 text-center text-slate-400">Loading…</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to={`/teach/courses/${lesson.courseId}`} className="text-sm text-slate-400 hover:text-white">
        ← {lesson.courseTitle}
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Edit lesson {lesson.order}</h1>

      {notice && <p className="mt-4 text-sm text-emerald-400">{notice}</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <section className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm text-slate-300">Lesson title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-slate-300">Lesson video (optional)</label>

          {videoUrl && (
            <div className="mb-3">
              <video src={videoUrl} controls className="max-h-64 w-full rounded-xl border border-slate-800 bg-black" />
              <button
                type="button"
                onClick={removeVideo}
                disabled={busy}
                className="mt-2 rounded-lg border border-red-800 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-950/40 disabled:opacity-50"
              >
                Remove video
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
              {videoUrl ? 'Replace video…' : 'Upload video…'}
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) void uploadVideo(file);
                }}
              />
            </label>
            {uploadPercent !== null && (
              <span className="text-sm text-forge-500">Uploading… {uploadPercent}%</span>
            )}
            <span className="text-xs text-slate-500">mp4 / webm / ogg / mov, max 200 MB</span>
          </div>

          <div className="mt-3">
            <label htmlFor="video" className="mb-1.5 block text-xs text-slate-500">
              …or paste an external video URL (saved with the lesson)
            </label>
            <input
              id="video"
              type="url"
              value={videoUrl.startsWith('/uploads/') ? '' : videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm focus:border-forge-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="content" className="text-sm text-slate-300">Content (Markdown)</label>
            <button
              type="button"
              onClick={() => setPreview((v) => !v)}
              className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div className="prose-lesson min-h-64 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2">
              <LessonMarkdown>{content}</LessonMarkdown>
            </div>
          ) : (
            <textarea
              id="content"
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm leading-relaxed focus:border-forge-500 focus:outline-none"
            />
          )}
        </div>
        <button
          onClick={saveLesson}
          disabled={busy}
          className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
        >
          Save lesson
        </button>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-bold">📝 Quiz</h2>
        <p className="mt-1 text-sm text-slate-500">
          Optional — remove all questions and save to delete the quiz.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="quizTitle" className="mb-1.5 block text-sm text-slate-300">Quiz title</label>
            <input
              id="quizTitle"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="passing" className="mb-1.5 block text-sm text-slate-300">Passing score (%)</label>
            <input
              id="passing"
              type="number"
              min={1}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
            />
          </div>
        </div>

        <ol className="mt-6 space-y-5">
          {questions.map((q, i) => (
            <li key={i} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between gap-3">
                <select
                  value={q.type}
                  onChange={(e) => changeType(i, e.target.value as QuestionType)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm focus:border-forge-500 focus:outline-none"
                >
                  <option value="MULTIPLE_CHOICE">Multiple choice</option>
                  <option value="TRUE_FALSE">True / False</option>
                  <option value="FILL_BLANK">Fill in the blank</option>
                </select>
                <button
                  onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== i))}
                  className="rounded-lg px-2 py-1 text-sm text-red-400/70 hover:bg-red-950/40 hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              <input
                value={q.prompt}
                onChange={(e) => updateQuestion(i, { prompt: e.target.value })}
                placeholder="Question prompt…"
                className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm focus:border-forge-500 focus:outline-none"
              />

              {q.type === 'MULTIPLE_CHOICE' && (
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`answer-${i}`}
                        checked={q.answer === opt && opt !== ''}
                        onChange={() => updateQuestion(i, { answer: opt })}
                        title="Mark as correct answer"
                        className="accent-emerald-500"
                      />
                      <input
                        value={opt}
                        onChange={(e) => {
                          const options = q.options.map((o, j) => (j === oi ? e.target.value : o));
                          updateQuestion(i, {
                            options,
                            answer: q.answer === opt ? e.target.value : q.answer,
                          });
                        }}
                        placeholder={`Option ${oi + 1}`}
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm focus:border-forge-500 focus:outline-none"
                      />
                      <button
                        onClick={() =>
                          updateQuestion(i, {
                            options: q.options.filter((_, j) => j !== oi),
                            answer: q.answer === opt ? '' : q.answer,
                          })
                        }
                        disabled={q.options.length <= 2}
                        className="px-2 text-slate-500 hover:text-red-300 disabled:opacity-30"
                        title="Remove option"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateQuestion(i, { options: [...q.options, ''] })}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
                  >
                    + Add option
                  </button>
                  <p className="text-xs text-slate-500">Select the radio button next to the correct option.</p>
                </div>
              )}

              {q.type === 'TRUE_FALSE' && (
                <div className="mt-3 flex gap-3">
                  {['True', 'False'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="radio"
                        name={`answer-${i}`}
                        checked={q.answer === opt}
                        onChange={() => updateQuestion(i, { answer: opt })}
                        className="accent-emerald-500"
                      />
                      {opt} is correct
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'FILL_BLANK' && (
                <input
                  value={q.answer}
                  onChange={(e) => updateQuestion(i, { answer: e.target.value })}
                  placeholder="Correct answer (case-insensitive)"
                  className="mt-3 w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm focus:border-forge-500 focus:outline-none"
                />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setQuestions((qs) => [...qs, { ...emptyQuestion }])}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Add question
          </button>
          <button
            onClick={saveQuiz}
            disabled={busy}
            className="rounded-lg bg-forge-600 px-6 py-2 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
          >
            Save quiz
          </button>
        </div>
      </section>
    </main>
  );
}
