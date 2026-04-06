import { useState } from 'react'
import { DIFFICULTY, SNAKE_SKINS } from '../game/constants.js'

export default function StartScreen({ onStart, selectedSkin, onSkinChange }) {
  const [skin, setSkin] = useState(selectedSkin || 'neon')

  const handleSkinSelect = (key) => {
    setSkin(key)
    if (onSkinChange) onSkinChange(key)
  }
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 gap-8">
      {/* Title */}
      <div className="text-center">
        <h1
          className="text-4xl md:text-6xl font-bold tracking-wider"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: '#00fff5',
            textShadow: '0 0 20px #00fff5, 0 0 40px #00fff588, 0 0 80px #00fff544',
          }}
        >
          NEON
        </h1>
        <h1
          className="text-4xl md:text-6xl font-bold tracking-wider mt-2"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: '#ff2d95',
            textShadow: '0 0 20px #ff2d95, 0 0 40px #ff2d9588, 0 0 80px #ff2d9544',
          }}
        >
          SNAKE
        </h1>
        <p
          className="mt-4 text-xs opacity-60"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          🐍 A RETRO ARCADE EXPERIENCE
        </p>
      </div>

      {/* Skin Selection */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <p
          className="text-center text-xs opacity-70 mb-1"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          SNAKE SKIN
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          {Object.entries(SNAKE_SKINS).map(([key, s]) => {
            const isActive = skin === key
            const glowColor = s.head || '#00fff5'
            return (
              <button
                key={key}
                onClick={() => handleSkinSelect(key)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  borderColor: isActive ? glowColor : glowColor + '33',
                  background: isActive ? glowColor + '22' : 'transparent',
                  color: glowColor,
                  boxShadow: isActive ? `0 0 15px ${glowColor}44` : 'none',
                }}
              >
                <span className="text-lg">{s.icon}</span>
                <span className="text-[8px]">{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <p
          className="text-center text-xs opacity-70 mb-2"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          SELECT DIFFICULTY
        </p>
        {Object.entries(DIFFICULTY).map(([key, { label, color }]) => {
          const highScore = parseInt(localStorage.getItem(`neon-snake-high-${key}`) || '0', 10)
          return (
            <button
              key={key}
              onClick={() => onStart(key, skin)}
              className="relative px-6 py-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                borderColor: color + '66',
                background: color + '11',
                color: color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = color
                e.currentTarget.style.boxShadow = `0 0 20px ${color}44, inset 0 0 20px ${color}11`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = color + '66'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span className="text-sm">{label}</span>
              {highScore > 0 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] opacity-50">
                  HI: {highScore}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Controls info */}
      <div
        className="text-center text-[10px] opacity-40 leading-relaxed"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <p>ARROWS / WASD / SWIPE</p>
        <p>ESC TO PAUSE</p>
      </div>
    </div>
  )
}
