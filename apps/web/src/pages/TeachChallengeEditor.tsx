import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import type {
  ChallengeDifficulty,
  ChallengeLanguage,
  ChallengeTestCaseEditDto,
  TeachChallengeDetailDto,
} from '@codeforge/shared';
import { LessonMarkdown } from '../components/LessonMarkdown';
import { StatusBadge } from '../components/StatusBadge';
import { api, errorMessage } from '../lib/api';

const allLanguages: ChallengeLanguage[] = ['PYTHON', 'JAVASCRIPT', 'TYPESCRIPT'];
const languageLabels: Record<ChallengeLanguage, string> = {
  PYTHON: 'Python',
  JAVASCRIPT: 'JavaScript',
  TYPESCRIPT: 'TypeScript',
};
const starterKeyByLang: Record<ChallengeLanguage, 'python' | 'javascript' | 'typescript'> = {
  PYTHON: 'python',
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
};

interface TestCaseRow {
  inputText: string;
  expectedOutputText: string;
  isHidden: boolean;
}

const emptyRow: TestCaseRow = { inputText: '[]', expectedOutputText: '', isHidden: true };

function rowFromDto(tc: ChallengeTestCaseEditDto): TestCaseRow {
  return {
    inputText: JSON.stringify(tc.input),
    expectedOutputText: JSON.stringify(tc.expectedOutput),
    isHidden: tc.isHidden,
  };
}

