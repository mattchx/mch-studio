import type { ContentStatus } from '@/types/database'

const statusConfig: Record<ContentStatus, { label: string; dotClass: string }> = {
  draft: { label: 'Draft', dotClass: 'bg-muted' },
  pending_review: { label: 'Pending', dotClass: 'bg-warning' },
  approved: { label: 'Approved', dotClass: 'bg-success' },
  published: { label: 'Published', dotClass: 'bg-info' },
  rejected: { label: 'Rejected', dotClass: 'bg-danger' },
}

export function StatusBadge({ status }: { status: ContentStatus }) {
  const config = statusConfig[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  )
}
