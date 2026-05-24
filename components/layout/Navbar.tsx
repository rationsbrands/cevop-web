'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CurrencyToggle } from '@/components/ui/CurrencyToggle'
import { IconMenu, IconX, IconChevronDown, LogoMark } from '@/components/icons'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase'

interface NavLink {
  label: string
  href: string
  items?: { label: string; href: string; desc: string }[]
}

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { 
    label: 'Platform', 
    href: '/product',
    items: [
      { label: 'QR Ordering', href: '/product#qr', desc: 'Contactless ordering for tables.' },
      { label: 'Service Display', href: '/product#kds', desc: 'Digital order management for chefs.' },
      { label: 'Admin Dashboard', href: '/product#admin', desc: 'Real-time sales and staff tracking.' },
    ]
  },
  { 
    label: 'Solutions', 
    href: '/solutions',
    items: [
      { label: 'Grow Sales', href: '/solutions#sales', desc: 'Increase basket size and repeat visits.' },
      { label: 'Protect Margin', href: '/solutions#margin', desc: 'Catch cost changes and stop leaks.' },
      { label: 'Optimize Labor', href: '/solutions#labor', desc: 'Get more done with the same team.' },
    ]
  },
  { 
    label: 'Resources', 
    href: '/customers',
    items: [
      { label: 'Success Stories', href: '/customers', desc: 'How independent restaurants win.' },
      { label: 'FAQ', href: '/#faq', desc: 'Common questions and answers.' },
    ]
  },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/about' },
]

function NavDropdown({ link, scrolled }: { link: NavLink; scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={link.href}
        className="flex items-center gap-1 text-[15px] font-medium text-[var(--color-text)] hover:opacity-70 transition-all py-4"
      >
        {link.label}
        {link.items && <IconChevronDown size={14} className={`opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
      </Link>

      <AnimatePresence>
        {isOpen && link.items && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 w-[280px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 shadow-2xl mt-[-8px]"
          >
            <div className="space-y-1">
              {link.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block p-3 rounded-xl hover:bg-[var(--color-surface2)] transition-colors group"
                >
                  <p className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-0.5">{item.label}</p>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar({ navData }: { navData?: any }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [runtimeNavData, setRuntimeNavData] = useState<any>(navData)

  useEffect(() => {
    setRuntimeNavData(navData)
  }, [navData])

  useEffect(() => {
    if (navData) return
    let cancelled = false
    ;(async () => {
      try {
        const supabase = getSupabaseClient()
        const { data } = await supabase.from('site_content').select('value').eq('key', 'nav').maybeSingle()
        if (!cancelled) setRuntimeNavData(data?.value ?? undefined)
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [navData])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const id = href.split('#')[1]
      const element = document.getElementById(id)
      if (element) {
        e.preventDefault()
        const offset = 80
        const bodyRect = document.body.getBoundingClientRect().top
        const elementRect = element.getBoundingClientRect().top
        const elementPosition = elementRect - bodyRect
        const offsetPosition = elementPosition - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    }
    setMobileOpen(false)
  }

  const dynamicNavLinks = [...DEFAULT_NAV_LINKS]
  if (runtimeNavData?.blog_url) {
    dynamicNavLinks.push({ label: 'Blog', href: runtimeNavData.blog_url })
  }
  const loginUrl = runtimeNavData?.login_url || 'https://app.cevop.com/login'

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[var(--color-bg)]/95 lg:bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]' 
            : 'bg-[var(--color-bg)] backdrop-blur-md border-b border-[var(--color-border)] lg:bg-[var(--color-bg)]/50 lg:backdrop-blur-md lg:border-b-0'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 grid grid-cols-[auto_1fr_auto] items-center">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group shrink-0 py-4">
              <LogoMark size={28} className="text-[var(--color-text)] group-hover:opacity-80 transition-opacity" />
              <span className="font-display text-2xl text-[var(--color-text)]">Cevop</span>
            </Link>
          </div>

          {/* Center: Desktop nav */}
          <div className="hidden lg:flex items-center justify-center h-full">
            <nav className="flex items-center gap-8 h-full">
              {dynamicNavLinks.map((link) => (
                <NavDropdown key={link.label} link={link} scrolled={scrolled} />
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center justify-end gap-3 sm:gap-8 h-full">
            <div className="hidden lg:flex items-center gap-8">
              <CurrencyToggle />
              <Link href={loginUrl} className="text-[15px] font-bold text-[var(--color-text)] hover:opacity-70 transition-all">
                Log In
              </Link>
              <Button href="/contact" variant="primary" size="md" className="rounded-full !px-8 !py-3">
                Book A Demo
              </Button>
            </div>
            <div className="flex items-center h-full">
              <ThemeToggle />
            </div>
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center text-[var(--color-text)]"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute right-0 top-0 h-full w-[min(420px,85vw)] bg-[var(--color-bg)] border-l border-[var(--color-border)] flex flex-col p-6"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <LogoMark size={28} className="text-[var(--color-text)]" />
                  <span className="font-display text-2xl text-[var(--color-text)]">Cevop</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-[var(--color-text)] border border-[var(--color-border)] rounded-full"
                  aria-label="Close menu"
                >
                  <IconX size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-6 flex-1 overflow-y-auto">
                {dynamicNavLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="space-y-4"
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="flex items-center justify-between font-display text-3xl text-[var(--color-text)] hover:opacity-70 transition-all uppercase"
                    >
                      {link.label}
                    </Link>
                    {link.items && (
                      <div className="grid grid-cols-1 gap-3 pl-4 border-l border-[var(--color-border)]">
                        {link.items.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className="text-lg font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="mt-8 space-y-4">
                <div className="flex justify-center pb-2">
                  <CurrencyToggle />
                </div>
                <Button
                  href="/contact"
                  variant="primary"
                  size="lg"
                  className="w-full rounded-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Book A Demo
                </Button>
                <Link
                  href={loginUrl}
                  className="block text-center text-[15px] font-bold text-[var(--color-text)] py-4 border border-[var(--color-border)] rounded-full"
                >
                  Log In
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
