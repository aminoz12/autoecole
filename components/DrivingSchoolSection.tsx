'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function DrivingSchoolSection() {
  const features = [
    'Choix de l\'heure, du moniteur et du lieu de RDV.',
    'Accompagnement tout au long de votre formation.',
    'Dès 100€ via votre Compte Personnel de Formation.',
    'Paiement en 4x sans frais.',
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
              <div className="bg-blue-600 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
                1ère auto-école de France
              </div>
              <div className="bg-green-600 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
                +1800 moniteurs
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Votre permis <span className="text-primary">30% moins cher</span> que l'auto-école de votre quartier.
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed">
              Un parcours sur-mesure et un suivi régulier qui allie la théorie à la pratique, une app pour tout gérer : on vous donne les clés, à vous de démarrer.
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
              Je passe mon permis de conduire
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
                src="/im1.png"
                alt="Permis de conduire"
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
