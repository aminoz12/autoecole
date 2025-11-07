'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function InsuranceSection() {
  const features = [
    'Conseillers disponibles dun lundi au samedi.',
    'Dépannage en 1h, 24h/24.',
    'Plus de 10 ans d\'expertise.',
    'Parcours 100% digital',
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Labels */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-orange-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
                430€ d'économie moyenne
              </div>
              <div className="bg-purple-600 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
                Plus de 100 000 assurés
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Assuré dans l'heure, <span className="text-primary">rassuré</span> pour longtemps.
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed">
              Des formules claires, des garanties utiles, un accompagnement humain et l'expertise de la sécurité routière d'Ornikar à vos côtés, le tout bien moins cher.
            </p>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-900 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              J'assure ma voiture
            </motion.button>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-lg">
              <Image
                src="/im2.png"
                alt="Assurance auto"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
