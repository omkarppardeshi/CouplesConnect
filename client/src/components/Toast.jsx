import { useState, useEffect } from 'react'

const MOOD_EMOJIS = {
  happy: '😊',
  loved: '🥰',
  neutral: '😐',
  sad: '😔',
  angry: '😤',
  anxious: '😰',
  excited: '🤩',
  tired: '😴'
}

export default function Toast({ message, type, mood, onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  const bgColor = type === 'hug' ? 'bg-blush' : 'bg-sage'
  const emoji = type === 'hug' ? '🤗' : (mood ? MOOD_EMOJIS[mood] || '💕' : '💕')

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-slide-down">
      <div className={`${bgColor} px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3`}>
        <span className="text-2xl">{emoji}</span>
        <span className="text-warm-700 font-medium">{message}</span>
        <button
          onClick={() => { setVisible(false); onClose(); }}
          className="ml-2 text-warm-400 hover:text-warm-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
