import { useState, useEffect } from 'react'
import API_BASE from '../config'

const CATEGORIES = [
  { id: 'dirty', label: 'Dirty', emoji: '🔥' },
  { id: 'flirty', label: 'Flirty', emoji: '💋' },
  { id: 'deep', label: 'Deep', emoji: '💕' },
  { id: 'playful', label: 'Playful', emoji: '😏' },
]

export default function SpicyModal({ onClose, onSendPosition, onSendQuestion }) {
  const [tab, setTab] = useState('positions')
  const [position, setPosition] = useState(null)
  const [question, setQuestion] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('dirty')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPosition()
  }, [])

  useEffect(() => {
    if (tab === 'questions') {
      fetchQuestion()
    }
  }, [selectedCategory, tab])

  const fetchPosition = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/spicy/position`)
      const data = await res.json()
      setPosition(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestion = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/spicy/question/${selectedCategory}`)
      const data = await res.json()
      setQuestion(data.question)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendPosition = () => {
    if (position) {
      onSendPosition(position)
      onClose()
    }
  }

  const handleSendQuestion = () => {
    if (question) {
      onSendQuestion(question, selectedCategory)
      onClose()
    }
  }

  const handleRefresh = () => {
    if (tab === 'positions') {
      fetchPosition()
    } else {
      fetchQuestion()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-warm-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-warm-700">Private Zone 🔒</h2>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-xl">
            <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-warm-100">
          <button
            onClick={() => { setTab('positions'); setQuestion(null); }}
            className={`flex-1 py-3 text-sm font-medium ${tab === 'positions' ? 'text-warm-500 border-b-2 border-warm-500' : 'text-warm-400'}`}
          >
            Positions
          </button>
          <button
            onClick={() => { setTab('questions'); setPosition(null); fetchQuestion(); }}
            className={`flex-1 py-3 text-sm font-medium ${tab === 'questions' ? 'text-warm-500 border-b-2 border-warm-500' : 'text-warm-400'}`}
          >
            Questions
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {tab === 'positions' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-warm-400">Loading...</div>
              ) : position ? (
                <div className="bg-gradient-to-br from-blush/20 to-sage/20 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-3">💑</div>
                  <h3 className="text-xl font-bold text-warm-700 mb-1">{position.name}</h3>
                  <span className="inline-block px-3 py-1 bg-warm-100 rounded-full text-xs text-warm-500 mb-3">
                    {position.difficulty}
                  </span>
                  <p className="text-warm-600 text-sm">{position.feel}</p>
                </div>
              ) : null}

              <button
                onClick={fetchPosition}
                disabled={loading}
                className="w-full py-3 bg-warm-100 hover:bg-warm-200 text-warm-600 rounded-xl font-medium transition-colors"
              >
                {loading ? 'Loading...' : '🔄 Shuffle Position'}
              </button>

              {position && (
                <button
                  onClick={handleSendPosition}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium"
                >
                  Send as Card 🔥
                </button>
              )}
            </div>
          )}

          {tab === 'questions' && (
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); fetchQuestion(); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-warm-500 text-white'
                        : 'bg-cream text-warm-600'
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-8 text-warm-400">Loading...</div>
              ) : question ? (
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-3">{CATEGORIES.find(c => c.id === selectedCategory)?.emoji}</div>
                  <p className="text-lg text-warm-700 italic">"{question}"</p>
                </div>
              ) : null}

              <div className="flex gap-2">
                <button
                  onClick={fetchQuestion}
                  disabled={loading}
                  className="flex-1 py-3 bg-warm-100 hover:bg-warm-200 text-warm-600 rounded-xl font-medium transition-colors"
                >
                  🔄 New Question
                </button>
                <button
                  onClick={fetchQuestion}
                  disabled={loading}
                  className="px-4 py-3 bg-warm-100 hover:bg-warm-200 text-warm-600 rounded-xl font-medium"
                >
                  📋 Category
                </button>
              </div>

              {question && (
                <button
                  onClick={handleSendQuestion}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium"
                >
                  Send as Card 💋
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
