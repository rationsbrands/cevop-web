'use client';

import React, { useMemo, useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPlanPrice, Plan } from '@/lib/plans'; 
import { CurrencyToggle } from '../ui/CurrencyToggle';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

type Billing = 'monthly' | 'annual'

function getSavingLines( 
  plan: Plan, 
  currency: ReturnType<typeof useCurrency>['currency'], 
  billing: Billing 
): { annualMessage: string; monthlySavingMessage: string } { 
  const monthly = plan.prices[currency].monthly; 
  const annual  = plan.prices[currency].annual; 
  if (!monthly || monthly === 0 || annual === null) { 
    return { annualMessage: '', monthlySavingMessage: '' }; 
  } 
  const saving = Math.round(monthly * 12 - annual); 
  if (saving <= 0) return { annualMessage: '', monthlySavingMessage: '' }; 
  const sym = 
    currency === 'NGN' ? '₦' : 
    currency === 'GBP' ? '£' : 
    currency === 'EUR' ? '€' : '$'; 
  return { 
    annualMessage: '2 months free', 
    monthlySavingMessage: `Save ${sym}${saving.toLocaleString()}/year on annual`, 
  }; 
} 

function PlanCard({ plan, billing, index }: { plan: Plan; billing: Billing; index: number }) {
  const { currency } = useCurrency();
  const priceValue = plan.prices[currency][billing];
  const isFixed = priceValue === null || priceValue === 0;
  const priceString = useMemo(() => formatPlanPrice(priceValue, currency), [currency, priceValue]);
  const { annualMessage, monthlySavingMessage } = useMemo( 
    () => getSavingLines(plan, currency, billing), 
    [plan, currency, billing] 
  ); 

  const ctaVariant = plan.highlighted ? 'primary' : 'secondary';
  const timezoneParam = 
    currency === 'GBP'    ? 'Europe%2FLondon'     : 
    currency === 'EUR'    ? 'Europe%2FParis'       : 
    currency === 'USD'    ? 'America%2FNew_York'   : 
    'Africa%2FLagos'; 
  const ctaLink = plan.id === 'enterprise' 
    ? '/contact' 
    : `https://app.cevop.com/signup?currency=${currency}&plan=${plan.id}&timezone=${timezoneParam}`; 

  return (
    <AnimatedItem index={index}>
      <div
        className={`relative flex flex-col h-full bg-[var(--color-surface)] p-10 transition-all duration-300 rounded-[32px] ${
          plan.highlighted
            ? 'border-2 border-[var(--color-accent)] shadow-[0_0_40px_rgba(0,179,166,0.1)]'
            : 'border border-[var(--color-border)] hover:border-[var(--color-accent)]/30'
        }`}
      >
        {plan.highlighted && (
          <div className="absolute -top-3 right-4">
            <span className="bg-[var(--color-accent)] text-black text-[10px] font-bold tracking-wider px-2 py-1 uppercase">
              Most Popular
            </span>
          </div>
        )}

        <div className="mb-5">
          <h3 className="font-display text-xl text-[var(--color-text)] tracking-wider mb-1 uppercase">{plan.name}</h3>
          <p className="text-xs text-[var(--color-muted)] leading-snug">{plan.description}</p>
        </div>

        <div className="mb-5">
          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${plan.id}-${currency}-${billing}-${priceString}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="font-display text-3xl text-[var(--color-text)] leading-none"
              >
                {priceString}
              </motion.span>
            </AnimatePresence>
            {!isFixed && <span className="text-xs text-[var(--color-muted)]">/ mo</span>}
          </div>
          {!isFixed && (
            <p className="text-[10px] text-[var(--color-muted)] mt-1">
              {billing === 'annual' ? 'Billed annually. Cancel anytime.' : 'Billed monthly. Cancel anytime.'}
            </p>
          )}
          {billing === 'annual' && annualMessage && ( 
            <p className="text-[10px] text-[var(--color-accent)] mt-1 font-bold">{annualMessage}</p> 
          )} 
          {billing === 'monthly' && monthlySavingMessage && ( 
            <p className="text-[10px] text-[var(--color-accent)] mt-1 font-bold">{monthlySavingMessage}</p> 
          )} 
          {plan.roiLine && (
            <p className="text-[10px] text-[var(--color-muted)] mt-2 leading-relaxed italic">{plan.roiLine}</p>
          )}
        </div>

        <div className="h-px bg-[var(--color-border)] mb-5" />

        <ul className="space-y-2.5 flex-1 mb-6">
          {plan.features.map((f) => ( 
            <li key={f} className="flex items-start gap-2">
              <span className="text-[var(--color-accent)] shrink-0 mt-0.5">
                <CheckIcon />
              </span>
              <span className="text-xs text-[var(--color-muted)]">{f}</span>
            </li>
          ))}
        </ul>

        <Button
          href={ctaLink}
          variant={ctaVariant}
          size="md"
          className="w-full"
        >
          {plan.cta}
        </Button>
      </div>
    </AnimatedItem>
  );
}

export function PricingCards({ plans }: { plans: Plan[] }) {
  const [billing, setBilling] = useState<Billing>('annual')
  const [billingOpen, setBillingOpen] = useState(false)
  const billingRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!billingOpen) return
    function onDown(e: MouseEvent) {
      if (!billingRef.current) return
      if (!billingRef.current.contains(e.target as Node)) setBillingOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [billingOpen])

  return (
    <>
      <AnimatedSection className="mb-8" delay={0.1}>
        <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-start">
          <CurrencyToggle />
          <div ref={billingRef} className="relative inline-flex items-center">
            <button
              type="button"
              onClick={() => setBillingOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setBillingOpen(false)
              }}
              aria-haspopup="listbox"
              aria-expanded={billingOpen}
              className="inline-flex items-center gap-2 bg-[var(--color-surface2)] border border-[var(--color-border)] p-1 rounded-full transition-all duration-150"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-wider rounded-full bg-[var(--color-accent)] text-black">
                {billing === 'annual' ? 'Annual' : 'Monthly'}
                <span className={`text-black/70 transition-transform duration-150 ${billingOpen ? 'rotate-180' : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </span>
            </button>

            {billingOpen && (
              <div
                role="listbox"
                className="absolute top-full mt-2 left-0 min-w-[200px] bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-2xl p-1 shadow-[0_12px_40px_rgba(0,0,0,0.35)] z-50"
              >
                {(['annual', 'monthly'] as Billing[]).map((b) => {
                  const selected = b === billing
                  return (
                    <button
                      key={b}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setBilling(b)
                        setBillingOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-colors duration-150 ${
                        selected
                          ? 'bg-[var(--color-accent)] text-black'
                          : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {b === 'annual' ? 'Annual' : 'Monthly'}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} index={i} />
        ))}
      </div>

      <AnimatedSection className="mt-8" delay={0.2}>
        <p className="text-center text-xs text-[var(--color-muted)]">
          Less than 1% of your monthly revenue. No per-order fees. No transaction cuts.
        </p>
      </AnimatedSection>
    </>
  );
}
