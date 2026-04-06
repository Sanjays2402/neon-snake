import { isSoundEnabled, toggleSound } from '../game/sound.js'
import { useState } from 'react'

export default function PauseOverlay({ onResume, onRestart, onQuit }) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled())

  const handleToggleSound = () => {
    const newVal = toggleSound()
    setSoundOn(newVal)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20"
      style={{ background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(4px)' }}
    >
      <div className="flex flex-col items-center gap-6">
        <h2
          className="text-2xl"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: '#b026ff',
            textShadow: '0 0 20px #b026ff88',
          }}
        >
          PAUSED
        </h2>

        <div className="flex flex-col gap-3 w-48">
          <PauseButton onClick={onResume} color="#00fff5" label="RESUME" />
          <PauseButton onClick={handleToggleSound} color="#ff6600" label={soundOn ? '🔊 SOUND ON' : '🔇 SOUND OFF'} />
          <PauseButton onClick={onRestart} color="#ffe600" label="RESTART" />
          <PauseButton onClick={onQuit} color="#ff2d95" label="QUIT" />
        </div>

        <p
          className="text-[10px] opacity-40 mt-2"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          ESC TO RESUME
        </p>
      </div>
    </div>
  )
}

function PauseButton({ onClick, color, label }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-3 rounded border-2 text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        borderColor: color + '66',
        color: color,
        background: color + '11',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.boxShadow = `0 0 15px ${color}44`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = color + '66'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {label}
    </button>
  )
}
