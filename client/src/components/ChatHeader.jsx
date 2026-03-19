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

export default function ChatHeader({ onMenuClick, couple, fightMode, partnerMood, onMoodClick }) {
  const moodValue = partnerMood?.mood || partnerMood

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-warm-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-cream rounded-xl transition-colors md:hidden"
        >
          <svg className="w-6 h-6 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warm-300 to-warm-400 flex items-center justify-center">
            <span className="text-lg">💕</span>
          </div>
          <div>
            <h1 className="font-semibold text-warm-700">You & Your Love</h1>
            <p className="text-xs text-warm-400">
              {fightMode.active ? '😌 Fight Mode Active' : 'Connected'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {moodValue && (
          <button
            onClick={onMoodClick}
            className="flex items-center gap-1 px-2 py-1 bg-cream rounded-full hover:bg-warm-100 transition-colors"
            title="Click to see partner's mood note"
          >
            <span className="text-lg">{MOOD_EMOJIS[moodValue] || '😊'}</span>
          </button>
        )}

        {!fightMode.active && (
          <button
            className="p-2 hover:bg-blush rounded-xl transition-colors"
            title="Mood check-in"
          >
            <svg className="w-5 h-5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}
