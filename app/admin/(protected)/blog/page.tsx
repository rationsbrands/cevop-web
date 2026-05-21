'use client'
import { useState, useEffect } from 'react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  is_published: boolean
  published_at: string | null
}

export default function BlogEditor() {
  const [posts, setPosts] = useState<Post[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', slug: '', excerpt: '', content: '', is_published: false })
  const [loading, setLoading] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    const res = await fetch('/api/admin/blog')
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      setSaveError(json.error || 'Failed')
      return
    }
    setSaveError('')
    if (json.data) setPosts(json.data)
  }

  async function handleSave() {
    setLoading(true)
    const payload = {
      ...formData,
      published_at: formData.is_published ? (editingId === 'new' ? new Date().toISOString() : posts.find(p => p.id === editingId)?.published_at || new Date().toISOString()) : null
    }

    if (editingId === 'new') {
      const res = await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const responseJson = await res.json().catch(() => ({}))
        setSaveError(responseJson.error || 'Failed')
        setLoading(false)
        return
      }
    } else {
      const res = await fetch(`/api/admin/blog/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const responseJson = await res.json().catch(() => ({}))
        setSaveError(responseJson.error || 'Failed')
        setLoading(false)
        return
      }
    }
    setSaveError('')
    await loadPosts()
    setEditingId(null)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    await loadPosts()
  }

  function startEdit(p: Post) {
    setFormData({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, is_published: p.is_published })
    setEditingId(p.id)
  }

  function startNew() {
    setFormData({ title: '', slug: '', excerpt: '', content: '', is_published: false })
    setEditingId('new')
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-text)] uppercase">Blog Posts</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Manage your content</p>
        </div>
        {editingId === null && (
          <button onClick={startNew} className="bg-[var(--color-accent)] text-black font-bold px-6 py-2.5 rounded-xl text-sm">New Post</button>
        )}
      </div>
      {saveError && <p className="text-red-500 text-sm mb-4">{saveError}</p>}

      {editingId !== null ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
          <input type="text" placeholder="Post Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value, slug: autoSlug(e.target.value) })} className="w-full font-bold text-xl bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50" />
          <input type="text" placeholder="slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 text-sm font-mono" />
          <textarea placeholder="Excerpt (for lists and SEO)" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 min-h-[80px] resize-none text-sm" />
          <textarea placeholder="Markdown Content" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-4 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50 min-h-[400px] font-mono text-sm" />
          
          <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
            <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
              <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4" />
              Published
            </label>
            <div className="flex gap-2">
              <button onClick={() => setEditingId(null)} className="px-6 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="bg-[var(--color-accent)] text-black px-8 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Save Post</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex justify-between items-center group">
              <div>
                <h3 className="font-bold text-lg text-[var(--color-text)] mb-1">{p.title}</h3>
                <p className="text-xs text-[var(--color-muted)]">/{p.slug} &bull; {p.is_published ? 'Published' : 'Draft'}</p>
              </div>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(p)} className="text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-accent)]">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-sm font-bold text-red-500 hover:text-red-400">Delete</button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-[var(--color-muted)] text-sm">No blog posts yet.</p>}
        </div>
      )}
    </div>
  )
}
