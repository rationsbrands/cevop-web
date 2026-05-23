import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    const supabase = (() => {
      try {
        return getSupabaseAdmin()
      } catch {
        return getSupabaseClient()
      }
    })()
    const { data, error } = await supabase.from('sponsors').select('*').order('sort_order', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') console.error('Admin API error:', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('sponsors').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    revalidatePath('/', 'layout')
    return NextResponse.json({ data })
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') console.error('Admin API error:', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
