export default function MessageBubble({ message, isOwn }) {
  const isHug = message.type === 'hug'
  const isQuestion = message.type === 'question'
  const isSong = message.type === 'song'
  const isSpicyPosition = message.type === 'spicy_position'
  const isSpicyQuestion = message.type === 'spicy_question'

  // Spicy Position Card
  if (isSpicyPosition) {
    const position = message.content
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs rounded-2xl overflow-hidden shadow-md ${
          isOwn ? 'bg-gradient-to-br from-pink-500 to-rose-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
        }`}>
          <div className="px-3 py-1.5 bg-black/20 flex items-center gap-2">
            <span className="text-white/80 text-xs">{isOwn ? 'You sent' : 'Partner sent'}</span>
            <span className="text-xs">👀</span>
          </div>
          <div className="p-4 text-white text-center">
            <div className="text-3xl mb-2">💑</div>
            <h3 className="font-bold text-lg mb-1">{position.name}</h3>
            <span className="inline-block px-2 py-0.5 bg-white/20 rounded-full text-xs mb-2">
              {position.difficulty}
            </span>
            <p className="text-sm opacity-90">{position.feel}</p>
          </div>
        </div>
      </div>
    )
  }

  // Spicy Question Card
  if (isSpicyQuestion) {
    const categoryEmojis = { dirty: '🔥', flirty: '💋', deep: '💕', playful: '😏' }
    const emoji = categoryEmojis[message.metadata?.category] || '💕'
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs rounded-2xl overflow-hidden shadow-md ${
          isOwn ? 'bg-gradient-to-br from-pink-500 to-purple-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
        }`}>
          <div className="px-3 py-1.5 bg-black/20 flex items-center gap-2">
            <span className="text-white/80 text-xs">{isOwn ? 'You sent' : 'Partner sent'}</span>
            <span className="text-xs">{emoji}</span>
          </div>
          <div className="p-4 text-white text-center">
            <div className="text-3xl mb-2">{emoji}</div>
            <p className="italic">"{message.content}"</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {message.metadata?.category}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (isHug) {
    return (
      <div className={`flex justify-center ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`px-6 py-4 rounded-3xl ${
          isOwn ? 'bg-warm-100' : 'bg-sage/30'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl hug-animation">🤗</span>
            <span className="text-warm-600 font-medium">
              {message.senderId?.deviceName || 'Partner'} sent a hug
            </span>
            <span className="text-2xl hug-animation" style={{ animationDelay: '0.3s' }}>🤗</span>
          </div>
        </div>
      </div>
    )
  }

  if (isQuestion) {
    // Parse the content which is "Q: [question]\nA: [answer]"
    const parts = message.content.split('\n')
    const questionPart = parts[0]?.replace('Q: ', '') || ''
    const answerPart = parts[1]?.replace('A: ', '') || message.content

    return (
      <div className="flex justify-center">
        <div className="max-w-xs px-6 py-4 rounded-3xl bg-gradient-to-r from-blush to-sage">
          <div className="text-center">
            <span className="text-lg mb-2 block">💭</span>
            <p className="text-sm text-warm-600 italic mb-3">"{questionPart}"</p>
            <p className="text-warm-700 font-medium">{answerPart}</p>
            <p className="text-xs text-warm-400 mt-2">Daily Question</p>
          </div>
        </div>
      </div>
    )
  }

  if (isSong) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl message-enter ${
          isOwn
            ? 'bg-warm-500 text-white rounded-br-md'
            : 'bg-white text-warm-700 rounded-bl-md shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span>🎵</span>
            <span className="text-sm font-medium">Shared a song</span>
          </div>
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className={`block break-words text-sm underline ${isOwn ? 'text-white/90 hover:text-white' : 'text-blue-600 hover:text-blue-700'}`}
          >
            {message.content}
          </a>
          {message.metadata?.message && (
            <p className="break-words mt-2 italic text-sm opacity-70">"{message.metadata.message}"</p>
          )}
          <div className={`flex items-center gap-2 mt-2 text-xs ${
            isOwn ? 'text-white/70 justify-end' : 'text-warm-400'
          }`}>
            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl message-enter ${
          isOwn
            ? 'bg-warm-500 text-white rounded-br-md'
            : 'bg-white text-warm-700 rounded-bl-md shadow-sm'
        }`}
      >
        <p className="break-words">{message.content}</p>
        <div className={`flex items-center gap-2 mt-1 text-xs ${
          isOwn ? 'text-white/70 justify-end' : 'text-warm-400'
        }`}>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {message.readAt && isOwn && (
            <span>✓✓</span>
          )}
        </div>
      </div>
    </div>
  )
}
