import { redirect } from 'next/navigation'
import { getSupabaseAuth } from '@/lib/supabaseServer'
import AdminShell from '../AdminShell'

export const metadata = { title: 'Cevop Admin', robots: 'noindex,nofollow' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseAuth()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return <AdminShell>{children}</AdminShell>
}
