'use client'
import { useEffect, useState } from 'react'
import React from 'react'
import Link from 'next/link'
import { LogoMark } from '@/components/icons'
import { getSupabaseClient } from '@/lib/supabase'

export function Footer({ socialData }: { socialData?: any }) {
  const [runtimeSocial, setRuntimeSocial] = useState<any>(socialData)

  useEffect(() => {
    setRuntimeSocial(socialData)
  }, [socialData])

  useEffect(() => {
    if (socialData) return
    let cancelled = false
    ;(async () => {
      try {
        const supabase = getSupabaseClient()
        const { data } = await supabase.from('site_content').select('value').eq('key', 'social').maybeSingle()
        if (!cancelled) setRuntimeSocial(data?.value ?? undefined)
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [socialData])

  const s = runtimeSocial ?? {
    email: 'hello@cevop.com',
    linkedin_url: '',
    twitter_url: ''
  }
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="flex items-center gap-2">
                <LogoMark size={22} className="text-[var(--color-accent)]" />
                <span className="font-display text-lg text-[var(--color-text)]">Cevop</span>
              </Link>
            </div>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed max-w-[220px]">
              Restaurant operations platform. QR ordering, live kitchen display, real-time management.
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-4">
              © {new Date().getFullYear()} Cevop. All rights reserved.
            </p>
          </div>

          {/* Centre: Links */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-4">Product</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Platform', href: '/product' },
                { label: 'Solutions', href: '/solutions' },
                { label: 'Customer Stories', href: '/customers' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-4">Legal</p>
              <ul className="space-y-2.5">
                  <li>
                    <a href="/privacy" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                      Terms of Service
                    </a>
                  </li>
              </ul>
            </div>
          </div>

          {/* Right: Contact */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-4">Get in Touch</p>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${s.email || 'hello@cevop.com'}`} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                  {s.email || 'hello@cevop.com'}
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-[11px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-4">Follow</p>
              <ul className="space-y-2.5">
                {s.linkedin_url && (
                  <li>
                    <a href={s.linkedin_url} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">LinkedIn</a>
                  </li>
                )}
                {s.twitter_url && (
                  <li>
                    <a href={s.twitter_url} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">Twitter (X)</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
