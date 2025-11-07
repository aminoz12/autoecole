'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function PointsRecoverySection() {
  const features = [
    'Financez votre permis, grâce à votre Compte Personnel de Formation.',
    'Récupérez vos points avec nos stages agréés en France.',
    'Accédez à des avantages exclusifs grâce au Club Ornikar.',
    'Assurance, financement, accompagnement : tout réuni.',
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
              <div className="bg-red-600 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
                Stage de Récupération de points
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
                Formations sécurité routière
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Après le permis, on reste à vos <span className="text-primary">côtés</span>.
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed">
              Votre permis n'est que le début. On vous aide à rouler plus loin, à moindre coût, et toujours avec des services pensés pour rendre la vie de conducteur plus simple et plus sereine.
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
              Je cherche un stage de récupération de points
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
                src="/im3.png"
                alt="Récupération de points"
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
