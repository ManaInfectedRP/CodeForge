export type RunnableLang = 'python' | 'javascript' | 'typescript' | 'lua' | 'html' | 'c';

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
    case 'lua':
      return 'lua';
    case 'html':
    case 'htm':
      return 'html';
    case 'c':
      return 'c';
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

export function isPyodideLoading(): boolean {
  return pyodidePromise === null;
}

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
      script.onerror = () => reject(new Error('Could not load the Python runtime, check your internet connection.'));
      document.head.appendChild(script);
    }).catch((err) => {
      pyodidePromise = null; // allow retry after a network failure
      throw err;
    });
  }
  return pyodidePromise;
}

export async function runPython(code: string): Promise<{ output: string; error: string | null }> {
  const py = await getPyodide();
  let output = '';
  py.setStdout({ batched: (s) => (output += s + '\n') });
  py.setStderr({ batched: (s) => (output += s + '\n') });
  // fresh namespace per run, used for challenge grading where each test case must be isolated
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

// --- Persistent Python namespace, shared across every code block on the same lesson/page ---
//
// Unlike runPython() above (fresh globals every call, for isolated challenge grading), this lets
// multiple `python` fenced code blocks on the same page behave like notebook cells: a variable or
// import from one block is still visible when a later block runs, in any order, as many times as
// the student re-runs them. The namespace is keyed by a caller-supplied session key (typically the
// lesson id) and is torn down and replaced whenever that key changes.

type PyNamespace = { destroy(): void };

let sessionKey: string | null = null;
let sessionNamespace: PyNamespace | null = null;

function getSessionNamespace(py: PyodideInterface, key: string): PyNamespace {
  if (sessionKey !== key) {
    sessionNamespace?.destroy();
    sessionNamespace = py.globals.get('dict')();
    sessionKey = key;
  }
  return sessionNamespace!;
}

export async function runPythonInSession(
  key: string,
  code: string
): Promise<{ output: string; error: string | null }> {
  const py = await getPyodide();
  let output = '';
  py.setStdout({ batched: (s) => (output += s + '\n') });
  py.setStderr({ batched: (s) => (output += s + '\n') });
  const namespace = getSessionNamespace(py, key);
  try {
    await py.runPythonAsync(code, { globals: namespace });
    return { output, error: null };
  } catch (err) {
    return { output, error: err instanceof Error ? err.message : String(err) };
  }
}

// --- Lua via wasmoon (Lua 5.4 compiled to WebAssembly), run in a Worker so a runaway
// script (e.g. an infinite loop) can be forcibly terminated the same way the JS sandbox
// below handles it - a synchronous WASM call on the main thread can't be interrupted by
// a timer, but Worker.terminate() kills the thread outright regardless of what it's doing. ---

const LUA_TIMEOUT_MS = 5000;

let luaWorker: Worker | null = null;

export function isLuaLoading(): boolean {
  return luaWorker === null;
}

function getLuaWorker(): Worker {
  if (!luaWorker) {
    luaWorker = new Worker(new URL('./luaWorker.ts', import.meta.url), { type: 'module' });
  }
  return luaWorker;
}

export function runLua(code: string): Promise<{ output: string; error: string | null }> {
  return new Promise((resolve) => {
    const worker = getLuaWorker();
    const timer = setTimeout(() => {
      worker.terminate();
      luaWorker = null; // next run gets a fresh worker (and pays the load cost again)
      resolve({ output: '', error: `Execution timed out after ${LUA_TIMEOUT_MS / 1000}s (infinite loop?)` });
    }, LUA_TIMEOUT_MS);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      resolve(e.data as { output: string; error: string | null });
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      luaWorker = null;
      resolve({ output: '', error: e.message || 'The Lua runtime crashed, try running again.' });
    };
    worker.postMessage(code);
  });
}

// --- C via picoc-js (a small C interpreter compiled to WASM), in a Worker for the same
// termination-safety reason as Lua above. picoc supports only a subset of ISO C with a
// minimal standard library, this is intentionally lightweight rather than a full gcc/clang
// toolchain, so more advanced lessons (manual memory management, some pointer patterns) may
// not run exactly as a real compiler would. ---

const C_TIMEOUT_MS = 5000;

let cWorker: Worker | null = null;

export function isCLoading(): boolean {
  return cWorker === null;
}

