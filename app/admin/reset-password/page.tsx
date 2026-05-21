'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || (globalThis as any).__CEVOP_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (globalThis as any).__CEVOP_SUPABASE_ANON_KEY
  const supabase = createBrowserClient(
    supabaseUrl as string,
    supabaseAnonKey as string
  )

  useEffect(() => {
    // Supabase Auth places the token hash in the URL hash fragment initially,
    // and createBrowserClient will automatically handle it and create a session.
    // If there is an error event from supabase auth, we could catch it here,
    // but typically we just allow the user to submit their new password.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          // Ready to reset password
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })
    
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }
    
    setSuccess(true)
    
    // Redirect to admin after a short delay
    setTimeout(() => {
      router.push('/admin')
      router.refresh()
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[var(--color-text)] uppercase mb-2">New Password</h1>
          <p className="text-sm text-[var(--color-muted)]">Set a new password for your account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 space-y-4">
          {success ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-green-500 font-medium">
                Password updated successfully!
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50"
                  placeholder="Enter new password"
                  required
                  autoFocus
                  minLength={6}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-[var(--color-accent)] text-black font-bold py-3 rounded-xl disabled:opacity-50 transition-opacity"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
