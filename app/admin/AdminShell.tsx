'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { IconMenu, IconX } from '@/components/icons'

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Hero', href: '/admin/hero' },
  { label: 'Pricing', href: '/admin/pricing' },
  { label: 'Customer Stories', href: '/admin/customers' },
  { label: 'FAQ', href: '/admin/faq' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  { label: 'Sponsors', href: '/admin/sponsors' },
  { label: 'Pages', href: '/admin/pages' },
  { label: 'Social & Contact', href: '/admin/social' },
  { label: 'Navigation', href: '/admin/navigation' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Settings', href: '/admin/settings' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || (globalThis as any).__CEVOP_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (globalThis as any).__CEVOP_SUPABASE_ANON_KEY
  const supabase = createBrowserClient(
    supabaseUrl as string,
    supabaseAnonKey as string
  )

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col lg:flex-row">
      <header className="lg:hidden sticky top-0 z-40 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-[var(--color-text)] border border-[var(--color-border)] rounded-lg"
            aria-label="Open navigation"
          >
            <IconMenu size={18} />
          </button>
          <div className="text-center">
            <p className="font-display text-sm text-[var(--color-text)] uppercase leading-tight">Cevop</p>
            <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-widest leading-tight">Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 h-10 text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] hover:text-red-500 border border-[var(--color-border)] rounded-lg"
          >
            Sign out
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setSidebarOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          <div
            className="absolute left-0 top-0 h-full w-[min(300px,85vw)] bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <p className="font-display text-lg text-[var(--color-text)] uppercase">Cevop</p>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">Admin Panel</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-[var(--color-text)] border border-[var(--color-border)] rounded-lg"
                aria-label="Close navigation"
              >
                <IconX size={18} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5 overflow-auto">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.href
                      ? 'bg-[var(--color-accent)] text-black font-bold'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface2)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-3 border-t border-[var(--color-border)]">
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-sm text-[var(--color-muted)] hover:text-red-500 text-left rounded-lg hover:bg-[var(--color-surface2)] transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="hidden lg:flex w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex-col">
        <div className="p-6 border-b border-[var(--color-border)]">
          <p className="font-display text-lg text-[var(--color-text)] uppercase">Cevop</p>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-[var(--color-accent)] text-black font-bold'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface2)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--color-border)]">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-[var(--color-muted)] hover:text-red-500 text-left rounded-lg hover:bg-[var(--color-surface2)] transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
