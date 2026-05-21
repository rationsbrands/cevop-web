import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Stories — Restaurants Growing with Cevop',
  description:
    'See how independent restaurants and chains across Nigeria and West Africa are using Cevop to grow sales, cut waste, and run tighter operations.',
  alternates: {
    canonical: 'https://cevop.com/customers',
  },
  openGraph: {
    title: 'Restaurant Success Stories | Cevop Customers',
    description: 'Real results from real restaurants using Cevop across Nigeria and West Africa.',
    url: 'https://cevop.com/customers',
  },
}

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
