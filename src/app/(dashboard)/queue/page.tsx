import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/ui'
import { QueueList } from '@/components/content/QueueList'
import { ContentFilters } from '@/components/content/ContentFilters'
import type { ContentItem, Client } from '@/types/database'

export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string; type?: string; status?: string; sort?: string }>
}) {
  const { client, type, status, sort } = await searchParams
  const supabase = await createClient()

  // Fetch clients for filter dropdown
  const { data: clients } = await supabase
    .from('clients')
    .select('id, slug, business_name, created_at')
    .order('business_name')

  // Build content query with sort
  let query = supabase
    .from('content_items')
    .select('*, client:clients(id, slug, business_name, created_at)')

  if (sort === 'oldest') {
    query = query.order('created_at', { ascending: true })
  } else if (sort === 'due_date') {
    query = query.order('due_date', { ascending: true, nullsFirst: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  if (client) {
    const matched = (clients || []).find((c) => c.slug === client)
    if (matched) query = query.eq('client_id', matched.id)
  }
  if (type) query = query.eq('content_type', type)
  if (status) {
    query = query.eq('status', status)
  } else {
    query = query.eq('status', 'pending_review')
  }

  const { data: items } = await query

  const contentItems = (items || []) as unknown as ContentItem[]

  return (
    <div>
      <PageHeader
        title="Queue"
        description={`${contentItems.length} item${contentItems.length !== 1 ? 's' : ''} to review`}
      />

      <div className="mb-8">
        <ContentFilters clients={(clients || []) as Client[]} />
      </div>

      {contentItems.length === 0 ? (
        <div className="py-20 text-muted">
          <p className="text-base font-[family-name:var(--font-display)] font-medium">Nothing to review</p>
          <p className="text-sm mt-1">Content will appear here once the agent generates it.</p>
        </div>
      ) : (
        <QueueList items={contentItems} key={sort || 'newest'} />
      )}
    </div>
  )
}
