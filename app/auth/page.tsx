'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'signup'>('login')

  const handleSuccess = () => {
    // Redirect will happen in the form itself
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-orange-100 flex items-center justify-center p-4">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-primary transition-colors z-50"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Retour à l'accueil</span>
      </Link>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Tabs */}
          <div className="bg-gradient-to-r from-primary to-orange-500 p-8 text-white">
            <h1 className="text-3xl font-bold text-center mb-6">
              Bienvenue chez AutoÉcole
            </h1>
            
            {/* Tab Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setView('login')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  view === 'login'
                    ? 'bg-white text-primary shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setView('signup')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  view === 'signup'
                    ? 'bg-white text-primary shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Inscription
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: view === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'login' ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Connectez-vous
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Accédez à votre espace personnel
                  </p>
                  <LoginForm onSuccess={handleSuccess} />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Créez votre compte
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Commencez votre formation dès maintenant
                  </p>
                  <SignupForm onSuccess={handleSuccess} />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}



