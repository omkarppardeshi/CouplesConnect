import { useState } from 'react'

export default function SongShare({ coupleId, userId, onClose, onSend }) {
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!url.trim()) return

    setIsSubmitting(true)
    try {
      onSend(url.trim(), 'song', { message: message.trim() })
      onClose()
    } catch (error) {
      console.error('Failed to share song:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getEmbedUrl = (url) => {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    if (ytMatch) {
      return { type: 'youtube', id: ytMatch[1] }
    }

    // Spotify
    const spotifyMatch = url.match(/spotify\.com\/([^\/]+)\/([^\/]+)\/([a-zA-Z0-9]+)/)
    if (spotifyMatch) {
      return { type: 'spotify', id: spotifyMatch[3] }
    }

    return null
  }

  const embedInfo = getEmbedUrl(url)

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-warm-700">Share a Song</h3>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-xl">
            <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-warm-600 mb-2">Song URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube, Spotify, or SoundCloud link"
              className="w-full px-4 py-3 bg-cream border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-400"
            />
          </div>

          <div>
            <label className="block text-sm text-warm-600 mb-2">Why this song? (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="This song reminds me of our first date..."
              maxLength={200}
              rows={2}
              className="w-full px-4 py-3 bg-cream border border-warm-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-warm-400"
            />
          </div>

          {embedInfo && (
            <div className="bg-cream rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-warm-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">
                  {embedInfo.type === 'youtube' ? '📺' : embedInfo.type === 'spotify' ? '🎧' : '🎵'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-warm-700">Song detected</p>
                <p className="text-xs text-warm-400">{embedInfo.type}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!url.trim() || isSubmitting}
            className="w-full py-4 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>🎵</span>
            {isSubmitting ? 'Sharing...' : 'Share Song'}
          </button>
        </div>
      </div>
    </div>
  )
}
