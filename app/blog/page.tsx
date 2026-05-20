import { getSupabaseClient } from '@/lib/supabase'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export const revalidate = 0

export default async function BlogIndex() {
  let navData: any = null
  let socialData: any = null
  let posts: any[] = []

  try {
    const supabase = getSupabaseClient()
    const [
      { data: navRes },
      { data: socialRes },
      { data: postsRes },
    ] = await Promise.all([
      supabase.from('site_content').select('value').eq('key', 'nav'),
      supabase.from('site_content').select('value').eq('key', 'social'),
      supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false }),
    ])

    navData = navRes?.[0]?.value ?? null
    socialData = socialRes?.[0]?.value ?? null
    posts = postsRes ?? []
  } catch {}

  return (
    <>
      <Navbar navData={navData} />
      <main className="min-h-screen pt-32 pb-24 px-4 bg-[var(--color-bg)]">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-5xl text-[var(--color-text)] mb-4 uppercase">Blog</h1>
          <p className="text-[var(--color-muted)] text-lg mb-16">Latest updates, guides, and restaurant operations advice.</p>
          
          <div className="space-y-8">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                  <article className="p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] group-hover:border-[var(--color-accent)] transition-colors">
                    <p className="text-xs text-[var(--color-accent)] font-bold tracking-widest uppercase mb-3">
                      {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h2 className="text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-4">{post.title}</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed">{post.excerpt}</p>
                  </article>
                </Link>
              ))
            ) : (
              <p className="text-[var(--color-muted)]">No posts published yet.</p>
            )}
          </div>
        </div>
      </main>
      <Footer socialData={socialData} />
    </>
  )
}
