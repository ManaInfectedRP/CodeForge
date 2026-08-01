/**
 * Stands in for the Node built-ins that the Emscripten glue in `wasmoon` and `picoc-js`
 * imports. Both bundles are isomorphic: they branch on `typeof process` at runtime and only
 * touch `fs`/`path`/`module`/... on Node, but the import statements are still statically
 * present, so a browser bundle has to resolve them to something. Aliased in next.config.ts
 * under the `browser` condition only, the server build keeps the real modules.
 */
const stub = {} as Record<string, never>;

export default stub;
