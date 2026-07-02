import { useState } from 'react';

export type RunnableLang = 'python' | 'javascript' | 'typescript';

const labels: Record<RunnableLang, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
};

export function normalizeLang(lang: string): RunnableLang | null {
  switch (lang.toLowerCase()) {
    case 'python':
    case 'py':
      return 'python';
    case 'javascript':
    case 'js':
      return 'javascript';
    case 'typescript':
    case 'ts':
      return 'typescript';
    default:
      return null;
  }
}

// --- Python via Pyodide (CPython compiled to WebAssembly, loaded once per page) ---

interface PyodideInterface {
  runPythonAsync(code: string, options?: { globals?: unknown }): Promise<unknown>;
  setStdout(opts: { batched: (s: string) => void }): void;
  setStderr(opts: { batched: (s: string) => void }): void;
  globals: { get(name: string): (() => { destroy(): void }) };
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/';
let pyodidePromise: Promise<PyodideInterface> | null = null;

function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = new Promise<PyodideInterface>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${PYODIDE_BASE}pyodide.js`;
      script.onload = () => {
        window
          .loadPyodide!({ indexURL: PYODIDE_BASE })
          .then(resolve)
          .catch(reject);
      };
      script.onerror = () => reject(new Error('Could not load the Python runtime — check your internet connection.'));
      document.head.appendChild(script);
    }).catch((err) => {
      pyodidePromise = null; // allow retry after a network failure
      throw err;
    });
  }
  return pyodidePromise;
}

async function runPython(code: string): Promise<{ output: string; error: string | null }> {
  const py = await getPyodide();
  let output = '';
  py.setStdout({ batched: (s) => (output += s + '\n') });
  py.setStderr({ batched: (s) => (output += s + '\n') });
  // fresh namespace per run so lessons don't leak variables into each other
  const namespace = py.globals.get('dict')();
  try {
    await py.runPythonAsync(code, { globals: namespace });
    return { output, error: null };
  } catch (err) {
    return { output, error: err instanceof Error ? err.message : String(err) };
  } finally {
    namespace.destroy();
  }
}

// --- JavaScript / TypeScript in a sandboxed Web Worker with a hard timeout ---

const WORKER_SOURCE = `
self.onmessage = async (e) => {
  const logs = [];
  const record = (...args) => logs.push(args.map((a) => {
    try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
    catch { return String(a); }
  }).join(' '));
  console.log = record;
  console.info = record;
  console.warn = record;
  console.error = record;
  try {
    // async wrapper enables top-level await in lesson code
    await (0, eval)('(async () => {\\n' + e.data + '\\n})()');
    self.postMessage({ output: logs.join('\\n'), error: null });
  } catch (err) {
    self.postMessage({ output: logs.join('\\n'), error: String(err) });
  }
};
`;

const JS_TIMEOUT_MS = 5000;

function runJs(code: string): Promise<{ output: string; error: string | null }> {
  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    const timer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({ output: '', error: `Execution timed out after ${JS_TIMEOUT_MS / 1000}s (infinite loop?)` });
    }, JS_TIMEOUT_MS);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(e.data as { output: string; error: string | null });
    };
    worker.postMessage(code);
  });
}

// --- Component ---

export function CodePlayground({ language, initialCode }: { language: RunnableLang; initialCode: string }) {
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
        if (!pyodidePromise) setStatus('Loading Python runtime… (first run only, ~10 MB)');
        result = await runPython(code);
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

  const lines = code.split('\n').length;

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{labels[language]}</span>
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

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={Math.min(Math.max(lines, 3), 24)}
        spellCheck={false}
        className="block w-full resize-y bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-200 focus:outline-none"
      />

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
