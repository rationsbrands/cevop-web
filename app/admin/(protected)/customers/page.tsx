'use client'
import { useEffect, useState } from 'react'

type CustomerStory = {
  name: string
  location: string
  stat: string
  statDesc: string
  quote: string
  author: string
  color: string
}

const DEFAULT_STORIES: CustomerStory[] = [
  {
    name: 'The Market at Edgewood',
    location: 'Palo Alto, CA',
    stat: '+7%',
    statDesc: 'gross margin improvement',
    quote: 'You should try Cevop if you want to make some money.',
    author: 'Navi, Owner',
    color: 'bg-[var(--color-accent)]',
  },
  {
    name: 'Talin Market',
    location: 'Albuquerque, NM',
    stat: '-67%',
    statDesc: 'less time ordering product per week',
    quote: 'Produce orders used to take me 2 to 3 hours to do…now it can be done in less than 1 hour.',
    author: 'Victor, Director of Operations',
    color: 'bg-blue-500',
  },
  {
    name: 'Valley Farm Market',
    location: 'Spring Valley, CA',
    stat: '+22%',
    statDesc: 'increase in net sales',
    quote: 'When you see something, you can pivot. And with Cevop, we can pivot fast.',
    author: 'Derek, Owner',
    color: 'bg-amber-500',
  },
]

function normalizeStories(value: any): CustomerStory[] {
  if (!Array.isArray(value)) return DEFAULT_STORIES
  const cleaned = value
    .map((s: any) => ({
      name: typeof s?.name === 'string' ? s.name : '',
      location: typeof s?.location === 'string' ? s.location : '',
      stat: typeof s?.stat === 'string' ? s.stat : '',
      statDesc: typeof s?.statDesc === 'string' ? s.statDesc : '',
      quote: typeof s?.quote === 'string' ? s.quote : '',
      author: typeof s?.author === 'string' ? s.author : '',
      color: typeof s?.color === 'string' ? s.color : 'bg-[var(--color-accent)]',
    }))
    .filter((s: CustomerStory) => s.name && s.quote)

  return cleaned.length > 0 ? cleaned : DEFAULT_STORIES
}

export default function CustomerStoriesEditor() {
  const [stories, setStories] = useState<CustomerStory[]>(DEFAULT_STORIES)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/content/customer_stories')
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(json.error || 'Failed')
          setLoaded(true)
          return
        }
        setStories(normalizeStories(json?.data))
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
    const res = await fetch('/api/admin/content/customer_stories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stories),
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

  function updateStory(index: number, changes: Partial<CustomerStory>) {
    setStories((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...changes }
      return next
    })
  }

  function removeStory(index: number) {
    setStories((prev) => prev.filter((_, i) => i !== index))
  }

  function addStory() {
    setStories((prev) => [
      ...prev,
      {
        name: 'New Story',
        location: '',
        stat: '',
        statDesc: '',
        quote: '',
        author: '',
        color: 'bg-[var(--color-accent)]',
      },
    ])
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--color-muted)] text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-text)] uppercase">Customer Stories</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Edit stories shown on /customers</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addStory}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] font-bold px-6 py-2.5 rounded-xl text-sm hover:border-[var(--color-accent)]/40"
          >
            Add Story
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[var(--color-accent)] text-black font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {stories.map((s, i) => (
          <div key={`${s.name}-${i}`} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)]">
              <h3 className="font-bold text-[var(--color-text)] uppercase tracking-wider">Story {i + 1}</h3>
              <button
                onClick={() => removeStory(i)}
                className="text-xs font-bold text-[var(--color-muted)] hover:text-red-400"
              >
                Remove
              </button>
            </div>

            <div className="space-y-3">
              <input type="text" placeholder="Business name" value={s.name} onChange={e => updateStory(i, { name: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              <input type="text" placeholder="Location" value={s.location} onChange={e => updateStory(i, { location: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />

              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Stat (e.g. +22%)" value={s.stat} onChange={e => updateStory(i, { stat: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
                <input type="text" placeholder="Stat description" value={s.statDesc} onChange={e => updateStory(i, { statDesc: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              </div>

              <textarea
                value={s.quote}
                onChange={e => updateStory(i, { quote: e.target.value })}
                className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] min-h-[110px] resize-none text-sm"
                placeholder="Quote"
              />
              <input type="text" placeholder="Author (e.g. Navi, Owner)" value={s.author} onChange={e => updateStory(i, { author: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm" />
              <input type="text" placeholder="Badge color class (e.g. bg-[var(--color-accent)])" value={s.color} onChange={e => updateStory(i, { color: e.target.value })} className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm font-mono" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
