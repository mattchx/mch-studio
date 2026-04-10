import type { ContentType } from '@/types/database'

const typeConfig: Record<ContentType, { label: string; colorClass: string }> = {
  social: { label: 'Social', colorClass: 'text-accent' },
  blog: { label: 'Blog', colorClass: 'text-info' },
  report: { label: 'Report', colorClass: 'text-success' },
  gbp_post: { label: 'GBP', colorClass: 'text-warning' },
  newsletter: { label: 'Newsletter', colorClass: 'text-muted' },
  site_update: { label: 'Update', colorClass: 'text-muted' },
}

export function TypeBadge({ type }: { type: ContentType }) {
  const config = typeConfig[type]
  return (
    <span className={`text-[11px] font-medium tracking-wide uppercase ${config.colorClass}`}>
      {config.label}
    </span>
  )
}
