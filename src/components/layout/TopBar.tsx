'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'

export function TopBar() {
  return (
    <header className="border-b border-border-subtle bg-surface">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/queue" className="flex items-baseline gap-1.5">
          <span className="font-[family-name:var(--font-display)] font-bold text-base text-accent">MCH</span>
          <span className="font-[family-name:var(--font-display)] font-medium text-base text-foreground">Studio</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Link>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
