'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Phone, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const hiddenTaskRoutes = new Set(['/listing', '/classified'])

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks
      .filter((task) => task.enabled && !hiddenTaskRoutes.has(task.route))
      .map((task) => ({ label: task.label, href: task.route })),
    []
  )

  const menuItems = [
    { label: 'Home', href: '/' },
    ...navItems.slice(0, 5),
    { label: 'Search', href: '/search' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-white/95 text-[var(--slot4-page-text)] shadow-[0_1px_12px_rgba(8,6,22,0.05)] backdrop-blur">
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container)] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 shrink-0 object-contain" />
          <span className="min-w-0">
            <span className="editable-display block max-w-[190px] truncate text-xl font-bold leading-none">{SITE_CONFIG.name}</span>
            <span className="mt-1 hidden max-w-[190px] truncate text-[11px] font-semibold text-[var(--slot4-muted-text)] sm:block">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.slice(0, 4).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[6px] px-3.5 py-2 text-sm font-bold transition ${
                  active ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]' : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 justify-center md:flex">
          <label className="flex w-full max-w-md items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-3 py-2.5 transition focus-within:border-[var(--slot4-accent)] focus-within:bg-white">
            <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
            <input name="q" type="search" placeholder="Search listings" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--slot4-muted-text)]" />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link href="/contact" className="hidden h-10 items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-white px-4 text-sm font-bold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex">
            <Phone className="h-4 w-4" /> Contact
          </Link>
          <Link href={session ? '/create' : '/signup'} className="hidden h-10 items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-4 text-sm font-bold text-white shadow-[0_12px_26px_rgba(22,46,147,0.22)] transition hover:-translate-y-0.5 sm:inline-flex">
            <UserPlus className="h-4 w-4" /> {session ? 'Post Listing' : 'Join'}
          </Link>
          <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-[6px] border border-[var(--editable-border)] bg-white lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-2 sm:grid-cols-2">
            {menuItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-[6px] border px-4 py-3 text-sm font-bold ${active ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]' : 'border-[var(--editable-border)] text-[var(--slot4-page-text)]'}`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? <button type="button" onClick={logout} className="rounded-[6px] border border-[var(--editable-border)] px-4 py-3 text-left text-sm font-bold">Logout</button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
