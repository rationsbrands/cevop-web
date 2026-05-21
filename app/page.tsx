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
  title: 'Restaurant Management Software Nigeria | Free QR Ordering System',
  description:
    'The #1 restaurant operations platform in Nigeria. QR ordering, live kitchen display, real-time management. Free forever — no app download, no credit card. Live in 10 minutes.',
  alternates: {
    canonical: 'https://cevop.com',
  },
  openGraph: {
    title: 'Restaurant Management Software Nigeria | Cevop',
    description:
      'QR ordering, live service display, and real-time management. Free forever plan — no credit card, no app download.',
    url: 'https://cevop.com',
  },
}


export default async function Home() {
  let heroData: any = null
  let socialData: any = null
  let navData: any = null
  let pricingData: any[] = []
  let faqData: any[] = []
  let testimonialData: any = null
  let sponsorData: any[] = []

  try {
    const supabase = getSupabaseClient()

    const [
      { data: heroRes },
      { data: socialRes },
      { data: navRes },
      { data: pricingRes },
      { data: faqRes },
      { data: testimonialRes },
      { data: sponsorRes },
    ] = await Promise.all([
      supabase.from('site_content').select('value').eq('key', 'hero'),
      supabase.from('site_content').select('value').eq('key', 'social'),
      supabase.from('site_content').select('value').eq('key', 'nav'),
      supabase.from('pricing_plans').select('*').order('sort_order'),
      supabase.from('faqs').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').eq('is_featured', true).limit(1),
      supabase.from('sponsors').select('*').eq('is_active', true).order('sort_order'),
    ])

    heroData = heroRes?.[0]?.value ?? null
    socialData = socialRes?.[0]?.value ?? null
    navData = navRes?.[0]?.value ?? null
    pricingData = pricingRes ?? []
    faqData = faqRes ?? []
    testimonialData = testimonialRes?.[0] ?? null
    sponsorData = sponsorRes ?? []
} catch (e) {
  console.error('Supabase fetch error:', e)
}
  return (
    <>
      <Navbar navData={navData} />
      <main>
        <Hero data={heroData} />
        <SocialProof sponsors={sponsorData} />
        <Problem />
        <HowItWorks />
        <Features />
        <Pricing plans={pricingData} />
        <Testimonial testimonial={testimonialData} />
        <FAQ faqs={faqData} />
        <FinalCTA email={socialData?.email} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Does the customer need to download an app?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No. Cevop works in any mobile browser. Customers scan the QR code and are taken directly to the menu — no download, no account, no friction.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is there a free plan with no time limit?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. The Cevop free plan is genuinely free forever — no trial period, no credit card, and no hidden expiry. You get 1 branch, up to 5 tables, and 3 staff accounts.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How long does setup take?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Most restaurants are live within 10 minutes. Create your account, add your menu, generate QR codes, print and place them on tables.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I manage multiple restaurant locations?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. The Growth and Enterprise plans support multiple branches, each fully isolated. Your admin dashboard shows all locations.',
                  },
                },
              ],
            }),
          }}
        />
      </main>
      <Footer socialData={socialData} />
    </>
  )
}
