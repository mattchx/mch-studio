'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import type { Client } from '@/types/database'

function FilterPills({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value === value ? '' : opt.value)}
          className={clsx(
            'px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer',
            opt.value === value
              ? 'bg-accent text-bg'
              : 'text-muted hover:text-foreground hover:bg-surface-2'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface-2 rounded-full transition-colors cursor-pointer"
      >
        {selected?.label || label}
        <ChevronDown className={clsx('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-surface border border-border rounded-xl py-1 z-50 shadow-lg shadow-black/20">
          <button
            onClick={() => { onChange(''); setOpen(false) }}
            className={clsx(
              'w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer',
              !value ? 'text-accent font-medium' : 'text-muted hover:text-foreground hover:bg-surface-2'
            )}
          >
            {label}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={clsx(
                'w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer',
                opt.value === value ? 'text-accent font-medium' : 'text-muted hover:text-foreground hover:bg-surface-2'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const statusOptions = [
  { value: 'pending_review', label: 'Pending' },
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
]

const typeOptions = [
  { value: 'social', label: 'Social' },
  { value: 'blog', label: 'Blog' },
  { value: 'gbp_post', label: 'GBP' },
  { value: 'report', label: 'Report' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'site_update', label: 'Update' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'due_date', label: 'Due Date' },
]

export function ContentFilters({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  const clientOptions = clients.map((c) => ({ value: c.slug, label: c.business_name }))

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Dropdown
        label="All Clients"
        options={clientOptions}
        value={searchParams.get('client') || ''}
        onChange={(v) => update('client', v)}
      />

      <span className="w-px h-4 bg-border-subtle mx-1" />

      <FilterPills
        options={statusOptions}
        value={searchParams.get('status') || ''}
        onChange={(v) => update('status', v)}
      />

      <span className="w-px h-4 bg-border-subtle mx-1" />

      <FilterPills
        options={typeOptions}
        value={searchParams.get('type') || ''}
        onChange={(v) => update('type', v)}
      />

      <div className="ml-auto">
        <Dropdown
          label="Sort"
          options={sortOptions}
          value={searchParams.get('sort') || 'newest'}
          onChange={(v) => update('sort', v)}
        />
      </div>
    </div>
  )
}
