import {
  CELL_SIZE, GRID_COLS, GRID_ROWS, CANVAS_W, CANVAS_H,
  DIR, DIFFICULTY, POWERUP_TYPES, COLORS, FOOD_TYPES
} from './constants.js'
import { ParticleSystem } from './particles.js'
import { playEatSound, playDeathSound, playPowerupSound } from './sound.js'
import { recordGame } from './stats.js'

export class SnakeGame {
  constructor(difficulty = 'medium', skin = 'neon') {
    this.difficulty = difficulty
    this.skin = skin
    this.particles = new ParticleSystem()
    this.floatingTexts = [] // floating score popups
    this.reset()
  }

  reset() {
    const mid = Math.floor(GRID_COLS / 2)
    const midY = Math.floor(GRID_ROWS / 2)
    // Snake segments as grid positions; rendering interpolates
    this.snake = [
      { x: mid, y: midY },
      { x: mid - 1, y: midY },
      { x: mid - 2, y: midY },
    ]
    // Smooth rendering positions (pixel coords)
    this.renderPositions = this.snake.map(s => ({
      x: s.x * CELL_SIZE + CELL_SIZE / 2,
      y: s.y * CELL_SIZE + CELL_SIZE / 2,
    }))
    this.dir = DIR.RIGHT
    this.nextDir = DIR.RIGHT
    this.food = null
    this.powerup = null
    this.powerupTimer = null
    this.activePowerups = {} // type -> expiresAt
    this.score = 0
    this.foodEaten = 0
    this.moveAccum = 0
    this.state = 'playing' // playing | paused | dead
    this.shakeTimer = 0
    this.shakeIntensity = 0
    this.trail = [] // fading trail positions
    this.obstacles = []
    this.deathStats = null
    this.startTime = Date.now()
    this.particles.clear()
    this._spawnFood()
    this._schedulePowerup()
  }

  get speed() {
    const base = DIFFICULTY[this.difficulty].speed
    if (this.activePowerups.speed && Date.now() < this.activePowerups.speed) {
      return base * 1.6
    }
    if (this.activePowerups.slow && Date.now() < this.activePowerups.slow) {
      return base * 0.5
    }
    return base
  }

  get hasShield() {
    return this.activePowerups.shield && Date.now() < this.activePowerups.shield
  }

  get hasDouble() {
    return this.activePowerups.double && Date.now() < this.activePowerups.double
  }

  setDirection(dir) {
    // Prevent 180-degree turns
    if (dir.x + this.dir.x === 0 && dir.y + this.dir.y === 0) return
    this.nextDir = dir
  }

  pause() {
    if (this.state === 'playing') this.state = 'paused'
    else if (this.state === 'paused') this.state = 'playing'
  }

  update(dt) {
    if (this.state !== 'playing') return

    // Expire powerups
    const now = Date.now()
    for (const [type, expires] of Object.entries(this.activePowerups)) {
      if (now >= expires) delete this.activePowerups[type]
    }

    // Shake decay
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt
      if (this.shakeTimer <= 0) this.shakeIntensity = 0
    }

    // Movement accumulator for grid-based logic at variable speed
    this.moveAccum += dt * this.speed
    while (this.moveAccum >= 1) {
      this.moveAccum -= 1
      this._step()
      if (this.state === 'dead') return
    }

    // Smooth interpolation for rendering
    const lerp = this.moveAccum
    this._updateRenderPositions(lerp)

    // Update trail
    if (this.renderPositions.length > 0) {
      this.trail.push({
        x: this.renderPositions[0].x,
        y: this.renderPositions[0].y,
        life: 1.0,
      })
    }
    this.trail.forEach(t => (t.life -= 0.03))
    this.trail = this.trail.filter(t => t.life > 0)

