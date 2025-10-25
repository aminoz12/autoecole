'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizComponentProps {
  quizTitle: string
  quizId: string
  questions: Question[]
  onClose: () => void
}

export default function QuizComponent({ quizTitle, quizId, questions, onClose }: QuizComponentProps) {
  const supabase = createClient()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  )
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [startTime] = useState(Date.now())
  const [saving, setSaving] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    
    if (isCorrect) {
      setScore(score + 1)
    }

    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestion] = true
    setAnsweredQuestions(newAnsweredQuestions)
    
    setShowExplanation(true)
  }

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Quiz completed, save results
      await saveQuizResults()
      setQuizCompleted(true)
    }
  }

  const saveQuizResults = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('No user found')
        return
      }

      const timeTaken = Math.floor((Date.now() - startTime) / 1000) // in seconds
      const percentage = Math.round((score / questions.length) * 100)

      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_id: quizId,
          quiz_title: quizTitle,
          score: score,
          total_questions: questions.length,
          percentage: percentage,
          time_taken_seconds: timeTaken
        })

      if (error) {
        console.error('Error saving quiz results:', error)
      }
    } catch (error) {
      console.error('Error saving quiz results:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setAnsweredQuestions(new Array(questions.length).fill(false))
    setQuizCompleted(false)
  }

  const getOptionClassName = (index: number) => {
    if (!showExplanation) {
      return selectedAnswer === index
        ? 'border-primary bg-primary/5 ring-2 ring-primary'
        : 'border-gray-300 hover:border-primary/50'
    }

    if (index === questions[currentQuestion].correctAnswer) {
      return 'border-green-500 bg-green-50 ring-2 ring-green-500'
    }

    if (index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correctAnswer) {
      return 'border-red-500 bg-red-50 ring-2 ring-red-500'
    }

    return 'border-gray-300 opacity-50'
  }

  const getOptionIcon = (index: number) => {
    if (!showExplanation) return null

    if (index === questions[currentQuestion].correctAnswer) {
      return <CheckCircle className="w-6 h-6 text-green-600" />
    }

    if (index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correctAnswer) {
      return <XCircle className="w-6 h-6 text-red-600" />
    }

    return null
  }

  const percentage = Math.round((score / questions.length) * 100)

  if (quizCompleted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full mb-6"
            >
              <Trophy className="w-20 h-20 text-primary" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Terminé !</h2>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-6xl font-bold text-primary mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-2xl text-gray-600 mb-4">
                Score: {percentage}%
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-600">Correctes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{questions.length - score}</div>
                  <div className="text-sm text-gray-600">Incorrectes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRestartQuiz}
                className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Recommencer
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{quizTitle}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="h-full bg-primary"
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-3 mb-6">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between ${getOptionClassName(
                      index
                    )}`}
                  >
                    <span className="font-medium">{option}</span>
                    {getOptionIcon(index)}
                  </button>
                ))}
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    selectedAnswer === questions[currentQuestion].correctAnswer
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {selectedAnswer === questions[currentQuestion].correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">
                        {selectedAnswer === questions[currentQuestion].correctAnswer
                          ? 'Bonne réponse !'
                          : 'Mauvaise réponse'}
                      </p>
                      <p className="text-sm text-gray-700">
                        {questions[currentQuestion].explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between bg-gray-50">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Précédent
          </button>

          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Valider
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? 'Suivant' : 'Terminer'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <div className="text-sm font-semibold text-gray-600">
            Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

