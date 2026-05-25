'use client'
import { useState, useEffect } from 'react'
const DEFAULT_PLANS = [
  {
    name: 'Free',
    tagline: 'Start exploring with no commitment.',
    price_ngn: 0,
    price_ngn_annual: 0,
    price_gbp: 0,
    price_gbp_annual: 0,
    price_eur: 0,
    price_eur_annual: 0,
    price_usd: 0,
    price_usd_annual: 0,
    price_africa: 0,
    price_africa_annual: 0,
    roi_line: null,
    is_active: true,
    is_popular: false,
    is_highlighted: false,
    cta_text: 'Start Free',
    cta_variant: 'secondary' as const,
    features: [
      '1 branch',
      'Up to 5 tables',
      'Up to 3 staff accounts',
      'QR menus & service display',
      'Waiter calls & service requests',
      'Live item availability updates',
      'Basic order flow (RECEIVED to SERVED)',
      '7-day analytics',
      'No credit card required',
    ],
  },
  {
    name: 'Starter',
    tagline: 'Everything a single location needs.',
    price_ngn: 12000,
    price_ngn_annual: 120000,
    price_gbp: 19,
    price_gbp_annual: 190,
    price_eur: 22,
    price_eur_annual: 220,
    price_usd: 25,
    price_usd_annual: 250,
    price_africa: 10,
    price_africa_annual: 100,
    roi_line: 'A 25-table restaurant typically pays this in 2 rounds of missed orders.',
    is_active: true,
    is_popular: false,
    is_highlighted: false,
    cta_text: 'Get Started',
    cta_variant: 'secondary' as const,
    features: [
      '1 branch',
      'Up to 25 tables',
      'Up to 10 staff accounts',
      'QR menus & service display',
      'Waiter calls, service requests & bill requests',
      'Floor sections & auto-assignment',
      '30-day analytics',
      'Cancel anytime',
    ],
  },
  {
    name: 'Growth',
    tagline: 'For restaurants expanding to multiple sites.',
    price_ngn: 30000,
    price_ngn_annual: 300000,
    price_gbp: 55,
    price_gbp_annual: 550,
    price_eur: 60,
    price_eur_annual: 600,
    price_usd: 65,
    price_usd_annual: 650,
    price_africa: 25,
    price_africa_annual: 250,
    roi_line: null,
    is_active: true,
    is_popular: true,
    is_highlighted: true,
    cta_text: 'Get Started',
    cta_variant: 'primary' as const,
    features: [
      'Up to 5 branches',
      'Up to 100 tables across all branches',
      'Unlimited staff accounts',
      'Everything in Starter',
      'Staff rotation & section shuffling',
      'Multi-branch dashboard',
      '1-year analytics',
      'Custom branding',
      'Priority support',
      'Cancel anytime',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'Custom deployment for large groups.',
    price_ngn: null,
    price_ngn_annual: null,
    price_gbp: null,
    price_gbp_annual: null,
    price_eur: null,
    price_eur_annual: null,
    price_usd: null,
    price_usd_annual: null,
    price_africa: null,
    price_africa_annual: null,
    roi_line: null,
    is_active: true,
    is_popular: false,
    is_highlighted: false,
    cta_text: 'Contact Us',
    cta_variant: 'secondary' as const,
    features: [
      'Unlimited branches and tables',
      'Unlimited staff accounts',
      'Everything in Growth',
      'API access and integrations',
      'Custom onboarding and SLA',
      'Dedicated account manager',
      'Annual contract',
    ],
  },
]

interface Plan {
  id: string
  name: string
  tagline: string
  price_ngn: number | null
  price_ngn_annual: number | null
  price_gbp: number | null
  price_gbp_annual: number | null
  price_eur: number | null
  price_eur_annual: number | null
  price_usd: number | null
  price_usd_annual: number | null
  price_africa: number | null
  price_africa_annual: number | null
  roi_line: string | null
  is_active: boolean
  is_popular: boolean
  is_highlighted: boolean
  cta_text: string
  cta_variant: 'primary' | 'secondary'
  features: string[]
  sort_order: number
}

export default function PricingEditor() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [manualOverrides, setManualOverrides] = useState<Record<string, Record<string, boolean>>>({})

  useEffect(() => { loadPlans() }, [])

  async function loadPlans() {
    try {
      const res = await fetch('/api/admin/pricing')
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError(json.error || 'Failed to load pricing plans')
      } else {
        setLoadError('')
        if (Array.isArray(json.data)) {
          const toNumberOrNull = (v: any): number | null => {
            if (v === null || v === undefined) return null
            if (typeof v === 'number') return Number.isFinite(v) ? v : null
            const s = String(v).trim()
            if (!s) return null
            if (/^free$/i.test(s)) return 0
            if (/^custom$/i.test(s)) return null
            const n = parseInt(s.replace(/[^0-9]/g, ''), 10)
            return Number.isFinite(n) ? n : null
          }

          setPlans(
            json.data.map((row: any): Plan => ({
              id: row.id,
              name: row.name ?? '',
              tagline: row.tagline ?? '',
              price_ngn: toNumberOrNull(row.price_ngn),
              price_ngn_annual: toNumberOrNull(row.price_ngn_annual),
              price_gbp: toNumberOrNull(row.price_gbp),
              price_gbp_annual: toNumberOrNull(row.price_gbp_annual),
              price_eur: toNumberOrNull(row.price_eur),
              price_eur_annual: toNumberOrNull(row.price_eur_annual),
              price_usd: toNumberOrNull(row.price_usd),
              price_usd_annual: toNumberOrNull(row.price_usd_annual),
              price_africa: toNumberOrNull(row.price_africa),
              price_africa_annual: toNumberOrNull(row.price_africa_annual),
              roi_line: row.roi_line ?? null,
              is_active: row.is_active ?? true,
              is_popular: row.is_popular ?? false,
              is_highlighted: row.is_highlighted ?? false,
              cta_text: row.cta_text ?? 'Get Started',
              cta_variant: (row.cta_variant === 'primary' ? 'primary' : 'secondary'),
              features: Array.isArray(row.features)
                ? row.features.map((f: any) => (typeof f === 'string' ? f : f?.text ?? '')).filter((x: string) => x.trim())
                : [],
              sort_order: typeof row.sort_order === 'number' ? row.sort_order : 0,
            }))
          )
          setManualOverrides({})
        }
      }
    } catch {
      setLoadError('Failed to load pricing plans')
    }
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
      const responseJson = await res.json().catch(() => ({}))
      setSaveError(responseJson.error || 'Failed')
    } else {
      setSaveError('')
    }
    await loadPlans()
    setLoading(null)
  }

  async function handleDelete(plan: Plan) {
    if (!confirm(`Delete "${plan.name}"?`)) return
    setDeleting(plan.id)
    const res = await fetch(`/api/admin/pricing/${plan.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const responseJson = await res.json().catch(() => ({}))
      setSaveError(responseJson.error || 'Failed')
    } else {
      setSaveError('')
    }
    await loadPlans()
    setDeleting(null)
  }

  async function seedDefaultPlans() {
    setSeeding(true)
    let firstError = ''
    for (let i = 0; i < DEFAULT_PLANS.length; i++) {
      const p = DEFAULT_PLANS[i]
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: p.name,
          tagline: p.tagline,
          price_ngn: p.price_ngn,
          price_ngn_annual: p.price_ngn_annual,
          price_gbp: p.price_gbp,
          price_gbp_annual: p.price_gbp_annual,
          price_eur: p.price_eur,
          price_eur_annual: p.price_eur_annual,
          price_usd: p.price_usd,
          price_usd_annual: p.price_usd_annual,
          price_africa: p.price_africa,
          price_africa_annual: p.price_africa_annual,
          roi_line: p.roi_line,
          is_active: p.is_active,
          is_popular: p.is_popular,
          is_highlighted: p.is_highlighted,
          cta_text: p.cta_text,
          cta_variant: p.cta_variant,
          features: p.features,
          sort_order: i,
        }),
      })
      if (!res.ok && !firstError) {
        const responseJson = await res.json().catch(() => ({}))
        firstError = responseJson.error || 'Failed'
      }
    }
    if (firstError) setSaveError(firstError)
    else setSaveError('')
    await loadPlans()
    setSeeding(false)
  }

  function updatePlan(index: number, changes: Partial<Plan>) {
    const newPlans = [...plans]
    newPlans[index] = { ...newPlans[index], ...changes }
    setPlans(newPlans)
  }

  function handleFeaturesChange(index: number, text: string) {
    const features = text.split('\n').map(l => l.trim()).filter(Boolean)
    updatePlan(index, { features })
  }

  const FX_FROM_NGN = {
    NGN: 1,
    GBP: 19 / 12000,
    EUR: 22 / 12000,
    USD: 25 / 12000,
    Africa: 10 / 12000,
  } as const

  type CurrencyKey = keyof typeof FX_FROM_NGN

  function toMonthlyFromAnnualPerMo(annualPerMo: number) {
    return Math.round((annualPerMo * 12) / 11)
  }

  function toAnnualPerMoFromMonthly(monthly: number) {
    return Math.round((monthly * 11) / 12)
  }

  function convert(amount: number, from: CurrencyKey, to: CurrencyKey) {
    const amountInNGN = amount / FX_FROM_NGN[from]
    return Math.round(amountInNGN * FX_FROM_NGN[to])
  }

  function parsePriceKey(key: keyof Plan): { currency: CurrencyKey; billing: 'monthly' | 'annual' } | null {
    const k = String(key)
    if (!k.startsWith('price_')) return null
    if (k.includes('_ngn')) return { currency: 'NGN', billing: k.endsWith('_annual') ? 'annual' : 'monthly' }
    if (k.includes('_gbp')) return { currency: 'GBP', billing: k.endsWith('_annual') ? 'annual' : 'monthly' }
    if (k.includes('_eur')) return { currency: 'EUR', billing: k.endsWith('_annual') ? 'annual' : 'monthly' }
    if (k.includes('_usd')) return { currency: 'USD', billing: k.endsWith('_annual') ? 'annual' : 'monthly' }
    if (k.includes('_africa')) return { currency: 'Africa', billing: k.endsWith('_annual') ? 'annual' : 'monthly' }
    return null
  }

  function computeAllFromInput(key: keyof Plan, value: number) {
    const parsed = parsePriceKey(key)
    if (!parsed) return null
    const sourceMonthly = parsed.billing === 'annual' ? toMonthlyFromAnnualPerMo(value) : value
    const monthly = {
      NGN: convert(sourceMonthly, parsed.currency, 'NGN'),
      GBP: convert(sourceMonthly, parsed.currency, 'GBP'),
      EUR: convert(sourceMonthly, parsed.currency, 'EUR'),
      USD: convert(sourceMonthly, parsed.currency, 'USD'),
      Africa: convert(sourceMonthly, parsed.currency, 'Africa'),
    }
    const annual = {
      NGN: toAnnualPerMoFromMonthly(monthly.NGN),
      GBP: toAnnualPerMoFromMonthly(monthly.GBP),
      EUR: toAnnualPerMoFromMonthly(monthly.EUR),
      USD: toAnnualPerMoFromMonthly(monthly.USD),
      Africa: toAnnualPerMoFromMonthly(monthly.Africa),
    }
    return {
      price_ngn: monthly.NGN,
      price_ngn_annual: annual.NGN,
      price_gbp: monthly.GBP,
      price_gbp_annual: annual.GBP,
      price_eur: monthly.EUR,
      price_eur_annual: annual.EUR,
      price_usd: monthly.USD,
      price_usd_annual: annual.USD,
      price_africa: monthly.Africa,
      price_africa_annual: annual.Africa,
    } as Partial<Plan>
  }

  function updateNumberField(index: number, key: keyof Plan, value: string) {
    const plan = plans[index]
    const planId = plan?.id
    if (!planId) return

    if (value === '') {
      setManualOverrides((prev) => ({
        ...prev,
        [planId]: { ...(prev[planId] ?? {}), [key]: false },
      }))
      updatePlan(index, { [key]: null } as any)
      return
    }

    const n = Number(value)
    const numeric = Number.isFinite(n) ? n : null
    setManualOverrides((prev) => ({
      ...prev,
      [planId]: { ...(prev[planId] ?? {}), [key]: true },
    }))
    updatePlan(index, { [key]: numeric } as any)
    if (numeric === null) return

    const computed = computeAllFromInput(key, numeric)
    if (!computed) return

    const overrides = manualOverrides[planId] ?? {}
    const next: Partial<Plan> = {}
    ;(Object.keys(computed) as (keyof Plan)[]).forEach((k) => {
      if (k === key || !overrides[k]) (next as any)[k] = (computed as any)[k]
    })
    updatePlan(index, next)
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
      {loadError && <p className="text-red-500 text-sm mb-4">{loadError}</p>}
      {saveError && <p className="text-red-500 text-sm mb-4">{saveError}</p>}

      {plans.length === 0 && !loadError && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 mb-6 flex items-center justify-between gap-6">
          <p className="text-sm text-[var(--color-muted)]">
            No pricing plans found in the database. Publish default plans to seed your initial pricing.
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(plan)}
                  disabled={deleting === plan.id || loading === plan.id}
                  className="text-xs text-red-500 hover:underline disabled:opacity-50"
                >
                  {deleting === plan.id ? 'Deleting...' : 'Delete'}
                </button>
                <button onClick={() => handleSave(plan)} disabled={loading === plan.id || deleting === plan.id} className="bg-[var(--color-accent)] text-black px-4 py-1.5 rounded text-xs font-bold disabled:opacity-50">
                  {loading === plan.id ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={plan.name} onChange={e => updatePlan(i, { name: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              <input type="text" placeholder="Tagline" value={plan.tagline} onChange={e => updatePlan(i, { tagline: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Sort order" value={plan.sort_order} onChange={e => updatePlan(i, { sort_order: Number(e.target.value) })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)] px-2">
                  <input type="checkbox" checked={plan.is_active} onChange={e => updatePlan(i, { is_active: e.target.checked })} /> Active
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="NGN monthly" value={plan.price_ngn ?? ''} onChange={e => updateNumberField(i, 'price_ngn', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <input type="number" placeholder="NGN annual (per mo)" value={plan.price_ngn_annual ?? ''} onChange={e => updateNumberField(i, 'price_ngn_annual', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="GBP monthly" value={plan.price_gbp ?? ''} onChange={e => updateNumberField(i, 'price_gbp', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <input type="number" placeholder="GBP annual (per mo)" value={plan.price_gbp_annual ?? ''} onChange={e => updateNumberField(i, 'price_gbp_annual', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="EUR monthly" value={plan.price_eur ?? ''} onChange={e => updateNumberField(i, 'price_eur', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <input type="number" placeholder="EUR annual (per mo)" value={plan.price_eur_annual ?? ''} onChange={e => updateNumberField(i, 'price_eur_annual', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="USD monthly" value={plan.price_usd ?? ''} onChange={e => updateNumberField(i, 'price_usd', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <input type="number" placeholder="USD annual (per mo)" value={plan.price_usd_annual ?? ''} onChange={e => updateNumberField(i, 'price_usd_annual', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Africa monthly" value={plan.price_africa ?? ''} onChange={e => updateNumberField(i, 'price_africa', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <input type="number" placeholder="Africa annual (per mo)" value={plan.price_africa_annual ?? ''} onChange={e => updateNumberField(i, 'price_africa_annual', e.target.value)} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
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

              <input type="text" placeholder="ROI line (optional)" value={plan.roi_line ?? ''} onChange={e => updatePlan(i, { roi_line: e.target.value || null })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-1">Features (One per line)</label>
                <textarea 
                  value={plan.features.join('\n')}
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
