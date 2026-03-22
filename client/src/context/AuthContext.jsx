import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only restore from localStorage if NOT after a logout
    // This prevents refreshing on login page from redirecting to chat
    if (!sessionStorage.getItem('skip_restore')) {
      const storedUser = localStorage.getItem('couplesconnect_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    setLoading(false)
  }, [])

  const login = async (userData) => {
    sessionStorage.removeItem('skip_restore')
    localStorage.setItem('couplesconnect_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    // Logout - clears session but keeps credentials for "I've Used This App Before"
    // SET the flag so that refreshing on login page does NOT restore user
    sessionStorage.setItem('skip_restore', 'true')
    setUser(null)
  }

  const logoutClearAll = () => {
    // Full logout - clears everything including credentials
    localStorage.removeItem('couplesconnect_user')
    localStorage.removeItem('partnerMood')
    localStorage.removeItem('dailyQuestionAnswered')
    sessionStorage.removeItem('skip_restore')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, logoutClearAll, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
