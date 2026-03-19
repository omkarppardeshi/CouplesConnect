export default function MessageBubble({ message, isOwn }) {
  const isHug = message.type === 'hug'
  const isQuestion = message.type === 'question'
  const isSong = message.type === 'song'

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
