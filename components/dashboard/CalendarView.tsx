'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  parseISO
} from 'date-fns'
import { fr } from 'date-fns/locale'

interface Reservation {
  id: string
  status: string
  lessons: {
    lesson_date: string
    start_time: string
    end_time: string
    lesson_type: string
    instructors: {
      name: string
    }
  }
}

interface CalendarViewProps {
  reservations: Reservation[]
}

export default function CalendarView({ reservations }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Get calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Get reservations for a specific day
  const getReservationsForDay = (day: Date) => {
    return reservations.filter(res => {
      const resDate = parseISO(res.lessons.lesson_date)
      return isSameDay(resDate, day)
    })
  }

  // Get reservations for selected date
  const selectedDayReservations = selectedDate ? getReservationsForDay(selectedDate) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'cancelled':
        return 'bg-red-500'
      case 'completed':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
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
        return 'Complétée'
      default:
        return status
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Calendrier des Leçons
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 bg-white/20 rounded-lg font-semibold min-w-[200px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </div>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(day => {
            const dayReservations = getReservationsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isToday = isSameDay(day, new Date())
            const hasReservations = dayReservations.length > 0

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square p-2 rounded-lg text-sm transition-all relative
                  ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                  ${isSelected ? 'bg-primary text-white font-bold' : 'hover:bg-gray-50'}
                  ${isToday && !isSelected ? 'border-2 border-primary font-semibold' : ''}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span>{format(day, 'd')}</span>
                  {hasReservations && (
                    <div className="flex gap-1 mt-1">
                      {dayReservations.slice(0, 3).map((res, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(res.status)}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Confirmée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Complétée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Annulée</span>
          </div>
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </h4>
          
          {selectedDayReservations.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              Aucune leçon prévue ce jour
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDayReservations.map(reservation => (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{reservation.lessons.start_time} - {reservation.lessons.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Moniteur: {reservation.lessons.instructors.name}</span>
                    </div>
                    <div className="text-gray-600">
                      Type: {reservation.lessons.lesson_type === 'conduite' ? 'Conduite' : 
                            reservation.lessons.lesson_type === 'code' ? 'Code' : 
                            'Examen blanc'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

