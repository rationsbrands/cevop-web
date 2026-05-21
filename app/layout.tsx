import type { Metadata, Viewport } from 'next'
import { Rethink_Sans, STIX_Two_Text, Fragment_Mono } from 'next/font/google'
import './globals.css'
import { getThemeScript } from '@/lib/theme'

const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-rethink',
})

const stixTwoText = STIX_Two_Text({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-stix',
})

const fragmentMono = Fragment_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-fragment',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cevop.com'),
  title: {
    default: 'Cevop — restaurant management software',
    template: '%s | Cevop',
  },
  description:
    'Cevop is the restaurant operations platform built for Nigeria and West Africa. QR ordering, live service display, and real-time management. Free — no credit card required.',
  keywords: [
    'restaurant management software',
    'QR ordering system Nigeria',
    'restaurant operations platform',
    'digital menu QR code',
    'restaurant POS Nigeria',
    'restaurant management app Lagos',
    'QR menu restaurant',
    'online ordering system restaurant',
    'restaurant software West Africa',
    'cevop',
  ],
  authors: [{ name: 'Cevop', url: 'https://cevop.com' }],
  creator: 'Cevop',
  publisher: 'Cevop',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: 'Cevop — restaurant management software',
    description:
      'QR ordering, live service display, and real-time management for restaurants. Free — no credit card required.',
    type: 'website',
    siteName: 'Cevop',
    url: 'https://cevop.com',
    locale: 'en_NG',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Cevop — Restaurant Operations Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cevop',
    creator: '@cevop',
    title: 'Cevop — restaurant management software',
    description:
      'QR ordering, live service display, and real-time management for restaurants. Free — no credit card required.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: 'https://cevop.com',
  },
  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00B3A6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

  return (
    <html lang="en" className={`dark ${rethinkSans.variable} ${stixTwoText.variable} ${fragmentMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__CEVOP_SUPABASE_URL=${JSON.stringify(supabaseUrl)};window.__CEVOP_SUPABASE_ANON_KEY=${JSON.stringify(
              supabaseAnonKey
            )};`,
          }}
        />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Cevop',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              url: 'https://cevop.com',
              description:
                'Restaurant operations platform. QR ordering, live service display, and real-time management for restaurants in Nigeria and West Africa.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'NGN',
                description: 'Free plan available. No credit card required.',
              },
              provider: {
                '@type': 'Organization',
                name: 'Cevop',
                url: 'https://cevop.com',
                email: 'hello@cevop.com',
                sameAs: ['https://twitter.com/cevop', 'https://linkedin.com/company/cevop'],
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
