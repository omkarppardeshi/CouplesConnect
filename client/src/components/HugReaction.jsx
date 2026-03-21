import { useEffect, useState } from 'react'

export default function HugReaction({ senderName, onComplete }) {
  const [visible, setVisible] = useState(false)
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    // Trigger animation after mount
    requestAnimationFrame(() => setVisible(true))

    // Generate floating hearts
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      size: 16 + Math.random() * 16
    }))
    setHearts(newHearts)

    // Auto dismiss after 2.5 seconds
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 300)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="absolute text-pink-400 animate-float-heart"
            style={{
              left: `${heart.left}%`,
              top: '50%',
              fontSize: `${heart.size}px`,
              animationDelay: `${heart.delay}s`,
              opacity: 0
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Center hug animation */}
      <div className={`relative transform transition-all duration-500 ${visible ? 'scale-100' : 'scale-0'}`}>
        {/* Expanding ring */}
        <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-pink-200 to-orange-200 animate-ping opacity-30" />

        {/* Main circle */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center shadow-2xl border-4 border-white">
          <span className="text-6xl animate-pulse">🤗</span>
        </div>

        {/* Text below */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <p className="text-white text-lg font-medium drop-shadow-lg">
            {senderName} sent a hug
          </p>
        </div>
      </div>
    </div>
  )
}
