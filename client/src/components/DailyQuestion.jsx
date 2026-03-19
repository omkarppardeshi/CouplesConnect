import { useState, useEffect } from 'react'
import API_BASE from '../config'

const QUESTIONS = [
  "What's something you appreciate about us?",
  "If you could relive one moment together, what would it be?",
  "What's a dream you have for our future?",
  "What's something I do that always makes you smile?",
  "What's a small thing that means a lot to you?",
  "What's your favorite memory of us this week?",
  "What's something you're looking forward to doing together?",
  "What's a lesson you've learned from our relationship?"
]

export default function DailyQuestion({ onClose, onSend, onAnswered }) {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchQuestion()
  }, [])

  const fetchQuestion = async () => {
    setIsLoading(true)
    try {
      // Try to get AI-generated question first
      const response = await fetch(`${API_BASE}/api/quotes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'love' })
      })
      const data = await response.json()
      setQuestion(data.quote?.text || getRandomFallback())
    } catch {
      setQuestion(getRandomFallback())
    } finally {
      setIsLoading(false)
    }
  }

  const getRandomFallback = () => {
    return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
  }

  const handleSendResponse = () => {
    if (response.trim()) {
      // Send both question and answer
      onSend(`Q: ${question}\nA: ${response.trim()}`, 'question', {})
      if (onAnswered) {
        onAnswered()
      }
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">💭</span>
            <h3 className="text-lg font-bold text-warm-700">Daily Question</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-xl">
            <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-center mb-6">
          {isLoading ? (
            <div className="py-8">
              <div className="w-8 h-8 mx-auto border-2 border-warm-200 border-t-warm-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blush to-sage rounded-2xl p-6 mb-6">
                <p className="text-xl text-warm-700 font-medium">
                  {question}
                </p>
              </div>

              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 bg-cream border border-warm-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-warm-400 mb-4"
              />

              <button
                onClick={handleSendResponse}
                disabled={!response.trim()}
                className="w-full py-4 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-2xl transition-all disabled:opacity-50"
              >
                Share with Partner
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
