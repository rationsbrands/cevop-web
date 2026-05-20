'use client'
import { useState, useEffect } from 'react'
import { DEFAULT_PLANS } from '@/components/sections/Pricing'

interface Feature { text: string; included: boolean }
interface Plan {
  id: string
  name: string
  tagline: string
  price_ngn: string
  price_gbp: string
  price_suffix: string
  is_popular: boolean
  is_highlighted: boolean
  cta_text: string
  cta_variant: 'primary' | 'secondary'
  features: Feature[]
}

export default function PricingEditor() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { loadPlans() }, [])

  async function loadPlans() {
    try {
      const res = await fetch('/api/admin/pricing')
      const { data } = await res.json()
      if (data) setPlans(data)
    } catch {}
    setLoaded(true)
  }

  async function handleSave(plan: Plan) {
    setLoading(plan.id)
    const res = await fetch(`/api/admin/pricing/${plan.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    })
    if (!res.ok) {
      alert('Failed to save plan. Please try again.')
    }
    await loadPlans()
    setLoading(null)
  }

  async function seedDefaultPlans() {
    setSeeding(true)
    let failed = false
    for (let i = 0; i < DEFAULT_PLANS.length; i++) {
      const p = DEFAULT_PLANS[i]
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: p.name,
          tagline: p.tagline,
          price_ngn: p.priceNGN,
          price_gbp: p.priceGBP,
          price_suffix: p.priceSuffix,
          is_popular: p.popular,
          is_highlighted: p.highlight,
          cta_text: p.cta,
          cta_variant: p.ctaVariant,
          features: p.features,
          sort_order: i,
        }),
      })
      if (!res.ok) failed = true
    }
    if (failed) alert('Some default plans failed to publish.')
    await loadPlans()
    setSeeding(false)
  }

  function updatePlan(index: number, changes: Partial<Plan>) {
    const newPlans = [...plans]
    newPlans[index] = { ...newPlans[index], ...changes }
    setPlans(newPlans)
  }

  function handleFeaturesChange(index: number, text: string) {
    const features = text.split('\n').filter(l => l.trim()).map(line => ({ text: line.trim(), included: true }))
    updatePlan(index, { features })
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
          <h1 className="font-display text-2xl text-[var(--color-text)] uppercase">Pricing Plans</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Manage plans and features</p>
        </div>
      </div>

      {plans.length === 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 mb-6 flex items-center justify-between gap-6">
          <p className="text-sm text-[var(--color-muted)]">
            No pricing plans found in the database. The website will show the built-in defaults until you publish plans.
          </p>
          <button
            onClick={seedDefaultPlans}
            disabled={seeding}
            className="bg-[var(--color-accent)] text-black font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50"
          >
            {seeding ? 'Publishing...' : 'Publish Default Plans'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {plans.map((plan, i) => (
          <div key={plan.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)]">
              <h3 className="font-bold text-[var(--color-text)] uppercase tracking-wider">{plan.name}</h3>
              <button onClick={() => handleSave(plan)} disabled={loading === plan.id} className="bg-[var(--color-accent)] text-black px-4 py-1.5 rounded text-xs font-bold disabled:opacity-50">
                {loading === plan.id ? 'Saving...' : 'Save Plan'}
              </button>
            </div>
            
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={plan.name} onChange={e => updatePlan(i, { name: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              <input type="text" placeholder="Tagline" value={plan.tagline} onChange={e => updatePlan(i, { tagline: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              
              <div className="grid grid-cols-3 gap-3">
                <input type="text" placeholder="Price NGN" value={plan.price_ngn} onChange={e => updatePlan(i, { price_ngn: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <input type="text" placeholder="Price GBP" value={plan.price_gbp} onChange={e => updatePlan(i, { price_gbp: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <input type="text" placeholder="Suffix" value={plan.price_suffix} onChange={e => updatePlan(i, { price_suffix: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="CTA Text" value={plan.cta_text} onChange={e => updatePlan(i, { cta_text: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <select value={plan.cta_variant} onChange={e => updatePlan(i, { cta_variant: e.target.value as 'primary'|'secondary' })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm">
                  <option value="primary">Primary Variant</option>
                  <option value="secondary">Secondary Variant</option>
                </select>
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                  <input type="checkbox" checked={plan.is_popular} onChange={e => updatePlan(i, { is_popular: e.target.checked })} /> Popular Badge
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                  <input type="checkbox" checked={plan.is_highlighted} onChange={e => updatePlan(i, { is_highlighted: e.target.checked })} /> Highlight Card
                </label>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-1">Features (One per line)</label>
                <textarea 
                  value={plan.features.map(f => f.text).join('\n')}
                  onChange={e => handleFeaturesChange(i, e.target.value)}
                  className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] min-h-[120px] resize-none text-sm font-mono" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
