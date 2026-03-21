import { useState, useRef, useEffect } from 'react'

export default function MessageInput({ onSend, onTyping, onSongShare, disabled, onFocus, onBlur }) {
  const [message, setMessage] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    onTyping(true)
    clearTimeout(handleChange.debounce)
    handleChange.debounce = setTimeout(() => onTyping(false), 2000)
  }

  return (
    <div className="bg-white/90 border-t border-warm-100 p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSongShare}
          disabled={disabled}
          className="p-3 hover:bg-sage rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Share a song"
        >
          <span className="text-xl">🎵</span>
        </button>

        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={disabled ? 'Fight Mode is active...' : 'Type a message...'}
          disabled={disabled}
          rows={1}
          className="flex-1 px-4 py-3 bg-cream border border-warm-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ maxHeight: '120px' }}
        />

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-3 bg-warm-500 hover:bg-warm-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  )
}