export function TeachChallengeEditor() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<TeachChallengeDetailDto | null>(null);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>('EASY');
  const [languages, setLanguages] = useState<ChallengeLanguage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [preview, setPreview] = useState(false);
  const [entryPoint, setEntryPoint] = useState('solve');
  const [starterCode, setStarterCode] = useState<Record<'python' | 'javascript' | 'typescript', string>>({
    python: '',
    javascript: '',
    typescript: '',
  });
  const [rows, setRows] = useState<TestCaseRow[]>([]);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api
      .get<TeachChallengeDetailDto>(`/instructor/challenges/${id}`)
      .then((res) => {
        const c = res.data;
        setChallenge(c);
        setTitle(c.title);
        setDifficulty(c.difficulty);
        setLanguages(c.languages);
        setPrompt(c.prompt);
        setEntryPoint(c.entryPoint);
        setStarterCode({
          python: c.starterCode.python ?? '',
          javascript: c.starterCode.javascript ?? '',
          typescript: c.starterCode.typescript ?? '',
        });
        setRows(c.testCases.map(rowFromDto));
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  useEffect(load, [load]);

  async function run(action: () => Promise<unknown>, successNotice?: string) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
      if (successNotice) setNotice(successNotice);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function toggleLanguage(lang: ChallengeLanguage) {
    setLanguages((ls) => (ls.includes(lang) ? ls.filter((l) => l !== lang) : [...ls, lang]));
  }

  function saveMeta(e: FormEvent) {
    e.preventDefault();
    void run(
      () => api.put(`/instructor/challenges/${id}`, { title, difficulty, languages, prompt, entryPoint, starterCode }),
      'Challenge details saved.'
    );
  }

  function updateRow(index: number, patch: Partial<TestCaseRow>) {
    setRows((rs) => rs.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function saveTestCases() {
    const errors: Record<number, string> = {};
    const testCases: ChallengeTestCaseEditDto[] = [];
    rows.forEach((r, i) => {
      let input: unknown;
      let expectedOutput: unknown;
      try {
        input = JSON.parse(r.inputText);
      } catch {
        errors[i] = 'Input must be valid JSON, e.g. [2, 3]';
        return;
      }
      if (!Array.isArray(input)) {
        errors[i] = 'Input must be a JSON array of arguments, e.g. [2, 3]';
        return;
      }
      try {
        expectedOutput = JSON.parse(r.expectedOutputText);
      } catch {
        errors[i] = 'Expected output must be valid JSON, e.g. 5 or "hello"';
        return;
      }
      testCases.push({ input, expectedOutput, isHidden: r.isHidden });
    });
    setRowErrors(errors);
    if (Object.keys(errors).length > 0) return;
    void run(
      () => api.put(`/instructor/challenges/${id}/test-cases`, { testCases }),
      'Test cases saved.'
    );
  }

  if (error && !challenge) return <main className="p-12 text-center text-red-400">{error}</main>;
  if (!challenge) return <main className="p-12 text-center text-slate-400">Loading…</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/teach/challenges" className="text-sm text-slate-400 hover:text-white">
        ← Your challenges
      </Link>

      <div className="mt-4 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{challenge.title}</h1>
        <StatusBadge status={challenge.status} />
      </div>
      <p className="mt-1 text-sm text-slate-500">{challenge.testCaseCount} test cases</p>

      {challenge.reviewNote && (
        <p className="mt-4 rounded-xl bg-red-950/40 px-4 py-3 text-sm text-red-300">
          Review feedback: {challenge.reviewNote}
        </p>
      )}

      {challenge.status === 'DRAFT' && (
        <button
          onClick={() =>
            run(
              () => api.post(`/instructor/challenges/${id}/submit`),
              'Submitted for review, an admin will approve or send feedback.'
            )
          }
          disabled={busy || challenge.testCaseCount === 0}
          title={challenge.testCaseCount === 0 ? 'Add at least one test case first' : undefined}
          className="mt-5 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
        >
          Submit for review
        </button>
      )}
      {challenge.status === 'PENDING_REVIEW' && (
        <p className="mt-5 rounded-xl border border-amber-700/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          ⏳ Waiting for admin review. You can keep editing in the meantime.
        </p>
      )}

      {notice && <p className="mt-4 text-sm text-emerald-400">{notice}</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <form onSubmit={saveMeta} className="mt-8 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-bold">Challenge details</h2>
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm text-slate-300">Title</label>
          <input
            id="title"
            required
            minLength={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="difficulty" className="mb-1.5 block text-sm text-slate-300">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as ChallengeDifficulty)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 focus:border-forge-500 focus:outline-none"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div>
            <label htmlFor="entryPoint" className="mb-1.5 block text-sm text-slate-300">Function name</label>
            <input
              id="entryPoint"
              required
              value={entryPoint}
              onChange={(e) => setEntryPoint(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm focus:border-forge-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-sm text-slate-300">Languages</p>
          <div className="flex gap-4">
            {allLanguages.map((lang) => (
              <label key={lang} className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={languages.includes(lang)}
                  onChange={() => toggleLanguage(lang)}
                  className="accent-forge-500"
                />
                {languageLabels[lang]}
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="prompt" className="text-sm text-slate-300">Prompt (Markdown)</label>
            <button
              type="button"
              onClick={() => setPreview((v) => !v)}
              className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div className="prose-lesson min-h-32 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2">
              <LessonMarkdown>{prompt}</LessonMarkdown>
            </div>
          ) : (
            <textarea
              id="prompt"
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Write \`${entryPoint}(...)\` that returns…`}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm leading-relaxed focus:border-forge-500 focus:outline-none"
            />
          )}
        </div>
        {languages.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">Starter code</p>
            {languages.map((lang) => (
              <div key={lang}>
                <label className="mb-1 block text-xs text-slate-500">{languageLabels[lang]}</label>
                <textarea
                  rows={4}
                  value={starterCode[starterKeyByLang[lang]]}
                  onChange={(e) =>
                    setStarterCode((sc) => ({ ...sc, [starterKeyByLang[lang]]: e.target.value }))
                  }
                  spellCheck={false}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-sm focus:border-forge-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}
        <button
          type="submit"
          disabled={busy || languages.length === 0}
          className="rounded-lg bg-forge-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
        >
          Save details
        </button>
      </form>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-bold">🧪 Test cases</h2>
        <p className="mt-1 text-sm text-slate-500">
          Input is a JSON array of arguments passed to <code>{entryPoint}(...)</code>. Expected output is the JSON
          value it should return. Hidden test cases aren't shown to students, only their input is sent to the
          browser for grading.
        </p>

        <ol className="mt-6 space-y-4">
          {rows.map((r, i) => (
            <li key={i} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={r.isHidden}
                    onChange={(e) => updateRow(i, { isHidden: e.target.checked })}
                    className="accent-forge-500"
                  />
                  Hidden
                </label>
                <button
                  onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                  className="rounded-lg px-2 py-1 text-sm text-red-400/70 hover:bg-red-950/40 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Input (JSON array)</label>
                  <input
                    value={r.inputText}
                    onChange={(e) => updateRow(i, { inputText: e.target.value })}
                    placeholder="[2, 3]"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-sm focus:border-forge-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Expected output (JSON)</label>
                  <input
                    value={r.expectedOutputText}
                    onChange={(e) => updateRow(i, { expectedOutputText: e.target.value })}
                    placeholder="5"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-sm focus:border-forge-500 focus:outline-none"
                  />
                </div>
              </div>
              {rowErrors[i] && <p className="mt-2 text-sm text-red-400">{rowErrors[i]}</p>}
            </li>
          ))}
        </ol>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setRows((rs) => [...rs, { ...emptyRow }])}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Add test case
          </button>
          <button
            onClick={saveTestCases}
            disabled={busy}
            className="rounded-lg bg-forge-600 px-6 py-2 text-sm font-semibold text-white hover:bg-forge-500 disabled:opacity-50"
          >
            Save test cases
          </button>
        </div>
      </section>
    </main>
  );
}
