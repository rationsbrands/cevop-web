import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET — no auth check needed, middleware already protects /admin/*
// The service role key is server-side only so this is safe
export async function GET(_req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const supabase = (() => {
      try {
        return getSupabaseAdmin()
      } catch {
        return getSupabaseClient()
      }
    })()
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', params.key)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: data?.value ?? null })
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') console.error('Admin API error:', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const body = await req.json()
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('site_content')
      .upsert({ key: params.key, value: body, updated_at: new Date().toISOString() })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    revalidatePath('/', 'layout')
    revalidatePath('/about')
    revalidatePath('/blog')
    revalidatePath('/customers')
    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') console.error('Admin API error:', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
