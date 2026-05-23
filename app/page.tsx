import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { SocialProof } from '@/components/sections/SocialProof'
import { Problem } from '@/components/sections/Problem'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Features } from '@/components/sections/Features'
import { Pricing } from '@/components/sections/Pricing'
import { Testimonial } from '@/components/sections/Testimonial'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { getSupabaseClient } from '@/lib/supabase'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cevop — Restaurant Management Software | Free QR Ordering',
  description:
    'The #1 restaurant operations platform in Nigeria. QR ordering, live kitchen display, real-time management. Free — no app download, no credit card. Live in 10 minutes.',
  alternates: {
    canonical: 'https://cevop.com',
  },
  openGraph: {
    title: 'Cevop — Restaurant Management Software',
    description:
      'QR ordering, live service display, and real-time management. Free plan — no credit card, no app download.',
    url: 'https://cevop.com',
  },
}


export default async function Home() {
  let heroData: any = null
  let socialData: any = null
  let navData: any = null
  let faqData: any[] = []
  let testimonialData: any = null
  let sponsorData: any[] = []
  let allowFallback = false

  try {
    const supabase = getSupabaseClient()

    const [
      { data: heroRes },
      { data: socialRes },
      { data: navRes },
      { data: faqRes },
      { data: testimonialRes },
      { data: sponsorRes },
    ] = await Promise.all([
      supabase.from('site_content').select('value').eq('key', 'hero'),
      supabase.from('site_content').select('value').eq('key', 'social'),
      supabase.from('site_content').select('value').eq('key', 'nav'),
      supabase.from('faqs').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').eq('is_featured', true).limit(1),
      supabase.from('sponsors').select('*').eq('is_active', true).order('sort_order'),
    ])

    heroData = heroRes?.[0]?.value ?? null
    socialData = socialRes?.[0]?.value ?? null
    navData = navRes?.[0]?.value ?? null
    faqData = faqRes ?? []
    testimonialData = testimonialRes?.[0] ?? null
    sponsorData = sponsorRes ?? []
} catch (e) {
  allowFallback = true
  console.error('Supabase fetch error:', e)
}
  return (
    <>
      <Navbar navData={navData} />
      <main>
        <Hero data={heroData} allowFallback={allowFallback} />
        <SocialProof sponsors={sponsorData} allowFallback={allowFallback} />
        <Problem />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonial testimonial={testimonialData} allowFallback={allowFallback} />
        <FAQ faqs={faqData} allowFallback={allowFallback} />
        <FinalCTA email={socialData?.email} />
        {faqData.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqData.map((f) => ({
                  '@type': 'Question',
                  name: f.question,
                  acceptedAnswer: { '@type': 'Answer', text: f.answer },
                })),
              }),
            }}
          />
        )}
      </main>
      <Footer socialData={socialData} />
    </>
  )
}
