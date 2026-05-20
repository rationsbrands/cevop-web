'use client'
import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection'
import { IconQR, IconMonitor, IconBell, IconBranch, IconUsers } from '@/components/icons'

const features = [
  { 
    id: 'qr',
    Icon: IconQR, 
    title: 'QR Ordering', 
    desc: 'Turn any table into a sales point. Customers scan, browse, and order in seconds. No apps, no friction.' 
  },
  { 
    id: 'kds',
    Icon: IconMonitor, 
    title: 'Kitchen Display', 
    desc: 'Replace paper tickets with a live digital board. Orders are received, tracked, and fulfilled in real-time.' 
  },
  { 
    id: 'admin',
    Icon: IconUsers, 
    title: 'Admin Dashboard', 
    desc: 'Monitor every branch from one master dashboard. Compare performance and manage stock across sites.' 
  },
  { 
    id: 'waiter',
    Icon: IconBell, 
    title: 'Service Requests', 
    desc: 'Let customers call for water, the bill, or a waiter with one tap. Staff get instant dashboard alerts.' 
  },
  { 
    id: 'team',
    Icon: IconBranch, 
    title: 'Multi-Site Control', 
    desc: 'Invite staff, assign roles, and track performance. Built for teams of 5 to 500.' 
  },
]

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="mb-20">
              <span className="text-[var(--color-accent)] font-bold tracking-[0.2em] uppercase text-xs mb-4 block text-center">
                The Platform
              </span>
              <h1 className="font-display text-[var(--color-text)] mb-8 leading-[1.1] uppercase text-center" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '-0.02em' }}>
                Everything you need <br />to run a <span className="text-[var(--color-accent)]">smarter</span> kitchen.
              </h1>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <AnimatedItem key={i} index={i}>
                  <div 
                    id={f.id}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] p-10 rounded-[32px] h-full hover:border-[var(--color-accent)]/30 transition-all duration-300 scroll-mt-32"
                  >
                    <div className="w-14 h-14 bg-[var(--color-accent-dim)] rounded-2xl flex items-center justify-center text-[var(--color-accent)] mb-8">
                      <f.Icon size={28} />
                    </div>
                    <h3 className="font-display text-2xl text-[var(--color-text)] mb-4 uppercase">{f.title}</h3>
                    <p className="text-[var(--color-muted)] text-base leading-relaxed">{f.desc}</p>
                  </div>
                </AnimatedItem>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
