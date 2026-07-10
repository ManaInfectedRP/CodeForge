import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import type { ChallengeDetailDto, ChallengeLanguage, ChallengeSubmissionDto, ChallengeSubmissionResultDto } from '@codeforge/shared';
import { api, errorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { LessonMarkdown } from '../components/LessonMarkdown';
import { runTestCase, type RunnableLang } from '../lib/sandbox';
import { highlight, type PrismLang } from '../lib/prism';
import { deepEqual } from '../lib/deepEqual';

interface PreviewResult {
  input: unknown[];
  expectedOutput: unknown;
  actualOutput: unknown;
  errored: boolean;
  errorMessage: string | null;
  passed: boolean;
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

const starterKeyByLang: Record<ChallengeLanguage, 'python' | 'javascript' | 'typescript' | 'lua' | 'html' | 'c'> = {
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

export function ChallengeSolve() {
  const { id } = useParams<{ id: string }>();
  const { refreshUser } = useAuth();
  const [challenge, setChallenge] = useState<ChallengeDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<ChallengeLanguage | null>(null);
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ChallengeSubmissionDto | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [previewResults, setPreviewResults] = useState<PreviewResult[] | null>(null);

  useEffect(() => {
    setChallenge(null);
    setError(null);
    setResult(null);
    setPreviewResults(null);
    api
      .get<ChallengeDetailDto>(`/challenges/${id}`)
      .then((res) => {
        setChallenge(res.data);
        const firstLang = res.data.languages[0];
        setLanguage(firstLang);
        setCode(res.data.starterCode[starterKeyByLang[firstLang]] ?? '');
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  function selectLanguage(lang: ChallengeLanguage) {
    if (!challenge || lang === language) return;
    setLanguage(lang);
    setCode(challenge.starterCode[starterKeyByLang[lang]] ?? '');
    setResult(null);
    setPreviewResults(null);
  }

  async function runPreview() {
    if (!challenge || !language) return;
    setPreviewing(true);
    setError(null);
    setPreviewResults(null);
    try {
      const runnable = langToRunnable[language];
      // Sequential for the same reason as submit(): Pyodide's stdout capture isn't safe to run concurrently.
      const results: PreviewResult[] = [];
      for (const ex of challenge.examples) {
        const r = await runTestCase(runnable, code, challenge.entryPoint, ex.input);
        results.push({
          input: ex.input,
          expectedOutput: ex.expectedOutput,
          actualOutput: r.actualOutput,
          errored: r.errored,
          errorMessage: r.errorMessage,
          passed: !r.errored && deepEqual(r.actualOutput, ex.expectedOutput),
        });
      }
      setPreviewResults(results);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPreviewing(false);
    }
  }

  async function submit() {
    if (!challenge || !language) return;
    setRunning(true);
    setError(null);
    setPreviewResults(null);
    try {
      const runnable = langToRunnable[language];
      // Sequential, not Promise.all: Pyodide is a single shared interpreter instance whose
      // stdout capture is set per-call, so concurrent runs cross-attribute each other's output.
      const results: ChallengeSubmissionResultDto[] = [];
      for (const tc of challenge.testCases) {
        const r = await runTestCase(runnable, code, challenge.entryPoint, tc.input);
        results.push({ testCaseId: tc.id, actualOutput: r.actualOutput, errored: r.errored, errorMessage: r.errorMessage });
      }
      const { data } = await api.post<ChallengeSubmissionDto>(`/challenges/${challenge.id}/submit`, {
        language,
        results,
      });
      setResult(data);
      if (data.xpAwarded > 0) {
        await refreshUser();
        setChallenge({ ...challenge, solved: true });
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setRunning(false);
    }
  }

  if (error && !challenge) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!challenge || !language) return <main className="p-12 text-center text-slate-400">Loading challenge…</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/challenges" className="text-sm text-slate-400 hover:text-white">
        ← Challenges
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{challenge.title}</h1>
        {challenge.solved && (
          <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-xs font-medium text-emerald-300">
            ✓ Solved
          </span>
        )}
      </div>

      <article className="prose-lesson mt-4">
        <LessonMarkdown sessionKey={challenge.id}>{challenge.prompt}</LessonMarkdown>
      </article>

      {challenge.examples.length > 0 && (
        <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Examples</p>
          <ul className="mt-2 space-y-1 font-mono text-sm text-slate-300">
            {challenge.examples.map((ex, i) => (
              <li key={i}>
                {language === 'HTML' ? (
                  (() => {
                    const a = ex.input[0] as { selector: string; extract: string; attr?: string };
                    return (
                      <>
                        {a.selector} → {a.extract}
                        {a.attr ? `(${a.attr})` : ''} → {JSON.stringify(ex.expectedOutput)}
                      </>
                    );
                  })()
                ) : (
                  <>
                    solve({ex.input.map((v) => JSON.stringify(v)).join(', ')}) → {JSON.stringify(ex.expectedOutput)}
                  </>
                )}
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
            {challenge.examples.length > 0 && (
              <button
                type="button"
                onClick={runPreview}
                disabled={running || previewing}
                className="rounded-md border border-slate-600 px-4 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
              >
                {previewing ? 'Running…' : '▷ Run'}
              </button>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={running || previewing}
              className="rounded-md bg-emerald-600 px-4 py-1 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {running ? 'Running…' : '▶ Submit'}
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

      {previewResults && (
        <div className="mt-4 space-y-2">
          {previewResults.map((r, i) => (
            <div
              key={i}
              className={`rounded-xl px-4 py-3 font-mono text-xs ${
                r.passed ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'
              }`}
            >
              <p className="font-sans font-semibold">
                {r.passed ? '✅' : '❌'}{' '}
                {language === 'HTML'
                  ? (() => {
                      const a = r.input[0] as { selector: string; extract: string; attr?: string };
                      return `${a.selector} → ${a.extract}${a.attr ? `(${a.attr})` : ''}`;
                    })()
                  : `solve(${r.input.map((v) => JSON.stringify(v)).join(', ')})`}
              </p>
              <p className="mt-1">expected: {JSON.stringify(r.expectedOutput)}</p>
              <p>
                {r.errored ? `error: ${r.errorMessage}` : `got: ${JSON.stringify(r.actualOutput)}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            result.passed ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'
          }`}
        >
          {result.passed ? '✅ All tests passed' : '❌ Not passed'}, {result.testsPassed}/{result.testsTotal} tests
          {result.xpAwarded > 0 && <span className="ml-2 text-amber-400">+{result.xpAwarded} XP</span>}
        </div>
      )}
    </main>
  );
}
