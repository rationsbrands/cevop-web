import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solutions — Grow Sales, Protect Margin & Optimise Labor',
  description:
    'Cevop helps restaurant owners grow sales, protect margins, and optimise labor. Purpose-built solutions for single restaurants and multi-location chains in Nigeria.',
  alternates: {
    canonical: 'https://cevop.com/solutions',
  },
  openGraph: {
    title: 'Cevop Solutions — For Nigerian Restaurant Owners',
    description: 'Grow sales, protect margin, and optimise labor. Solutions built for restaurants in Nigeria and West Africa.',
    url: 'https://cevop.com/solutions',
  },
}

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
