import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim().split(/\s+/)[0]
  if (!url) throw new Error('Missing Supabase URL env var (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL)')
  return url
}

function getSupabaseAnonKey() {
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim().split(/\s+/)[0]
  if (!key) throw new Error('Missing Supabase anon key env var (NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY)')
  return key
}

function getSupabaseServiceRoleKeyOptional() {
  const raw = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!raw) return undefined
  const key = raw.trim().split(/\s+/)[0]
  if (!key) return undefined
  if (key.split('.').length !== 3) return undefined
  return key
}

// Public client — for server components fetching content (read-only)
export function getSupabaseClient() {
  if (typeof window !== 'undefined') {
    const w = window as any
    if (!w.__CEVOP_SUPABASE_CLIENT__) {
      w.__CEVOP_SUPABASE_CLIENT__ = createClient(getSupabaseUrl(), getSupabaseAnonKey())
    }
    return w.__CEVOP_SUPABASE_CLIENT__
  }
  return createClient(getSupabaseUrl(), getSupabaseAnonKey())
}

// Admin client — for API routes writing content (server-side only)
export function getSupabaseAdmin() {
  const raw =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE
  if (!raw) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Admin writes will fail. ' +
        'Add it to your .env.local and to Vercel environment variables.'
    )
  }
  const key = raw.trim().split(/\s+/)[0]
  if (key.split('.').length !== 3) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY looks invalid (expected a JWT with 3 parts). ' +
        'Check your .env.local and Vercel environment variables.'
    )
  }
  return createClient(getSupabaseUrl(), key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
