'use client'

import { motion } from 'framer-motion'
import { Check, Star, Clock, Car } from 'lucide-react'

export default function PricingSection() {
  const pricingPlans = [
    {
      name: 'Découverte',
      price: '45',
      period: 'par leçon',
      description: 'Parfait pour commencer votre apprentissage',
      features: [
        '1 leçon de conduite (1h)',
        'Moniteur diplômé',
        'Véhicule moderne',
        'Assurance incluse',
        'Évaluation de niveau',
      ],
      popular: false,
      color: 'border-gray-200',
      buttonText: 'Réserver',
    },
    {
      name: 'Pack 10h',
      price: '420',
      period: '10 leçons',
      description: 'Le plus populaire pour progresser rapidement',
      features: [
        '10 leçons de conduite (1h chacune)',
        'Moniteur dédié',
        'Véhicule moderne',
        'Assurance incluse',
        'Suivi personnalisé',
        'Code de la route inclus',
        'Préparation à l\'examen',
      ],
      popular: true,
      color: 'border-primary',
      buttonText: 'Choisir ce pack',
    },
    {
      name: 'Formation complète',
      price: '1,200',
      period: 'jusqu\'au permis',
      description: 'Formation complète jusqu\'à l\'obtention du permis',
      features: [
        'Leçons illimitées jusqu\'au permis',
        'Moniteur dédié',
        'Véhicule moderne',
        'Assurance incluse',
        'Code de la route complet',
        'Préparation intensive',
        'Garantie de réussite',
        'Suivi post-permis',
      ],
      popular: false,
      color: 'border-secondary',
      buttonText: 'Formation complète',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section id="tarifs" className="section-padding bg-neutral">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Nos <span className="text-primary">tarifs</span> transparents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez la formule qui correspond le mieux à vos besoins et à votre budget. 
            Tous nos tarifs incluent l'assurance et l'essence.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${plan.color} ${
                plan.popular ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1"
                  >
                    <Star className="h-4 w-4" />
                    <span>Le plus populaire</span>
                  </motion.div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}€
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 + featureIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3"
                    >
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.a
                  href="/auth"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 block text-center ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-orange-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Questions sur nos tarifs ?
            </h3>
            <p className="text-gray-600 mb-6">
              Nos conseillers sont là pour vous aider à choisir la formule la plus adaptée à votre situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Clock className="h-5 w-5" />
                <span>Prendre rendez-vous</span>
              </motion.a>
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Car className="h-5 w-5" />
                <span>Essai gratuit</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

