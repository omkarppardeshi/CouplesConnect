import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API_BASE from '../config'

export default function Setup() {
  const [mode, setMode] = useState(null) // 'create' or 'join'
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCreate = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/api/couples/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create couple')
      }

      setMode('created')
      setCode(data.code)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoin = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/api/couples/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, code })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join couple')
      }

      navigate('/chat')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-blush to-sage p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-warm-700">Connect with Your Partner</h1>
          <p className="text-warm-500 mt-2">Create a new pairing or join existing</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {!mode && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full py-5 px-6 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Pairing
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full py-5 px-6 bg-sage hover:bg-sage/80 text-warm-700 font-medium rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Join with Code
            </button>
          </div>
        )}

        {mode === 'create' && !code && (
          <div className="space-y-4">
            <div className="bg-blush rounded-2xl p-6 text-center">
              <p className="text-warm-700 font-medium mb-2">Ready to create your couple space?</p>
              <p className="text-warm-500 text-sm">You'll get a 6-digit code to share with your partner</p>
            </div>
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-2xl transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Generate Code'}
            </button>
            <button
              onClick={() => setMode(null)}
              className="w-full py-3 text-warm-500 hover:text-warm-700 text-sm"
            >
              Go back
            </button>
          </div>
        )}

        {mode === 'created' && code && (
          <div className="space-y-6 text-center">
            <div className="bg-sage rounded-2xl p-6">
              <p className="text-warm-600 text-sm mb-3">Share this code with your partner</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-bold text-warm-700 tracking-widest">{code}</span>
                <button
                  onClick={copyCode}
                  className="p-2 hover:bg-sage/50 rounded-lg transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blush rounded-2xl p-6">
              <p className="text-warm-600 text-sm mb-2">Waiting for your partner to join...</p>
              <div className="flex items-center justify-center gap-2 text-warm-500">
                <div className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>

            <button
              onClick={() => navigate('/chat')}
              className="w-full py-4 px-6 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-2xl transition-all"
            >
              Continue to Chat
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-2">
                Enter your partner's code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-6 py-5 bg-cream border border-warm-200 rounded-2xl text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleJoin}
              disabled={isLoading || code.length !== 6}
              className="w-full py-4 px-6 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Joining...' : 'Join Couple'}
            </button>
            <button
              onClick={() => setMode(null)}
              className="w-full py-3 text-warm-500 hover:text-warm-700 text-sm"
            >
              Go back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
