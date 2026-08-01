# ⚒️ Kodstigen

A programming learning platform, built as a **static site**. Students pick a learning path
(Python, JavaScript, C++, Kubernetes, …), work through interactive lessons, run real code in
the browser, take quizzes, and solve coding challenges. No account, no server, no database.

## Tech stack

| Layer | Tech |
|-------|------|
| App | Next.js 16 (App Router, `output: 'export'`), React 19, TypeScript, Tailwind CSS v4 |
| Content | JSON files in `apps/web/content`, read at build time |
| Runtimes | Pyodide (Python), Web Worker (JS/TS), wasmoon (Lua), picoc-js (C), sandboxed iframe (HTML) |
| Hosting | Render.com static site |

## Repo layout

```
apps/
  web/
    content/          the entire course catalog as JSON (see below)
    public/           images, language logos
    src/app/          routes (App Router)
    src/components/   UI, all client-side
    src/lib/          content readers, code sandboxes, Prism setup
build.sh              build entrypoint used by Render (with .next/cache reuse)
render.yaml           Render blueprint: one static site, nothing else
```

## Getting started

Prerequisites: Node.js 20+ and [Yarn 1.x](https://classic.yarnpkg.com/) (`npm i -g yarn`,
or `corepack enable` from an elevated shell).

```bash
yarn install
yarn dev            # http://localhost:3000
```

Other scripts:

```bash
yarn build          # static export into apps/web/out
yarn typecheck
```

`yarn build` writes a complete, self-contained site to `apps/web/out` (~480 pages). Serve
that directory with any static file server to preview the real artifact.

## Content

Everything a student sees is generated from JSON under `apps/web/content`:

| File | What it holds |
|------|---------------|
| `paths.json` | the 28 learning paths (+ the `public` holder path for the free sample course) |
| `courses.json` | course index: slug, title, description, path, lesson/quiz counts |
| `courses/<slug>.json` | one course, with every lesson's markdown and quiz |
| `challenges.json` | all coding challenges, with starter code and test cases |
| `blog.json` | blog posts |
| `testimonials.json` | student reviews shown on the landing page (empty by default) |

**Adding a course**: create `content/courses/<slug>.json` (copy an existing one for the
shape), then add a matching entry to `content/courses.json`. `pathSlug` must match a slug in
`paths.json`. Routes, the sitemap, and the catalog pick it up on the next build, there is
nothing to migrate or seed.

**Adding a challenge**: append an object to `content/challenges.json`. `testCases[].isHidden`
still controls what's shown as an "Example" versus only revealed after running all tests, but
note that everything in this file ships to the browser, hidden expected outputs included,
grading happens client-side now.

**Lesson markdown**: fenced code blocks in a runnable language become interactive:
`python`/`js`/`ts`/`lua`/`c` render a `CodePlayground` with a Run button, `html` renders a
live sandboxed preview. Everything else is statically syntax-highlighted. Consecutive Python
blocks in one lesson share an interpreter namespace, like notebook cells.

## How code execution works

Nothing is sent anywhere. Each language runs locally in the visitor's browser:

- **Python** via [Pyodide](https://pyodide.org) (CPython on WebAssembly), lazy-loaded from a
  CDN on first run; `numpy`/`pandas`/`scikit-learn` are fetched on demand.
- **JavaScript** in a Web Worker with a 5s timeout, so an infinite loop can be killed.
- **TypeScript** stripped with [Sucrase](https://sucrase.io), then run as JavaScript.
- **Lua** via [wasmoon](https://github.com/ceifa/wasmoon), **C** via
  [picoc-js](https://github.com/KritR/picoc-wasm), both in workers for the same timeout reason.
- **HTML** in an iframe with `sandbox="allow-scripts"` and no same-origin access.

Quizzes and coding challenges are graded in the browser using the same sandbox.

## Deploying to Render.com

Push to GitHub, then in the Render dashboard choose **New → Blueprint** and point it at the
repo. [render.yaml](render.yaml) provisions a single static site that runs
[build.sh](build.sh) and serves `apps/web/out` from Render's CDN. `build.sh` restores and
saves `.next/cache` between builds via `$XDG_CACHE_HOME`, which keeps rebuilds fast.

## What this used to be

Through v0.1 Kodstigen ran an Express + Prisma + PostgreSQL backend with accounts, XP and
streaks, enrollment and progress tracking, a leaderboard, achievements, certificates with QR
verification, community chat, instructor course authoring, and an admin review queue. All of
it lived in `apps/api` and is still in the git history if it's ever needed again.
