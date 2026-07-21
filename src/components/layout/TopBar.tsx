'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export function TopBar() {
  const pathname = usePathname()
  const onSocial = pathname === '/studio'
  const onSimulator = pathname.startsWith('/studio/meta-ads-simulator')
  const onSaved = pathname.startsWith('/studio/saved') || pathname.startsWith('/studio/p/')

  return (
    <header className="border-b border-[#e2d7bd] bg-[#fffdf7] text-[#1e211e]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/studio" className="flex items-baseline gap-1.5">
          <span className="font-[family-name:var(--font-display)] text-base font-bold text-[#191919]">
            MCH
          </span>
          <span className="font-[family-name:var(--font-display)] text-base font-medium text-[#1e211e]">
            Studio
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            <NavLink href="/studio" active={onSocial}>
              Social
            </NavLink>
            <NavLink href="/studio/meta-ads-simulator" active={onSimulator}>
              Ads Simulator
            </NavLink>
            <NavLink href="/studio/saved" active={onSaved}>
              Saved
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

function NavLink({
  active,
  children,
  href,
}: {
  active: boolean
  children: React.ReactNode
  href: string
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors',
        active
          ? 'bg-[#191919] text-[#f7d66b]'
          : 'text-[#5b6159] hover:text-[#6a4b00]',
      )}
    >
      {children}
    </Link>
  )
}
