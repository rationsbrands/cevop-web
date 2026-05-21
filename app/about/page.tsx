import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getSupabaseClient } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Cevop — Restaurant Operations Platform Built in Nigeria',
  description:
    'Cevop was founded to give restaurant owners in Nigeria and West Africa the same powerful tools that global chains use. Learn about our mission, team, and story.',
  alternates: {
    canonical: 'https://cevop.com/about',
  },
  openGraph: {
    title: 'About Cevop — Restaurant Operations Platform',
    description: 'Built for the modern restaurant in Nigeria and West Africa. Learn about our mission.',
    url: 'https://cevop.com/about',
  },
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const supabase = getSupabaseClient()
  const [
    { data: pageRes },
    { data: socialRes },
    { data: navRes },
  ] = await Promise.all([
    supabase.from('pages').select('*').eq('slug', 'about').eq('is_published', true).single(),
    supabase.from('site_content').select('value').eq('key', 'social'),
    supabase.from('site_content').select('value').eq('key', 'nav'),
  ])

  const content = pageRes?.content || 'About page coming soon.'
  const socialData = socialRes?.[0]?.value ?? null
  const navData = navRes?.[0]?.value ?? null

  return (
    <>
      <Navbar navData={navData} />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl text-[var(--color-text)] uppercase mb-8">{pageRes?.title || 'About Us'}</h1>
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
