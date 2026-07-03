'use client'

import Link from 'next/link'
import { FileText, Home, MessageCircle, Search } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <>
      <footer className="border-t border-[var(--editable-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_100%)] pb-16 text-[var(--editable-footer-text)] md:pb-0">
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 shrink-0 object-contain" />
              <span>
                <span className="editable-display block text-xl font-bold">{SITE_CONFIG.name}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-muted-text)]">An advanced listing company</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-extrabold">Company</h3>
            <div className="mt-3 grid gap-2">
              {[['About', '/about'], ['Contact', '/contact'], ['Search', '/search'], ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']])].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-accent)]">{label}</Link>
              ))}
              {session ? <button type="button" onClick={logout} className="text-left text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-accent)]">Logout</button> : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold">Need a Quote?</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Browse listings, compare details, and send an enquiry when a post matches your need.</p>
            <Link href="/contact" className="mt-4 inline-flex rounded-[6px] bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(22,46,147,0.22)]">
              Send enquiry
            </Link>
          </div>
        </div>
        <div className="border-t border-[var(--editable-border)] px-5 py-4 text-center text-xs font-semibold text-[var(--slot4-muted-text)]">
          © {year} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </footer>

      <nav className="editable-bottom-dock grid-cols-4 text-[11px] font-semibold text-[#46557f]">
        <Link href="/" className="grid place-items-center gap-1 py-2"><Home className="h-6 w-6" />Home</Link>
        <Link href="/search" className="grid place-items-center gap-1 py-2"><Search className="h-6 w-6" />Search</Link>
        <Link href="/contact" className="grid place-items-center gap-1 py-2"><FileText className="h-6 w-6" />Free Quote</Link>
        <Link href="/contact" className="grid place-items-center gap-1 py-2"><MessageCircle className="h-6 w-6" />WhatsApp</Link>
      </nav>
    </>
  )
}
