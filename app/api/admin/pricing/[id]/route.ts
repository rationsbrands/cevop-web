import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {  const body = await req.json()
  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...updates } = body ?? {}
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('pricing_plans')
    .update({ ...updates })
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/', 'layout')
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('pricing_plans').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/', 'layout')
  return NextResponse.json({ success: true })
}
