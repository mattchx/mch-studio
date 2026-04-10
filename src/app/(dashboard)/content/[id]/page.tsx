import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui'
import { StatusBadge } from '@/components/content/StatusBadge'
import { TypeBadge } from '@/components/content/TypeBadge'
import { ReviewActions } from './ReviewActions'
import type { ContentItem } from '@/types/database'

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('content_items')
    .select('*, client:clients(id, slug, business_name, created_at)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const item = data as unknown as ContentItem

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={item.title}
        description={item.client?.business_name}
      />

      <div className="flex items-center gap-2 mb-6">
        <TypeBadge type={item.content_type} />
        <StatusBadge status={item.status} />
        {item.due_date && (
          <span className="text-xs text-muted">
            Due {new Date(item.due_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Image preview */}
      {item.image_url && (
        <div className="mb-6 rounded-xl overflow-hidden border border-border">
          <img src={item.image_url} alt="" className="w-full" />
        </div>
      )}

      {/* Body content */}
      {item.body && (
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
            {item.body}
          </div>
        </div>
      )}

      {/* Metadata */}
      {item.metadata && Object.keys(item.metadata).length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Metadata</h3>
          <pre className="text-xs text-muted overflow-x-auto">
            {JSON.stringify(item.metadata, null, 2)}
          </pre>
        </div>
      )}

      {/* Rejection note */}
      {item.rejection_note && (
        <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-400">{item.rejection_note}</p>
        </div>
      )}

      {/* Review actions */}
      {(item.status === 'pending_review' || item.status === 'draft') && (
        <ReviewActions item={item} />
      )}
    </div>
  )
}
