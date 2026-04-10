import { createClient } from '@/lib/supabase/server'
import { PageHeader, Card, Badge } from '@/components/ui'
import { TypeBadge } from '@/components/content/TypeBadge'
import { StatusBadge } from '@/components/content/StatusBadge'
import Link from 'next/link'
import type { ContentItem, Client } from '@/types/database'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function getWeekDates(offset: number) {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7)
  monday.setHours(0, 0, 0, 0)

  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d)
  }
  return days
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const { week } = await searchParams
  const weekOffset = parseInt(week || '0', 10)
  const days = getWeekDates(weekOffset)
  const weekStart = days[0]
  const weekEnd = new Date(days[6])
  weekEnd.setHours(23, 59, 59, 999)

  const supabase = await createClient()

  // Get content with due dates in this week range
  const { data: items } = await supabase
    .from('content_items')
    .select('*, client:clients(id, slug, business_name)')
    .gte('due_date', weekStart.toISOString())
    .lte('due_date', weekEnd.toISOString())
    .order('due_date', { ascending: true })

  const contentItems = (items || []) as unknown as ContentItem[]

  // Get all clients for the legend
  const clientIds = [...new Set(contentItems.map(i => i.client_id))]

  // Group by day
  const dayMap = new Map<string, ContentItem[]>()
  for (const day of days) {
    dayMap.set(day.toDateString(), [])
  }
  for (const item of contentItems) {
    if (item.due_date) {
      const dateKey = new Date(item.due_date).toDateString()
      const arr = dayMap.get(dateKey)
      if (arr) arr.push(item)
    }
  }

  const weekLabel = `${days[0].toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })} - ${days[6].toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}`

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Scheduled content by week"
      />

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/calendar?week=${weekOffset - 1}`}
          className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Link>
        <span className="text-sm font-medium">{weekLabel}</span>
        <Link
          href={`/calendar?week=${weekOffset + 1}`}
          className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const dateKey = day.toDateString()
          const dayItems = dayMap.get(dateKey) || []
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <div key={dateKey} className="min-h-[160px]">
              <div className={`text-xs font-medium mb-2 px-1 ${isToday ? 'text-accent' : 'text-muted'}`}>
                {day.toLocaleDateString('en-CA', { weekday: 'short' })}
                <span className={`ml-1 ${isToday ? 'bg-accent text-white px-1.5 py-0.5 rounded-full' : ''}`}>
                  {day.getDate()}
                </span>
              </div>
              <div className="space-y-1.5">
                {dayItems.map(item => (
                  <Link key={item.id} href={`/content/${item.id}`}>
                    <div className="bg-surface border border-border rounded-lg p-2 hover:border-accent/50 transition-colors">
                      <div className="flex items-center gap-1 mb-1">
                        <TypeBadge type={item.content_type} />
                      </div>
                      <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                      {item.client && (
                        <p className="text-xs text-muted truncate">{item.client.business_name}</p>
                      )}
                      <div className="mt-1">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </Link>
                ))}
                {dayItems.length === 0 && (
                  <div className="text-xs text-muted/40 text-center py-4">-</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Week summary */}
      <Card className="mt-6 !p-4">
        <div className="flex items-center gap-6 text-sm">
          <span className="text-muted">{contentItems.length} items this week</span>
          {contentItems.filter(i => i.status === 'pending_review').length > 0 && (
            <Badge color="yellow">
              {contentItems.filter(i => i.status === 'pending_review').length} pending review
            </Badge>
          )}
          {contentItems.filter(i => i.status === 'approved').length > 0 && (
            <Badge color="green">
              {contentItems.filter(i => i.status === 'approved').length} approved
            </Badge>
          )}
          {contentItems.filter(i => i.status === 'published').length > 0 && (
            <Badge color="blue">
              {contentItems.filter(i => i.status === 'published').length} published
            </Badge>
          )}
        </div>
      </Card>
    </div>
  )
}
