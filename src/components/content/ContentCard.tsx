'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StatusBadge } from './StatusBadge'
import { TypeBadge } from './TypeBadge'
import type { ContentItem } from '@/types/database'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export function ContentCard({ item }: { item: ContentItem }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const createdDate = new Date(item.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
  const hasImage = !!item.image_url

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this content item?')) return
    setDeleting(true)
    await fetch(`/api/content/${item.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <Link
      href={`/content/${item.id}`}
      className="block bg-surface rounded-xl p-5 hover:bg-surface-2 transition-colors group"
    >
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        {hasImage && (
          <img src={item.image_url!} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top row: type + status + date */}
          <div className="flex items-center gap-3 mb-1.5">
            <TypeBadge type={item.content_type} />
            <StatusBadge status={item.status} />
            <span className="text-xs text-muted ml-auto">{createdDate}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-medium text-foreground leading-snug">{item.title}</h3>

          {/* Client */}
          {item.client && (
            <p className="text-sm text-muted mt-1">{item.client.business_name}</p>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-lg text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer flex-shrink-0 mt-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Link>
  )
}
