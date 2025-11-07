'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, AlertCircle, CheckCircle, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { mockExamQuestions, type MockExamQuestion } from './mockExamData'

interface MockExamComponentProps {
  onClose: () => void
}

export default function MockExamComponent({ onClose }: MockExamComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(mockExamQuestions.length).fill(-1))
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  // Timer countdown
  useEffect(() => {
    if (showResults || timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinishExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showResults, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleFinishExam = async () => {
    // Calculate score
    let correctCount = 0
    mockExamQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    // Save to database
    await saveExamResults(correctCount)
  }

  const saveExamResults = async (correctCount: number) => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const percentage = Math.round((correctCount / mockExamQuestions.length) * 100)
      const timeTaken = 30 * 60 - timeLeft

      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_id: 'mock-exam',
          quiz_title: 'Examen Blanc (40 questions)',
          score: correctCount,
          total_questions: mockExamQuestions.length,
          percentage: percentage,
          time_taken_seconds: timeTaken
        })

      if (error) throw error
      toast.success('Résultats enregistrés !')
    } catch (error) {
      console.error('Error saving exam results:', error)
    } finally {
      setSaving(false)
    }
  }

  const answeredCount = answers.filter(a => a !== -1).length
  const percentage = showResults ? Math.round((score / mockExamQuestions.length) * 100) : 0
  const passed = percentage >= 35 // 35/40 correct to pass

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Examen Blanc</h2>
            <p className="text-white/90">40 questions - Conditions réelles d'examen</p>
          </div>
          <div className="flex items-center gap-4">
            {!showResults && (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'animate-pulse text-red-300' : ''}`} />
                <span className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-300' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!showResults ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                  <span>Question {currentQuestion + 1} / {mockExamQuestions.length}</span>
                  <span>{answeredCount} réponse{answeredCount > 1 ? 's' : ''} donnée{answeredCount > 1 ? 's' : ''}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / mockExamQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mb-6"
                >
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {currentQuestion + 1}
                      </div>
                      <p className="text-lg font-medium text-gray-900 flex-1">
                        {mockExamQuestions[currentQuestion].question}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Catégorie: {mockExamQuestions[currentQuestion].category}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {mockExamQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          answers[currentQuestion] === index
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            answers[currentQuestion] === index
                              ? 'border-primary bg-primary'
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion] === index && (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                
                {currentQuestion === mockExamQuestions.length - 1 ? (
                  <button
                    onClick={handleFinishExam}
                    className="btn-primary"
                  >
                    Terminer l'examen
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(Math.min(mockExamQuestions.length - 1, currentQuestion + 1))}
                    className="btn-primary"
                  >
                    Suivant
                  </button>
                )}
              </div>

              {/* Question Navigator */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Navigation rapide :</p>
                <div className="grid grid-cols-10 gap-2">
                  {mockExamQuestions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        index === currentQuestion
                          ? 'bg-primary text-white'
                          : answers[index] !== -1
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Results
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <Trophy className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-red-600" />
                )}
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {passed ? 'Félicitations ! 🎉' : 'Pas encore réussi'}
              </h3>
              <p className="text-gray-600 mb-8">
                {passed 
                  ? 'Vous avez réussi l\'examen blanc !' 
                  : 'Continuez à vous entraîner, vous y êtes presque !'}
              </p>

              <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-primary mb-2">{score}/{mockExamQuestions.length}</div>
                  <div className="text-sm text-gray-600">Bonnes réponses</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className={`text-4xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-600">Score final</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {formatTime(30 * 60 - timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600">Temps utilisé</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setCurrentQuestion(0)
                    setAnswers(new Array(mockExamQuestions.length).fill(-1))
                    setTimeLeft(30 * 60)
                    setShowResults(false)
                    setScore(0)
                  }}
                  className="btn-primary"
                >
                  Recommencer
                </button>
              </div>

              {!passed && (
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  <p>💡 <strong>Conseil :</strong> Il faut au moins 35 bonnes réponses pour réussir l'examen.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

