import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API_BASE from '../config'

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [deviceName, setDeviceName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleStart = async () => {
    setIsLoading(true)
    setError('')

    try {
      let credentialID
      let credentialPublicKey

      // Try WebAuthn if available, otherwise use demo mode
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
          if (available) {
            // Generate a random credential ID for this device
            credentialID = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
            credentialPublicKey = 'generated_' + Date.now()
          } else {
            throw new Error('Demo mode')
          }
        } catch {
          // WebAuthn not fully available, use demo mode
          credentialID = 'demo_' + btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
          credentialPublicKey = 'demo_' + Date.now()
        }
      } else {
        // No WebAuthn support, use demo mode
        credentialID = 'demo_' + btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
        credentialPublicKey = 'demo_' + Date.now()
      }

      // Register with our backend
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentialID,
          credentialPublicKey,
          deviceName: deviceName || 'My Device'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      login({
        userId: data.userId,
        credentialID,
        deviceName: data.deviceName || deviceName || 'My Device'
      })

      // If already in a couple, go to chat, else go to setup
      navigate(data.isExisting ? '/chat' : '/setup')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthenticate = async () => {
    setIsLoading(true)
    setError('')

    try {
      // For demo purposes, we'll use a stored credential
      // In production, this would trigger actual biometric auth
      const storedUser = localStorage.getItem('couplesconnect_user')
      if (!storedUser) {
        setError('No registered device found. Please register first.')
        setIsLoading(false)
        return
      }

      const userData = JSON.parse(storedUser)

      // Verify with backend
      const response = await fetch(`${API_BASE}/api/auth/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentialID: userData.credentialID })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      // Update localStorage with server's deviceName
      const updatedUserData = { ...userData, deviceName: data.deviceName || userData.deviceName }
      login(updatedUserData)

      // Check if user is in a couple
      const coupleRes = await fetch(`${API_BASE}/api/couples/by-user/${userData.userId}`)
      if (coupleRes.ok) {
        navigate('/chat')
      } else {
        navigate('/setup')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-blush to-sage p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-warm-300 to-warm-400 flex items-center justify-center">
            <span className="text-3xl">💕</span>
          </div>
          <h1 className="text-3xl font-bold text-warm-700">Couples Connect</h1>
          <p className="text-warm-500 mt-2">A calm space for you two</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {!isRegistering ? (
          <div className="space-y-4">
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              {isLoading ? 'Setting up...' : 'Set Up New Device'}
            </button>

            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-warm-200 w-full"></div>
              <span className="absolute bg-white px-4 text-sm text-warm-400">or</span>
            </div>

            <button
              onClick={handleAuthenticate}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-sage hover:bg-sage/80 text-warm-700 font-medium rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              I've Used This App Before
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-2">
                Give this device a name (optional)
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g., Sarah's iPhone"
                className="w-full px-4 py-3 bg-cream border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleStart}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register Device'}
            </button>
          </div>
        )}

        <p className="text-xs text-warm-400 text-center mt-6">
          Your data stays private. No accounts, no tracking, just you two.
        </p>
      </div>
    </div>
  )
}
