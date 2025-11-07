'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Check, Star, Flag, CheckCircle, Trophy } from 'lucide-react'

export default function FeaturesSection() {
  const services = [
    {
      image: '/code.png',
      checkIcon: Check,
      title: 'CODE DE LA ROUTE : OFFICIEL 2025',
      description: 'Questions conformes à l\'examen officiel 2025.',
      price: 'DÈS 14,99€',
      borderColor: 'border-red-500',
    },
    {
      image: '/permis.png',
      checkIcon: Check,
      title: 'PERMIS DE CONDUIRE : ÉCONOMISEZ 30%',
      description: '30% moins cher qu\'en auto-école traditionnelle.',
      price: 'DÈS 599,99€',
      borderColor: 'border-red-500',
    },
    {
      image: '/assurance.png',
      starIcon: Star,
      title: 'ASSURANCE AUTO NOTÉE 4,7/5',
      description: 'Notée 4,7/5 avec déjà +100 000 assurés.',
      saving: 'ÉCONOMISER 430€',
      borderColor: 'border-blue-400',
    },
    {
      image: '/assurance-habitation.png',
      title: 'ASSURANCE HABITATION COMPLÈTE',
      description: 'Une couverture solide pensée pour chaque imprévu.',
      price: 'DÈS 2,17€',
      borderColor: 'border-orange-500',
    },
  ]

  const badges = [
    {
      icon: Flag,
      title: 'AGRÉÉE PAR L\'ÉTAT',
      description: 'Certification officielle garantissant la qualité de notre formation',
      iconColor: 'text-blue-600',
    },
    {
      icon: CheckCircle,
      title: '50 000 ÉLÈVES ACCOMPAGNÉS AVEC SUCCÈS',
      description: 'Élèves accompagnés avec succès et certifiés.',
      iconColor: 'text-green-500',
    },
    {
      icon: Trophy,
      title: '+10 ANS D\'EXPERTISE',
      description: 'Expertise en sécurité routière reconnue et éprouvée',
      iconColor: 'text-yellow-500',
    },
  ]

  return (
    <section id="formations" className="py-12 md:py-16 bg-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Four Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {services.map((service, index) => {
            const CheckIcon = service.checkIcon
            const StarIcon = service.starIcon
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg border-2 p-8 sm:p-10 flex flex-col min-h-[550px] sm:min-h-[600px] h-full"
              style={{ borderColor: service.borderColor.includes('red') ? '#ef4444' : service.borderColor.includes('blue') ? '#60a5fa' : '#f97316' }}
            >
              {/* Image with Checkmark/Star */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  {service.image && (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  {CheckIcon && (
                    <CheckIcon className="absolute -bottom-1 -right-1 h-7 w-7 text-red-500 bg-white rounded-full" strokeWidth={3} />
                  )}
                  {StarIcon && (
                    <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-blue-400 rounded-full flex items-center justify-center">
                      <StarIcon className="h-4 w-4 text-white" fill="white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-5 uppercase leading-tight break-words overflow-hidden">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-700 mb-8 flex-grow">
                {service.description}
              </p>

              {/* Price or Saving */}
              <div className="mt-auto pt-6 border-t-2 border-gray-300">
                {service.price && (
                  <div className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wider leading-tight">
                    <span className="inline-block">{service.price}</span>
                  </div>
                )}
                {service.saving && (
                  <div className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wider leading-tight">
                    <span className="inline-block">{service.saving}</span>
                  </div>
                )}
              </div>
            </motion.div>
            )
          })}
        </div>

        {/* Three Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {badges.map((badge, index) => {
            const BadgeIcon = badge.icon
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-5 flex items-start gap-4"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                <BadgeIcon className="h-7 w-7" style={{ color: badge.iconColor.includes('blue') ? '#2563eb' : badge.iconColor.includes('green') ? '#22c55e' : '#eab308' }} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase leading-tight">
                  {badge.title}
                </h4>
                <p className="text-xs text-gray-700">
                  {badge.description}
                </p>
              </div>
            </motion.div>
            )
          })}
        </div>

        {/* Footer Text */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-32"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-32"></div>
          </div>
          <p className="text-gray-900 text-2xl sm:text-3xl font-bold tracking-wide">
            Et bien plus encore
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-32"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-32"></div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
