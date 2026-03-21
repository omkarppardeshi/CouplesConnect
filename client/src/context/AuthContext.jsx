import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('couplesconnect_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (userData) => {
    localStorage.setItem('couplesconnect_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    // Logout - clears session but keeps credentials for "I've Used This App Before"
    setUser(null)
  }

  const logoutClearAll = () => {
    // Full logout - clears everything including credentials
    localStorage.removeItem('couplesconnect_user')
    localStorage.removeItem('partnerMood')
    localStorage.removeItem('dailyQuestionAnswered')
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
