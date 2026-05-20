'use client'
import { useState, useEffect } from 'react'

interface Testimonial {
  id: string
  quote: string
  author_name: string
  author_title: string
  author_location: string
  is_active: boolean
  is_featured: boolean
}

const DEFAULT_TESTIMONIAL = {
  quote: "We used to lose orders every Friday night. Now the service sees every order the second it's placed. Service is faster, staff are calmer, and customers actually come back.",
  author_name: 'Restaurant Owner',
  author_title: '',
  author_location: 'Lagos, Nigeria',
  is_active: true,
  is_featured: true,
}

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ quote: '', author_name: '', author_title: '', author_location: '', is_active: true, is_featured: false })
  const [loading, setLoading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { loadTestimonials() }, [])

  async function loadTestimonials() {
    try {
      const res = await fetch('/api/admin/testimonials')
      const { data } = await res.json()
      if (data) setTestimonials(data)
    } catch {}
    setLoaded(true)
  }

  async function handleSave() {
    setLoading(true)
    let res;
    if (editingId === 'new') {
      res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } else {
      res = await fetch(`/api/admin/testimonials/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    }
    if (!res.ok) {
      alert('Failed to save testimonial. Please try again.')
    } else {
      setEditingId(null)
    }
    await loadTestimonials()
    setLoading(false)
  }

  async function seedDefaultTestimonial() {
    setSeeding(true)
    const res = await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEFAULT_TESTIMONIAL),
    })
    if (!res.ok) alert('Failed to publish default testimonial.')
    await loadTestimonials()
    setSeeding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    await loadTestimonials()
  }

  function startEdit(t: Testimonial) {
    setFormData({ quote: t.quote, author_name: t.author_name, author_title: t.author_title, author_location: t.author_location, is_active: t.is_active, is_featured: t.is_featured })
    setEditingId(t.id)
  }

  function startNew() {
    setFormData({ quote: '', author_name: '', author_title: '', author_location: '', is_active: true, is_featured: false })
    setEditingId('new')
  }

  const FormFields = () => (
    <div className="space-y-4">
      <textarea placeholder="Quote" value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 min-h-[80px] resize-none text-sm" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input type="text" placeholder="Author Name" value={formData.author_name} onChange={e => setFormData({ ...formData, author_name: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 text-sm" />
        <input type="text" placeholder="Author Title" value={formData.author_title} onChange={e => setFormData({ ...formData, author_title: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 text-sm" />
        <input type="text" placeholder="Author Location" value={formData.author_location} onChange={e => setFormData({ ...formData, author_location: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 text-sm" />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
          <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
          <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} />
          Featured (Hero)
        </label>
      </div>
    </div>
  )

  if (!loaded) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[var(--color-muted)] text-sm">Loading...</p>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-text)] uppercase">Testimonials</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Manage customer quotes</p>
        </div>
        <button onClick={startNew} className="bg-[var(--color-accent)] text-black font-bold px-6 py-2.5 rounded-xl text-sm">Add Testimonial</button>
      </div>

      {testimonials.length === 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 mb-6 flex items-center justify-between gap-6">
          <p className="text-sm text-[var(--color-muted)]">
            No testimonials found in the database. The website will show the built-in default testimonial until you publish one.
          </p>
          <button
            onClick={seedDefaultTestimonial}
            disabled={seeding}
            className="bg-[var(--color-accent)] text-black font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50"
          >
            {seeding ? 'Publishing...' : 'Publish Default Testimonial'}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {editingId === 'new' && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-accent)] rounded-2xl p-6 space-y-4">
            <FormFields />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="bg-[var(--color-accent)] text-black px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Save</button>
            </div>
          </div>
        )}

        {testimonials.map(t => (
          <div key={t.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
            {editingId === t.id ? (
              <div className="space-y-4">
                <FormFields />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Cancel</button>
                  <button onClick={handleSave} disabled={loading} className="bg-[var(--color-accent)] text-black px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Save</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-[var(--color-text)] mb-4 italic">"{t.quote}"</p>
                <p className="text-xs text-[var(--color-muted)] font-bold">{t.author_name} — {t.author_title}, {t.author_location}</p>
                <div className="flex gap-4 mt-4">
                  <span className={`text-xs ${t.is_active ? 'text-green-500' : 'text-red-500'}`}>{t.is_active ? 'Active' : 'Inactive'}</span>
                  {t.is_featured && <span className="text-xs text-[var(--color-accent)]">Featured</span>}
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--color-border)]">
                  <button onClick={() => startEdit(t)} className="text-xs text-[var(--color-accent)] hover:underline">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
