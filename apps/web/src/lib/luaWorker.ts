import { LuaFactory } from 'wasmoon';

// Loaded once per worker instance and reused across runs; only discarded (along with the
// whole worker) if a run times out, so a hung script doesn't leave the runtime in a bad state.
const LUA_WASM_URL = 'https://cdn.jsdelivr.net/npm/wasmoon@1.16.0/dist/glue.wasm';
let factory: InstanceType<typeof LuaFactory> | null = null;

function luaValueToString(value: unknown): string {
  if (value === undefined || value === null) return 'nil';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

self.onmessage = async (e: MessageEvent<string>) => {
  try {
    if (!factory) factory = new LuaFactory(LUA_WASM_URL);
    // fresh engine per run so lessons don't leak globals into each other
    const engine = await factory.createEngine();
    let output = '';
    engine.global.set('print', (...args: unknown[]) => {
      output += args.map(luaValueToString).join('\t') + '\n';
    });
    try {
      await engine.doString(e.data);
      self.postMessage({ output, error: null });
    } catch (err) {
      self.postMessage({ output, error: err instanceof Error ? err.message : String(err) });
    } finally {
      engine.global.close();
    }
  } catch (err) {
    self.postMessage({ output: '', error: err instanceof Error ? err.message : String(err) });
  }
};
