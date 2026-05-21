import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Cevop — Book a Demo',
  description:
    'Book a 15-minute demo with the Cevop team. See how QR ordering and real-time restaurant management can grow your sales. Available for restaurants in Nigeria, UK, and West Africa.',
  alternates: {
    canonical: 'https://cevop.com/contact',
  },
  openGraph: {
    title: 'Contact Cevop — Book a Restaurant Management Demo',
    description: 'Book a 15-minute demo to see how Cevop can help your restaurant grow sales and protect margins.',
    url: 'https://cevop.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
