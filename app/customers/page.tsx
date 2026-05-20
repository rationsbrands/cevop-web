'use client'
import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection'

const stories = [
  {
    name: 'The Market at Edgewood',
    location: 'Palo Alto, CA',
    stat: '+7%',
    statDesc: 'gross margin improvement',
    quote: 'You should try Cevop if you want to make some money.',
    author: 'Navi, Owner',
    color: 'bg-[var(--color-accent)]',
  },
  {
    name: 'Talin Market',
    location: 'Albuquerque, NM',
    stat: '-67%',
    statDesc: 'less time ordering product per week',
    quote: 'Produce orders used to take me 2 to 3 hours to do…now it can be done in less than 1 hour.',
    author: 'Victor, Director of Operations',
    color: 'bg-blue-500',
  },
  {
    name: 'Valley Farm Market',
    location: 'Spring Valley, CA',
    stat: '+22%',
    statDesc: 'increase in net sales',
    quote: 'When you see something, you can pivot. And with Cevop, we can pivot fast.',
    author: 'Derek, Owner',
    color: 'bg-amber-500',
  }
]

export default function CustomersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="mb-20 text-center">
              <span className="text-[var(--color-accent)] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                Customer Stories
              </span>
              <h1 className="font-display text-[var(--color-text)] mb-8 leading-[1.1] uppercase" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '-0.02em' }}>
                Independent by choice. <br /><span className="text-[var(--color-accent)]">Unstoppable</span> by design.
              </h1>
              <p className="text-[var(--color-muted)] text-xl max-w-2xl mx-auto leading-relaxed">
                See how restaurants across the country are using Cevop to reclaim their time and grow their margins.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((s, i) => (
                <AnimatedItem key={s.name} index={i}>
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 h-full flex flex-col hover:border-[var(--color-accent)]/30 transition-all duration-300">
                    <div className="flex-1">
                      <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-8 ${s.color}`}>
                        {s.name}
                      </div>
                      <div className="mb-8">
                        <p className="font-display text-5xl text-[var(--color-text)] mb-1">{s.stat}</p>
                        <p className="text-[var(--color-muted)] text-sm font-bold uppercase tracking-widest">{s.statDesc}</p>
                      </div>
                      <blockquote className="font-serif italic text-xl text-[var(--color-text)] leading-relaxed mb-8">
                        &ldquo;{s.quote}&rdquo;
                      </blockquote>
                    </div>
                    <div className="pt-8 border-t border-[var(--color-border)]">
                      <p className="text-[var(--color-text)] font-bold text-sm uppercase mb-1">{s.author}</p>
                      <p className="text-[var(--color-muted)] text-xs uppercase tracking-widest">{s.location}</p>
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </div>

            <AnimatedSection className="mt-32 text-center">
              <h2 className="font-display text-4xl text-[var(--color-text)] mb-10 uppercase">Trusted by leading restaurants</h2>
              <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {['RATIONS', 'BISTRO 24', 'THE PEARL', 'KASADA', 'NOURISH', 'SAVOR'].map((name) => (
                  <span key={name} className="font-display text-3xl text-[var(--color-text)] tracking-widest uppercase">{name}</span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