function getCWorker(): Worker {
  if (!cWorker) {
    cWorker = new Worker(new URL('./cWorker.ts', import.meta.url), { type: 'module' });
  }
  return cWorker;
}

export function runC(code: string): Promise<{ output: string; error: string | null }> {
  return new Promise((resolve) => {
    const worker = getCWorker();
    const timer = setTimeout(() => {
      worker.terminate();
      cWorker = null;
      resolve({ output: '', error: `Execution timed out after ${C_TIMEOUT_MS / 1000}s (infinite loop?)` });
    }, C_TIMEOUT_MS);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      resolve(e.data as { output: string; error: string | null });
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      cWorker = null;
      resolve({ output: '', error: e.message || 'The C runtime crashed, try running again.' });
    };
    worker.postMessage(code);
  });
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

export function runJs(code: string): Promise<{ output: string; error: string | null }> {
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

// --- Coding-challenge test-case harness ---
//
// Wraps the student's raw function definition with a small prelude/postlude that
// decodes a JSON-encoded args array, calls the challenge's entry-point function,
// and prints a sentinel line carrying the JSON-encoded return value (or error).
// This lets us reuse runPython/runJs completely unmodified, one run per test case.

const RESULT_PREFIX = '__CF_RESULT__';
const ERROR_PREFIX = '__CF_ERROR__';

export interface TestCaseRunResult {
  actualOutput: unknown;
  errored: boolean;
  errorMessage: string | null;
}

function extractSentinel(output: string): TestCaseRunResult {
  const lines = output.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (line.startsWith(RESULT_PREFIX)) {
      try {
        return { actualOutput: JSON.parse(line.slice(RESULT_PREFIX.length)), errored: false, errorMessage: null };
      } catch {
        return { actualOutput: null, errored: true, errorMessage: 'Could not read the return value.' };
      }
    }
    if (line.startsWith(ERROR_PREFIX)) {
      return { actualOutput: null, errored: true, errorMessage: line.slice(ERROR_PREFIX.length) };
    }
  }
  return { actualOutput: null, errored: true, errorMessage: 'No result produced, did the function return a value?' };
}

function buildPythonHarness(studentCode: string, entryPoint: string, input: unknown[]): string {
  // Double-JSON-encode the args so they become a safe Python string literal regardless of
  // quotes/newlines/unicode in the input, then json.loads it back into a real Python list.
  const argsLiteral = JSON.stringify(JSON.stringify(input));
  return [
    'import json as __cf_json',
    '',
    studentCode,
    '',
    `__cf_args = __cf_json.loads(${argsLiteral})`,
    'try:',
    `    __cf_result = ${entryPoint}(*__cf_args)`,
    `    print(${JSON.stringify(RESULT_PREFIX)} + __cf_json.dumps(__cf_result))`,
    'except Exception as __cf_e:',
    `    print(${JSON.stringify(ERROR_PREFIX)} + str(__cf_e))`,
    '',
  ].join('\n');
}

function buildJsHarness(studentCode: string, entryPoint: string, input: unknown[]): string {
  const argsLiteral = JSON.stringify(JSON.stringify(input));
  return [
    studentCode,
    '',
    'try {',
    `  const __cfArgs = JSON.parse(${argsLiteral});`,
    `  const __cfResult = await ${entryPoint}(...__cfArgs);`, // await is safe even if the student's function is sync
    `  console.log(${JSON.stringify(RESULT_PREFIX)} + JSON.stringify(__cfResult === undefined ? null : __cfResult));`,
    '} catch (__cfErr) {',
    `  console.log(${JSON.stringify(ERROR_PREFIX)} + (__cfErr && __cfErr.message ? __cfErr.message : String(__cfErr)));`,
    '}',
  ].join('\n');
}

function luaStringLiteral(s: string): string {
  const escaped = s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  return `"${escaped}"`;
}

/** Renders a JSON-ish value as a Lua literal, so args can be inlined directly as Lua syntax
 * instead of needing a Lua-side JSON decoder (Lua's stdlib has none). */
function jsValueToLuaLiteral(value: unknown): string {
  if (value === null || value === undefined) return 'nil';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return luaStringLiteral(value);
  if (Array.isArray(value)) return `{${value.map(jsValueToLuaLiteral).join(', ')}}`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return `{${entries.map(([k, v]) => `[${luaStringLiteral(k)}] = ${jsValueToLuaLiteral(v)}`).join(', ')}}`;
  }
  throw new Error(`Cannot encode ${typeof value} as a Lua literal`);
}

