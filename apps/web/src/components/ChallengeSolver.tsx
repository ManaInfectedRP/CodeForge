'use client';

import { useState } from 'react';
import Link from 'next/link';
import Editor from 'react-simple-code-editor';
import type { Challenge, ChallengeLanguage, StarterCodeKey } from '@/lib/content';
import { LessonMarkdown } from '@/components/LessonMarkdown';
import { runTestCase, type RunnableLang } from '@/lib/sandbox';
import { highlight, type PrismLang } from '@/lib/prism';
import { deepEqual } from '@/lib/deepEqual';

interface CaseResult {
  input: unknown[];
  expectedOutput: unknown;
  actualOutput: unknown;
  errored: boolean;
  errorMessage: string | null;
  passed: boolean;
  isHidden: boolean;
}

const langToRunnable: Record<ChallengeLanguage, RunnableLang> = {
  PYTHON: 'python',
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  LUA: 'lua',
  HTML: 'html',
  C: 'c',
};

const langLabels: Record<ChallengeLanguage, string> = {
  PYTHON: 'Python',
  JAVASCRIPT: 'JavaScript',
  TYPESCRIPT: 'TypeScript',
  LUA: 'Lua',
  HTML: 'HTML',
  C: 'C',
};

const starterKeyByLang: Record<ChallengeLanguage, StarterCodeKey> = {
  PYTHON: 'python',
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  LUA: 'lua',
  HTML: 'html',
  C: 'c',
};

// react-simple-code-editor's highlighter takes a Prism grammar name, not a RunnableLang - HTML has
// no "html" grammar in Prism, it's called "markup".
const highlightLangByRunnable: Record<RunnableLang, PrismLang> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  lua: 'lua',
  html: 'markup',
  c: 'c',
};

function describeCase(input: unknown[], language: ChallengeLanguage): string {
  if (language === 'HTML') {
    const a = input[0] as { selector: string; extract: string; attr?: string };
    return `${a.selector} → ${a.extract}${a.attr ? `(${a.attr})` : ''}`;
  }
  return `solve(${input.map((v) => JSON.stringify(v)).join(', ')})`;
}

export function ChallengeSolver({ challenge }: { challenge: Challenge }) {
  const [language, setLanguage] = useState<ChallengeLanguage>(challenge.languages[0]);
  const [code, setCode] = useState(challenge.starterCode[starterKeyByLang[challenge.languages[0]]] ?? '');
  const [busy, setBusy] = useState<'run' | 'submit' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CaseResult[] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const examples = challenge.testCases.filter((tc) => !tc.isHidden);

  function selectLanguage(lang: ChallengeLanguage) {
    if (lang === language) return;
    setLanguage(lang);
    setCode(challenge.starterCode[starterKeyByLang[lang]] ?? '');
    setResults(null);
    setSubmitted(false);
  }

  async function run(mode: 'run' | 'submit') {
    setBusy(mode);
    setError(null);
    setResults(null);
    setSubmitted(mode === 'submit');
    try {
      const runnable = langToRunnable[language];
      const cases = mode === 'submit' ? challenge.testCases : examples;
      // Sequential, not Promise.all: Pyodide is a single shared interpreter instance whose
      // stdout capture is set per-call, so concurrent runs cross-attribute each other's output.
      const next: CaseResult[] = [];
      for (const tc of cases) {
        const r = await runTestCase(runnable, code, challenge.entryPoint, tc.input);
        next.push({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: r.actualOutput,
          errored: r.errored,
          errorMessage: r.errorMessage,
          passed: !r.errored && deepEqual(r.actualOutput, tc.expectedOutput),
          isHidden: tc.isHidden,
        });
      }
      setResults(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  const passedCount = results?.filter((r) => r.passed).length ?? 0;
  const allPassed = results !== null && results.length > 0 && passedCount === results.length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/challenges" className="text-sm text-slate-400 hover:text-white">
        ← Challenges
      </Link>

      <h1 className="mt-4 text-2xl font-bold">{challenge.title}</h1>

      <article className="prose-lesson mt-4">
        <LessonMarkdown sessionKey={challenge.slug}>{challenge.prompt}</LessonMarkdown>
      </article>

      {examples.length > 0 && (
        <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Examples</p>
          <ul className="mt-2 space-y-1 font-mono text-sm text-slate-300">
            {examples.map((ex) => (
              <li key={ex.id}>
                {describeCase(ex.input, language)} → {JSON.stringify(ex.expectedOutput)}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
          <div className="flex gap-1">
            {challenge.languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => selectLanguage(lang)}
                className={`rounded-md px-3 py-1 text-xs font-semibold ${
                  lang === language ? 'bg-forge-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {langLabels[lang]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {examples.length > 0 && (
              <button
                type="button"
                onClick={() => run('run')}
                disabled={busy !== null}
                className="rounded-md border border-slate-600 px-4 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
              >
                {busy === 'run' ? 'Running…' : '▷ Run'}
              </button>
            )}
            <button
              type="button"
              onClick={() => run('submit')}
              disabled={busy !== null}
              className="rounded-md bg-emerald-600 px-4 py-1 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {busy === 'submit' ? 'Running…' : '▶ Run all tests'}
            </button>
          </div>
        </div>

        <div className="max-h-[36rem] min-h-[14rem] overflow-auto bg-slate-950">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(c) => highlight(c, highlightLangByRunnable[langToRunnable[language]])}
            padding={16}
            textareaClassName="focus:outline-none"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontSize: '0.875rem',
              lineHeight: 1.625,
            }}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {results && (
        <>
          {submitted && (
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
                allPassed ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'
              }`}
            >
              {allPassed ? '✅ All tests passed' : '❌ Not passed'}, {passedCount}/{results.length} tests
            </div>
          )}
          <div className="mt-4 space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3 font-mono text-xs ${
                  r.passed ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'
                }`}
              >
                <p className="font-sans font-semibold">
                  {r.passed ? '✅' : '❌'} {describeCase(r.input, language)}
                  {r.isHidden && <span className="ml-2 font-normal text-slate-400">(hidden test)</span>}
                </p>
                <p className="mt-1">expected: {JSON.stringify(r.expectedOutput)}</p>
                <p>{r.errored ? `error: ${r.errorMessage}` : `got: ${JSON.stringify(r.actualOutput)}`}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
