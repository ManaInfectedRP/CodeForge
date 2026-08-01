import type { NextConfig } from 'next';

/** `wasmoon` (Lua) and `picoc-js` (C) ship Emscripten glue that statically imports Node
 * built-ins it only ever calls when running under Node. In the browser bundle those
 * specifiers still have to resolve, so they point at an empty module. */
const NODE_BUILTIN_STUB = './src/lib/node-builtin-stub.ts';
const stubbedBuiltins = ['fs', 'path', 'crypto', 'child_process', 'module', 'os', 'tty', 'worker_threads', 'util'];

const nextConfig: NextConfig = {
  /** Emits a fully static site into `out/` at build time, no Node server at runtime.
   * https://nextjs.org/docs/app/guides/static-exports */
  output: 'export',
  /** Every route becomes `<route>/index.html` so any plain file server (Render's static
   * site included) resolves it without rewrite rules. */
  trailingSlash: true,
  /** next/image's optimizer needs a server; the static build serves the original files. */
  images: { unoptimized: true },
  turbopack: {
    resolveAlias: Object.fromEntries(
      stubbedBuiltins.map((name) => [name, { browser: NODE_BUILTIN_STUB }])
    ),
  },
};

export default nextConfig;
