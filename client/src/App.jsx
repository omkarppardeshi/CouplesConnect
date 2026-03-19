import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Setup from './pages/Setup'
import ChatRoom from './pages/ChatRoom'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-warm-600 animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
      <Route path="/setup" element={user ? <Setup /> : <Navigate to="/login" />} />
      <Route path="/chat" element={user ? <ChatRoom /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
    </Routes>
  )
}

export default App
