'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || (globalThis as any).__CEVOP_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (globalThis as any).__CEVOP_SUPABASE_ANON_KEY
  const supabase = useMemo(
    () =>
      createBrowserClient(
        supabaseUrl as string,
        supabaseAnonKey as string
      ),
    [supabaseUrl, supabaseAnonKey]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      const msg = String(err?.message || err || 'Failed to sign in')
      if (msg.toLowerCase().includes('failed to fetch')) {
        setError('Auth server unreachable. If you are using local auth, start the gateway on http://localhost:54321.')
      } else {
        setError(msg)
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <span className="cevop-wordmark" aria-label="Cevop" role="img" />
          </div>
          <p className="text-sm text-[var(--color-muted)]">Marketing site control panel</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50"
              placeholder="email address"
              required
              autoFocus
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block">
                Password
              </label>
              <Link href="/admin/forgot-password" tabIndex={-1} className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 pr-12 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)] text-xs font-bold uppercase tracking-widest"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[var(--color-accent)] text-black font-bold py-3 rounded-xl disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
