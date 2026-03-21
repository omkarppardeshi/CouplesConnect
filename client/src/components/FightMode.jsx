import { useState, useEffect } from 'react'
import API_BASE from '../config'

const FIGHT_DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 }
]

export default function FightMode({ endsAt, onDisable, onHug }) {
  const [quote, setQuote] = useState('')
  const [quoteSource, setQuoteSource] = useState('')
  const [timeLeft, setTimeLeft] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    fetchQuote()
  }, [])

  useEffect(() => {
    if (!endsAt) return

    const updateTimer = () => {
      const now = new Date()
      const end = new Date(endsAt)
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft('Time to reconnect!')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)

      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        setTimeLeft(`${hours}h ${mins}m`)
      } else {
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  const fetchQuote = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/quotes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'calm' })
      })
      const data = await response.json()
      setQuote(data.quote?.text || 'Take a deep breath. This moment will pass.')
      setQuoteSource(data.quote?.source || 'curated')
    } catch (error) {
      setQuote('Take a deep breath. This moment will pass.')
      setQuoteSource('curated')
    }
  }

  const handleDisable = () => {
    setShowConfirm(true)
  }

  const confirmDisable = () => {
    onDisable()
    setShowConfirm(false)
  }

  return (
    <div className="fixed inset-0 z-50 fight-mode-bg flex items-center justify-center p-6">
      <div className="max-w-lg text-center">
        {/* Floating hearts animation */}
        <div className="relative h-32 mb-8">
          <span className="absolute text-4xl animate-float" style={{ left: '10%', animationDelay: '0s' }}>💕</span>
          <span className="absolute text-3xl animate-float" style={{ left: '30%', animationDelay: '0.5s' }}>✨</span>
          <span className="absolute text-4xl animate-float" style={{ left: '50%', animationDelay: '1s' }}>💕</span>
          <span className="absolute text-3xl animate-float" style={{ left: '70%', animationDelay: '1.5s' }}>✨</span>
          <span className="absolute text-4xl animate-float" style={{ left: '85%', animationDelay: '0.7s' }}>💕</span>
        </div>

        <h2 className="text-2xl font-bold text-warm-700 mb-4">Fight Mode Active</h2>

        <p className="text-warm-500 mb-2">
          Take this time to relax and reflect
        </p>

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg">
          <p className="text-xl text-warm-700 italic leading-relaxed mb-3">
            "{quote}"
          </p>
          <div className="flex items-center justify-center gap-2">
            {quoteSource === 'ai' ? (
              <>
                <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs text-sage font-medium">AI Generated</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-warm-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs text-warm-300 font-medium">Thoughtful Quote</span>
              </>
            )}
          </div>
        </div>

        <div className="text-5xl font-bold text-warm-600 mb-8">
          {timeLeft}
        </div>

        <button
          onClick={onHug}
          className="px-6 py-3 bg-blush-500/20 hover:bg-blush-500/30 text-warm-600 font-medium rounded-xl transition-all hover:scale-105 mb-4"
        >
          <span className="text-xl mr-2">🤗</span>
          Send a Hug
        </button>

        <button
          onClick={handleDisable}
          className="px-6 py-3 bg-warm-500/20 hover:bg-warm-500/30 text-warm-600 rounded-xl transition-colors text-sm"
        >
          End Fight Mode Early
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-warm-700 mb-2">End Fight Mode?</h3>
            <p className="text-warm-500 text-sm mb-6">
              Are you sure you want to end the calm period early?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-cream hover:bg-warm-100 text-warm-600 rounded-xl transition-colors"
              >
                Keep Calm
              </button>
              <button
                onClick={confirmDisable}
                className="flex-1 py-3 bg-warm-500 hover:bg-warm-600 text-white rounded-xl transition-colors"
              >
                End Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
