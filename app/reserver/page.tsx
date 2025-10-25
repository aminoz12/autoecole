import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingContent from '@/components/booking/BookingContent'

export default async function ReserverPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch available lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select(`
      *,
      instructors (*),
      vehicles (*)
    `)
    .eq('status', 'available')
    .gte('lesson_date', new Date().toISOString().split('T')[0])
    .order('lesson_date', { ascending: true })
    .order('start_time', { ascending: true })

  // Fetch all instructors
  const { data: instructors } = await supabase
    .from('instructors')
    .select('*')
    .eq('active', true)

  return <BookingContent user={user} lessons={lessons || []} instructors={instructors || []} />
}

