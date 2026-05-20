import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/', 'layout')
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {  const body = await req.json()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('testimonials').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/', 'layout')
  return NextResponse.json({ data })
}
