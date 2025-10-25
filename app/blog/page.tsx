import { createClient } from '@/lib/supabase/server'
import BlogList from '@/components/blog/BlogList'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Blog - AutoEcole Pro | Conseils et Actualités',
  description: 'Découvrez nos articles sur le code de la route, le permis de conduire, la sécurité routière et l\'assurance automobile.',
}

export default async function BlogPage() {
  const supabase = await createClient()

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-32">
        <BlogList posts={posts || []} categories={categories || []} />
      </div>
      <Footer />
    </main>
  )
}