    // Update floating texts
    this.floatingTexts.forEach(ft => {
      ft.y -= 1.2
      ft.life -= 0.025
    })
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0)

    this.particles.update()
  }

  _step() {
    this.dir = this.nextDir
    const head = this.snake[0]
    const nx = head.x + this.dir.x
    const ny = head.y + this.dir.y

    // Wall collision
    if (nx < 0 || nx >= GRID_COLS || ny < 0 || ny >= GRID_ROWS) {
      if (this.hasShield) {
        delete this.activePowerups.shield
        // Wrap around instead
        const wrapped = {
          x: (nx + GRID_COLS) % GRID_COLS,
          y: (ny + GRID_ROWS) % GRID_ROWS,
        }
        this.snake.unshift(wrapped)
        this.snake.pop()
        return
      }
      this._die()
      return
    }

    // Self collision
    for (let i = 1; i < this.snake.length; i++) {
      if (this.snake[i].x === nx && this.snake[i].y === ny) {
        if (this.hasShield) {
          delete this.activePowerups.shield
          return // skip this move
        }
        this._die()
        return
      }
    }

    // Obstacle collision
    for (const obs of this.obstacles) {
      if (obs.x === nx && obs.y === ny) {
        if (this.hasShield) {
          delete this.activePowerups.shield
          return
        }
        this._die()
        return
      }
    }

    const newHead = { x: nx, y: ny }
    this.snake.unshift(newHead)

    // Food collision
    if (this.food && nx === this.food.x && ny === this.food.y) {
      const foodDef = FOOD_TYPES[this.food.type] || FOOD_TYPES.apple
      let points = foodDef.points
      if (this.hasDouble) points *= 2
      this.score += points
      this.foodEaten++

      // Golden fruit gives temporary speed boost
      if (this.food.type === 'golden') {
        this.activePowerups.speed = Date.now() + 3000
      }

      playEatSound(this.food.type)

      // Floating score text
      const prefix = this.hasDouble ? '×2 ' : ''
      this.floatingTexts.push({
        x: this.food.x * CELL_SIZE + CELL_SIZE / 2,
        y: this.food.y * CELL_SIZE + CELL_SIZE / 2,
        text: `${prefix}+${points}`,
        color: foodDef.color,
        life: 1.0,
      })

      // Particles with food-specific color
      this.particles.emit(
        this.food.x * CELL_SIZE + CELL_SIZE / 2,
        this.food.y * CELL_SIZE + CELL_SIZE / 2,
        foodDef.color,
        25
      )

      // Spawn obstacles every 5 food eaten
      if (this.foodEaten % 5 === 0) {
        this._spawnObstacles(2)
      }

      this._spawnFood()
    } else {
      this.snake.pop()
    }

    // Powerup collision
    if (this.powerup && nx === this.powerup.x && ny === this.powerup.y) {
      this.activePowerups[this.powerup.type] = Date.now() + POWERUP_TYPES[this.powerup.type].duration
      playPowerupSound()
      this.particles.emit(
        this.powerup.x * CELL_SIZE + CELL_SIZE / 2,
        this.powerup.y * CELL_SIZE + CELL_SIZE / 2,
        POWERUP_TYPES[this.powerup.type].color,
        30
      )
      this.powerup = null
      this._schedulePowerup()
    }
  }

  _die() {
    this.state = 'dead'
    this.shakeTimer = 0.5
    this.shakeIntensity = 12
    playDeathSound()
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000)
    this.deathStats = {
      score: this.score,
      foodEaten: this.foodEaten,
      length: this.snake.length,
      time: elapsed,
      difficulty: DIFFICULTY[this.difficulty].label,
    }
    // Explode snake
    this.snake.forEach(s => {
      this.particles.emit(
        s.x * CELL_SIZE + CELL_SIZE / 2,
        s.y * CELL_SIZE + CELL_SIZE / 2,
        COLORS.snake,
        5
      )
    })
    // Save high score
    const key = `neon-snake-high-${this.difficulty}`
    const prev = parseInt(localStorage.getItem(key) || '0', 10)
    if (this.score > prev) {
      localStorage.setItem(key, this.score.toString())
      this.deathStats.newHighScore = true
    }
    this.deathStats.highScore = Math.max(this.score, prev)
    recordGame(this.deathStats)
  }

  _updateRenderPositions(lerp) {
    this.renderPositions = this.snake.map((seg, i) => {
      const target = {
        x: seg.x * CELL_SIZE + CELL_SIZE / 2,
        y: seg.y * CELL_SIZE + CELL_SIZE / 2,
      }
      if (i === 0 && this.state === 'playing') {
        // Interpolate head forward
        const prev = this.snake[1] || seg
        const prevPx = {
          x: prev.x * CELL_SIZE + CELL_SIZE / 2,
          y: prev.y * CELL_SIZE + CELL_SIZE / 2,
        }
        // Head moves from previous position to current
        return {
          x: target.x + this.dir.x * lerp * CELL_SIZE,
          y: target.y + this.dir.y * lerp * CELL_SIZE,
        }
      }
      return target
    })
  }

  _spawnFood() {
    // Pick food type based on weighted random
    const types = Object.entries(FOOD_TYPES)
    const totalWeight = types.reduce((sum, [, t]) => sum + t.weight, 0)
    let roll = Math.random() * totalWeight
    let foodType = 'apple'
    for (const [key, t] of types) {
      roll -= t.weight
      if (roll <= 0) { foodType = key; break }
    }

    let pos
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_COLS),
        y: Math.floor(Math.random() * GRID_ROWS),
      }
    } while (
      this.snake.some(s => s.x === pos.x && s.y === pos.y) ||
      this.obstacles.some(o => o.x === pos.x && o.y === pos.y)
    )
    this.food = { ...pos, type: foodType }
  }

  _spawnObstacles(count) {
    for (let i = 0; i < count; i++) {
      let pos
      let attempts = 0
      do {
        pos = {
          x: Math.floor(Math.random() * GRID_COLS),
          y: Math.floor(Math.random() * GRID_ROWS),
        }
        attempts++
      } while (
        attempts < 100 &&
        (this.snake.some(s => s.x === pos.x && s.y === pos.y) ||
        this.obstacles.some(o => o.x === pos.x && o.y === pos.y) ||
        (this.food && this.food.x === pos.x && this.food.y === pos.y) ||
        (Math.abs(pos.x - this.snake[0].x) < 3 && Math.abs(pos.y - this.snake[0].y) < 3))
      )
      if (attempts < 100) {
        this.obstacles.push(pos)
      }
    }
  }

  _schedulePowerup() {
    if (this.powerupTimer) clearTimeout(this.powerupTimer)
    const delay = 8000 + Math.random() * 12000
    this.powerupTimer = setTimeout(() => {
      if (this.state !== 'playing') return
      const types = Object.keys(POWERUP_TYPES)
      const type = types[Math.floor(Math.random() * types.length)]
      let pos
      do {
        pos = {
          x: Math.floor(Math.random() * GRID_COLS),
          y: Math.floor(Math.random() * GRID_ROWS),
        }
      } while (
        this.snake.some(s => s.x === pos.x && s.y === pos.y) ||
        (this.food && this.food.x === pos.x && this.food.y === pos.y)
      )
      this.powerup = { ...pos, type, spawnTime: Date.now() }
    }, delay)
  }

  getHighScore() {
    return parseInt(localStorage.getItem(`neon-snake-high-${this.difficulty}`) || '0', 10)
  }

  destroy() {
    if (this.powerupTimer) clearTimeout(this.powerupTimer)
  }
}
