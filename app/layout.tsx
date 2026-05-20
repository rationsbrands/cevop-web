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
  title: 'Cevop — Restaurant Operations Platform',
  description: 'QR ordering, live kitchen display, and real-time management for restaurants. No app download required. Start free for 14 days.',
  openGraph: {
    title: 'Cevop — Restaurant Operations Platform',
    description: 'QR ordering, live kitchen display, and real-time management for restaurants. No app download required. Start free for 14 days.',
    type: 'website',
    siteName: 'Cevop',
    url: 'https://cevop.com',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Cevop — Restaurant Operations Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cevop — Restaurant Operations Platform',
    description: 'QR ordering, live kitchen display, and real-time management for restaurants.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: 'https://cevop.com',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00B3A6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${rethinkSans.variable} ${stixTwoText.variable} ${fragmentMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
