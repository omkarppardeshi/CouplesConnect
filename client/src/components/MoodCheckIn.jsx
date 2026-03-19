import { useState } from 'react'
import API_BASE from '../config'

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '🥰', label: 'Loved', value: 'loved' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😤', label: 'Angry', value: 'angry' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '🤩', label: 'Excited', value: 'excited' },
  { emoji: '😴', label: 'Tired', value: 'tired' }
]

const DURATIONS = [
  { label: '1 hour', value: 1 },
  { label: '4 hours', value: 4 },
  { label: 'Until tomorrow', value: 24 }
]

export default function MoodCheckIn({ coupleId, userId, onClose, onMoodSubmit }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [selectedDuration, setSelectedDuration] = useState(4)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!selectedMood) return

    setIsSubmitting(true)
    try {
      await fetch(`${API_BASE}/api/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupleId,
          userId,
          mood: selectedMood,
          note: note.trim() || undefined,
          duration: selectedDuration
        })
      })

      // Notify partner via socket
      if (onMoodSubmit) {
        const expiresAt = new Date(Date.now() + selectedDuration * 60 * 60 * 1000)
        onMoodSubmit(selectedMood, note.trim() || null, expiresAt.toISOString())
      }

      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit mood:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-5xl mb-4 animate-bounce-soft">
            {selectedMood && MOODS.find(m => m.value === selectedMood)?.emoji}
          </div>
          <h3 className="text-lg font-bold text-warm-700">Mood Recorded</h3>
          <p className="text-warm-500 text-sm mt-2 mb-6">Your partner can see how you're doing</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-warm-700">How are you feeling?</h3>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-xl">
            <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-3 rounded-2xl text-center transition-all ${
                selectedMood === mood.value
                  ? 'bg-blush scale-105 ring-2 ring-warm-400'
                  : 'bg-cream hover:bg-sage'
              }`}
            >
              <span className="text-2xl block mb-1">{mood.emoji}</span>
              <span className="text-xs text-warm-500">{mood.label}</span>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-warm-600 mb-2">Show for how long?</label>
          <div className="flex gap-2">
            {DURATIONS.map(d => (
              <button
                key={d.value}
                onClick={() => setSelectedDuration(d.value)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedDuration === d.value
                    ? 'bg-warm-500 text-white'
                    : 'bg-cream text-warm-600 hover:bg-warm-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-warm-600 mb-2">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Share more about how you're feeling..."
            maxLength={280}
            rows={2}
            className="w-full px-4 py-3 bg-cream border border-warm-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-warm-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedMood || isSubmitting}
          className="w-full py-4 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sharing...' : 'Share Mood'}
        </button>
      </div>
    </div>
  )
}