// Lua's stdlib has no JSON support, so the harness carries its own minimal encoder to send the
// student's return value back through the same print-based sentinel protocol as the other
// languages. Empty tables encode as [] since Lua can't distinguish an empty array from an
// empty object.
const LUA_JSON_ENCODER = `
local function __cf_json_encode(v)
  local t = type(v)
  if v == nil then return 'null' end
  if t == 'boolean' then return v and 'true' or 'false' end
  if t == 'number' then return tostring(v) end
  if t == 'string' then
    local escaped = v:gsub('[\\\\"\\n\\r\\t]', {
      ['\\\\'] = '\\\\\\\\', ['"'] = '\\\\"', ['\\n'] = '\\\\n', ['\\r'] = '\\\\r', ['\\t'] = '\\\\t',
    })
    return '"' .. escaped .. '"'
  end
  if t == 'table' then
    local n = 0
    for _ in pairs(v) do n = n + 1 end
    local isArray = n == 0
    if not isArray then
      isArray = true
      for i = 1, n do if v[i] == nil then isArray = false break end end
    end
    local parts = {}
    if isArray then
      for i = 1, n do parts[#parts + 1] = __cf_json_encode(v[i]) end
      return '[' .. table.concat(parts, ',') .. ']'
    end
    for k, val in pairs(v) do
      parts[#parts + 1] = __cf_json_encode(tostring(k)) .. ':' .. __cf_json_encode(val)
    end
    return '{' .. table.concat(parts, ',') .. '}'
  end
  error('cannot encode value of type ' .. t)
end
`;

function buildLuaHarness(studentCode: string, entryPoint: string, input: unknown[]): string {
  const argsLiteral = input.map(jsValueToLuaLiteral).join(', ');
  return [
    studentCode,
    '',
    LUA_JSON_ENCODER,
    `local __cf_ok, __cf_result = pcall(function() return ${entryPoint}(${argsLiteral}) end)`,
    'if __cf_ok then',
    `  print(${JSON.stringify(RESULT_PREFIX)} .. __cf_json_encode(__cf_result))`,
    'else',
    `  print(${JSON.stringify(ERROR_PREFIX)} .. tostring(__cf_result))`,
    'end',
  ].join('\n');
}

function cStringLiteral(s: string): string {
  const escaped = s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  return `"${escaped}"`;
}

// picoc has no struct/array literal syntax and no stdlib JSON, so each argument is rendered as a
// standalone local declaration (rather than an inline expression) and referenced by name in the
// call - this sidesteps picoc's missing compound-literal/initializer-list support entirely. Every
// C challenge is designed to have an int-returning entry point, since the client never sees the
// test case's expectedOutput (only examples get that), so there's no type info to pick a print
// format from at harness-build time.
function cArgDecl(value: unknown, index: number): { decl: string; ref: string } {
  if (typeof value === 'number') {
    return { decl: '', ref: String(Math.trunc(value)) };
  }
  if (typeof value === 'string') {
    return { decl: '', ref: cStringLiteral(value) };
  }
  if (Array.isArray(value) && value.every((v) => typeof v === 'number')) {
    const name = `__cf_arg${index}`;
    const elems = value.map((v) => Math.trunc(v as number)).join(', ');
    return { decl: `int ${name}[] = { ${elems} };\n`, ref: name };
  }
  throw new Error(`Cannot encode ${typeof value} as a C argument`);
}

function buildCHarness(studentCode: string, entryPoint: string, input: unknown[]): string {
  const decls: string[] = [];
  const refs: string[] = [];
  input.forEach((value, i) => {
    const { decl, ref } = cArgDecl(value, i);
    if (decl) decls.push(decl);
    refs.push(ref);
  });
  return [
    '#include <stdio.h>',
    '',
    studentCode,
    '',
    'int main(void) {',
    ...decls.map((d) => '  ' + d),
    `  int __cf_result = ${entryPoint}(${refs.join(', ')});`,
    `  printf("${RESULT_PREFIX}%d\\n", __cf_result);`,
    '  return 0;',
    '}',
    '',
  ].join('\n');
}

