import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlogPost from '@/components/blog/BlogPost'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    return {
      title: 'Article non trouvé',
    }
  }

  return {
    title: post.seo_title || `${post.title} | AutoEcole Pro`,
    description: post.seo_description || post.excerpt,
    keywords: post.seo_keywords?.join(', '),
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  // Fetch the blog post
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    notFound()
  }

  // Increment views count
  await supabase
    .from('blog_posts')
    .update({ views_count: (post.views_count || 0) + 1 })
    .eq('id', post.id)

  // Fetch related posts (same category, exclude current)
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', post.category)
    .eq('is_published', true)
    .neq('id', post.id)
    .limit(3)
    .order('published_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-32">
        <BlogPost post={post} relatedPosts={relatedPosts || []} />
      </div>
      <Footer />
    </main>
  )
}


