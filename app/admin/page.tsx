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

  // Fetch all user profiles
  const { data: allProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
  }

  // Filter out the current admin user and any profiles without proper user data
  // Admin users typically have specific emails or can be identified by the current user
  const profiles = allProfiles?.filter(profile => 
    profile.id !== user.id && // Exclude the current logged-in admin
    profile.full_name !== 'Admin User' && // Exclude profiles with admin name
    profile.email !== 'walid@autoecole-admin.com' &&
    profile.email !== 'admin@autoecole.local' &&
    profile.email !== 'test@admin.com'
  ) || []

  return (
    <AdminDashboard
      user={user}
      reservations={reservations || []}
      blogPosts={blogPosts || []}
      quizResults={quizResults || []}
      profiles={profiles || []}
    />
  )
}

