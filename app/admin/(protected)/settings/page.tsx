'use client'
import { useMemo, useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
      }
    }
    loadUser()
  }, [supabase.auth])

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email) {
      setError('User email not found. Please log in again.')
      setLoading(false)
      return
    }

    // Re-authenticate first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    })

    if (signInError) {
      setError('Incorrect current password')
      setLoading(false)
      return
    }

    // Now update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
    }
    
    setLoading(false)
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--color-text)] uppercase mb-2">Settings</h1>
      <p className="text-[var(--color-muted)] text-sm mb-8">Change your administrator password.</p>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 max-w-md">
        <h2 className="font-bold text-[var(--color-text)] mb-4">Change Password</h2>
        
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50"
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/50"
              placeholder="Enter new password"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword}
            className="w-full bg-[var(--color-accent)] text-black font-bold py-3 rounded-xl disabled:opacity-50 transition-opacity mt-4"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
