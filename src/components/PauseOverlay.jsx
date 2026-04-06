import { useState } from 'react'
import { SNAKE_SKINS } from '../game/constants.js'
import { isSoundEnabled, toggleSound } from '../game/sound.js'

export default function PauseOverlay({ onResume, onRestart, onQuit, currentSkin, onSkinChange }) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled())

  const handleToggleSound = () => {
    const newVal = toggleSound()
    setSoundOn(newVal)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20"
      style={{ background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(4px)' }}
    >
      <div className="flex flex-col items-center gap-5">
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

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="px-3 py-2 rounded border text-[9px] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            borderColor: soundOn ? '#39ff1466' : '#ff2d9566',
            color: soundOn ? '#39ff14' : '#ff2d95',
            background: soundOn ? '#39ff1411' : '#ff2d9511',
          }}
        >
          {soundOn ? '🔊 SOUND ON' : '🔇 SOUND OFF'}
        </button>

        {/* Skin Selector */}
        <div className="flex flex-col items-center gap-2">
          <p
            className="text-[8px] opacity-40"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            SNAKE SKIN
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {Object.entries(SNAKE_SKINS).map(([key, skinDef]) => {
              const isActive = currentSkin === key
              const borderColor = skinDef.head || '#ffffff'
              return (
                <button
                  key={key}
                  onClick={() => onSkinChange(key)}
                  className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded border transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    borderColor: isActive ? borderColor : borderColor + '33',
                    background: isActive ? borderColor + '22' : 'transparent',
                    boxShadow: isActive ? `0 0 10px ${borderColor}44` : 'none',
                  }}
                >
                  <span className="text-sm">{skinDef.icon}</span>
                  <span className="text-[6px]" style={{ color: isActive ? borderColor : borderColor + '66' }}>
                    {skinDef.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-48">
          <PauseButton onClick={onResume} color="#00fff5" label="RESUME" />
          <PauseButton onClick={onRestart} color="#ffe600" label="RESTART" />
          <PauseButton onClick={onQuit} color="#ff2d95" label="QUIT" />
        </div>

        <p
          className="text-[10px] opacity-40 mt-1"
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
