'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function MediaSection() {
  // Using all 8 .avif images from public folder
  const mediaLogos = [
    { src: '/1.avif' },
    { src: '/2.avif' },
    { src: '/3.avif' },
    { src: '/4.avif' },
    { src: '/5.avif' },
    { src: '/6.avif' },
    { src: '/7.avif' },
    { src: '/8.avif' },
  ]

  // Duplicate the logos for seamless loop
  const duplicatedLogos = [...mediaLogos, ...mediaLogos]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Ces <span className="text-primary">médias</span> parlent de nous.
          </h2>
        </motion.div>

        {/* Sliding Logos */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{
              x: ['0%', '-50%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex items-center space-x-12"
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`logo-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-16 w-32"
              >
                <Image
                  src={logo.src}
                  alt=""
                  width={120}
                  height={60}
                  className="max-h-16 w-auto object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