// --- HTML via a sandboxed iframe + postMessage ---
//
// HTML challenges have no entry-point function to call, so grading works differently: each test
// case's `input` is a one-element array holding a DOM assertion `{ selector, extract, attr? }`,
// and `expectedOutput` is the value that assertion should extract once the student's markup is
// rendered. The iframe uses the same trust model as HtmlPreview (`sandbox="allow-scripts"`, no
// `allow-same-origin`) so the student's page cannot reach the parent's DOM or origin - it can only
// report back through postMessage. As with the Lua/JS workers, a hard timeout guards against a
// student <script> that hangs (e.g. an infinite loop); unlike a Worker, an iframe can't be forcibly
// killed mid-synchronous-loop, so the timeout removes the iframe rather than truly interrupting it.

const HTML_TIMEOUT_MS = 5000;
const HTML_RESULT_TYPE = '__cf_html_result__';

export interface HtmlAssertion {
  selector: string;
  extract: 'exists' | 'count' | 'text' | 'html' | 'tag' | 'attr';
  attr?: string;
}

function buildHtmlAssertionScript(assertion: HtmlAssertion): string {
  return `
<script>
(function () {
  function post(msg) {
    parent.postMessage(Object.assign({ type: ${JSON.stringify(HTML_RESULT_TYPE)} }, msg), '*');
  }
  try {
    var assertion = ${JSON.stringify(assertion)};
    var els = document.querySelectorAll(assertion.selector);
    var first = els[0];
    var result;
    switch (assertion.extract) {
      case 'exists': result = els.length > 0; break;
      case 'count': result = els.length; break;
      case 'text': result = first ? first.textContent.trim() : null; break;
      case 'html': result = first ? first.innerHTML.trim() : null; break;
      case 'tag': result = first ? first.tagName.toLowerCase() : null; break;
      case 'attr': result = first ? first.getAttribute(assertion.attr || '') : null; break;
      default: throw new Error('Unknown assertion type: ' + assertion.extract);
    }
    post({ ok: true, result: result });
  } catch (err) {
    post({ ok: false, error: err && err.message ? err.message : String(err) });
  }
})();
</script>`;
}

function runHtmlAssertion(studentHtml: string, assertion: HtmlAssertion): Promise<TestCaseRunResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.display = 'none';

    let settled = false;
    const finish = (result: TestCaseRunResult) => {
      if (settled) return;
      settled = true;
      window.removeEventListener('message', onMessage);
      clearTimeout(timer);
      iframe.remove();
      resolve(result);
    };

    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframe.contentWindow || !e.data || e.data.type !== HTML_RESULT_TYPE) return;
      if (e.data.ok) finish({ actualOutput: e.data.result, errored: false, errorMessage: null });
      else finish({ actualOutput: null, errored: true, errorMessage: e.data.error });
    };
    window.addEventListener('message', onMessage);

    const timer = setTimeout(() => {
      finish({
        actualOutput: null,
        errored: true,
        errorMessage: `Execution timed out after ${HTML_TIMEOUT_MS / 1000}s (infinite loop in a <script> tag?)`,
      });
    }, HTML_TIMEOUT_MS);

    iframe.srcdoc = studentHtml + buildHtmlAssertionScript(assertion);
    document.body.appendChild(iframe);
  });
}

/** Runs the student's function once against one test case's input, inside the existing sandbox. */
export async function runTestCase(
  lang: RunnableLang,
  studentCode: string,
  entryPoint: string,
  input: unknown[]
): Promise<TestCaseRunResult> {
  if (lang === 'python') {
    const { output, error } = await runPython(buildPythonHarness(studentCode, entryPoint, input));
    if (error) return { actualOutput: null, errored: true, errorMessage: error };
    return extractSentinel(output);
  }
  if (lang === 'lua') {
    const { output, error } = await runLua(buildLuaHarness(studentCode, entryPoint, input));
    if (error) return { actualOutput: null, errored: true, errorMessage: error };
    return extractSentinel(output);
  }
  if (lang === 'html') {
    return runHtmlAssertion(studentCode, input[0] as HtmlAssertion);
  }
  if (lang === 'c') {
    const { output, error } = await runC(buildCHarness(studentCode, entryPoint, input));
    if (error) return { actualOutput: null, errored: true, errorMessage: error };
    return extractSentinel(output);
  }
  let js = studentCode;
  if (lang === 'typescript') {
    const { transform } = await import('sucrase');
    js = transform(js, { transforms: ['typescript'] }).code;
  }
  const { output, error } = await runJs(buildJsHarness(js, entryPoint, input));
  if (error) return { actualOutput: null, errored: true, errorMessage: error };
  return extractSentinel(output);
}
