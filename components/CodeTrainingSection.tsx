'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function CodeTrainingSection() {
  const features = [
    '+1500 questions conformes à l&apos;examen 2025.',
    '135 fiches de cours claires et faciles à retenir.',
    'Examens blancs avec corrections détaillées.',
    'Suivi de votre progression grâce à un tableau de bord dédié',
  ]

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
              <div className="bg-green-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
                APP N°1 DE RÉVISION DU CODE
              </div>
              <div className="bg-amber-700 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
                +1M DE TÉLÉCHARGEMENTS
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              La formation code qui vous mène droit au <span className="text-primary">40/40</span>.
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Questions conformes à l&apos;examen officiel, fiches de cours, sessions en live et examens blancs : tout est réuni pour vous faire progresser en toute confiance.
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
                  <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
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
              className="border-2 border-gray-900 bg-white text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-900 hover:text-white transition-all duration-300 w-full sm:w-auto"
            >
              J&apos;obtiens mon code de la route
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
                src="/im0.png"
                alt="Code training"
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
