import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch statistics with error handling
  const { data: reservations, error: resError } = await supabase
    .from('reservations')
    .select('*, lessons(*), profiles(*)')
    .order('created_at', { ascending: false })
  
  if (resError) {
    console.error('Error fetching reservations:', resError)
  }

  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (blogError) {
    console.error('Error fetching blog posts:', blogError)
  }

  const { data: quizResults, error: quizError } = await supabase
    .from('quiz_results')
    .select('*')
    .order('completed_at', { ascending: false })
    .limit(10)
  
  if (quizError) {
    console.error('Error fetching quiz results:', quizError)
  }

  return (
    <AdminDashboard
      user={user}
      reservations={reservations || []}
      blogPosts={blogPosts || []}
      quizResults={quizResults || []}
    />
  )
}

