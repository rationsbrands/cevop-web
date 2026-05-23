import React from 'react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function Testimonial({ testimonial, allowFallback = false }: { testimonial?: any; allowFallback?: boolean }) {
  const isProd = process.env.NODE_ENV === 'production'
  const canFallback = !isProd || allowFallback
  if (!canFallback && !testimonial) return null

  const t = testimonial ?? {
    quote: 'We used to lose orders every Friday night. Now Service is faster, staff are calmer, and customers actually come back.',
    author_name: 'Restaurant Owner',
    author_location: 'Lagos, Nigeria',
  }

  return (
    <section className="py-24 px-4 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <span
            className="font-display text-[var(--color-accent)] block mb-2 leading-none select-none"
            style={{ fontSize: 120, opacity: 0.25, lineHeight: 1 }}
            aria-hidden
          >
            &ldquo;
          </span>
          <blockquote className="font-serif italic text-[var(--color-text)] leading-relaxed mb-6" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.35rem)' }}>
            {t.quote}
          </blockquote>
          <p className="text-xs text-[var(--color-muted)] font-medium tracking-widest uppercase">
            — {t.author_name} · {t.author_location}
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
