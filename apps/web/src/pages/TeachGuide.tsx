import { NavLink } from 'react-router-dom';
import { LessonMarkdown } from '../components/LessonMarkdown';

const teachTabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${
    isActive ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  }`;

const guide = `
## 📚 Adding a course

1. Go to **Manage → Teach**, then the **Courses** tab, and click **+ New course**.
2. Fill in a title, description, and pick the learning path it belongs to, then **Create draft**. This opens the course editor.
3. Click **+ Add lesson** to create your first lesson, then open it to write its content. Lessons support Markdown, headings, **bold**, tables, and fenced code blocks. Python, JavaScript, and TypeScript code blocks become interactive editable playgrounds automatically, everything else (like C++ or bash) renders as static code.
4. Optionally attach a video (upload a file or paste an external URL) and a quiz (multiple choice, true/false, or fill-in-the-blank questions) to any lesson.
5. Use the ↑ / ↓ buttons on the course page to reorder lessons.
6. Once you have at least one lesson, click **Submit for review** on the course page. The course moves to *Pending review* and becomes visible to an admin, but not to students yet.
7. An admin will either **approve** it (it goes live immediately) or **send it back** with feedback, in which case it returns to *Draft* so you can fix it up and resubmit.
8. You can keep editing a course at any status, published courses will show your live edits to students immediately.
9. Export any course you own as a single Markdown file anytime with the **Export as Markdown** button on the course page, handy for backups or moving content elsewhere.

## ✍️ Writing lesson content in Markdown

Lesson content, challenge prompts, and this guide itself are all written in Markdown, so everything below works in any **Content** box.

- **Headings** — \`#\`, \`##\`, \`###\` for section structure.
- **Emphasis** — \`**bold**\`, \`*italic*\`, \`~~strikethrough~~\`.
- **Lists** — \`- item\` for bullets, \`1. item\` for numbered, \`- [ ]\` / \`- [x]\` for a checklist, rendered as real checkboxes:
  - [x] a completed step
  - [ ] a pending step
- **Links & images** — \`[text](url)\` and \`![alt](url)\`.
- **Tables** — standard pipe syntax, rendered with real borders and a shaded header row:

| Difficulty | Stars |
|------------|-------|
| Easy | ⭐ |
| Hard | ⭐⭐⭐⭐⭐ |

### Code blocks

Tag a fenced code block with a language. **Python, JavaScript, and TypeScript become interactive, editable playgrounds** with a Run button, students can execute the code right there in the lesson:

\`\`\`python
print("Try editing me and hit Run!")
\`\`\`

Every other language (C++, bash, JSON, C) renders as static, syntax-highlighted code instead:

\`\`\`bash
npm install
\`\`\`

### Callouts

Five GitHub-style alert types highlight important information. Start a blockquote with \`[!NOTE]\`, \`[!TIP]\`, \`[!IMPORTANT]\`, \`[!WARNING]\`, or \`[!CAUTION]\`:

> [!NOTE]
> Useful information readers should know.

> [!WARNING]
> Something that needs immediate attention.

A plain \`>\` blockquote without one of those markers renders as an ordinary quote instead.

## 💻 Adding a coding challenge

1. Go to **Manage → Teach**, then the **Challenges** tab, and click **+ New challenge**.
2. Pick a title, a difficulty (Easy / Medium / Hard), and which languages students can solve it in (Python, JavaScript, TypeScript), then **Create draft**. This opens the challenge editor.
3. Fill in the **prompt** (Markdown, this is what students read), the **function name** students must implement (e.g. \`solve\`), and starter code for each language you picked, then **Save details**.
4. Add **test cases** below. Each one has:
   - **Input**, a JSON array of the arguments passed to your function, e.g. \`[2, 3]\` for a two-argument function.
   - **Expected output**, the JSON value the function should return for that input, e.g. \`5\`, \`"hello"\`, \`true\`, or \`[1, 2, 3]\`.
   - **Hidden**, hidden test cases aren't shown to students as examples, only their *input* is ever sent to the browser, the expected output stays on the server so a student can't peek at the answer. Add at least one or two visible (non-hidden) test cases as examples, and some hidden ones to prevent hard-coded answers.
5. Click **Save test cases**, then **Submit for review** once you have at least one.
6. Same as courses, an admin approves or sends it back with feedback before it appears at */challenges* for students.

### How grading works

Student code runs entirely in their browser (the same sandbox used for lesson playgrounds), it's called once per test case with your input, and its return value is sent back to the server. The server, which is the only place your expected outputs live, does the actual pass/fail comparison, so grading can't be spoofed by an incorrect client-reported "passed" flag.
`;

export function TeachGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav className="flex gap-2">
        <NavLink to="/teach" end className={teachTabClass}>
          Courses
        </NavLink>
        <NavLink to="/teach/challenges" className={teachTabClass}>
          Challenges
        </NavLink>
        <NavLink to="/teach/guide" className={teachTabClass}>
          Guide
        </NavLink>
      </nav>

      <h1 className="mt-6 text-3xl font-bold">📖 Instructor guide</h1>
      <p className="mt-2 text-slate-400">
        How to publish a new course or coding challenge, from draft to live.
      </p>

      <article className="prose-lesson mt-8">
        <LessonMarkdown>{guide}</LessonMarkdown>
      </article>
    </main>
  );
}
