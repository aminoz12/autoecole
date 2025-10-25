'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Car, User, Filter, ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Lesson {
  id: string
  lesson_date: string
  start_time: string
  end_time: string
  lesson_type: string
  duration_minutes: number
  price: number
  instructors: {
    id: string
    name: string
    photo_url?: string
  }
  vehicles: {
    model: string
    transmission_type: string
  } | null
}

interface Instructor {
  id: string
  name: string
}

interface BookingContentProps {
  user: any
  lessons: Lesson[]
  instructors: Instructor[]
}

export default function BookingContent({ user, lessons, instructors }: BookingContentProps) {
  const supabase = createClient()
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [booking, setBooking] = useState<string | null>(null)

  const filteredLessons = lessons.filter((lesson) => {
    if (selectedInstructor !== 'all' && lesson.instructors.id !== selectedInstructor) return false
    if (selectedType !== 'all' && lesson.lesson_type !== selectedType) return false
    return true
  })

  const handleBookLesson = async (lessonId: string) => {
    if (!confirm('Confirmer la réservation de cette leçon ?')) return

    setBooking(lessonId)
    try {
      const { error } = await supabase.from('reservations').insert({
        user_id: user.id,
        lesson_id: lessonId,
        status: 'pending',
      })

      if (error) throw error

      alert('Réservation effectuée avec succès !')
      window.location.href = '/dashboard'
    } catch (error: any) {
      console.error('Error booking lesson:', error)
      alert(error.message || 'Erreur lors de la réservation')
    } finally {
      setBooking(null)
    }
  }

  const getLessonTypeText = (type: string) => {
    switch (type) {
      case 'conduite':
        return 'Conduite'
      case 'code':
        return 'Code'
      case 'examen_blanc':
        return 'Examen blanc'
      default:
        return type
    }
  }

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'conduite':
        return 'bg-blue-100 text-blue-800'
      case 'code':
        return 'bg-green-100 text-green-800'
      case 'examen_blanc':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Group lessons by date
  const lessonsByDate = filteredLessons.reduce((acc, lesson) => {
    const date = lesson.lesson_date
    if (!acc[date]) acc[date] = []
    acc[date].push(lesson)
    return acc
  }, {} as Record<string, Lesson[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Réserver une Leçon</h1>
              <p className="text-gray-600">Choisissez un créneau disponible</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moniteur
              </label>
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="all">Tous les moniteurs</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de leçon
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="all">Tous les types</option>
                <option value="conduite">Conduite</option>
                <option value="code">Code</option>
                <option value="examen_blanc">Examen blanc</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Lessons List */}
        {Object.keys(lessonsByDate).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-12 text-center"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune leçon disponible
            </h3>
            <p className="text-gray-600">
              Aucune leçon ne correspond à vos critères de recherche
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.entries(lessonsByDate).map(([date, dateLessons], dateIndex) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dateIndex * 0.1 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {new Date(date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dateLessons.map((lesson, lessonIndex) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: lessonIndex * 0.05 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getLessonTypeColor(
                              lesson.lesson_type
                            )}`}
                          >
                            {getLessonTypeText(lesson.lesson_type)}
                          </span>
                          {lesson.price && (
                            <span className="text-lg font-bold text-primary">
                              {lesson.price}€
                            </span>
                          )}
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Clock className="w-4 h-4" />
                            <span>
                              {lesson.start_time} - {lesson.end_time} ({lesson.duration_minutes} min)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <User className="w-4 h-4" />
                            <span>{lesson.instructors.name}</span>
                          </div>
                          {lesson.vehicles && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Car className="w-4 h-4" />
                              <span>
                                {lesson.vehicles.model} ({lesson.vehicles.transmission_type})
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleBookLesson(lesson.id)}
                          disabled={booking === lesson.id}
                          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {booking === lesson.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Réservation...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Réserver
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

