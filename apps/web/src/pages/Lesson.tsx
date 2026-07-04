import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { LessonDetailDto } from '@codeforge/shared';
import { LessonMarkdown } from '../components/LessonMarkdown';
import { api, errorMessage } from '../lib/api';
import { QuizPlayer } from '../components/QuizPlayer';
import { ProjectSubmissionPanel } from '../components/ProjectSubmissionPanel';
import { useAuth } from '../context/AuthContext';

export function Lesson() {
  const { id } = useParams<{ id: string }>();
  const { refreshUser } = useAuth();
  const [lesson, setLesson] = useState<LessonDetailDto | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    setLesson(null);
    setQuizPassed(false);
    setError(null);
    api
      .get<LessonDetailDto>(`/lessons/${id}`)
      .then((res) => {
        setLesson(res.data);
        setQuizPassed(res.data.quizPassed);
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  async function markComplete() {
    if (!lesson) return;
    setCompleting(true);
    try {
      const { data } = await api.post<{ xpAwarded: number }>(`/lessons/${lesson.id}/complete`);
      setLesson({ ...lesson, completed: true });
      if (data.xpAwarded > 0) await refreshUser();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setCompleting(false);
    }
  }

  if (error) {
    return (
      <main className="p-12 text-center">
        <p className="text-red-400">{error}</p>
        <Link to="/courses" className="mt-4 inline-block text-sm text-forge-500 hover:underline">
          ← Back to courses
        </Link>
      </main>
    );
  }
  if (!lesson) return <main className="p-12 text-center text-slate-400">Loading lesson…</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link to={`/courses/${lesson.courseId}`} className="text-sm text-slate-400 hover:text-white">
        ← {lesson.courseTitle}
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">Lesson {lesson.order}</p>
        {lesson.completed && (
          <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-xs font-medium text-emerald-300">
            ✓ Completed
          </span>
        )}
      </div>

      {lesson.videoUrl && (
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <video src={lesson.videoUrl} controls className="h-full w-full" />
        </div>
      )}

      <article className="prose-lesson mt-2">
        <LessonMarkdown>{lesson.content}</LessonMarkdown>
      </article>

      {lesson.requiresSubmission && (
        <ProjectSubmissionPanel
          lessonId={lesson.id}
          submission={lesson.mySubmission}
          onSubmitted={(mySubmission) => setLesson({ ...lesson, mySubmission })}
        />
      )}

      {lesson.quiz && (
        <QuizPlayer
          key={lesson.quiz.id}
          quiz={lesson.quiz}
          onPass={() => setQuizPassed(true)}
        />
      )}

      {!lesson.completed &&
        (!quizPassed ? (
          <p className="mt-8 rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm text-slate-400">
            Pass the quiz above to unlock lesson completion.
          </p>
        ) : lesson.requiresSubmission && lesson.mySubmission?.status !== 'APPROVED' ? (
          <p className="mt-8 rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm text-slate-400">
            Waiting on an approved project submission before this lesson can be marked complete.
          </p>
        ) : (
          <button
            onClick={markComplete}
            disabled={completing}
            className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {completing ? 'Saving…' : '✓ Mark lesson complete (+10 XP)'}
          </button>
        ))}

      <nav className="mt-12 flex justify-between border-t border-slate-800 pt-6 text-sm">
        {lesson.prevLessonId ? (
          <Link to={`/lessons/${lesson.prevLessonId}`} className="text-forge-500 hover:underline">
            ← Previous lesson
          </Link>
        ) : (
          <span />
        )}
        {lesson.nextLessonId ? (
          lesson.completed ? (
            <Link
              to={`/lessons/${lesson.nextLessonId}`}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-500"
            >
              Next lesson →
            </Link>
          ) : (
            <Link to={`/lessons/${lesson.nextLessonId}`} className="text-forge-500 hover:underline">
              Next lesson →
            </Link>
          )
        ) : (
          <Link to={`/courses/${lesson.courseId}`} className="text-emerald-400 hover:underline">
            Back to course overview →
          </Link>
        )}
      </nav>
    </main>
  );
}
