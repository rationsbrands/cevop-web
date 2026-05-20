'use client'
import { useState, useEffect } from 'react'

interface Page {
  id: string
  slug: string
  title: string
  content: string
  is_published: boolean
}

export default function PagesEditor() {
  const [pages, setPages] = useState<Page[]>([])
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '', is_published: true })
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { loadPages() }, [])

  async function loadPages() {
    try {
      const res = await fetch('/api/admin/pages')
      const { data } = await res.json()
      if (data) setPages(data)
    } catch {}
    setLoaded(true)
  }

  async function handleSave() {
    setLoading(true)
    const res = await fetch(`/api/admin/pages/${editingSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    
    if (!res.ok) {
      alert('Failed to save page. Please try again.')
    } else {
      setEditingSlug(null)
    }
    await loadPages()
    setLoading(false)
  }

  function startEdit(p: Page) {
    setFormData({ title: p.title, content: p.content, is_published: p.is_published })
    setEditingSlug(p.slug)
  }

  if (!loaded) return <div className="flex justify-center h-64"><p className="text-[var(--color-muted)] text-sm">Loading...</p></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-text)] uppercase">Static Pages</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Manage content for About Us, Privacy Policy, etc.</p>
        </div>
      </div>

      <div className="space-y-4">
        {pages.map(p => (
          <div key={p.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
            {editingSlug === p.slug ? (
              <div className="space-y-4">
                <input type="text" placeholder="Page Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] text-sm font-bold" />
                <div>
                  <label className="text-[10px] uppercase font-bold text-[var(--color-muted)] mb-1 block">Content (Markdown Supported)</label>
                  <textarea 
                    value={formData.content} 
                    onChange={e => setFormData({ ...formData, content: e.target.value })} 
                    className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] text-sm min-h-[400px] font-mono resize-y" 
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                  <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })} /> Published
                </label>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingSlug(null)} className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Cancel</button>
                  <button onClick={handleSave} disabled={loading} className="bg-[var(--color-accent)] text-black px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Save Page</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-[var(--color-text)]">{p.title}</p>
                  <p className="text-xs text-[var(--color-muted)] font-mono mt-1">/{p.slug}</p>
                  <div className="flex gap-4 mt-2">
                    <span className={`text-xs ${p.is_published ? 'text-green-500' : 'text-red-500'}`}>{p.is_published ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(p)} className="bg-[var(--color-surface2)] text-[var(--color-text)] px-4 py-2 rounded text-xs font-bold hover:bg-[var(--color-accent)] hover:text-black transition-colors">Edit Content</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
