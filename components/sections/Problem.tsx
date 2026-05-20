import React from 'react'
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection'

const problems = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Customers wait. Revenue walks.',
    desc: 'Staff are stretched thin. Customers who can\'t get attention leave — or don\'t come back.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
        <line x1="9" y1="21" x2="15" y2="18" />
      </svg>
    ),
    title: 'Orders get lost between table and service.',
    desc: 'Verbal orders. Paper tickets. Shouting across a busy floor. Things get missed. Food gets wasted. Guests get frustrated.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <line x1="9" y1="11" x2="9" y2="11.01" strokeWidth="3" />
        <line x1="15" y1="11" x2="15" y2="11.01" strokeWidth="3" />
        <path d="M7 8l2 3 4-4" stroke="var(--color-red)" strokeWidth="1.5" />
      </svg>
    ),
    title: 'No visibility across locations.',
    desc: 'If you run more than one site, you\'re flying blind. No unified view of orders, staff, or revenue until it\'s too late to act.',
  },
]

export function Problem() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-14">
          <h2 className="font-display text-[var(--color-text)] mb-2 uppercase" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            SERVICE SHOULD BE SEAMLESS.
          </h2>
          <p className="text-[var(--color-muted)] text-base font-light">Usually it isn&apos;t.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <AnimatedItem key={p.title} index={i}>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-2xl h-full transition-all duration-300 hover:border-[var(--color-accent)]/30">
                <div className="text-[var(--color-accent)] mb-6 bg-[var(--color-accent-dim)] w-12 h-12 flex items-center justify-center rounded-xl">{p.icon}</div>
                <h3 className="text-[var(--color-text)] font-bold text-base mb-3 leading-tight uppercase tracking-tight">{p.title}</h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{p.desc}</p>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  )
}
