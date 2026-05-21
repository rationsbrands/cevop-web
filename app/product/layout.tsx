import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Platform — QR Ordering, Service Display & Restaurant Management',
  description:
    'Discover all Cevop features: QR digital menus, live service display, admin dashboard, waiter call system, and multi-branch control. Built for restaurants in Nigeria and West Africa.',
  alternates: {
    canonical: 'https://cevop.com/product',
  },
  openGraph: {
    title: 'Cevop Platform — QR Ordering & Restaurant Management Features',
    description: 'QR ordering, live service display, multi-branch dashboard, waiter call system. Everything your restaurant needs.',
    url: 'https://cevop.com/product',
  },
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
