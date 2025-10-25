'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Car, Phone, Mail, CheckCircle, XCircle, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Reservation {
  id: string
  status: string
  created_at: string
  user_id: string
  notes: string
  lessons: {
    lesson_date: string
    start_time: string
    end_time: string
    lesson_type: string
    instructors: {
      name: string
      phone: string
    }
    vehicles: {
      model: string
      plate_number: string
    } | null
  }
  profiles: {
    full_name: string
    phone: string
  } | null
}

interface ReservationManagementProps {
  reservations: Reservation[]
}

export default function ReservationManagement({ reservations: initialReservations }: ReservationManagementProps) {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')
  const supabase = createClient()

  // Filter reservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      (reservation.profiles?.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      reservation.lessons.instructors.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filter === 'all' || reservation.status === filter
    
    return matchesSearch && matchesFilter
  })

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setReservations(reservations.map(r => 
        r.id === id ? { ...r, status: newStatus } : r
      ))
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
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

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    completed: reservations.filter(r => r.status === 'completed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600 capitalize">{key === 'total' ? 'Total' : getStatusText(key)}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Tous' : getStatusText(f)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600">Aucune réservation trouvée</p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Info */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {reservation.profiles?.full_name || 'Utilisateur'}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{getLessonTypeText(reservation.lessons.lesson_type)}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(reservation.lessons.lesson_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{reservation.lessons.start_time} - {reservation.lessons.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Moniteur: {reservation.lessons.instructors.name}</span>
                    </div>
                    {reservation.lessons.vehicles && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span>{reservation.lessons.vehicles.model} ({reservation.lessons.vehicles.plate_number})</span>
                      </div>
                    )}
                    {reservation.profiles?.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{reservation.profiles.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {reservation.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{reservation.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="lg:w-48 flex lg:flex-col gap-2">
                  {reservation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirmer
                      </button>
                      <button
                        onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Annuler
                      </button>
                    </>
                  )}

                  {reservation.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(reservation.id, 'completed')}
                        className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Marquer terminée
                      </button>
                      <button
                        onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                        className="flex-1 lg:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Annuler
                      </button>
                    </>
                  )}

                  {(reservation.status === 'completed' || reservation.status === 'cancelled') && (
                    <div className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-center text-sm">
                      {reservation.status === 'completed' ? 'Terminée' : 'Annulée'}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}


