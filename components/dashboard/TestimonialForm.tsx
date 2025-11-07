'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface TestimonialFormProps {
  user: any
  profile: any
}

export default function TestimonialForm({ user, profile }: TestimonialFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      toast.error('Veuillez écrire un commentaire')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          user_id: user.id,
          full_name: profile?.full_name || 'Élève',
          rating,
          comment: comment.trim()
        })

      if (error) throw error

      toast.success('Merci pour votre témoignage ! Il sera publié après modération.')
      setComment('')
      setRating(5)
    } catch (error) {
      console.error('Error submitting testimonial:', error)
      toast.error('Erreur lors de l\'envoi du témoignage')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Partagez votre expérience
      </h3>
      <p className="text-gray-600 mb-6">
        Votre avis compte ! Partagez votre expérience pour aider d'autres élèves.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre note
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Votre témoignage
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Partagez votre expérience avec AutoÉcole..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Envoyer mon témoignage
            </>
          )}
        </motion.button>

        <p className="text-xs text-gray-500 text-center">
          Votre témoignage sera vérifié avant publication
        </p>
      </form>
    </div>
  )
}

