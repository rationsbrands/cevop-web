import Link from 'next/link'

const SECTIONS = [
  { label: 'Hero', href: '/admin/hero', desc: 'Headline, subtext, CTA buttons' },
  { label: 'Pricing', href: '/admin/pricing', desc: 'Plans, prices, features' },
  { label: 'FAQ', href: '/admin/faq', desc: 'Questions and answers' },
  { label: 'Testimonials', href: '/admin/testimonials', desc: 'Customer quotes' },
  { label: 'Social & Contact', href: '/admin/social', desc: 'Email, social links' },
  { label: 'Navigation', href: '/admin/navigation', desc: 'Blog URL and nav links' },
  { label: 'Blog', href: '/admin/blog', desc: 'Posts, drafts, publishing' },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--color-text)] uppercase mb-2">Dashboard</h1>
      <p className="text-[var(--color-muted)] text-sm mb-8">Manage your marketing site content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-accent)]/40 transition-all group"
          >
            <p className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-1">{s.label}</p>
            <p className="text-xs text-[var(--color-muted)]">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
        <p className="text-xs text-[var(--color-muted)]">
          Changes made here appear on <a href="https://cevop.com" target="_blank" className="text-[var(--color-accent)] hover:underline">cevop.com</a> immediately — no redeployment needed.
        </p>
      </div>
    </div>
  )
}
