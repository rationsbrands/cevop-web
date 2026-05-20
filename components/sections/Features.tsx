import React from 'react'
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection'
import { IconQR, IconMonitor, IconBell, IconBranch, IconUsers, IconOffline, IconDownload } from '@/components/icons'

const features = [
  { Icon: IconQR, name: 'QR Digital Menu', desc: 'No app download. Works in any mobile browser, instantly.' },
  { Icon: IconMonitor, name: 'Live Kitchen Display', desc: 'Orders appear the moment they are placed. Status updates in one tap.' },
  { Icon: IconBell, name: 'Waiter Call System', desc: 'Customers request attention from the table. Staff respond from their dashboard.' },
  { Icon: IconBranch, name: 'Multi-Branch Control', desc: 'One account manages every location. Each branch fully isolated.' },
  { Icon: IconUsers, name: 'Staff Management', desc: 'Invite, assign roles, and manage your team in minutes.' },
  { Icon: IconOffline, name: 'Works Offline', desc: 'Orders queue locally and sync automatically when connection returns.' },
  { Icon: IconDownload, name: 'QR Code Generator', desc: 'Bulk-generate print-ready QR codes for every table in seconds.' },
]

export function Features() {
  return (
    <section id="features-detail" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-14">
          <h2 className="font-display text-[var(--color-text)] mb-2 uppercase" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '0.02em' }}>
            EVERYTHING YOUR RESTAURANT NEEDS
          </h2>
          <p className="text-[var(--color-muted)] text-base font-light">Built for operators. Not for demos.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <AnimatedItem key={f.name} index={i}>
              <div className="group bg-[var(--color-surface)] border border-[var(--color-border)] p-8 h-full transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-[0_0_30px_rgba(0,179,166,0.05)] rounded-2xl cursor-default">
                <div className="text-[var(--color-accent)] mb-6 bg-[var(--color-accent-dim)] w-12 h-12 flex items-center justify-center rounded-xl">
                  <f.Icon size={24} />
                </div>
                <h3 className="text-[var(--color-text)] font-bold text-lg mb-3 uppercase tracking-tight">{f.name}</h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  )
}
