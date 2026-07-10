import { runC } from 'picoc-js';

// picoc only supports a subset of ISO C (no full standard library), which is fine for the
// small, self-contained snippets these lessons use, but explains why more exotic stdlib calls
// might not work exactly like a real gcc/clang toolchain would.
//
// runC() has no completion signal at all: it boots the WASM module asynchronously, then once
// ready runs the whole program synchronously, calling the write callback for each line of
// output as it happens, with nothing to await afterwards. Since our lesson snippets only ever
// print in one synchronous burst (no real async I/O in picoc), we detect "done" by debouncing:
// resolve once output has gone quiet for a bit, with a hard ceiling in case there's no output
// at all (or the module never finishes booting).

const QUIET_PERIOD_MS = 200;
const MAX_WAIT_MS = 4000;

self.onmessage = (e: MessageEvent<string>) => {
  const source = e.data;
  let output = '';
  let settled = false;
  let quietTimer: ReturnType<typeof setTimeout> | undefined;

  function finish() {
    if (settled) return;
    settled = true;
    clearTimeout(quietTimer);
    self.postMessage({ output, error: null });
  }

  try {
    runC(source, (line: string) => {
      output += line + '\n';
      clearTimeout(quietTimer);
      quietTimer = setTimeout(finish, QUIET_PERIOD_MS);
    });
    setTimeout(finish, MAX_WAIT_MS);
  } catch (err) {
    settled = true;
    clearTimeout(quietTimer);
    self.postMessage({ output, error: err instanceof Error ? err.message : String(err) });
  }
};
