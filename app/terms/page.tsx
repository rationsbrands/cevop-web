import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getSupabaseClient } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export const revalidate = 60

export default async function TermsPage() {
  const supabase = getSupabaseClient()
  const [
    { data: pageRes },
    { data: socialRes },
    { data: navRes },
  ] = await Promise.all([
    supabase.from('pages').select('*').eq('slug', 'terms').eq('is_published', true).single(),
    supabase.from('site_content').select('value').eq('key', 'social'),
    supabase.from('site_content').select('value').eq('key', 'nav'),
  ])

  const content = pageRes?.content || 'Terms of Service coming soon.'
  const socialData = socialRes?.[0]?.value ?? null
  const navData = navRes?.[0]?.value ?? null

  return (
    <>
      <Navbar navData={navData} />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl text-[var(--color-text)] uppercase mb-8">{pageRes?.title || 'Terms of Service'}</h1>
          <div className="prose prose-invert prose-p:text-[var(--color-muted)] prose-headings:text-[var(--color-text)] prose-a:text-[var(--color-accent)] max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </main>
      <Footer socialData={socialData} />
    </>
  )
}
