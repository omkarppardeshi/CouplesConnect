import { forwardRef } from 'react'
import MessageBubble from './MessageBubble'

const MessageList = forwardRef(function MessageList({ messages, currentUserId, partnerTyping, fightMode }, ref) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream/50">
      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blush flex items-center justify-center">
            <span className="text-2xl">💌</span>
          </div>
          <p className="text-warm-500">No messages yet</p>
          <p className="text-warm-400 text-sm mt-1">Say hello to your love!</p>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageBubble
          key={message._id || index}
          message={message}
          isOwn={message.senderId?._id === currentUserId}
        />
      ))}

      {partnerTyping && (
        <div className="flex items-center gap-2 text-warm-400 text-sm">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-warm-400 rounded-full typing-dot"></span>
            <span className="w-2 h-2 bg-warm-400 rounded-full typing-dot" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-warm-400 rounded-full typing-dot" style={{ animationDelay: '0.4s' }}></span>
          </div>
          <span>Partner is typing...</span>
        </div>
      )}

      <div ref={ref} />
    </div>
  )
})

export default MessageList
