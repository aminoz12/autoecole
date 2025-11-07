'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface LeaderboardEntry {
  user_id: string
  full_name: string
  total_quizzes: number
  average_score: number
  total_score: number
  rank: number
}

export default function QuizLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      // Fetch quiz results with user profiles
      const { data: results, error } = await supabase
        .from('quiz_results')
        .select('user_id, score, percentage, profiles(full_name)')
        .order('completed_at', { ascending: false })

      if (error) throw error

      // Group by user and calculate stats
      const userStats = results.reduce((acc: any, result: any) => {
        const userId = result.user_id
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            full_name: result.profiles?.full_name || 'Élève',
            total_quizzes: 0,
            total_score: 0,
            scores: []
          }
        }
        acc[userId].total_quizzes++
        acc[userId].total_score += result.score
        acc[userId].scores.push(result.percentage)
        return acc
      }, {})

      // Calculate averages and create leaderboard
      const leaderboardData = Object.values(userStats).map((user: any) => ({
        user_id: user.user_id,
        full_name: user.full_name,
        total_quizzes: user.total_quizzes,
        total_score: user.total_score,
        average_score: Math.round(user.scores.reduce((sum: number, s: number) => sum + s, 0) / user.scores.length),
        rank: 0
      }))

      // Sort by average score and assign ranks
      leaderboardData.sort((a: any, b: any) => b.average_score - a.average_score)
      leaderboardData.forEach((entry: any, index) => {
        entry.rank = index + 1
      })

      setLeaderboard(leaderboardData.slice(0, 10) as LeaderboardEntry[])
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <Award className="w-5 h-5 text-gray-400" />
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8" />
          <h3 className="text-2xl font-bold">Classement des Quiz</h3>
        </div>
        <p className="text-white/90">Les meilleurs élèves du mois</p>
      </div>

      <div className="p-6">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucun résultat pour le moment</p>
            <p className="text-sm mt-2">Soyez le premier à apparaître dans le classement !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:shadow-md ${
                  entry.rank <= 3 ? 'bg-gradient-to-r from-gray-50 to-white border-2 border-primary/20' : 'bg-gray-50'
                }`}
              >
                {/* Rank */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${getRankBadge(entry.rank)}`}>
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{entry.full_name}</p>
                  <p className="text-sm text-gray-600">
                    {entry.total_quizzes} quiz complété{entry.total_quizzes > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className={`text-2xl font-bold ${
                      entry.average_score >= 90 ? 'text-green-600' :
                      entry.average_score >= 75 ? 'text-blue-600' :
                      entry.average_score >= 60 ? 'text-amber-600' : 'text-gray-600'
                    }`}>
                      {entry.average_score}%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Moyenne</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-gray-700 text-center">
            💡 <strong>Astuce :</strong> Complétez plus de quiz pour améliorer votre classement !
          </p>
        </div>
      </div>
    </div>
  )
}

