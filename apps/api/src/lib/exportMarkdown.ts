import type { Course, LearningPath, Lesson, Question, Quiz } from '@prisma/client';

type LessonWithQuiz = Lesson & { quiz: (Quiz & { questions: Question[] }) | null };

function questionMarkdown(q: Question, index: number): string[] {
  const lines = [`**${index + 1}. ${q.prompt}**`, ''];
  if (q.type === 'FILL_BLANK') {
    lines.push(`Correct answer: \`${q.answer}\``, '');
  } else {
    // rendered as GFM task-list checkboxes: the checked box is the answer key
    for (const opt of q.options) lines.push(`- [${opt === q.answer ? 'x' : ' '}] ${opt}`);
    lines.push('');
  }
  return lines;
}

/** Renders a full course (metadata + every lesson's content and quiz) as one Markdown document. */
export function buildCourseMarkdown(course: Course, path: LearningPath, lessons: LessonWithQuiz[]): string {
  const lines: string[] = [
    `# ${course.title}`,
    '',
    `**Learning path:** ${path.icon} ${path.name}  `,
    `**Status:** ${course.status}  `,
    `**Lessons:** ${lessons.length}`,
    '',
    course.description,
    '',
  ];

  lessons.forEach((lesson, i) => {
    lines.push('---', '', `## Lesson ${lesson.order} — ${lesson.title}`, '');
    if (lesson.videoUrl) lines.push('> [!NOTE]', `> 🎥 Video: ${lesson.videoUrl}`, '');
    lines.push(lesson.content.trim(), '');

    if (lesson.quiz) {
      lines.push(`### 📝 Quiz — ${lesson.quiz.title} (passing score: ${lesson.quiz.passingScore}%)`, '');
      lesson.quiz.questions.forEach((q, qi) => lines.push(...questionMarkdown(q, qi)));
    }
    if (i === lessons.length - 1) lines.push('---');
  });

  return lines.join('\n').trimEnd() + '\n';
}
