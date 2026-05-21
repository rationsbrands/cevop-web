'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || (globalThis as any).__CEVOP_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (globalThis as any).__CEVOP_SUPABASE_ANON_KEY
  const supabase = createBrowserClient(
    supabaseUrl as string,
    supabaseAnonKey as string
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    // Ensure redirect url is constructed with the window origin
    const redirectUrl = `${window.location.origin}/admin/reset-password`
    
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })
    
    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[var(--color-text)] uppercase mb-2">Reset Password</h1>
          <p className="text-sm text-[var(--color-muted)]">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 space-y-4">
          {success ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-[var(--color-text)]">
                Check your email for the password reset link.
              </p>
              <Link href="/admin/login" className="block w-full bg-[var(--color-surface2)] text-[var(--color-text)] font-bold py-3 rounded-xl hover:bg-[var(--color-surface3)] transition-colors">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50"
                  placeholder="admin@cevop.com"
                  required
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[var(--color-accent)] text-black font-bold py-3 rounded-xl disabled:opacity-50 transition-opacity"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
              
              <div className="text-center pt-2">
                <Link href="/admin/login" className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                  Back to login
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
