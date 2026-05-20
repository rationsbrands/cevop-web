'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export const DEFAULT_FAQS = [
  {
    q: 'Is there really a free plan with no time limit?',
    a: 'Yes. The Cevop free plan is genuinely free forever — no trial period, no credit card, and no hidden expiry. You get 1 branch, up to 5 tables, and 3 staff accounts. If you want to experience the full Growth plan before subscribing, ask us about a 7-day trial.',
  },
  {
    q: 'Does the customer need to download an app?',
    a: 'No. Cevop works in any mobile browser. Customers scan the QR code and are taken directly to the menu — no download, no account, no friction.',
  },
  {
    q: 'What happens if the internet goes down?',
    a: 'The customer app queues orders locally and syncs the moment the connection returns. Kitchen staff are notified as soon as orders arrive. Nothing is lost.',
  },
  {
    q: 'Can I manage multiple restaurant locations?',
    a: 'Yes. The Growth and Enterprise plans support multiple branches, each fully isolated. Your admin dashboard shows all locations, and branch managers only see their own location.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most restaurants are live within 10 minutes. Create your account, add your menu, generate QR codes, print and place them on tables. That\'s it.',
  },
  {
    q: 'Which currencies are supported?',
    a: 'Cevop supports NGN, GBP, USD, EUR, GHS, KES, ZAR and more. Currency is set per organisation at the point of signup.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All data is isolated per organisation and per branch at the database level — not just in the UI. Tokens are short-lived, hashed, and rotated on every request. Your data cannot be accessed by other tenants.',
  },
]

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`border-b border-[var(--color-border)] transition-all duration-300 ${open ? 'bg-[var(--color-surface2)]/30 px-6' : 'px-0'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left gap-4"
      >
        <span className={`text-base font-bold transition-colors duration-150 uppercase tracking-tight ${open ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}>
          <span className="text-[var(--color-accent)] font-mono text-xs mr-4 opacity-60">
            {String(index + 1).padStart(2, '0')}
          </span>
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="text-[var(--color-muted)] shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="pb-6 text-base text-[var(--color-muted)] leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ({ faqs }: { faqs?: any[] }) {
  const displayFaqs = faqs && faqs.length > 0
    ? faqs.map(f => ({ q: f.question, a: f.answer }))
    : DEFAULT_FAQS

  return (
    <section id="faq" className="py-24 px-4 bg-[var(--color-surface)]">
      <div className="max-w-[720px] mx-auto">
        <AnimatedSection className="mb-12">
          <h2 className="font-display text-[var(--color-text)] mb-2 uppercase" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            COMMON QUESTIONS
          </h2>
          <p className="text-[var(--color-muted)] text-base font-light">Everything you need to know before you start.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div>
            {displayFaqs.map((faq, i) => (
              <FAQItem key={faq.q} faq={faq} index={i} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
