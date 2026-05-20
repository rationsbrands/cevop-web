'use client'
import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { IconCheck } from '@/components/icons'

const solutions = [
  {
    id: 'sales',
    title: 'Grow Sales',
    tagline: 'Deliver an experience shoppers come back for.',
    desc: 'Sales growth comes from repeat visits and bigger baskets. Cevop helps you create the kind of store experience that earns both.',
    features: ['QR Digital Menu', 'Upsell Recommendations', 'Loyalty Integration', 'Instant Waiter Calls'],
    color: 'bg-[var(--color-accent)]',
  },
  {
    id: 'margin',
    title: 'Protect Margin',
    tagline: 'Stop margin leaks before they add up.',
    desc: 'Nickels, dimes, and dollars fall through the cracks. Cevop helps you catch cost changes early, before they quietly eat into profit.',
    features: ['Real-time Inventory', 'Automated Reordering', 'Waste Tracking', 'Price Sensitivity Alerts'],
    color: 'bg-blue-500',
  },
  {
    id: 'labor',
    title: 'Optimize Labor',
    tagline: 'Get more done with the same team.',
    desc: 'Labor is tight. Time is even tighter. Cevop helps your team spend less time on manual work and more time with customers.',
    features: ['Live Service Display', 'Staff Performance Metrics', 'Shift Scheduling', 'Task Automation'],
    color: 'bg-amber-500',
  }
]

export default function SolutionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="mb-20 text-center">
              <span className="text-[var(--color-accent)] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                Solutions
              </span>
              <h1 className="font-display text-[var(--color-text)] mb-8 leading-[1.1] uppercase" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '-0.02em' }}>
                Built for how <br /><span className="text-[var(--color-accent)]">restaurants</span> actually work.
              </h1>
              <p className="text-[var(--color-muted)] text-xl max-w-2xl mx-auto leading-relaxed">
                Whether you're a single bistro or a growing chain, Cevop standardises your operations so growth doesn’t multiply stress.
              </p>
            </AnimatedSection>

            <div className="space-y-12">
              {solutions.map((s, i) => (
                <AnimatedSection key={s.id} delay={i * 0.1}>
                  <div className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-12 lg:p-16 flex flex-col lg:flex-row gap-12 items-center hover:border-[var(--color-accent)]/30 transition-all duration-500">
                    <div className="flex-1 space-y-6">
                      <div className={`inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white ${s.color}`}>
                        {s.title}
                      </div>
                      <h2 className="font-display text-4xl text-[var(--color-text)] uppercase leading-tight">
                        {s.tagline}
                      </h2>
                      <p className="text-[var(--color-muted)] text-lg leading-relaxed">
                        {s.desc}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {s.features.map((f) => (
                          <div key={f} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-[var(--color-accent-dim)] flex items-center justify-center text-[var(--color-accent)]">
                              <IconCheck size={12} strokeWidth={3} />
                            </div>
                            <span className="text-sm font-medium text-[var(--color-text)]">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 w-full lg:w-1/2 aspect-square rounded-[32px] bg-[var(--color-surface2)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
                       {/* Placeholder for visual/illustration */}
                       <div className="font-display text-6xl text-[var(--color-muted)] opacity-20 uppercase select-none">
                         {s.title}
                       </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="mt-32 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-16">
              <h2 className="font-display text-4xl text-[var(--color-text)] mb-6 uppercase">Ready to optimize your operations?</h2>
              <p className="text-[var(--color-muted)] text-lg mb-10 max-w-xl mx-auto">
                Join 500+ restaurants growing with Cevop. Start for free today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/#pricing" variant="primary" size="lg" className="rounded-full !px-10">Start for Free</Button>
                <Button href="/contact" variant="secondary" size="lg" className="rounded-full !px-10">Book a Demo</Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
