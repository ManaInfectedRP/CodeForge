import type { LearningPathDto } from '@codeforge/shared';

interface Props {
  path: LearningPathDto;
  selected?: boolean;
  onToggle?: () => void;
}

export function PathCard({ path, selected, onToggle }: Props) {
  const stars = '★'.repeat(path.difficulty) + '☆'.repeat(5 - path.difficulty);
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!onToggle}
      className={`w-full rounded-2xl border p-5 text-left transition-all ${
        selected
          ? 'border-forge-500 bg-forge-900/30 ring-2 ring-forge-500/50'
          : 'border-slate-800 bg-slate-900 hover:border-slate-600'
      } ${onToggle ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl">{path.icon}</span>
        {selected !== undefined && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              selected ? 'bg-forge-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {selected ? 'Selected' : 'Select'}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-bold">Learn {path.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-400">{path.description}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-slate-500">Difficulty</dt>
        <dd className="text-right text-amber-400">{stars}</dd>
        <dt className="text-slate-500">Lessons</dt>
        <dd className="text-right text-slate-300">{path.lessonCount}</dd>
        <dt className="text-slate-500">Projects</dt>
        <dd className="text-right text-slate-300">{path.projectCount}</dd>
        <dt className="text-slate-500">Est. time</dt>
        <dd className="text-right text-slate-300">{path.estimatedHours} hours</dd>
      </dl>
    </button>
  );
}
