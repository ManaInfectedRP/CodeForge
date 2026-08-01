'use client';

import { useState } from 'react';
import type { Quiz } from '@/lib/content';

interface Result {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  incorrectQuestionIds: string[];
}

/** Same rule the API used to apply: exact match, case-insensitive for typed answers. */
function isCorrect(given: string, expected: string, type: Quiz['questions'][number]['type']): boolean {
  const answer = given.trim();
  return type === 'FILL_BLANK' ? answer.toLowerCase() === expected.trim().toLowerCase() : answer === expected;
}

export function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);

  const answeredAll = quiz.questions.every((q) => (answers[q.id] ?? '').trim() !== '');
  const incorrect = new Set(result?.incorrectQuestionIds ?? []);

  function grade() {
    const incorrectQuestionIds = quiz.questions
      .filter((q) => !isCorrect(answers[q.id] ?? '', q.answer, q.type))
      .map((q) => q.id);
    const correctCount = quiz.questions.length - incorrectQuestionIds.length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    setResult({
      score,
      passed: score >= quiz.passingScore,
      correctCount,
      totalQuestions: quiz.questions.length,
      incorrectQuestionIds,
    });
  }

  function reset() {
    setAnswers({});
    setResult(null);
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📝 {quiz.title}</h2>
        <span className="text-sm text-slate-400">Passing score: {quiz.passingScore}%</span>
      </div>

      <ol className="mt-6 space-y-6">
        {quiz.questions.map((q, i) => (
          <li
            key={q.id}
            className={`rounded-xl border p-4 ${
              result
                ? incorrect.has(q.id)
                  ? 'border-red-500/50 bg-red-950/20'
                  : 'border-emerald-500/50 bg-emerald-950/20'
                : 'border-slate-800'
            }`}
          >
            <p className="font-medium">
              <span className="mr-2 text-slate-500">{i + 1}.</span>
              {q.prompt}
            </p>
            {q.type === 'FILL_BLANK' ? (
              <input
                type="text"
                value={answers[q.id] ?? ''}
                disabled={!!result}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                placeholder="Type your answer…"
                className="mt-3 w-full max-w-sm rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-forge-500 focus:outline-none"
              />
            ) : (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      answers[q.id] === opt
                        ? 'border-forge-500 bg-forge-900/40 text-white'
                        : 'border-slate-700 text-slate-300 hover:border-slate-500'
                    } ${result ? 'pointer-events-none opacity-80' : ''}`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      disabled={!!result}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                      className="accent-blue-500"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {result && incorrect.has(q.id) && (
              <p className="mt-2 text-sm text-red-400">Incorrect, review the lesson and try again.</p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 flex items-center gap-4">
        {result ? (
          <>
            <div
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                result.passed ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'
              }`}
            >
              {result.passed ? '✅ Passed' : '❌ Not passed'}, {result.score}% ({result.correctCount}/
              {result.totalQuestions} correct)
            </div>
            <button onClick={reset} className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
              Try again
            </button>
          </>
        ) : (
          <button
            onClick={grade}
            disabled={!answeredAll}
            className="rounded-lg bg-forge-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit answers
          </button>
        )}
      </div>
    </section>
  );
}
