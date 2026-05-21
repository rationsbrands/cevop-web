'use client'
import { useState, useEffect } from 'react'

const DEFAULT_NAV = {
  login_url: 'https://app.cevop.com/login',
  blog_url: '',
}

interface FieldProps {
  label: string
  value: string
  onChange: (val: string) => void
}

function Field({ label, value, onChange }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 text-sm"
      />
    </div>
  )
}

export default function NavigationEditor() {
  const [data, setData] = useState(DEFAULT_NAV)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/content/nav')
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(json.error || 'Failed')
          setLoaded(true)
          return
        }
        if (json?.data) setData((prev) => ({ ...prev, ...json.data }))
        setError('')
      } catch {
        setError('Failed')
      } finally {
        setLoaded(true)
      }
    })()
  }, [])

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/admin/content/nav', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (!res.ok) {
      const responseJson = await res.json().catch(() => ({}))
      setError(responseJson.error || 'Save failed')
      return
    }
    setError('')
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
          <h1 className="font-display text-2xl text-[var(--color-text)] uppercase">Navigation</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Edit navigation links</p>
        </div>
        <div className="text-right">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[var(--color-accent)] text-black font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        </div>
      </div>

      <div className="space-y-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
        <Field
          label="Login URL"
          value={data.login_url}
          onChange={val => setData(prev => ({ ...prev, login_url: val }))}
        />
        <Field
          label="Blog URL"
          value={data.blog_url}
          onChange={val => setData(prev => ({ ...prev, blog_url: val }))}
        />
      </div>
    </div>
  )
}
