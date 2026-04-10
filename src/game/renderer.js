import { CELL_SIZE, GRID_COLS, GRID_ROWS, CANVAS_W, CANVAS_H, COLORS, POWERUP_TYPES, FOOD_TYPES, SNAKE_SKINS } from './constants.js'

export function drawGame(ctx, game, time) {
  const { snake, renderPositions, food, powerup, activePowerups, trail, particles, obstacles, floatingTexts } = game
  const skin = SNAKE_SKINS[game.skin] || SNAKE_SKINS.neon

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
    ctx.fillStyle = skin.trail || COLORS.trail
    ctx.shadowColor = skin.head || COLORS.snake
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(t.x, t.y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })

  // Food with pulsing glow (type-aware)
  if (food) {
    const fx = food.x * CELL_SIZE + CELL_SIZE / 2
    const fy = food.y * CELL_SIZE + CELL_SIZE / 2
    const pulse = 1 + Math.sin(time * 5) * 0.3
    const foodDef = FOOD_TYPES[food.type] || FOOD_TYPES.apple

    ctx.save()
    ctx.shadowColor = foodDef.color
    ctx.shadowBlur = 20 * pulse
    ctx.fillStyle = foodDef.color
    ctx.beginPath()
    ctx.arc(fx, fy, (CELL_SIZE / 2 - 2) * pulse, 0, Math.PI * 2)
    ctx.fill()
    // Inner glow
    ctx.shadowBlur = 30 * pulse
    ctx.globalAlpha = 0.4
    ctx.fill()
    // Icon
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
    ctx.font = `${12 * pulse}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(foodDef.icon, fx, fy + 1)
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

  // Obstacles with neon purple glow
  if (obstacles && obstacles.length > 0) {
    obstacles.forEach(obs => {
      const ox = obs.x * CELL_SIZE
      const oy = obs.y * CELL_SIZE
      const pulse = 1 + Math.sin(time * 3 + obs.x + obs.y) * 0.15

      ctx.save()
      ctx.shadowColor = '#b026ff'
      ctx.shadowBlur = 15 * pulse
      ctx.fillStyle = '#b026ff'
      roundedRect(ctx, ox + 2, oy + 2, CELL_SIZE - 4, CELL_SIZE - 4, 3)
      ctx.fill()
      // Inner highlight
      ctx.globalAlpha = 0.3
      ctx.fillStyle = '#d060ff'
      roundedRect(ctx, ox + 4, oy + 4, CELL_SIZE - 8, CELL_SIZE - 8, 2)
      ctx.fill()
      ctx.restore()
    })
  }

  // Snake body (skin-aware)
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

      let color = _getSkinColor(game.skin, i, renderPositions.length, time, hasShield)
      if (isHead) color = hasShield ? POWERUP_TYPES.shield.color : (skin.head || COLORS.snakeHead)

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
      const connColor = skin.body || skin.head || COLORS.snake
      ctx.shadowColor = connColor
      ctx.shadowBlur = 8
      ctx.strokeStyle = connColor
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

  // Floating score texts
  if (floatingTexts && floatingTexts.length > 0) {
    floatingTexts.forEach(ft => {
      ctx.save()
      ctx.globalAlpha = ft.life
      ctx.font = `bold ${14 + (1 - ft.life) * 8}px 'Press Start 2P', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = ft.color
      ctx.shadowBlur = 15
      ctx.fillStyle = ft.color
      ctx.fillText(ft.text, ft.x, ft.y)
      ctx.restore()
    })
  }

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

// Get segment color based on skin type
function _getSkinColor(skinKey, segIndex, totalSegs, time, hasShield) {
  if (hasShield) return POWERUP_TYPES.shield.color
  const t = segIndex / totalSegs
  switch (skinKey) {
    case 'rainbow': {
      const hue = ((segIndex * 25) + time * 60) % 360
      return `hsl(${hue}, 100%, 60%)`
    }
    case 'fire': {
      const r = 255
      const g = Math.floor(180 - t * 140)
      const b = Math.floor(30 - t * 30)
      return `rgb(${r},${g},${b})`
    }
    case 'ice': {
      const r = Math.floor(200 - t * 150)
      const g = Math.floor(230 - t * 80)
      const b = 255
      return `rgb(${r},${g},${b})`
    }
    case 'gold':
      return '#ffd700'
    case 'neon':
    default:
      return '#00fff5'
  }
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
