export default function SpicyCard({ message, isOwn }) {
  const isPosition = message.type === 'spicy_position'
  const isQuestion = message.type === 'spicy_question'
  const content = message.content
  const metadata = message.metadata || {}

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs rounded-2xl overflow-hidden shadow-md ${
        isOwn ? 'bg-gradient-to-br from-pink-500 to-rose-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
      }`}>
        {/* Header */}
        <div className="px-4 py-2 bg-black/20 flex items-center gap-2">
          <span className="text-white/80 text-xs">{isOwn ? 'You' : 'Partner'}</span>
          {isOnwer && <span className="text-xs">👀</span>}
        </div>

        {/* Content */}
        <div className="p-4 text-white text-center">
          {isPosition ? (
            <div>
              <div className="text-4xl mb-2">💑</div>
              <h3 className="font-bold text-lg mb-1">{content.name}</h3>
              <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs mb-2">
                {content.difficulty}
              </span>
              <p className="text-sm opacity-90">{content.feel}</p>
            </div>
          ) : isQuestion ? (
            <div>
              <div className="text-4xl mb-2">{getCategoryEmoji(metadata.category)}</div>
              <p className="text-sm italic">"{content}"</p>
              <span className="inline-block mt-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                {metadata.category}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function getCategoryEmoji(category) {
  const emojis = {
    dirty: '🔥',
    flirty: '💋',
    deep: '💕',
    playful: '😏'
  }
  return emojis[category] || '💕'
}
