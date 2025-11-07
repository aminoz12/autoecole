'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Car, User, LogOut, Plus, X, CheckCircle, PlayCircle, BookOpen, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import QuizComponent from './QuizComponent'
import { priorityRulesQuiz, roadSignsQuiz, generalCodeQuiz, emergencySituationsQuiz, type Question } from './quizData'
import WhatsAppButton from '@/components/WhatsAppButton'
import TestimonialForm from './TestimonialForm'
import QuizLeaderboard from './QuizLeaderboard'
import MockExamComponent from './MockExamComponent'
import CalendarView from './CalendarView'

interface Reservation {
  id: string
  status: string
  created_at: string
  lessons: {
    lesson_date: string
    start_time: string
    end_time: string
    lesson_type: string
    instructors: {
      name: string
    }
    vehicles: {
      model: string
      transmission_type: string
    } | null
  }
}

interface QuizResult {
  id: string
  quiz_id: string
  quiz_title: string
  score: number
  total_questions: number
  percentage: number
  completed_at: string
}

interface DashboardContentProps {
  user: any
  profile: any
  reservations: Reservation[]
  quizResults: QuizResult[]
}

export default function DashboardContent({ user, profile, reservations, quizResults: initialQuizResults }: DashboardContentProps) {
  const supabase = createClient()
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'reservations' | 'calendar' | 'courses' | 'quiz'>('reservations')
  const [activeQuiz, setActiveQuiz] = useState<{ title: string; id: string; questions: Question[] } | null>(null)
  const [quizResults, setQuizResults] = useState<QuizResult[]>(initialQuizResults)
  const [showMockExam, setShowMockExam] = useState(false)

  // Calculate quiz statistics
  const totalQuizzesTaken = quizResults.length
  const totalCorrectAnswers = quizResults.reduce((sum, result) => sum + result.score, 0)
  const totalQuestionsAnswered = quizResults.reduce((sum, result) => sum + result.total_questions, 0)
  const averagePercentage = totalQuizzesTaken > 0 
    ? Math.round(quizResults.reduce((sum, result) => sum + result.percentage, 0) / totalQuizzesTaken)
    : 0

  // Get best score for each quiz type
  const getBestScore = (quizId: string) => {
    const results = quizResults.filter(r => r.quiz_id === quizId)
    if (results.length === 0) return null
    return results.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    )
  }

  // Refetch quiz results
  const refetchQuizResults = async () => {
    const { data } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
    
    if (data) {
      setQuizResults(data)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleCancelReservation = async (reservationId: string, lessonId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return

    setCancelling(reservationId)
    try {
      // Update reservation status
      await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId)

      // Update lesson status
      await supabase
        .from('lessons')
        .update({ status: 'available' })
        .eq('id', lessonId)

      window.location.reload()
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      alert('Erreur lors de l\'annulation')
    } finally {
      setCancelling(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée'
      case 'pending':
        return 'En attente'
      case 'cancelled':
        return 'Annulée'
      case 'completed':
        return 'Terminée'
      default:
        return status
    }
  }

  const getLessonTypeText = (type: string) => {
    switch (type) {
      case 'conduite':
        return 'Leçon de conduite'
      case 'code':
        return 'Leçon de code'
      case 'examen_blanc':
        return 'Examen blanc'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Tableau de Bord</h1>
              <p className="text-gray-600">Bienvenue, {profile?.full_name || user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="mb-8">
          <Link
            href="/reserver"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all"
          >
            <Plus className="w-5 h-5" />
            Réserver une nouvelle leçon
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Confirmées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reservations.filter((r) => r.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reservations.filter((r) => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Car className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reservations.filter((r) => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'reservations'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Liste
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'calendar'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Calendrier
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'courses'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <PlayCircle className="w-5 h-5" />
              Cours en ligne
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'quiz'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Quiz
            </button>
          </div>
        </div>

        {/* Reservations List */}
        {activeTab === 'reservations' && (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Mes Réservations</h2>
              </div>

              {reservations.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune réservation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Vous n'avez pas encore réservé de leçon
                  </p>
                  <Link
                    href="/reserver"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Réserver maintenant
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {reservations.map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                reservation.status
                              )}`}
                            >
                              {getStatusText(reservation.status)}
                            </span>
                            <span className="text-sm text-gray-600">
                              {getLessonTypeText(reservation.lessons.lesson_type)}
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(reservation.lessons.lesson_date).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="w-4 h-4" />
                              <span>
                                {reservation.lessons.start_time} - {reservation.lessons.end_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <User className="w-4 h-4" />
                              <span>Moniteur: {reservation.lessons.instructors.name}</span>
                            </div>
                            {reservation.lessons.vehicles && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Car className="w-4 h-4" />
                                <span>
                                  {reservation.lessons.vehicles.model} (
                                  {reservation.lessons.vehicles.transmission_type})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                          <button
                            onClick={() =>
                              handleCancelReservation(reservation.id, (reservation.lessons as any).id)
                            }
                            disabled={cancelling === reservation.id}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Annuler
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Testimonial Form */}
            <div className="mt-8">
              <TestimonialForm user={user} profile={profile} />
            </div>
          </>
        )}

        {/* Calendar View */}
        {activeTab === 'calendar' && (
          <CalendarView reservations={reservations} />
        )}

        {/* Online Courses Section */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Cours en ligne - Code de la route</h2>
            <p className="text-gray-600 mt-1">Apprenez le code de la route à votre rythme</p>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Course 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-blue-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    12:30
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Règles de priorité</h3>
                  <p className="text-sm text-gray-600 mb-4">Apprenez les règles essentielles de priorité sur la route</p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Regarder
                  </button>
                </div>
              </motion.div>

              {/* Course 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gradient-to-br from-green-500 to-green-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    18:45
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Panneaux de signalisation</h3>
                  <p className="text-sm text-gray-600 mb-4">Maîtrisez tous les panneaux de signalisation routière</p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Regarder
                  </button>
                </div>
              </motion.div>

              {/* Course 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-purple-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    22:15
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Conduite en ville</h3>
                  <p className="text-sm text-gray-600 mb-4">Techniques et règles pour conduire en milieu urbain</p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Regarder
                  </button>
                </div>
              </motion.div>

              {/* Course 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gradient-to-br from-orange-500 to-orange-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    15:20
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Autoroute et voie rapide</h3>
                  <p className="text-sm text-gray-600 mb-4">Règles spécifiques pour la conduite sur autoroute</p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Regarder
                  </button>
                </div>
              </motion.div>

              {/* Course 5 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gradient-to-br from-red-500 to-red-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    10:30
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Stationnement</h3>
                  <p className="text-sm text-gray-600 mb-4">Techniques de stationnement et réglementation</p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Regarder
                  </button>
                </div>
              </motion.div>

              {/* Course 6 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gradient-to-br from-teal-500 to-teal-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    14:00
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Sécurité routière</h3>
                  <p className="text-sm text-gray-600 mb-4">Distance de sécurité et comportements préventifs</p>
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Regarder
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
          </div>
        )}

        {/* Quiz Section */}
        {activeTab === 'quiz' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quiz - Testez vos connaissances</h2>
            <p className="text-gray-600 mt-1">Entraînez-vous avec nos quiz thématiques</p>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quiz 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Quiz - Règles de priorité</h3>
                    <p className="text-sm text-gray-600 mb-4">5 questions • 5 minutes</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        Meilleur score: <span className="font-semibold text-primary">
                          {getBestScore('priority-rules') ? `${getBestScore('priority-rules')!.score}/${getBestScore('priority-rules')!.total_questions}` : '--'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className={`w-4 h-4 ${getBestScore('priority-rules') ? 'text-yellow-500' : 'text-gray-300'}`} />
                        <span className={`text-sm font-semibold ${getBestScore('priority-rules') ? 'text-gray-900' : 'text-gray-400'}`}>
                          {getBestScore('priority-rules') ? `${getBestScore('priority-rules')!.percentage}%` : '--'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveQuiz({ title: 'Quiz - Règles de priorité', id: 'priority-rules', questions: priorityRulesQuiz })}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {getBestScore('priority-rules') ? 'Recommencer' : 'Commencer le quiz'}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Quiz 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BookOpen className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Quiz - Panneaux de signalisation</h3>
                    <p className="text-sm text-gray-600 mb-4">5 questions • 5 minutes</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        Meilleur score: <span className="font-semibold text-primary">
                          {getBestScore('road-signs') ? `${getBestScore('road-signs')!.score}/${getBestScore('road-signs')!.total_questions}` : '--'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className={`w-4 h-4 ${getBestScore('road-signs') ? 'text-yellow-500' : 'text-gray-300'}`} />
                        <span className={`text-sm font-semibold ${getBestScore('road-signs') ? 'text-gray-900' : 'text-gray-400'}`}>
                          {getBestScore('road-signs') ? `${getBestScore('road-signs')!.percentage}%` : '--'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveQuiz({ title: 'Quiz - Panneaux de signalisation', id: 'road-signs', questions: roadSignsQuiz })}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {getBestScore('road-signs') ? 'Recommencer' : 'Commencer le quiz'}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Quiz 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Quiz - Code général</h3>
                    <p className="text-sm text-gray-600 mb-4">5 questions • 5 minutes</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        Meilleur score: <span className="font-semibold text-primary">
                          {getBestScore('general-code') ? `${getBestScore('general-code')!.score}/${getBestScore('general-code')!.total_questions}` : '--'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className={`w-4 h-4 ${getBestScore('general-code') ? 'text-yellow-500' : 'text-gray-300'}`} />
                        <span className={`text-sm font-semibold ${getBestScore('general-code') ? 'text-gray-900' : 'text-gray-400'}`}>
                          {getBestScore('general-code') ? `${getBestScore('general-code')!.percentage}%` : '--'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveQuiz({ title: 'Quiz - Code général', id: 'general-code', questions: generalCodeQuiz })}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {getBestScore('general-code') ? 'Recommencer' : 'Commencer le quiz'}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Quiz 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <BookOpen className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Quiz - Situations d'urgence</h3>
                    <p className="text-sm text-gray-600 mb-4">5 questions • 5 minutes</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        Meilleur score: <span className="font-semibold text-primary">
                          {getBestScore('emergency-situations') ? `${getBestScore('emergency-situations')!.score}/${getBestScore('emergency-situations')!.total_questions}` : '--'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className={`w-4 h-4 ${getBestScore('emergency-situations') ? 'text-yellow-500' : 'text-gray-300'}`} />
                        <span className={`text-sm font-semibold ${getBestScore('emergency-situations') ? 'text-gray-900' : 'text-gray-400'}`}>
                          {getBestScore('emergency-situations') ? `${getBestScore('emergency-situations')!.percentage}%` : '--'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveQuiz({ title: 'Quiz - Situations d\'urgence', id: 'emergency-situations', questions: emergencySituationsQuiz })}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {getBestScore('emergency-situations') ? 'Recommencer' : 'Commencer le quiz'}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Mock Exam Card - PREMIUM */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative border-2 border-primary rounded-lg p-6 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  EXAMEN BLANC
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Examen Blanc - 40 Questions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Conditions réelles d'examen • 30 minutes • 35 bonnes réponses requises
                    </p>
                    <button 
                      onClick={() => setShowMockExam(true)}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
                    >
                      Lancer l'examen blanc
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Quiz Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors"
              >
                <div className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full mb-4">
                    <Award className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Votre progression globale</h3>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div>
                      <div className="text-3xl font-bold text-primary">{totalQuizzesTaken}</div>
                      <div className="text-sm text-gray-600">Quiz complétés</div>
                    </div>
                    <div>
                      <div className={`text-3xl font-bold ${totalQuizzesTaken > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {totalQuizzesTaken > 0 ? `${averagePercentage}%` : '--'}
                      </div>
                      <div className="text-sm text-gray-600">Taux de réussite</div>
                    </div>
                    <div>
                      <div className={`text-3xl font-bold ${totalQuestionsAnswered > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                        {totalCorrectAnswers}/{totalQuestionsAnswered}
                      </div>
                      <div className="text-sm text-gray-600">Bonnes réponses</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quiz Leaderboard */}
            <div className="mt-8">
              <QuizLeaderboard />
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizComponent
          quizTitle={activeQuiz.title}
          quizId={activeQuiz.id}
          questions={activeQuiz.questions}
          onClose={async () => {
            setActiveQuiz(null)
            // Stay on quiz tab and refetch results
            setActiveTab('quiz')
            await refetchQuizResults()
          }}
        />
      )}

      {/* Mock Exam Modal */}
      {showMockExam && (
        <MockExamComponent
          onClose={async () => {
            setShowMockExam(false)
            setActiveTab('quiz')
            await refetchQuizResults()
          }}
        />
      )}
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  )
}

