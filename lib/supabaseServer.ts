import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

// Auth client — for SSR auth checking and API routes
export function getSupabaseAuth() {
  const cookieStore = cookies()

  return createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
