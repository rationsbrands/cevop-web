'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCurrency } from '@/context/CurrencyContext';
import { SupportedCurrency } from '@/lib/currency';

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const options = useMemo<{ value: SupportedCurrency; label: string }[]>(
    () => [
      { value: 'NGN', label: '₦ NGN' },
      { value: 'GBP', label: '£ GBP' },
      { value: 'USD', label: '$ USD' },
      { value: 'Africa', label: '$ Africa' },
    ],
    []
  )
  const currentLabel = useMemo(() => options.find((o) => o.value === currency)?.label ?? currency, [currency, options])

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 bg-[var(--color-surface2)] border border-[var(--color-border)] p-1 rounded-full transition-all duration-150"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-wider rounded-full bg-[var(--color-accent)] text-black">
          {currentLabel}
          <span className={`text-black/70 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full mt-2 left-0 min-w-[160px] bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-2xl p-1 shadow-[0_12px_40px_rgba(0,0,0,0.35)] z-50"
        >
          {options.map((o) => {
            const selected = o.value === currency
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setCurrency(o.value)
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-colors duration-150 ${
                  selected
                    ? 'bg-[var(--color-accent)] text-black'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}
