'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Textarea } from '@/components/ui'
import { Check, X, Pencil } from 'lucide-react'
import type { ContentItem } from '@/types/database'

export function ReviewActions({ item }: { item: ContentItem }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [rejectionNote, setRejectionNote] = useState('')
  const [editing, setEditing] = useState(false)
  const [editBody, setEditBody] = useState(item.body || '')
  const [editTitle, setEditTitle] = useState(item.title)

  async function updateStatus(status: string, extra: Record<string, unknown> = {}) {
    setLoading(true)
    const res = await fetch(`/api/content/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra }),
    })
    if (res.ok) {
      router.push('/queue')
      router.refresh()
    }
    setLoading(false)
  }

  async function saveEdit() {
    setLoading(true)
    const res = await fetch(`/api/content/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, body: editBody }),
    })
    if (res.ok) {
      setEditing(false)
      router.refresh()
    }
    setLoading(false)
  }

  if (editing) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:border-accent outline-none"
        />
        <Textarea
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          rows={12}
        />
        <div className="flex items-center gap-3">
          <Button onClick={saveEdit} disabled={loading}>
            Save Changes
          </Button>
          <Button variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  if (showReject) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <Textarea
          placeholder="Rejection note (optional)..."
          value={rejectionNote}
          onChange={(e) => setRejectionNote(e.target.value)}
          rows={3}
        />
        <div className="flex items-center gap-3">
          <Button
            variant="danger"
            onClick={() => updateStatus('rejected', { rejection_note: rejectionNote })}
            disabled={loading}
          >
            Confirm Reject
          </Button>
          <Button variant="ghost" onClick={() => setShowReject(false)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="success"
        onClick={() => updateStatus('approved')}
        disabled={loading}
      >
        <Check className="w-4 h-4" />
        Approve
      </Button>
      <Button variant="danger" onClick={() => setShowReject(true)}>
        <X className="w-4 h-4" />
        Reject
      </Button>
      <Button variant="secondary" onClick={() => setEditing(true)}>
        <Pencil className="w-4 h-4" />
        Edit
      </Button>
    </div>
  )
}
