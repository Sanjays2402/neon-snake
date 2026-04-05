// Particle system for food-eat effects and death

export class Particle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 4
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.life = 1.0
    this.decay = 0.015 + Math.random() * 0.025
    this.size = 2 + Math.random() * 4
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.97
    this.vy *= 0.97
    this.life -= this.decay
    this.size *= 0.98
  }

  draw(ctx) {
    if (this.life <= 0) return
    ctx.save()
    ctx.globalAlpha = this.life
    ctx.shadowColor = this.color
    ctx.shadowBlur = 10
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  get dead() {
    return this.life <= 0
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = []
  }

  emit(x, y, color, count = 20) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color))
    }
  }

  update() {
    this.particles.forEach(p => p.update())
    this.particles = this.particles.filter(p => !p.dead)
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx))
  }

  clear() {
    this.particles = []
  }
}
