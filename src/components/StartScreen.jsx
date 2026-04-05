import { DIFFICULTY } from '../game/constants.js'

export default function StartScreen({ onStart }) {
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
              onClick={() => onStart(key)}
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
