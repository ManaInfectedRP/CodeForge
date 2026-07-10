import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import {
  isCLoading,
  isLuaLoading,
  isPyodideLoading,
  normalizeLang,
  runC,
  runJs,
  runLua,
  runPythonInSession,
  type RunnableLang,
} from '../lib/sandbox';
import { highlight, type PrismLang } from '../lib/prism';

export { normalizeLang, type RunnableLang };

const labels: Record<RunnableLang, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  lua: 'Lua',
  html: 'HTML',
  c: 'C',
};

// LessonMarkdown intercepts html/htm fences into HtmlPreview before they ever reach this
// component, but RunnableLang includes 'html' for the challenge-solving side of the sandbox, so
// this map still needs to be exhaustive.
const highlightLangByRunnable: Record<RunnableLang, PrismLang> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  lua: 'lua',
  html: 'markup',
  c: 'c',
};

interface Props {
  language: RunnableLang;
  initialCode: string;
  /** Python code blocks sharing this key share one interpreter namespace, like notebook cells:
   * a variable or import from one block is still visible when another block with the same key
   * runs. Blocks without a sessionKey (or in other languages) stay isolated. */
  sessionKey?: string;
}

export function CodePlayground({ language, initialCode, sessionKey }: Props) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setOutput(null);
    setError(null);
    try {
      let result: { output: string; error: string | null };
      if (language === 'python') {
        if (isPyodideLoading()) setStatus('Loading Python runtime… (first run only, ~10 MB)');
        else if (/^\s*(import|from)\s+(numpy|pandas|scipy|sklearn)\b/m.test(code)) {
          setStatus('Downloading scientific packages… (first use of numpy/pandas/scikit-learn only, may take a while)');
        }
        result = await runPythonInSession(sessionKey ?? 'default', code);
      } else if (language === 'lua') {
        if (isLuaLoading()) setStatus('Loading Lua runtime… (first run only)');
        result = await runLua(code);
      } else if (language === 'c') {
        if (isCLoading()) setStatus('Loading C runtime… (first run only)');
        result = await runC(code);
      } else {
        let js = code;
        if (language === 'typescript') {
          const { transform } = await import('sucrase');
          js = transform(code, { transforms: ['typescript'] }).code;
        }
        result = await runJs(js);
      }
      setOutput(result.output);
      setError(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setStatus(null);
      setRunning(false);
    }
  }

  function reset() {
    setCode(initialCode);
    setOutput(null);
    setError(null);
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {labels[language]}
          {language === 'python' && sessionKey && (
            <span className="ml-2 font-normal normal-case text-slate-600" title="Variables and imports carry over from other Python blocks on this page">
              shares state with other Python blocks
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={running || code === initialCode}
            className="rounded-md px-3 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="rounded-md bg-emerald-600 px-4 py-1 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {running ? 'Running…' : '▶ Run'}
          </button>
        </div>
      </div>

      <div className="max-h-[36rem] min-h-[4.5rem] overflow-auto bg-slate-950">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(c) => highlight(c, highlightLangByRunnable[language])}
          padding={16}
          textareaClassName="focus:outline-none"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: '0.875rem',
            lineHeight: 1.625,
          }}
        />
      </div>

      {status && <div className="border-t border-slate-800 px-4 py-2 text-xs text-forge-500">{status}</div>}

      {(output !== null || error !== null) && (
        <div className="border-t border-slate-800 bg-black/40 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">Output</p>
          {output && <pre className="whitespace-pre-wrap font-mono text-sm text-emerald-300">{output}</pre>}
          {error && <pre className="whitespace-pre-wrap font-mono text-sm text-red-400">{error}</pre>}
          {!output && !error && <p className="font-mono text-sm text-slate-500">(no output)</p>}
        </div>
      )}
    </div>
  );
}
