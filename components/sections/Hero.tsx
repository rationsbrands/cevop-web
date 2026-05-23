'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

function QRScanVisual() {
  const [phase, setPhase] = useState<'scan' | 'card' | 'fade'>('scan')

  useEffect(() => {
    const cycle = () => {
      setPhase('scan')
      setTimeout(() => setPhase('card'), 2800)
      setTimeout(() => setPhase('fade'), 5200)
      setTimeout(() => setPhase('scan'), 6000)
    }
    cycle()
    const id = setInterval(cycle, 6200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center h-full min-h-[420px]">
      {/* Phone frame */}
      <div className="relative" style={{ width: 220, height: 380 }}>
        <svg width="220" height="380" viewBox="0 0 220 380" fill="none">
          {/* Phone body */}
          <rect x="2" y="2" width="216" height="376" rx="28" stroke="var(--color-border)" strokeWidth="2" fill="var(--color-surface)" />
          {/* Screen area */}
          <rect x="12" y="40" width="196" height="290" fill="var(--color-surface2)" />
          {/* Notch */}
          <rect x="75" y="10" width="70" height="16" rx="8" fill="var(--color-surface2)" />
          {/* Home indicator */}
          <rect x="85" y="358" width="50" height="4" rx="2" fill="var(--color-border)" />
        </svg>

        {/* Screen content */}
        <div className="absolute top-[40px] left-[12px] right-[12px] h-[290px] overflow-hidden bg-[var(--color-surface2)] p-3">
          {/* Status bar */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-[8px] font-bold text-[var(--color-muted)] font-mono">9:41</span>
            <span className="text-[8px] text-[var(--color-muted)]">●●●</span>
          </div>

          {/* QR Code area */}
          <AnimatePresence mode="wait">
            {phase === 'scan' && (
              <motion.div
                key="qr"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <p className="text-[8px] text-[var(--color-muted)] mb-2 font-medium tracking-wider uppercase">Scan Table QR</p>
                {/* QR code SVG */}
                <div className="relative" style={{ width: 120, height: 120 }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    {/* Corner squares */}
                    <rect x="8" y="8" width="30" height="30" rx="2" stroke="var(--color-text)" strokeWidth="3" fill="none" />
                    <rect x="13" y="13" width="18" height="18" fill="var(--color-text)" rx="1" />
                    <rect x="82" y="8" width="30" height="30" rx="2" stroke="var(--color-text)" strokeWidth="3" fill="none" />
                    <rect x="87" y="13" width="18" height="18" fill="var(--color-text)" rx="1" />
                    <rect x="8" y="82" width="30" height="30" rx="2" stroke="var(--color-text)" strokeWidth="3" fill="none" />
                    <rect x="13" y="87" width="18" height="18" fill="var(--color-text)" rx="1" />
                    {/* Data modules */}
                    {[
                      [46,8],[54,8],[62,8],[70,8],
                      [46,16],[58,16],[70,16],
                      [50,24],[62,24],
                      [46,32],[54,32],[66,32],[70,32],
                      [46,40],[58,40],[66,40],
                      [82,46],[90,46],[98,46],[106,46],
                      [82,54],[94,54],[106,54],
                      [82,62],[90,62],[98,62],
                      [46,46],[54,46],[62,46],[70,46],
                      [46,54],[58,54],[70,54],
                      [46,62],[50,62],[62,62],[70,62],
                      [46,70],[54,70],[66,70],
                      [82,70],[90,70],[98,70],[106,70],
                      [8,46],[16,46],[24,46],[32,46],
                      [8,54],[20,54],[28,54],
                      [8,62],[16,62],[28,62],
                      [8,70],[20,70],[32,70],
                      [54,82],[66,82],[74,82],[82,82],[90,82],[98,82],[106,82],
                      [54,90],[62,90],[82,90],[98,90],
                      [54,98],[70,98],[78,98],[90,98],[106,98],
                      [54,106],[62,106],[74,106],[82,106],[94,106],[106,106],
                    ].map(([x, y], i) => (
                      <rect key={i} x={x} y={y} width="6" height="6" fill="var(--color-text)" />
                    ))}
                  </svg>
                  {/* Scan line */}
                  <div
                    className="scan-line absolute left-0 right-0 h-[2px] opacity-80"
                    style={{ background: 'var(--color-accent)', position: 'absolute', left: 4, right: 4 }}
                  />
                  {/* Corner brackets */}
                  {[
                    { top: -2, left: -2, borderTop: 2, borderLeft: 2 },
                    { top: -2, right: -2, borderTop: 2, borderRight: 2 },
                    { bottom: -2, left: -2, borderBottom: 2, borderLeft: 2 },
                    { bottom: -2, right: -2, borderBottom: 2, borderRight: 2 },
                  ].map((style, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4"
                      style={{
                        ...style,
                        borderColor: 'var(--color-accent)',
                        borderStyle: 'solid',
                        borderWidth: 0,
                        ...(style.borderTop ? { borderTopWidth: style.borderTop, borderLeftWidth: style.borderLeft ?? style.borderRight } : {}),
                        ...(style.borderBottom ? { borderBottomWidth: style.borderBottom, borderLeftWidth: style.borderLeft ?? style.borderRight } : {}),
                      }}
                    />
                  ))}
                </div>
                <p className="text-[7px] text-[var(--color-muted)] mt-2">Point camera at code</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order card */}
          <AnimatePresence>
            {(phase === 'card' || phase === 'fade') && (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: phase === 'fade' ? 0 : 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-3 flex flex-col"
              >
                {/* Mini menu UI */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold text-[var(--color-text)]">Demo Bistro</span>
                  <span className="text-[8px] text-[var(--color-accent)] font-mono">Table 4</span>
                </div>
                {/* Category pills */}
                <div className="flex gap-1 mb-2">
                  {['Starters', 'Mains', 'Drinks'].map((c, i) => (
                    <span key={c} className={`text-[7px] px-1.5 py-0.5 rounded-sm font-medium ${i === 1 ? 'bg-[var(--color-accent)] text-black' : 'bg-[var(--color-border)] text-[var(--color-muted)]'}`}>
                      {c}
                    </span>
                  ))}
                </div>
                {/* Items */}
                {[
                  { name: 'Suya Burger', price: '₦16,000' },
                  { name: 'Party Jollof', price: '₦14,000' },
                  { name: 'Chapman', price: '₦5,500' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-[var(--color-border)]">
                    <div>
                      <p className="text-[8px] font-semibold text-[var(--color-text)]">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-mono text-[var(--color-accent)]">{item.price}</span>
                      <div className="w-4 h-4 bg-[var(--color-accent)] flex items-center justify-center rounded-sm">
                        <span className="text-black text-[8px] font-bold leading-none">+</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-auto pt-2">
                  <div className="w-full bg-[var(--color-accent)] text-black text-[8px] font-bold text-center py-1.5 rounded-sm">
                    Place Order — ₦35,500
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 border border-[var(--color-border)] rounded opacity-30" />
      <div className="absolute -bottom-4 -left-8 w-16 h-16 border border-[var(--color-accent)] opacity-10 rounded" />
      <div className="absolute top-1/2 -right-12 w-3 h-3 rounded-full bg-[var(--color-accent)] opacity-40 animate-float" />
    </div>
  )
}

export interface HeroData {
  badge: string
  headline_line1: string
  headline_line2: string
  headline_accent: string
  subtext: string
  show_primary_cta?: boolean
  cta_primary_text: string
  cta_primary_href: string
  show_secondary_cta?: boolean
  cta_secondary_text: string
  cta_secondary_href: string
  footnote: string
}

export function Hero({ data, allowFallback = false }: { data?: HeroData | null; allowFallback?: boolean }) {
  const isProd = process.env.NODE_ENV === 'production'
  const canFallback = !isProd || allowFallback
  if (!data && !canFallback) return null

  const d = data ?? {
    badge: 'The full Cevop system',
    headline_line1: 'Restaurant OS',
    headline_line2: 'built to grow',
    headline_accent: 'your sales.',
    subtext: 'Ordering, receiving, pricing, and reporting. All in one place. Designed for how restaurants actually work.',
    show_primary_cta: true,
    cta_primary_text: 'Start for Free',
    cta_primary_href: '#pricing',
    show_secondary_cta: true,
    cta_secondary_text: 'See How It Works',
    cta_secondary_href: '#how-it-works',
    footnote: 'Free · No credit card required · Live in 10 minutes',
  }
  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.15] pointer-events-none" style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full opacity-[0.05] pointer-events-none" style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />

      <div className="relative max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-accent)] bg-[var(--color-accent-dim)] px-4 py-2 rounded-full mb-8">
                {d.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="font-display leading-[1] text-[var(--color-text)] mb-8 uppercase"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', letterSpacing: '-0.02em' }}
            >
              {d.headline_line1}<br />{d.headline_line2}<br /><span className="text-[var(--color-accent)]">{d.headline_accent}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-[var(--color-muted)] text-lg leading-relaxed mb-10 max-w-[520px] mx-auto lg:mx-0 whitespace-pre-wrap"
            >
              {d.subtext}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-5"
            >
              {(d.show_primary_cta !== false) && (
                <Button href={d.cta_primary_href} variant="primary" size="lg">
                  {d.cta_primary_text}
                </Button>
              )}
              {(d.show_secondary_cta !== false) && (
                <Button href={d.cta_secondary_href} variant="secondary" size="lg">
                  {d.cta_secondary_text}
                </Button>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="text-xs text-[var(--color-muted)]"
            >
              {d.footnote}
            </motion.p>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative p-8 rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[0_0_80px_rgba(0,179,166,0.05)]">
              <QRScanVisual />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
