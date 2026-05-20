'use client'
import React, { useState } from 'react'
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

type Currency = 'NGN' | 'GBP'

interface Feature { text: string; included: boolean }
interface Plan {
  name: string
  tagline: string
  priceNGN: string
  priceGBP: string
  priceSuffix: string
  popular: boolean
  cta: string
  ctaVariant: 'primary' | 'secondary'
  features: Feature[]
  highlight: boolean
}

export const DEFAULT_PLANS: Plan[] = [
  {
    name: 'FREE',
    tagline: 'Start for free. No time limit.',
    priceNGN: 'Free',
    priceGBP: 'Free',
    priceSuffix: 'forever',
    popular: false,
    cta: 'Start for Free',
    ctaVariant: 'secondary',
    highlight: false,
    features: [
      { text: '1 branch', included: true },
      { text: 'Up to 5 tables', included: true },
      { text: 'Up to 3 staff accounts', included: true },
      { text: 'QR menus & service display', included: true },
      { text: 'Waiter calls & service requests', included: true },
      { text: 'No credit card required', included: true },
    ],
  },
  {
    name: 'STARTER',
    tagline: 'Everything a single location needs.',
    priceNGN: '₦25,000',
    priceGBP: '£15',
    priceSuffix: '/ month',
    popular: false,
    cta: 'Get Started',
    ctaVariant: 'secondary',
    highlight: false,
    features: [
      { text: '1 branch', included: true },
      { text: 'Up to 20 tables', included: true },
      { text: 'Up to 5 staff accounts', included: true },
      { text: 'QR menus & service display', included: true },
      { text: 'Waiter calls & service requests', included: true },
    ],
  },
  {
    name: 'GROWTH',
    tagline: 'For restaurants expanding to multiple sites.',
    priceNGN: '₦65,000',
    priceGBP: '£40',
    priceSuffix: '/ month',
    popular: true,
    cta: 'Get Started',
    ctaVariant: 'primary',
    highlight: true,
    features: [
      { text: 'Up to 5 branches', included: true },
      { text: 'Up to 100 tables across all branches', included: true },
      { text: 'Unlimited staff accounts', included: true },
      { text: 'Multi-branch dashboard', included: true },
      { text: 'Priority support', included: true },
    ],
  },
  {
    name: 'ENTERPRISE',
    tagline: 'Custom deployment for large groups.',
    priceNGN: 'Custom',
    priceGBP: 'Custom',
    priceSuffix: '',
    popular: false,
    cta: 'Contact Us',
    ctaVariant: 'secondary',
    highlight: false,
    features: [
      { text: 'Unlimited branches', included: true },
      { text: 'Unlimited tables', included: true },
      { text: 'Unlimited staff accounts', included: true },
      { text: 'Custom onboarding & SLA', included: true },
      { text: 'API access & integrations', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
  },
]

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PlanCard({ plan, currency, index }: { plan: Plan; currency: Currency; index: number }) {
  const price = currency === 'NGN' ? plan.priceNGN : plan.priceGBP
  const isFixed = price === 'Free' || price === 'Custom'

  return (
    <AnimatedItem index={index}>
      <div
        className={`relative flex flex-col h-full bg-[var(--color-surface)] p-10 transition-all duration-300 rounded-[32px] ${
          plan.highlight
            ? 'border-2 border-[var(--color-accent)] shadow-[0_0_40px_rgba(0,179,166,0.1)]'
            : 'border border-[var(--color-border)] hover:border-[var(--color-accent)]/30'
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-3 right-4">
            <span className="bg-[var(--color-accent)] text-black text-[10px] font-bold tracking-wider px-2 py-1 uppercase">
              Most Popular
            </span>
          </div>
        )}

        <div className="mb-5">
          <h3 className="font-display text-xl text-[var(--color-text)] tracking-wider mb-1 uppercase">{plan.name}</h3>
          <p className="text-xs text-[var(--color-muted)] leading-snug">{plan.tagline}</p>
        </div>

        <div className="mb-5">
          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${plan.name}-${currency}-${price}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="font-display text-3xl text-[var(--color-text)] leading-none"
              >
                {price}
              </motion.span>
            </AnimatePresence>
            {plan.priceSuffix && (
              <span className="text-xs text-[var(--color-muted)]">{plan.priceSuffix}</span>
            )}
          </div>
          {!isFixed && (
            <p className="text-[10px] text-[var(--color-muted)] mt-1">Billed monthly. Cancel anytime.</p>
          )}
        </div>

        <div className="h-px bg-[var(--color-border)] mb-5" />

        <ul className="space-y-2.5 flex-1 mb-6">
          {plan.features.map((f) => (
            <li key={f.text} className="flex items-start gap-2">
              <span className="text-[var(--color-accent)] shrink-0 mt-0.5">
                <CheckIcon />
              </span>
              <span className="text-xs text-[var(--color-muted)]">{f.text}</span>
            </li>
          ))}
        </ul>

        <Button
          href={
            plan.cta === 'Contact Us'
              ? '/contact'
              : plan.name === 'FREE'
              ? 'https://app.cevop.com/signup'
              : `https://app.cevop.com/signup?plan=${plan.name.toLowerCase()}`
          }
          variant={plan.ctaVariant}
          size="md"
          className="w-full"
        >
          {plan.cta}
        </Button>
      </div>
    </AnimatedItem>
  )
}

export function Pricing({ plans }: { plans?: any[] }) {
  const [currency, setCurrency] = useState<Currency>('NGN')
  
  const displayPlans = plans && plans.length > 0 
    ? plans.map(p => ({
        name: p.name,
        tagline: p.tagline,
        priceNGN: p.price_ngn,
        priceGBP: p.price_gbp,
        priceSuffix: p.price_suffix,
        popular: p.is_popular,
        cta: p.cta_text,
        ctaVariant: p.cta_variant,
        highlight: p.is_highlighted,
        features: p.features
      }))
    : DEFAULT_PLANS

  return (
    <section id="pricing" className="py-24 px-4 bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-12">
          <h2 className="font-display text-[var(--color-text)] mb-2 uppercase" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            SIMPLE PRICING.
          </h2>
          <p className="text-[var(--color-muted)] text-base font-light">Start free. Scale as you grow.</p>
        </AnimatedSection>

        {/* Currency toggle */}
        <AnimatedSection className="mb-10" delay={0.1}>
          <div className="flex items-center gap-1 bg-[var(--color-surface2)] border border-[var(--color-border)] p-1 w-fit rounded">
            {(['NGN', 'GBP'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-4 py-1.5 text-xs font-bold tracking-wider transition-all duration-150 rounded-sm ${
                  currency === c
                    ? 'bg-[var(--color-accent)] text-black'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {c === 'NGN' ? '₦ NGN' : '£ GBP'}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayPlans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} currency={currency} index={i} />
          ))}
        </div>

        <AnimatedSection className="mt-8" delay={0.2}>
          <p className="text-center text-xs text-[var(--color-muted)]">
            Start free now. No payment required, no time limit.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
