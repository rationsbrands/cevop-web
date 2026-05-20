'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Hero', href: '/admin/hero' },
  { label: 'Pricing', href: '/admin/pricing' },
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
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col">
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

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
