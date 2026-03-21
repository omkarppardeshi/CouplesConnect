import { useState } from 'react'

export default function MoodToggle({ isOn, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
        isOn
          ? 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg scale-110'
          : 'bg-warm-100 hover:bg-warm-200'
      }`}
      title={isOn ? "You're in the mood! 🔥" : "Tap if you're in the mood..."}
    >
      {isOn ? '🔥' : '💭'}
    </button>
  )
}
