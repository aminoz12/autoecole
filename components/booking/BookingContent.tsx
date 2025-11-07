'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Car, User, Filter, ArrowLeft, CheckCircle, List, CalendarDays } from 'lucide-react'
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
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [currentMonth, setCurrentMonth] = useState(new Date())

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

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getLessonsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return lessonsByDate[dateString] || []
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)

  const previousMonth = () => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonthNum = today.getMonth()
    
    // Don't allow going to previous months before current month
    if (
      currentMonth.getFullYear() > currentYear ||
      (currentMonth.getFullYear() === currentYear && currentMonth.getMonth() > currentMonthNum)
    ) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  // Check if we can go to previous month
  const canGoPrevious = () => {
    const today = new Date()
    return (
      currentMonth.getFullYear() > today.getFullYear() ||
      (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() > today.getMonth())
    )
  }

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">Calendrier</span>
                <span className="sm:hidden">Cal.</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                Liste
              </button>
            </div>
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

        {/* Calendar View */}
        {viewMode === 'calendar' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-200">
              {/* Today's date banner */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-900">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Aujourd'hui : {new Date().toLocaleDateString('fr-FR', { 
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                    <p className="text-sm text-blue-700">Seules les leçons à partir d'aujourd'hui sont affichées</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    disabled={!canGoPrevious()}
                    className={`p-2 rounded-lg transition-colors ${
                      canGoPrevious()
                        ? 'hover:bg-gray-100 text-gray-700'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                    title={canGoPrevious() ? 'Mois précédent' : 'Impossible de revenir en arrière'}
                  >
                    ←
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                    title="Mois suivant"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Days of the month - only show from today onwards */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const date = new Date(year, month, day)
                  const dayLessons = getLessonsForDate(date)
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const dateToCompare = new Date(date)
                  dateToCompare.setHours(0, 0, 0, 0)
                  const isToday = dateToCompare.getTime() === today.getTime()
                  const isPast = dateToCompare < today

                  // Skip past dates completely - don't render them
                  if (isPast) {
                    return null
                  }

                  // For the first visible day (today), add empty cells to align with correct day of week
                  const emptyCellsBefore = isToday && date.getDay() > 0 ? (
                    Array.from({ length: date.getDay() }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="aspect-square" />
                    ))
                  ) : null

                  return (
                    <React.Fragment key={day}>
                      {emptyCellsBefore}
                      <div
                        className={`aspect-square border rounded-lg p-2 transition-all ${
                          dayLessons.length > 0
                            ? 'bg-primary/5 border-primary cursor-pointer hover:bg-primary/10 hover:shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        } ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {day}
                          {isToday && <span className="ml-1 text-primary">•</span>}
                        </div>
                        {dayLessons.length > 0 && (
                          <div className="text-xs">
                            <div className="bg-primary text-white rounded px-1 py-0.5 text-center font-medium">
                              {dayLessons.length} leçon{dayLessons.length > 1 ? 's' : ''}
                            </div>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>

              {/* Calendar Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-primary bg-primary/5"></div>
                  <span>Leçons disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-primary"></div>
                  <span>Aujourd'hui</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-gray-200 bg-white"></div>
                  <span>Jours sans leçon</span>
                </div>
              </div>

              {/* Selected Day Lessons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  📅 Leçons disponibles à partir d'aujourd'hui
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })} et après
                </p>
                {(() => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  
                  const futureLessons = Object.entries(lessonsByDate)
                    .filter(([dateString]) => {
                      const lessonDate = new Date(dateString)
                      lessonDate.setHours(0, 0, 0, 0)
                      return (
                        lessonDate.getMonth() === month &&
                        lessonDate.getFullYear() === year &&
                        lessonDate >= today // Only show lessons from today onwards
                      )
                    })
                    .flatMap(([, dateLessons]) => dateLessons)
                  
                  return futureLessons.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      Aucune leçon disponible à partir d'aujourd'hui ce mois-ci
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {futureLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${getLessonTypeColor(
                                lesson.lesson_type
                              )}`}
                            >
                              {getLessonTypeText(lesson.lesson_type)}
                            </span>
                            {lesson.price && (
                              <span className="font-bold text-primary">{lesson.price}€</span>
                            )}
                          </div>

                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="w-4 h-4" />
                              {new Date(lesson.lesson_date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="w-4 h-4" />
                              {lesson.start_time} - {lesson.end_time}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <User className="w-4 h-4" />
                              {lesson.instructors.name}
                            </div>
                          </div>

                          <button
                            onClick={() => handleBookLesson(lesson.id)}
                            disabled={booking === lesson.id}
                            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 text-sm"
                          >
                            {booking === lesson.id ? 'Réservation...' : 'Réserver'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </div>
          </motion.div>
        ) : (
          /* List View */
          Object.keys(lessonsByDate).length === 0 ? (
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
          )
        )}
      </div>
    </div>
  )
}

