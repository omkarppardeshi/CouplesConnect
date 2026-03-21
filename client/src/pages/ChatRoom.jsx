import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import ChatHeader from '../components/ChatHeader'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import FightMode from '../components/FightMode'
import MoodCheckIn from '../components/MoodCheckIn'
import SongShare from '../components/SongShare'
import DailyQuestion from '../components/DailyQuestion'
import Sidebar from '../components/Sidebar'
import Toast from '../components/Toast'
import API_BASE from '../config'

export default function ChatRoom() {
  const [messages, setMessages] = useState([])
  const [couple, setCouple] = useState(null)
  const [fightMode, setFightMode] = useState({ active: false, endsAt: null })
  const [showMoodPrompt, setShowMoodPrompt] = useState(false)
  const [showSongShare, setShowSongShare] = useState(false)
  const [showDailyQuestion, setShowDailyQuestion] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [partnerTyping, setPartnerTyping] = useState(false)
  const [partnerMood, setPartnerMood] = useState(() => {
    const stored = localStorage.getItem('partnerMood')
    if (stored) {
      const { mood, note, expiresAt } = JSON.parse(stored)
      if (expiresAt && new Date(expiresAt) > new Date()) {
        return { mood, note, expiresAt: new Date(expiresAt).getTime() }
      }
      localStorage.removeItem('partnerMood')
    }
    return null
  })
  const [hasAnsweredDaily, setHasAnsweredDaily] = useState(false)
  const [toast, setToast] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const socket = useSocket()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadCoupleAndMessages()

    // Handle partner mood auto-expiry on page load
    const stored = localStorage.getItem('partnerMood')
    if (stored) {
      const { expiresAt } = JSON.parse(stored)
      if (expiresAt) {
        const timeUntilExpiry = new Date(expiresAt).getTime() - Date.now()
        if (timeUntilExpiry > 0) {
          const timeoutId = setTimeout(() => {
            setPartnerMood(null)
            localStorage.removeItem('partnerMood')
          }, timeUntilExpiry)
          return () => clearTimeout(timeoutId)
        } else {
          setPartnerMood(null)
          localStorage.removeItem('partnerMood')
        }
      }
    }
  }, [])

  const loadCoupleAndMessages = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/couples/by-user/${user.userId}`)
      if (response.ok) {
        const data = await response.json()
        setCouple(data)

        if (data.fightMode && data.fightMode.active && data.fightMode.endsAt) {
          const endsAt = new Date(data.fightMode.endsAt)
          if (endsAt > new Date()) {
            setFightMode({ active: true, endsAt })
          }
        }

        loadMessages(data._id)

        // Check if user already answered today's daily question
        const today = new Date().toDateString()
        const stored = localStorage.getItem('dailyQuestionAnswered')
        if (stored) {
          const { date, userId } = JSON.parse(stored)
          if (date !== today || userId !== user.userId) {
            // Not answered today yet, check messages
            checkDailyQuestionAnswered(data._id)
          }
        } else {
          checkDailyQuestionAnswered(data._id)
        }
      }
    } catch (error) {
      console.error('Failed to load couple:', error)
    }
  }

  const checkDailyQuestionAnswered = async (coupleId) => {
    try {
      const response = await fetch(`${API_BASE}/api/messages/${coupleId}`)
      if (response.ok) {
        const messages = await response.json()
        const today = new Date().toDateString()
        const answeredToday = messages.some(msg => {
          if (msg.type === 'question' && msg.senderId?._id === user.userId) {
            const msgDate = new Date(msg.timestamp).toDateString()
            return msgDate === today
          }
          return false
        })
        if (answeredToday) {
          setHasAnsweredDaily(true)
          localStorage.setItem('dailyQuestionAnswered', JSON.stringify({
            date: today,
            userId: user.userId
          }))
        }
      }
    } catch (error) {
      console.error('Failed to check daily question:', error)
    }
  }

  const loadMessages = async (coupleId) => {
    const cid = coupleId || couple?._id
    if (!cid) return
    try {
      const response = await fetch(`${API_BASE}/api/messages/${cid}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  useEffect(() => {
    if (!socket || !couple) return

    socket.emit('join_couple', { coupleId: couple._id, userId: user.userId })

    socket.on('new_message', (message) => {
      setMessages(prev => [...prev, message])
      scrollToBottom()

      if (message.type === 'hug' && fightMode.active && message.senderId?._id !== user.userId) {
        setToast({ type: 'hug', message: 'Partner sent you a hug!' })
      }
    })

    socket.on('partner_typing', ({ isTyping }) => {
      setPartnerTyping(isTyping)
    })

    socket.on('fight_mode_started', ({ duration, endsAt }) => {
      setFightMode({ active: true, endsAt: new Date(endsAt) })
    })

    socket.on('fight_mode_ended', () => {
      setFightMode({ active: false, endsAt: null })
    })

    socket.on('partner_mood', ({ mood, note, expiresAt }) => {
      const expiryTime = expiresAt ? new Date(expiresAt).getTime() : Date.now() + 24 * 60 * 60 * 1000
      const moodData = { mood, note, expiresAt: expiryTime }
      setPartnerMood(moodData)
      localStorage.setItem('partnerMood', JSON.stringify(moodData))
    })

    return () => {
      socket.off('new_message')
      socket.off('partner_typing')
      socket.off('fight_mode_started')
      socket.off('fight_mode_ended')
      socket.off('partner_mood')
    }
  }, [socket, couple])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = (content, type = 'text', metadata = {}) => {
    if (!socket || !couple || (fightMode.active && type !== 'hug')) return
    socket.emit('send_message', { coupleId: couple._id, senderId: user.userId, content, type, metadata })
  }

  const sendHug = () => {
    if (!socket || !couple) return
    socket.emit('send_hug', { coupleId: couple._id, senderId: user.userId })
  }

  const enableFightMode = (duration) => {
    if (!socket || !couple) return
    socket.emit('enable_fight_mode', { coupleId: couple._id, duration })
  }

  const disableFightMode = () => {
    if (!socket || !couple) return
    socket.emit('disable_fight_mode', { coupleId: couple._id })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleTyping = (isTyping) => {
    if (!socket || !couple) return
    socket.emit('typing', { coupleId: couple._id, userId: user.userId, isTyping })
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        couple={couple}
        onShowMood={() => { setShowMoodPrompt(true); setShowSidebar(false); }}
        onShowSong={() => { setShowSongShare(true); setShowSidebar(false); }}
        onShowQuestion={() => { setShowDailyQuestion(true); setShowSidebar(false); }}
        onEnableFightMode={enableFightMode}
        hasAnsweredDaily={hasAnsweredDaily}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onMenuClick={() => setShowSidebar(true)}
          couple={couple}
          fightMode={fightMode}
          partnerMood={partnerMood}
          onMoodClick={() => {
            if (partnerMood?.note) {
              setToast({ type: 'mood', mood: partnerMood.mood, message: `Partner is feeling ${partnerMood.mood}: "${partnerMood.note}"` })
            } else if (partnerMood?.mood) {
              setToast({ type: 'mood', mood: partnerMood.mood, message: `Partner is feeling ${partnerMood.mood}` })
            }
          }}
        />

        <MessageList
          messages={messages}
          currentUserId={user.userId}
          partnerTyping={partnerTyping}
          fightMode={fightMode}
          messagesEndRef={messagesEndRef}
        />

        {fightMode.active && (
          <FightMode
            endsAt={fightMode.endsAt}
            onDisable={disableFightMode}
            onHug={sendHug}
          />
        )}

        <MessageInput
          onSend={sendMessage}
          onHug={sendHug}
          onTyping={handleTyping}
          onSongShare={() => setShowSongShare(true)}
          disabled={fightMode.active}
        />
      </div>

      {showMoodPrompt && (
        <MoodCheckIn
          coupleId={couple?._id}
          userId={user.userId}
          onClose={() => setShowMoodPrompt(false)}
          onMoodSubmit={(mood, note, expiresAt) => {
            if (socket && couple) {
              socket.emit('mood_update', { coupleId: couple._id, userId: user.userId, mood, note, expiresAt })
            }
          }}
        />
      )}

      {showSongShare && (
        <SongShare
          coupleId={couple?._id}
          userId={user.userId}
          onClose={() => setShowSongShare(false)}
          onSend={sendMessage}
        />
      )}

      {showDailyQuestion && (
        <DailyQuestion
          onClose={() => setShowDailyQuestion(false)}
          onSend={sendMessage}
          onAnswered={() => {
            setHasAnsweredDaily(true)
            localStorage.setItem('dailyQuestionAnswered', JSON.stringify({
              date: new Date().toDateString(),
              userId: user.userId
            }))
          }}
        />
      )}

      {toast && (
        <Toast
          type={toast.type}
          mood={toast.mood}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
