'use client'
import { useState, useEffect } from 'react'

const DEFAULT_HERO = {
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
  footnote: 'Free forever · No credit card required · Live in 10 minutes',
}

interface FieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  multiline?: boolean
}

function Field({ label, value, onChange, multiline = false }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 min-h-[80px] resize-none text-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 text-sm"
        />
      )}
    </div>
  )
}

export default function HeroEditor() {
  const [data, setData] = useState(DEFAULT_HERO)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/hero').then(r => r.json()).then(({ data: d }) => {
      if (d) setData((prev) => ({ ...prev, ...d }))
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/admin/content/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (!res.ok) {
      alert('Failed to save changes. Please try again.')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!loaded) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[var(--color-muted)] text-sm">Loading...</p>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-text)] uppercase">Hero Section</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Edit the homepage hero content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--color-accent)] text-black font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
        <Field
          label="Badge Text"
          value={data.badge}
          onChange={val => setData(prev => ({ ...prev, badge: val }))}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field
            label="Headline Line 1"
            value={data.headline_line1}
            onChange={val => setData(prev => ({ ...prev, headline_line1: val }))}
          />
          <Field
            label="Headline Line 2"
            value={data.headline_line2}
            onChange={val => setData(prev => ({ ...prev, headline_line2: val }))}
          />
          <Field
            label="Headline Accent (teal)"
            value={data.headline_accent}
            onChange={val => setData(prev => ({ ...prev, headline_accent: val }))}
          />
        </div>
        <Field
          label="Subtext"
          value={data.subtext}
          onChange={val => setData(prev => ({ ...prev, subtext: val }))}
          multiline
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-5">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm text-[var(--color-text)] mb-2 font-bold">
              <input type="checkbox" checked={data.show_primary_cta !== false} onChange={e => setData(prev => ({ ...prev, show_primary_cta: e.target.checked }))} /> Show Primary CTA
            </label>
            <Field label="Primary CTA Text" value={data.cta_primary_text} onChange={val => setData(prev => ({ ...prev, cta_primary_text: val }))} />
            <Field label="Primary CTA Link" value={data.cta_primary_href} onChange={val => setData(prev => ({ ...prev, cta_primary_href: val }))} />
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm text-[var(--color-text)] mb-2 font-bold">
              <input type="checkbox" checked={data.show_secondary_cta !== false} onChange={e => setData(prev => ({ ...prev, show_secondary_cta: e.target.checked }))} /> Show Secondary CTA
            </label>
            <Field label="Secondary CTA Text" value={data.cta_secondary_text} onChange={val => setData(prev => ({ ...prev, cta_secondary_text: val }))} />
            <Field label="Secondary CTA Link" value={data.cta_secondary_href} onChange={val => setData(prev => ({ ...prev, cta_secondary_href: val }))} />
          </div>
        </div>
        <Field
          label="Footnote Text"
          value={data.footnote}
          onChange={val => setData(prev => ({ ...prev, footnote: val }))}
        />
      </div>
    </div>
  )
}
