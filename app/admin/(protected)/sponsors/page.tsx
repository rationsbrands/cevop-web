'use client'
import { useState, useEffect } from 'react'

interface Sponsor {
  id: string
  name: string
  logo_url: string
  font_weight: string
  is_active: boolean
  sort_order: number
}

const DEFAULT_SPONSORS = [
  { name: 'Rations', logo_url: '', font_weight: 'font-black' },
  { name: 'DEMO BISTRO', logo_url: '', font_weight: 'font-light tracking-[0.2em]' },
  { name: 'The Pearl', logo_url: '', font_weight: 'font-serif italic font-bold' },
  { name: 'KASADA', logo_url: '', font_weight: 'font-mono font-bold' },
  { name: 'Bistro 24', logo_url: '', font_weight: 'font-display tracking-tight' }
]

export default function SponsorsEditor() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', logo_url: '', font_weight: 'font-bold', is_active: true, sort_order: 0 })
  const [loading, setLoading] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => { loadSponsors() }, [])

  async function loadSponsors() {
    try {
      const res = await fetch('/api/admin/sponsors')
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError(json.error || 'Failed to load sponsors')
      } else {
        setLoadError('')
        if (Array.isArray(json.data)) setSponsors(json.data)
      }
    } catch {
      setLoadError('Failed to load sponsors')
    }
    setLoaded(true)
  }

  async function handleSave() {
    setLoading(true)
    let res;
    if (editingId === 'new') {
      res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } else {
      res = await fetch(`/api/admin/sponsors/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    }
    if (!res.ok) {
      alert('Failed to save sponsor. Please try again.')
    } else {
      setEditingId(null)
    }
    await loadSponsors()
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this sponsor?')) return
    await fetch(`/api/admin/sponsors/${id}`, { method: 'DELETE' })
    await loadSponsors()
  }

  async function persistOrder(nextSponsors: Sponsor[]) {
    setReordering(true)
    try {
      await Promise.all(
        nextSponsors.map((s, index) =>
          fetch(`/api/admin/sponsors/${s.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...s, sort_order: index }),
          })
        )
      )
      await loadSponsors()
    } finally {
      setReordering(false)
    }
  }

  async function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) return
    const from = sponsors.findIndex((s) => s.id === draggingId)
    const to = sponsors.findIndex((s) => s.id === targetId)
    if (from < 0 || to < 0) return
    const next = [...sponsors]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    const nextWithOrder = next.map((s, idx) => ({ ...s, sort_order: idx }))
    setSponsors(nextWithOrder)
    await persistOrder(nextWithOrder)
  }

  async function seedDefaultSponsors() {
    setSeeding(true)
    let failed = false
    for (let i = 0; i < DEFAULT_SPONSORS.length; i++) {
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...DEFAULT_SPONSORS[i], sort_order: i, is_active: true }),
      })
      if (!res.ok) failed = true
    }
    if (failed) alert('Some default sponsors failed to publish.')
    await loadSponsors()
    setSeeding(false)
  }

  function startEdit(s: Sponsor) {
    setFormData({ name: s.name, logo_url: s.logo_url, font_weight: s.font_weight, is_active: s.is_active, sort_order: s.sort_order })
    setEditingId(s.id)
  }

  function startNew() {
    setFormData({ name: '', logo_url: '', font_weight: 'font-bold', is_active: true, sort_order: sponsors.length })
    setEditingId('new')
  }

  function renderFormFields() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Sponsor Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] text-sm"
          />
          <input
            type="text"
            placeholder="Logo Image URL (optional)"
            value={formData.logo_url}
            onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
            className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[var(--color-muted)] mb-1 block">Text Style (if no logo)</label>
            <input
              type="text"
              placeholder="e.g. font-bold font-serif"
              value={formData.font_weight}
              onChange={e => setFormData({ ...formData, font_weight: e.target.value })}
              className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] text-sm"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
          />{' '}
          Active
        </label>
      </div>
    )
  }

  if (!loaded) return <div className="flex justify-center h-64"><p className="text-[var(--color-muted)] text-sm">Loading...</p></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-text)] uppercase">Sponsors</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Manage the “Trusted By” social proof banner</p>
        </div>
        <button onClick={startNew} className="bg-[var(--color-accent)] text-black font-bold px-6 py-2.5 rounded-xl text-sm">Add Sponsor</button>
      </div>

      {loadError && <p className="text-red-500 text-sm mb-4">{loadError}</p>}

      {sponsors.length === 0 && !loadError && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 mb-6 flex items-center justify-between gap-6">
          <p className="text-sm text-[var(--color-muted)]">No sponsors found in the database. Publish default sponsors to seed your initial list.</p>
          <button onClick={seedDefaultSponsors} disabled={seeding} className="bg-[var(--color-accent)] text-black font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">
            {seeding ? 'Publishing...' : 'Publish Default Sponsors'}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {editingId === 'new' && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-accent)] rounded-2xl p-6 space-y-4">
            {renderFormFields()}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Cancel</button>
              <button onClick={handleSave} disabled={loading || reordering} className="bg-[var(--color-accent)] text-black px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Save</button>
            </div>
          </div>
        )}

        {sponsors.map(s => (
          <div
            key={s.id}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6"
            draggable={!reordering && editingId === null}
            onDragStart={() => setDraggingId(s.id)}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(e) => {
              if (reordering || editingId !== null) return
              e.preventDefault()
            }}
            onDrop={async (e) => {
              if (reordering || editingId !== null) return
              e.preventDefault()
              await handleDrop(s.id)
            }}
          >
            {editingId === s.id ? (
              <div className="space-y-4">
                {renderFormFields()}
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Cancel</button>
                  <button onClick={handleSave} disabled={loading || reordering} className="bg-[var(--color-accent)] text-black px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Save</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {s.logo_url ? (
                    <img src={s.logo_url} alt={s.name} className="h-10 object-contain grayscale opacity-60" />
                  ) : (
                    <span className={`text-xl text-[var(--color-text)] ${s.font_weight}`}>{s.name}</span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text)]">{s.name}</p>
                    <div className="flex gap-4 mt-1">
                      <span className={`text-xs ${s.is_active ? 'text-green-500' : 'text-red-500'}`}>{s.is_active ? 'Active' : 'Inactive'}</span>
                      <span className="text-xs text-[var(--color-muted)]">Order: {s.sort_order}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(s)} className="text-xs text-[var(--color-accent)] hover:underline">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
