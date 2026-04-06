import { useState, useCallback } from 'react'
import StartScreen from './components/StartScreen.jsx'
import GameCanvas from './components/GameCanvas.jsx'
import HUD from './components/HUD.jsx'
import PauseOverlay from './components/PauseOverlay.jsx'
import GameOverScreen from './components/GameOverScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState('start') // start | playing | gameover
  const [difficulty, setDifficulty] = useState('medium')
  const [skin, setSkin] = useState('neon')
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [deathStats, setDeathStats] = useState(null)
  const [gameKey, setGameKey] = useState(0) // force remount

  const handleStart = useCallback((diff, selectedSkin) => {
    setDifficulty(diff)
    setSkin(selectedSkin || 'neon')
    setScreen('playing')
    setIsPaused(false)
    setScore(0)
    setDeathStats(null)
    setGameKey(k => k + 1)
  }, [])

  const handleDeath = useCallback((stats) => {
    setDeathStats(stats)
    setScreen('gameover')
  }, [])

  const handleScoreUpdate = useCallback((s, hs) => {
    setScore(s)
    setHighScore(hs)
  }, [])

  const handlePause = useCallback(() => {
    if (screen === 'playing') {
      setIsPaused(p => !p)
    }
  }, [screen])

  const handleRestart = useCallback(() => {
    setScreen('playing')
    setIsPaused(false)
    setDeathStats(null)
    setGameKey(k => k + 1)
  }, [])

  const handleQuit = useCallback(() => {
    setScreen('start')
    setIsPaused(false)
    setDeathStats(null)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#0a0a0f] overflow-hidden select-none">
      {screen === 'start' && <StartScreen onStart={handleStart} selectedSkin={skin} onSkinChange={setSkin} />}

      {(screen === 'playing' || screen === 'gameover') && (
        <div className="flex flex-col items-center gap-1 relative">
          <HUD score={score} highScore={highScore} difficulty={difficulty} />

          <div className="relative">
            <GameCanvas
              key={gameKey}
              difficulty={difficulty}
              skin={skin}
              onDeath={handleDeath}
              onScoreUpdate={handleScoreUpdate}
              onPause={handlePause}
              isPaused={isPaused}
            />

            {isPaused && screen === 'playing' && (
              <PauseOverlay
                onResume={() => setIsPaused(false)}
                onRestart={handleRestart}
                onQuit={handleQuit}
              />
            )}

            {screen === 'gameover' && (
              <GameOverScreen
                stats={deathStats}
                onRestart={handleRestart}
                onQuit={handleQuit}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
