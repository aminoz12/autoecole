import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardContent from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch user's reservations
  const { data: reservations } = await supabase
    .from('reservations')
    .select(`
      *,
      lessons (
        *,
        instructors (*),
        vehicles (*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch quiz results
  const { data: quizResults } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  return (
    <DashboardContent
      user={user}
      profile={profile}
      reservations={reservations || []}
      quizResults={quizResults || []}
    />
  )
}

