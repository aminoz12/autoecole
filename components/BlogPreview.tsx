'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  category: string
  published_at: string
}

interface BlogPreviewProps {
  posts: BlogPost[]
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Permis': 'bg-blue-100 text-blue-700',
      'Code': 'bg-purple-100 text-purple-700',
      'Conduite': 'bg-green-100 text-green-700',
      'Conseils': 'bg-amber-100 text-amber-700',
      'Actualités': 'bg-red-100 text-red-700',
      'Sécurité': 'bg-orange-100 text-orange-700',
      'Assurance': 'bg-cyan-100 text-cyan-700',
    }
    return colors[category] || 'bg-primary/10 text-primary'
  }

  return (
    <section className="py-16 bg-white" id="blog">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Nos derniers <span className="text-primary">articles</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Conseils, astuces et actualités pour réussir votre permis
          </motion.p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.slice(0, 5).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className={`relative ${index === 0 ? 'h-64' : 'h-48'} bg-gradient-to-br from-primary/10 to-secondary/10`}>
                  {post.featured_image ? (
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Tag className="w-16 h-16 text-primary opacity-20" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Category */}
                  <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </div>

                  {/* Title */}
                  <h3 className={`font-bold text-gray-900 mb-2 hover:text-primary transition-colors line-clamp-2 ${
                    index === 0 ? 'text-2xl' : 'text-xl'
                  }`}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Voir tous les articles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}


