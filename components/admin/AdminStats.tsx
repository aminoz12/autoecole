'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, Users, TrendingUp, Eye, CheckCircle } from 'lucide-react'

interface AdminStatsProps {
  reservations: any[]
  blogPosts: any[]
  quizResults: any[]
  profiles: any[]
}

export default function AdminStats({ reservations, blogPosts, quizResults, profiles }: AdminStatsProps) {
  // Note: profiles list already excludes admin accounts (filtered at parent level)
  
  // Calculate new users this week
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const newUsersThisWeek = profiles.filter(p => new Date(p.created_at) > weekAgo).length

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
      name: 'Utilisateurs',
      value: profiles.length,
      icon: Users,
      change: `+${newUsersThisWeek} cette semaine`,
      changeType: 'positive' as const,
      color: 'bg-indigo-500',
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

  // Recent accounts (regular users only, admins already filtered)
  const recentAccounts = profiles.slice(0, 5)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

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

      {/* Three Columns */}
      <div className="grid lg:grid-cols-3 gap-6">
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

        {/* Recent Accounts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Nouveaux Comptes</h3>
          {recentAccounts.length === 0 ? (
            <p className="text-gray-600 text-sm">Aucun compte</p>
          ) : (
            <div className="space-y-3">
              {recentAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {account.full_name || 'Sans nom'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDate(account.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 flex-shrink-0">
                    Nouveau
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


