import React from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { fetchPlans } from '@/lib/plans';
import { PricingCards } from './PricingCards';

export async function Pricing() {
  const plans = await fetchPlans();
  if (plans.length === 0) return null;

  return (
    <section id="pricing" className="py-24 px-4 bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-12">
          <h2 className="font-display text-[var(--color-text)] mb-2 uppercase" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            SIMPLE PRICING.
          </h2>
          <p className="text-[var(--color-muted)] text-base font-light">Start free. Scale as you grow.</p>
        </AnimatedSection>

        <PricingCards plans={plans} />
      </div>
    </section>
  );
}
