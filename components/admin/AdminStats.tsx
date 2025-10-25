'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, Users, TrendingUp, Eye, CheckCircle } from 'lucide-react'

interface AdminStatsProps {
  reservations: any[]
  blogPosts: any[]
  quizResults: any[]
}

export default function AdminStats({ reservations, blogPosts, quizResults }: AdminStatsProps) {
  const stats = [
    {
      name: 'Total Réservations',
      value: reservations.length,
      icon: Calendar,
      change: '+12%',
      changeType: 'positive' as const,
      color: 'bg-blue-500',
    },
    {
      name: 'Articles Publiés',
      value: blogPosts.filter(p => p.is_published).length,
      icon: FileText,
      change: `${blogPosts.length} total`,
      changeType: 'neutral' as const,
      color: 'bg-green-500',
    },
    {
      name: 'Quiz Complétés',
      value: quizResults.length,
      icon: CheckCircle,
      change: 'Derniers 10',
      changeType: 'neutral' as const,
      color: 'bg-purple-500',
    },
    {
      name: 'Vues Blog',
      value: blogPosts.reduce((sum, p) => sum + (p.views_count || 0), 0),
      icon: Eye,
      change: 'Total',
      changeType: 'neutral' as const,
      color: 'bg-orange-500',
    },
  ]

  // Recent reservations
  const recentReservations = reservations.slice(0, 5)

  // Popular articles
  const popularArticles = blogPosts
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Two Columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Réservations Récentes</h3>
          {recentReservations.length === 0 ? (
            <p className="text-gray-600 text-sm">Aucune réservation</p>
          ) : (
            <div className="space-y-3">
              {recentReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {reservation.profiles?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {reservation.lessons?.lesson_type || 'Leçon'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    reservation.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : reservation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Articles */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Articles Populaires</h3>
          {popularArticles.length === 0 ? (
            <p className="text-gray-600 text-sm">Aucun article</p>
          ) : (
            <div className="space-y-3">
              {popularArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {article.views_count || 0} vues
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    article.is_published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {article.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


