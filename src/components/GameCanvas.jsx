import { useRef, useEffect, useCallback } from 'react'
import { SnakeGame } from '../game/engine.js'
import { drawGame } from '../game/renderer.js'
import { CANVAS_W, CANVAS_H, DIR } from '../game/constants.js'

export default function GameCanvas({ difficulty, skin, onDeath, onScoreUpdate, onPause, isPaused }) {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(0)
  const touchStartRef = useRef(null)

  // Initialize game
  useEffect(() => {
    const game = new SnakeGame(difficulty, skin)
    gameRef.current = game
    return () => {
      game.destroy()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [difficulty, skin])

  // Sync pause state
  useEffect(() => {
    if (!gameRef.current) return
    if (isPaused && gameRef.current.state === 'playing') {
      gameRef.current.state = 'paused'
    } else if (!isPaused && gameRef.current.state === 'paused') {
      gameRef.current.state = 'playing'
    }
  }, [isPaused])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let running = true

    function loop(timestamp) {
      if (!running) return
      const game = gameRef.current
      if (!game) return

      const dt = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0.016
      lastTimeRef.current = timestamp

      game.update(dt)
      drawGame(ctx, game, timestamp / 1000)

      // Notify parent of score changes
      if (onScoreUpdate) {
        onScoreUpdate(game.score, game.getHighScore())
      }

      if (game.state === 'dead' && onDeath) {
        onDeath(game.deathStats)
        // Keep rendering particles after death
        game.particles.update()
        drawGame(ctx, game, timestamp / 1000)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [difficulty, onDeath, onScoreUpdate])

  // Keyboard controls
  useEffect(() => {
    function handleKey(e) {
      const game = gameRef.current
      if (!game) return

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        if (onPause) onPause()
        return
      }

      if (game.state !== 'playing') return

      const keyMap = {
        ArrowUp: DIR.UP, ArrowDown: DIR.DOWN, ArrowLeft: DIR.LEFT, ArrowRight: DIR.RIGHT,
        w: DIR.UP, W: DIR.UP, s: DIR.DOWN, S: DIR.DOWN,
        a: DIR.LEFT, A: DIR.LEFT, d: DIR.RIGHT, D: DIR.RIGHT,
      }

      if (keyMap[e.key]) {
        e.preventDefault()
        game.setDirection(keyMap[e.key])
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onPause])

  // Touch/swipe controls
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartRef.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (Math.max(absDx, absDy) < 20) return // too small

    const game = gameRef.current
    if (!game || game.state !== 'playing') return

    if (absDx > absDy) {
      game.setDirection(dx > 0 ? DIR.RIGHT : DIR.LEFT)
    } else {
      game.setDirection(dy > 0 ? DIR.DOWN : DIR.UP)
    }
    touchStartRef.current = null
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="block max-w-full max-h-full"
      style={{
        imageRendering: 'pixelated',
        aspectRatio: `${CANVAS_W}/${CANVAS_H}`,
      }}
    />
  )
}
