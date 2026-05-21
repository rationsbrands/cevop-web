'use client'
import { useState, useEffect } from 'react'
import { DEFAULT_FAQS } from '@/components/sections/FAQ'

interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
}

export default function FAQEditor() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ question: '', answer: '', sort_order: 0 })
  const [loading, setLoading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => { loadFaqs() }, [])

  async function loadFaqs() {
    try {
      const res = await fetch('/api/admin/faqs')
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSaveError(json.error || 'Failed')
      } else {
        setSaveError('')
        if (json.data) setFaqs(json.data)
      }
    } catch {}
    setLoaded(true)
  }

  async function handleSave() {
    setLoading(true)
    let res;
    if (editingId === 'new') {
      res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } else {
      res = await fetch(`/api/admin/faqs/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    }
    if (!res.ok) {
      const responseJson = await res.json().catch(() => ({}))
      setSaveError(responseJson.error || 'Failed')
    } else {
      setSaveError('')
      setEditingId(null)
    }
    await loadFaqs()
    setLoading(false)
  }

  async function seedDefaultFaqs() {
    setSeeding(true)
    let firstError = ''
    for (let i = 0; i < DEFAULT_FAQS.length; i++) {
      const f = DEFAULT_FAQS[i]
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: f.q, answer: f.a, sort_order: i }),
      })
      if (!res.ok && !firstError) {
        const responseJson = await res.json().catch(() => ({}))
        firstError = responseJson.error || 'Failed'
      }
    }
    if (firstError) setSaveError(firstError)
    else setSaveError('')
    await loadFaqs()
    setSeeding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    await loadFaqs()
  }

  function startEdit(faq: FAQ) {
    setFormData({ question: faq.question, answer: faq.answer, sort_order: faq.sort_order })
    setEditingId(faq.id)
  }

  function startNew() {
    setFormData({ question: '', answer: '', sort_order: faqs.length })
    setEditingId('new')
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
          <h1 className="font-display text-2xl text-[var(--color-text)] uppercase">FAQs</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Manage frequently asked questions</p>
        </div>
        <button
          onClick={startNew}
          className="bg-[var(--color-accent)] text-black font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          Add FAQ
        </button>
      </div>
      {saveError && <p className="text-red-500 text-sm mb-4">{saveError}</p>}

      {faqs.length === 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 mb-6 flex items-center justify-between gap-6">
          <p className="text-sm text-[var(--color-muted)]">
            No FAQs found in the database. The website will show the built-in defaults until you publish FAQs.
          </p>
          <button
            onClick={seedDefaultFaqs}
            disabled={seeding}
            className="bg-[var(--color-accent)] text-black font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50"
          >
            {seeding ? 'Publishing...' : 'Publish Default FAQs'}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {editingId === 'new' && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-accent)] rounded-2xl p-6 space-y-4">
            <input type="text" placeholder="Question" value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 text-sm" />
            <textarea placeholder="Answer" value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 min-h-[80px] resize-none text-sm" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="bg-[var(--color-accent)] text-black px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Save</button>
            </div>
          </div>
        )}

        {faqs.map(faq => (
          <div key={faq.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
            {editingId === faq.id ? (
              <div className="space-y-4">
                <input type="text" value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 text-sm" />
                <textarea value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 min-h-[80px] resize-none text-sm" />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Cancel</button>
                  <button onClick={handleSave} disabled={loading} className="bg-[var(--color-accent)] text-black px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Save</button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-[var(--color-text)] mb-2">{faq.question}</h3>
                <p className="text-sm text-[var(--color-muted)] mb-4">{faq.answer}</p>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(faq)} className="text-xs text-[var(--color-accent)] hover:underline">Edit</button>
                  <button onClick={() => handleDelete(faq.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
