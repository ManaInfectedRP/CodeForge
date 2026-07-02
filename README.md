# ⚒️ CodeForge Academy

A modern programming learning platform. Students pick learning paths (C++, Python, JavaScript, TypeScript, Node.js), enroll in courses, complete lessons, pass quizzes, and earn XP while keeping a daily streak alive.

## Tech stack

| Layer | Tech |
|-------|------|
| API | Node.js, Express, TypeScript, Prisma, JWT, Zod |
| Web | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Axios |
| Database | PostgreSQL |
| Shared | `@codeforge/shared`, DTOs and types used by both API and web |

## Repo layout

```
apps/
  api/        Express + Prisma backend (port 4000)
  web/        React + Vite frontend (port 5173, proxies /api to the backend)
packages/
  shared/     TypeScript types shared across apps
```

## Getting started

Prerequisites: Node.js 20+, a running PostgreSQL server.

### Fast boot (one command)

```bash
./fastboot.sh          # install deps, migrate, seed, start api + web
./fastboot.sh --fresh  # same, but wipe and recreate the database first
```

On Windows, run it from Git Bash: `bash fastboot.sh`.

### Manual steps

```bash
# 1. Install dependencies
npm install

# 2. Configure the database connection
#    Edit apps/api/.env, default is postgres:postgres@localhost:5432/codeforge

# 3. Create the schema and seed demo data
npm run db:migrate      # runs prisma migrate dev (creates the codeforge DB schema)
npm run db:seed         # 5 learning paths, 5 courses, lessons, quizzes, 10 coding challenges, 12 achievements, demo accounts

# 4. Run both apps
npm run dev             # api on :4000, web on :5173
```

Open http://localhost:5173.

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@codeforge.dev | student123 |
| Instructor | instructor@codeforge.dev | instructor123 |
| Admin | admin@codeforge.dev | admin123 |

## What's implemented (v0.1, core slice)

- **Auth**, register, login, JWT sessions, role model (student / instructor / admin)
- **Learning paths**, the five language paths with difficulty, lesson counts, and multi-select onboarding
- **Course catalog**, browse by path, enroll, per-course curriculum view
- **Lessons**, markdown content, video slot, prev/next navigation, mark-complete
- **Quizzes**, multiple choice, true/false, and fill-in-the-blank; graded server-side (answers never leave the API); pass/fail against a passing score
- **Gamification**, XP for lessons (+10), first quiz pass (+25), and first challenge solve (+30), daily streak tracking
- **Dashboard**, XP, streak, enrolled courses with completion %, recent activity, selected paths
- **Code playground**, every python/js/ts code block in a lesson is an editable editor with Run/Reset and an output panel. Code executes in the student's browser, fully sandboxed: Python via Pyodide (CPython on WebAssembly, lazy-loaded from CDN on first run), JavaScript in a Web Worker with a 5s timeout, TypeScript stripped with Sucrase then run as JS. C++/bash blocks stay static.
- **Coding challenges** (`/challenges`), 10 seeded problems (Easy/Medium/Hard) solvable in Python, JavaScript, or TypeScript. Submissions run client-side in the same sandbox as the playground, but grading is server-authoritative: expected outputs for hidden test cases never leave the API, only inputs do, mirroring how quiz answers are graded.
- **Leaderboard** (`/leaderboard`), top students ranked by XP with streak and challenges-solved columns
- **Achievements** (`/achievements`), 12 badges that unlock automatically across XP, streak, lessons, quizzes, and challenges milestones
- **Instructor authoring** (`/teach`), create draft courses, write markdown lessons with live preview, upload lesson videos, build quizzes (all three question types), reorder/delete lessons, submit for review
- **Admin review** (`/admin`), approve or send back pending courses with feedback, unpublish live courses; only approved courses appear in the student catalog

## API overview

```
POST /api/auth/register        create account
POST /api/auth/login           get JWT
GET  /api/auth/me              current user
GET  /api/paths                learning paths (+ selected flags when authed)
PUT  /api/me/paths             set my learning paths
GET  /api/me/dashboard         dashboard payload
GET  /api/courses?path=slug    published courses
GET  /api/courses/:id          course detail + my progress
POST /api/courses/:id/enroll   enroll
GET  /api/lessons/:id          lesson content + quiz (no answers)
POST /api/lessons/:id/complete mark complete, award XP
POST /api/quizzes/:id/attempts submit answers, get graded result
GET  /api/challenges           list challenges (+ solved flags when authed)
GET  /api/challenges/:id       challenge detail, starter code, examples, test-case inputs (no expected outputs)
POST /api/challenges/:id/submit submit test-case results, get graded result, award XP
GET  /api/leaderboard          top students by XP
GET  /api/achievements         achievement definitions + my unlock status

# Instructor (role: INSTRUCTOR or ADMIN)
GET/POST /api/instructor/courses            list / create draft courses
GET/PUT  /api/instructor/courses/:id        edit course details
POST /api/instructor/courses/:id/submit     submit draft for review
POST /api/instructor/courses/:id/lessons    add lesson
GET/PUT/DELETE /api/instructor/lessons/:id  edit / remove lesson
POST /api/instructor/lessons/:id/move       reorder lesson
PUT  /api/instructor/lessons/:id/quiz       replace lesson quiz

# Admin (role: ADMIN)
GET  /api/admin/courses?status=             all courses by status
POST /api/admin/courses/:id/approve         publish
POST /api/admin/courses/:id/reject          send back with feedback
POST /api/admin/courses/:id/unpublish       pull a live course
```

## Roadmap (from the full spec)

Certificates with QR verification ·
discussion forums
