import React from 'react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

function PhoneMockup() {
  return (
    <div className="relative flex justify-center">
      <div className="relative border-2 border-[var(--color-border)] rounded-[20px] overflow-hidden" style={{ width: 200, height: 340, background: 'var(--color-surface2)' }}>
        <div className="p-3">
          <div className="flex gap-1 mb-3">
            {['Starters', 'Mains', 'Drinks'].map((c, i) => (
              <span key={c} className={`text-[8px] px-2 py-1 rounded-sm font-medium ${i === 1 ? 'bg-[var(--color-accent)] text-black' : 'border border-[var(--color-border)] text-[var(--color-muted)]'}`}>{c}</span>
            ))}
          </div>
          {[
            { name: 'Suya Burger', desc: 'Grilled suya patty', price: '₦16,000' },
            { name: 'Party Jollof', desc: 'Smoky oven-baked', price: '₦14,000' },
            { name: 'Chapman', desc: 'Classic Lagos mix', price: '₦5,500' },
          ].map((item) => (
            <div key={item.name} className="flex justify-between items-start py-2 border-b border-[var(--color-border)]">
              <div>
                <p className="text-[9px] font-semibold text-[var(--color-text)]">{item.name}</p>
                <p className="text-[7px] text-[var(--color-muted)]">{item.desc}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-mono text-[var(--color-accent)]">{item.price}</span>
                <div className="w-5 h-5 bg-[var(--color-accent)] flex items-center justify-center rounded-sm shrink-0">
                  <span className="text-black text-[10px] font-bold leading-none">+</span>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-3 bg-[var(--color-accent)] text-black text-[8px] font-bold text-center py-2 rounded-sm">
            VIEW CART (2) — ₦30,000
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceMockup() {
  const columns = [
    { label: 'RECEIVED', color: 'var(--color-blue)', orders: [{ table: 'T3', items: 'Jollof × 2', time: '0:42' }, { table: 'T7', items: 'Burger × 1', time: '1:05' }] },
    { label: 'PREPARING', color: 'var(--color-amber)', orders: [{ table: 'T1', items: 'Steak × 1', time: '8:22' }] },
    { label: 'READY', color: 'var(--color-green)', orders: [{ table: 'T5', items: 'Wings × 3', time: '14:11' }] },
  ]
  return (
    <div className="flex gap-2">
      {columns.map((col) => (
        <div key={col.label} className="flex-1">
          <div className="text-[7px] font-bold tracking-widest mb-2 font-mono" style={{ color: col.color }}>{col.label}</div>
          <div className="space-y-1.5">
            {col.orders.map((o) => (
              <div key={o.table} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-2 rounded-sm" style={{ borderLeftColor: col.color, borderLeftWidth: 2 }}>
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] font-bold font-mono text-[var(--color-text)]">{o.table}</span>
                  <span className="text-[7px] font-mono text-[var(--color-muted)]">{o.time}</span>
                </div>
                <p className="text-[7px] text-[var(--color-muted)]">{o.items}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function DashboardMockup() {
  const stats = [
    { label: 'Revenue Today', value: '₦142K', delta: '+12%' },
    { label: 'Active Orders', value: '8', delta: 'live' },
    { label: 'Tables Occupied', value: '14/20', delta: '70%' },
    { label: 'Staff On Shift', value: '6', delta: 'active' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((s) => (
        <div key={s.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-sm">
          <p className="text-[7px] text-[var(--color-muted)] uppercase tracking-wider mb-1">{s.label}</p>
          <p className="text-lg font-display text-[var(--color-text)] leading-none">{s.value}</p>
          <p className="text-[7px] text-[var(--color-accent)] font-mono mt-1">{s.delta}</p>
        </div>
      ))}
    </div>
  )
}

const steps = [
  {
    number: '01',
    title: 'The Customer',
    desc: 'Scan the QR code on your table. Browse the menu, add items to your cart, and place your order. Call a waiter. Request the bill. All from your phone — no download, no account, no waiting.',
    Visual: PhoneMockup,
  },
  {
    number: '02',
    title: 'The Service',
    desc: 'Orders appear on the service display the moment they\'re placed. Staff confirm, prepare, and mark orders ready in one tap. Every order tracked. Nothing missed.',
    Visual: ServiceMockup,
  },
  {
    number: '03',
    title: 'The Manager',
    desc: 'Every branch. Every order. Every member of staff. One dashboard, real-time, from anywhere. Filter by location. Spot problems before they become complaints.',
    Visual: DashboardMockup,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16">
          <h2 className="font-display text-[var(--color-text)] mb-2 uppercase" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            THREE STEPS.
          </h2>
          <p className="text-[var(--color-muted)] text-base font-light">Zero friction. For everyone.</p>
        </AnimatedSection>

        <div className="space-y-20">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={0.1}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                  <div className="flex items-start gap-4 mb-4">
                    <span className="font-display opacity-20 leading-none shrink-0" style={{ fontSize: 80, color: 'var(--color-accent)' }}>
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl text-[var(--color-text)] mb-3" style={{ letterSpacing: '0.02em' }}>
                        {step.title.toUpperCase()}
                      </h3>
                      <p className="text-[var(--color-muted)] text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
                <div className={`bg-[var(--color-surface2)] border border-[var(--color-border)] p-6 rounded ${i % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}>
                  <step.Visual />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
