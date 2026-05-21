import { MetadataRoute } from 'next'
import { getSupabaseClient } from '@/lib/supabase'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cevop.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/product`, lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/solutions`, lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/customers`, lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date('2025-01-01'), changeFrequency: 'yearly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  try {
    const supabase = getSupabaseClient()
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...blogRoutes]
  } catch {
    return staticRoutes
  }
}
