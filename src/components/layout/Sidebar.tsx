'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { LayoutList, Settings, CalendarDays, Palette } from 'lucide-react'

const nav = [
  { href: '/queue', label: 'Queue', icon: LayoutList },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-surface border-r border-border flex flex-col h-full fixed">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-accent" />
          <span className="font-semibold text-sm">MCH Studio</span>
        </div>
        <p className="text-xs text-muted mt-1">Content Management</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-muted hover:text-foreground hover:bg-surface-2'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
