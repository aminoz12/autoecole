'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Plus, X, Clock, User as UserIcon } from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay
} from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function CalendarManagement() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showSlotModal, setShowSlotModal] = useState(false)

  // Get calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Sample time slots (in real app, fetch from database)
  const [timeSlots, setTimeSlots] = useState([
    { time: '09:00 - 11:00', instructor: 'Jean Dupont', available: true },
    { time: '11:00 - 13:00', instructor: 'Marie Martin', available: true },
    { time: '14:00 - 16:00', instructor: 'Jean Dupont', available: false },
    { time: '16:00 - 18:00', instructor: 'Marie Martin', available: true },
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Gestion du Calendrier
            </h3>
            <p className="text-gray-600 mt-1">
              Gérez les créneaux disponibles pour les réservations
            </p>
          </div>
          <button
            onClick={() => setShowSlotModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter un créneau
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Month Navigator */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ← Mois précédent
            </button>
            <h4 className="text-xl font-bold">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </h4>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              Mois suivant →
            </button>
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
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())
              const isPast = day < new Date() && !isToday

              return (
                <motion.button
                  key={day.toISOString()}
                  whileHover={{ scale: isPast ? 1 : 1.05 }}
                  whileTap={{ scale: isPast ? 1 : 0.95 }}
                  onClick={() => !isPast && setSelectedDate(day)}
                  disabled={isPast}
                  className={`
                    aspect-square p-2 rounded-lg text-sm transition-all
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                    ${isSelected ? 'bg-primary text-white font-bold' : 'hover:bg-gray-50'}
                    ${isToday && !isSelected ? 'border-2 border-primary font-semibold' : ''}
                    ${isPast ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {format(day, 'd')}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Day Slots */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Créneaux disponibles - {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </h4>

          <div className="space-y-3">
            {timeSlots.map((slot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  slot.available 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">{slot.time}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserIcon className="w-4 h-4" />
                      <span>{slot.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    slot.available 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {slot.available ? 'Disponible' : 'Réservé'}
                  </span>
                  <button
                    onClick={() => {
                      setTimeSlots(prev => prev.map((s, i) => 
                        i === index ? { ...s, available: !s.available } : s
                      ))
                      toast.success(slot.available ? 'Créneau bloqué' : 'Créneau débloqué')
                    }}
                    className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    {slot.available ? 'Bloquer' : 'Débloquer'}
                  </button>
                  <button
                    onClick={() => {
                      setTimeSlots(prev => prev.filter((_, i) => i !== index))
                      toast.success('Créneau supprimé')
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {timeSlots.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>Aucun créneau défini pour cette date</p>
              <button
                onClick={() => setShowSlotModal(true)}
                className="mt-4 text-primary hover:underline"
              >
                Ajouter un créneau
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Ajouter un créneau</h3>
              <button
                onClick={() => setShowSlotModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de début
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fin
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moniteur
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Jean Dupont</option>
                  <option>Marie Martin</option>
                  <option>Pierre Bernard</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSlotModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    toast.success('Créneau ajouté avec succès')
                    setShowSlotModal(false)
                  }}
                  className="flex-1 btn-primary"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Comment utiliser ce calendrier</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Sélectionnez une date pour voir/gérer les créneaux</li>
          <li>• Bloquez les créneaux non disponibles</li>
          <li>• Ajoutez des créneaux récurrents pour les semaines à venir</li>
          <li>• Les élèves ne peuvent réserver que les créneaux disponibles</li>
        </ul>
      </div>
    </div>
  )
}

