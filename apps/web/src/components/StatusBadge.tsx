import type { CourseStatus } from '@codeforge/shared';

const styles: Record<CourseStatus, string> = {
  DRAFT: 'bg-slate-800 text-slate-300',
  PENDING_REVIEW: 'bg-amber-900/50 text-amber-300',
  PUBLISHED: 'bg-emerald-900/50 text-emerald-300',
};

const labels: Record<CourseStatus, string> = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending review',
  PUBLISHED: 'Published',
};

export function StatusBadge({ status }: { status: CourseStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
