'use client'

import { useState, useRef } from 'react'
import { ContentCard } from './ContentCard'
import { GripVertical } from 'lucide-react'
import type { ContentItem } from '@/types/database'

export function QueueList({ items }: { items: ContentItem[] }) {
  const [orderedItems, setOrderedItems] = useState(items)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  function handleDragStart(index: number) {
    dragItem.current = index
  }

  function handleDragEnter(index: number) {
    dragOverItem.current = index
  }

  function handleDragEnd() {
    if (dragItem.current === null || dragOverItem.current === null) return
    if (dragItem.current === dragOverItem.current) return

    const reordered = [...orderedItems]
    const [removed] = reordered.splice(dragItem.current, 1)
    reordered.splice(dragOverItem.current, 0, removed)
    setOrderedItems(reordered)

    dragItem.current = null
    dragOverItem.current = null
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  return (
    <div className="space-y-3">
      {orderedItems.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          className="flex items-stretch group"
        >
          <div className="flex items-center pr-2 cursor-grab active:cursor-grabbing text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <ContentCard item={item} />
          </div>
        </div>
      ))}
    </div>
  )
}
