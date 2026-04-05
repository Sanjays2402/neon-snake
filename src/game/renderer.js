import { CELL_SIZE, GRID_COLS, GRID_ROWS, CANVAS_W, CANVAS_H, COLORS, POWERUP_TYPES } from './constants.js'

export function drawGame(ctx, game, time) {
  const { snake, renderPositions, food, powerup, activePowerups, trail, particles } = game

  // Screen shake offset
  let sx = 0, sy = 0
  if (game.shakeIntensity > 0) {
    sx = (Math.random() - 0.5) * game.shakeIntensity * 2
    sy = (Math.random() - 0.5) * game.shakeIntensity * 2
  }

  ctx.save()
  ctx.translate(sx, sy)

  // Background
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Grid lines (very subtle)
  ctx.strokeStyle = COLORS.grid
  ctx.lineWidth = 0.5
  for (let x = 0; x <= GRID_COLS; x++) {
    ctx.beginPath()
    ctx.moveTo(x * CELL_SIZE, 0)
    ctx.lineTo(x * CELL_SIZE, CANVAS_H)
    ctx.stroke()
  }
  for (let y = 0; y <= GRID_ROWS; y++) {
    ctx.beginPath()
    ctx.moveTo(0, y * CELL_SIZE)
    ctx.lineTo(CANVAS_W, y * CELL_SIZE)
    ctx.stroke()
  }

  // Border walls with glow
  ctx.save()
  ctx.shadowColor = COLORS.wall
  ctx.shadowBlur = 15
  ctx.strokeStyle = COLORS.wall
  ctx.lineWidth = 3
  ctx.strokeRect(1, 1, CANVAS_W - 2, CANVAS_H - 2)
  ctx.restore()

  // Trail
  trail.forEach(t => {
    ctx.save()
    ctx.globalAlpha = t.life * 0.3
    ctx.fillStyle = COLORS.trail
    ctx.shadowColor = COLORS.snake
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(t.x, t.y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })

  // Food with pulsing glow
  if (food) {
    const fx = food.x * CELL_SIZE + CELL_SIZE / 2
    const fy = food.y * CELL_SIZE + CELL_SIZE / 2
    const pulse = 1 + Math.sin(time * 5) * 0.3

    ctx.save()
    ctx.shadowColor = COLORS.food
    ctx.shadowBlur = 20 * pulse
    ctx.fillStyle = COLORS.food
    ctx.beginPath()
    ctx.arc(fx, fy, (CELL_SIZE / 2 - 2) * pulse, 0, Math.PI * 2)
    ctx.fill()
    // Inner glow
    ctx.shadowBlur = 30 * pulse
    ctx.globalAlpha = 0.4
    ctx.fill()
    ctx.restore()
  }

  // Powerup with spinning/pulsing
  if (powerup) {
    const px = powerup.x * CELL_SIZE + CELL_SIZE / 2
    const py = powerup.y * CELL_SIZE + CELL_SIZE / 2
    const pt = POWERUP_TYPES[powerup.type]
    const pulse = 1 + Math.sin(time * 4) * 0.25
    const bobble = Math.sin(time * 3) * 2

    ctx.save()
    ctx.shadowColor = pt.color
    ctx.shadowBlur = 25 * pulse
    ctx.fillStyle = pt.color
    ctx.beginPath()
    // Draw a diamond shape
    const r = (CELL_SIZE / 2) * pulse
    ctx.moveTo(px, py - r + bobble)
    ctx.lineTo(px + r, py + bobble)
    ctx.lineTo(px, py + r + bobble)
    ctx.lineTo(px - r, py + bobble)
    ctx.closePath()
    ctx.fill()
    // Icon
    ctx.shadowBlur = 0
    ctx.fillStyle = '#000'
    ctx.font = `${10 * pulse}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(pt.icon, px, py + bobble + 1)
    ctx.restore()
  }

  // Snake body
  if (renderPositions.length > 0) {
    const hasShield = game.hasShield

    // Draw body segments with glow
    for (let i = renderPositions.length - 1; i >= 0; i--) {
      const pos = renderPositions[i]
      const isHead = i === 0
      const t = i / renderPositions.length
      const alpha = 1 - t * 0.4

      ctx.save()
      ctx.globalAlpha = alpha

      let color = COLORS.snake
      if (hasShield) color = POWERUP_TYPES.shield.color
      if (isHead) color = COLORS.snakeHead

      ctx.shadowColor = color
      ctx.shadowBlur = isHead ? 20 : 12
      ctx.fillStyle = color

      const size = isHead ? CELL_SIZE / 2 : CELL_SIZE / 2 - 1 - t * 2
      ctx.beginPath()
      if (isHead) {
        // Rounded head
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
      } else {
        // Rounded rect body
        roundedRect(ctx, pos.x - size, pos.y - size, size * 2, size * 2, 4)
      }
      ctx.fill()

      // Eyes on head
      if (isHead) {
        ctx.shadowBlur = 0
        ctx.fillStyle = '#000'
        const eyeOffset = 3
        const eyeSize = 2.5
        const dx = game.dir.x
        const dy = game.dir.y
        // Position eyes based on direction
        if (dx !== 0) {
          ctx.beginPath()
          ctx.arc(pos.x + dx * 3, pos.y - eyeOffset, eyeSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(pos.x + dx * 3, pos.y + eyeOffset, eyeSize, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(pos.x - eyeOffset, pos.y + dy * 3, eyeSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(pos.x + eyeOffset, pos.y + dy * 3, eyeSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.restore()
    }

    // Connecting segments smoothly
    if (renderPositions.length > 1) {
      ctx.save()
      ctx.shadowColor = COLORS.snake
      ctx.shadowBlur = 8
      ctx.strokeStyle = COLORS.snake
      ctx.lineWidth = CELL_SIZE - 6
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.moveTo(renderPositions[0].x, renderPositions[0].y)
      for (let i = 1; i < renderPositions.length; i++) {
        ctx.lineTo(renderPositions[i].x, renderPositions[i].y)
      }
      ctx.stroke()
      ctx.restore()
    }
  }

  // Particles
  particles.draw(ctx)

  ctx.restore() // end shake transform

  // Active powerup indicators (top-right, outside shake)
  const activeTypes = Object.entries(activePowerups)
  activeTypes.forEach(([type, expires], idx) => {
    const pt = POWERUP_TYPES[type]
    if (!pt) return
    const remaining = Math.max(0, expires - Date.now())
    const pct = remaining / pt.duration

    ctx.save()
    ctx.fillStyle = pt.color
    ctx.shadowColor = pt.color
    ctx.shadowBlur = 10
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${pt.icon} ${(remaining / 1000).toFixed(1)}s`, CANVAS_W - 10, 25 + idx * 22)

    // Timer bar
    ctx.fillStyle = pt.color + '44'
    ctx.fillRect(CANVAS_W - 80, 30 + idx * 22, 70, 4)
    ctx.fillStyle = pt.color
    ctx.fillRect(CANVAS_W - 80, 30 + idx * 22, 70 * pct, 4)
    ctx.restore()
  })

  // CRT scanline overlay
  drawCRT(ctx)
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawCRT(ctx) {
  // Scanlines
  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
  for (let y = 0; y < CANVAS_H; y += 3) {
    ctx.fillRect(0, y, CANVAS_W, 1)
  }
  // Vignette
  const grad = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.3,
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.8
  )
  grad.addColorStop(0, 'transparent')
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
  ctx.restore()
}
