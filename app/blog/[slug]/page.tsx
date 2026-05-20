import { getSupabaseClient } from '@/lib/supabase'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 0

// A very simple markdown renderer (since we don't have a library installed yet)
function renderMarkdown(content: string) {
  return content
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-6">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-[var(--color-accent)] hover:underline">$1</a>')
    .replace(/\n\n/gim, '</p><p class="mb-6 leading-relaxed">')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[var(--color-accent)] pl-4 italic my-6">$1</blockquote>')
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  let navData: any = null
  let socialData: any = null
  let post: any = null

  try {
    const supabase = getSupabaseClient()
    const [
      { data: navRes },
      { data: socialRes },
      { data: postRes },
    ] = await Promise.all([
      supabase.from('site_content').select('value').eq('key', 'nav'),
      supabase.from('site_content').select('value').eq('key', 'social'),
      supabase.from('blog_posts').select('*').eq('slug', params.slug).single(),
    ])

    navData = navRes?.[0]?.value ?? null
    socialData = socialRes?.[0]?.value ?? null
    post = postRes
  } catch {
    notFound()
  }

  if (!post || (!post.is_published && process.env.NODE_ENV === 'production')) {
    notFound()
  }
  
  // Wrap content in initial p tag
  const htmlContent = `<p class="mb-6 leading-relaxed">${renderMarkdown(post.content)}</p>`

  return (
    <>
      <Navbar navData={navData} />
      <main className="min-h-screen pt-32 pb-24 px-4 bg-[var(--color-bg)]">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-sm font-bold text-[var(--color-accent)] hover:underline mb-8 inline-block">&larr; Back to Blog</Link>
          
          <article>
            <header className="mb-12 pb-12 border-b border-[var(--color-border)]">
              <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-text)] mb-6 uppercase leading-tight">{post.title}</h1>
              {post.published_at && (
                <p className="text-sm text-[var(--color-muted)] font-bold tracking-widest uppercase">
                  {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
              {!post.is_published && (
                <span className="inline-block mt-4 text-xs bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full font-bold">DRAFT</span>
              )}
            </header>
            
            <div 
              className="prose prose-invert max-w-none text-[var(--color-text)]"
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          </article>
        </div>
      </main>
      <Footer socialData={socialData} />
    </>
  )
}
