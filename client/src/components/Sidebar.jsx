import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API_BASE from '../config'

export default function Sidebar({ isOpen, onClose, couple, onShowMood, onShowSong, onShowQuestion, onEnableFightMode, hasAnsweredDaily, onLogout }) {
  const { user, setUser } = useAuth()
  const [showFightModeOptions, setShowFightModeOptions] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [displayName, setDisplayName] = useState(user?.deviceName || '')
  const [nameLoading, setNameLoading] = useState(false)

  const FIGHT_DURATIONS = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 }
  ]

  const handleEnableFightMode = (duration) => {
    if (onEnableFightMode) {
      onEnableFightMode(duration)
    }
    setShowFightModeOptions(false)
    onClose()
  }

  const handleSaveName = async () => {
    if (!displayName.trim() || !user?.userId) return
    setNameLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/user/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceName: displayName.trim() })
      })
      if (response.ok) {
        const updatedUser = { ...user, deviceName: displayName.trim() }
        setUser(updatedUser)
        localStorage.setItem('couplesconnect_user', JSON.stringify(updatedUser))
        setIsEditingName(false)
      }
    } catch (error) {
      console.error('Failed to update name:', error)
    } finally {
      setNameLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* User Name */}
          <div className="p-4 border-b border-warm-100">
            {isEditingName ? (
              <div className="space-y-2">
                <label className="text-xs text-warm-400 font-medium">My Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-cream border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warm-400"
                    placeholder="Your name"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={nameLoading || !displayName.trim()}
                    className="px-3 py-2 bg-warm-500 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    {nameLoading ? '...' : 'Save'}
                  </button>
                </div>
                <button
                  onClick={() => { setIsEditingName(false); setDisplayName(user?.deviceName || ''); }}
                  className="text-xs text-warm-400 hover:text-warm-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsEditingName(true); setDisplayName(user?.deviceName || ''); }}
                className="w-full flex items-center justify-between group"
              >
                <div className="text-left">
                  <p className="text-xs text-warm-400">My Name</p>
                  <p className="font-medium text-warm-700">{user?.deviceName || 'Tap to set name'}</p>
                </div>
                <svg className="w-4 h-4 text-warm-300 group-hover:text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>

          {/* Header */}
          <div className="p-4 border-b border-warm-100 flex items-center justify-between">
            <h2 className="font-bold text-warm-700">Menu</h2>
            <button onClick={onClose} className="p-2 hover:bg-cream rounded-xl md:hidden">
              <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={onShowMood}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors text-left"
            >
              <span className="text-xl">😊</span>
              <span className="text-warm-700">Mood Check-in</span>
            </button>

            <button
              onClick={onShowSong}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors text-left"
            >
              <span className="text-xl">🎵</span>
              <span className="text-warm-700">Share a Song</span>
            </button>

            {!hasAnsweredDaily && (
              <button
                onClick={onShowQuestion}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors text-left"
              >
                <span className="text-xl">💭</span>
                <span className="text-warm-700">Daily Question</span>
              </button>
            )}

            <div className="border-t border-warm-100 my-4 pt-4">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl">🧘</span>
                <span className="text-warm-600 font-medium">Fight Mode</span>
              </div>

              <div className="ml-10 space-y-1">
                {FIGHT_DURATIONS.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => handleEnableFightMode(duration.value)}
                    className="w-full text-left px-4 py-2 text-sm text-warm-500 hover:bg-blush rounded-lg transition-colors"
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-warm-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Couple Info */}
          {couple && (
            <div className="p-4 border-t border-warm-100">
              <p className="text-xs text-warm-400 mb-2">Pairing Code</p>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-warm-700">{couple.code}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(couple.code)}
                  className="p-1 hover:bg-cream rounded"
                >
                  <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
