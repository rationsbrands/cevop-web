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

export const dynamic = 'force-dynamic'


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
      </main>
      <Footer socialData={socialData} />
    </>
  )
}
