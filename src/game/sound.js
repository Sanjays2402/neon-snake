// Sound effects using Web Audio API synth

let audioCtx = null
let soundEnabled = true

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      return null
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function isSoundEnabled() {
  return soundEnabled
}

export function toggleSound() {
  soundEnabled = !soundEnabled
  return soundEnabled
}

export function setSoundEnabled(val) {
  soundEnabled = val
}

function playTone(freq, duration, type = 'square', gainVal = 0.15, slide = null) {
  if (!soundEnabled) return
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  if (slide) {
    osc.frequency.exponentialRampToValueAtTime(slide, ctx.currentTime + duration)
  }
  gain.gain.setValueAtTime(gainVal, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export function playEatSound(foodType) {
  if (!soundEnabled) return
  if (foodType === 'cherry') {
    playTone(660, 0.08, 'square', 0.12)
    setTimeout(() => playTone(880, 0.1, 'square', 0.12), 60)
  } else if (foodType === 'golden') {
    playTone(880, 0.06, 'square', 0.12)
    setTimeout(() => playTone(1100, 0.06, 'square', 0.12), 50)
    setTimeout(() => playTone(1320, 0.12, 'sine', 0.15), 100)
  } else {
    // apple (default)
    playTone(520, 0.08, 'square', 0.1)
    setTimeout(() => playTone(680, 0.1, 'square', 0.1), 50)
  }
}

export function playDeathSound() {
  if (!soundEnabled) return
  playTone(400, 0.15, 'sawtooth', 0.2, 80)
  setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.15, 40), 120)
}

export function playPowerupSound() {
  if (!soundEnabled) return
  playTone(600, 0.06, 'sine', 0.12)
  setTimeout(() => playTone(800, 0.06, 'sine', 0.12), 50)
  setTimeout(() => playTone(1000, 0.06, 'sine', 0.12), 100)
  setTimeout(() => playTone(1200, 0.12, 'sine', 0.15), 150)
}

export function playLevelUpSound() {
  if (!soundEnabled) return
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.12, 'sine', 0.12), i * 80)
  })
}

export function playPortalSound() {
  if (!soundEnabled) return
  playTone(300, 0.15, 'sine', 0.1, 900)
}
