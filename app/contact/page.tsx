'use client'
import React, { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', restaurantName: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              <AnimatedSection>
                <span className="text-[var(--color-accent)] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                  Get in Touch
                </span>
                <h1 className="font-display text-[var(--color-text)] mb-8 leading-[1.1] uppercase" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '-0.02em' }}>
                  Ready to <br /><span className="text-[var(--color-accent)]">modernise</span> your kitchen?
                </h1>
                <p className="text-[var(--color-muted)] text-xl leading-relaxed mb-12">
                  Book a 15-minute demo to see how Cevop can help you grow sales and protect your margins.
                </p>
                
                <div className="space-y-8">
                  <div>
                    <p className="text-[var(--color-text)] font-bold text-sm uppercase mb-2 tracking-widest">Email Us</p>
                    <a href="mailto:hello@cevop.com" className="text-2xl font-medium text-[var(--color-accent)] hover:opacity-70 transition-all">hello@cevop.com</a>
                  </div>
                  <div>
                    <p className="text-[var(--color-text)] font-bold text-sm uppercase mb-2 tracking-widest">Global Support</p>
                    <p className="text-lg text-[var(--color-muted)]">Available 24/7 for all active branches.</p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[40px] p-10 lg:p-12 shadow-2xl">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] px-1">First Name</label>
                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-all" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] px-1">Last Name</label>
                        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-all" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] px-1">Work Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-all" placeholder="john@restaurant.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] px-1">Restaurant Name</label>
                      <input type="text" name="restaurantName" value={form.restaurantName} onChange={handleChange} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-all" placeholder="Bistro 24" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] px-1">How can we help?</label>
                      <textarea name="message" value={form.message} onChange={handleChange} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-all min-h-[120px] resize-none" placeholder="Tell us about your restaurant..."></textarea>
                    </div>
                    <Button variant="primary" size="lg" className="w-full rounded-full py-5 text-base shadow-[0_20px_40px_rgba(0,179,166,0.15)]" type="submit" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Sending...' : 'Request a Demo'}
                    </Button>
                    {status === 'success' && (
                      <p className="text-center text-sm text-[var(--color-accent)] mt-4">
                        ✓ Message sent! We'll be in touch within one business day.
                      </p>
                    )}
                    {status === 'error' && (
                      <p className="text-center text-sm text-red-500 mt-4">
                        {errorMsg || 'Something went wrong. Please email us directly at hello@cevop.com'}
                      </p>
                    )}
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
