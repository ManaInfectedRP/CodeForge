import type { LearningPathDto } from '@codeforge/shared';

interface Props {
  path: LearningPathDto;
  onClick: () => void;
}

export function PathCard({ path, onClick }: Props) {
  const stars = '★'.repeat(path.difficulty) + '☆'.repeat(5 - path.difficulty);
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition-all hover:border-slate-600"
    >
      <span className="text-3xl">{path.icon}</span>
      <h3 className="mt-3 text-lg font-bold">Learn {path.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-400">{path.description}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-slate-500">Difficulty</dt>
        <dd className="text-right text-amber-400">{stars}</dd>
        <dt className="text-slate-500">Lessons</dt>
        <dd className="text-right text-slate-300">{path.lessonCount}</dd>
        <dt className="text-slate-500">Projects</dt>
        <dd className="text-right text-slate-300">{path.projectCount}</dd>
      </dl>
    </button>
  );
}
