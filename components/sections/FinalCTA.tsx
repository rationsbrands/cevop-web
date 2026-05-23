import React from 'react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'

export function FinalCTA({ email }: { email?: string }) {
  return (
    <section className="py-32 px-4 bg-[var(--color-bg)] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <h2
            className="font-display text-[var(--color-text)] mb-8 leading-[1.1] uppercase"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            Launch new locations <br /><span className="text-[var(--color-accent)]">with confidence.</span>
          </h2>
          <p className="text-[var(--color-muted)] text-xl mb-12 font-medium max-w-2xl mx-auto">
            When your restaurant runs on a strong foundation, expansion becomes inevitable.
            Cevop standardises your operations so growth doesn&apos;t multiply stress.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Button href="https://app.cevop.com/signup?currency=NGN" variant="primary" size="lg">
              Start Free Trial
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Book a Demo
            </Button>
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            No credit card required &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Setup in 10 minutes
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
