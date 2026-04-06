// Game constants and configuration

export const CELL_SIZE = 20
export const GRID_COLS = 30
export const GRID_ROWS = 30
export const CANVAS_W = CELL_SIZE * GRID_COLS
export const CANVAS_H = CELL_SIZE * GRID_ROWS

export const DIR = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

export const DIFFICULTY = {
  easy: { label: 'Easy', speed: 8, color: '#39ff14' },
  medium: { label: 'Medium', speed: 12, color: '#ffe600' },
  hard: { label: 'Hard', speed: 18, color: '#ff6600' },
  insane: { label: 'Insane', speed: 25, color: '#ff2d95' },
}

export const SNAKE_SKINS = {
  neon: {
    label: 'Neon',
    body: '#00fff5',
    head: '#00ffff',
    glow: '#00fff544',
    trail: '#00fff520',
    icon: '💎',
  },
  rainbow: {
    label: 'Rainbow',
    body: null, // computed per segment via HSL
    head: '#ff00ff',
    glow: '#ff00ff44',
    trail: '#ff00ff20',
    icon: '🌈',
  },
  fire: {
    label: 'Fire',
    body: null, // gradient yellow→red
    head: '#ffaa00',
    glow: '#ff440044',
    trail: '#ff440020',
    icon: '🔥',
  },
  ice: {
    label: 'Ice',
    body: null, // gradient white→blue
    head: '#ffffff',
    glow: '#88ccff44',
    trail: '#88ccff20',
    icon: '❄️',
  },
  gold: {
    label: 'Gold',
    body: '#ffd700',
    head: '#fff8dc',
    glow: '#ffd70044',
    trail: '#ffd70020',
    icon: '👑',
  },
}

export const FOOD_TYPES = {
  apple: { points: 1, color: '#39ff14', glow: '#39ff1466', label: 'Apple', icon: '🍎', weight: 60 },
  cherry: { points: 3, color: '#ff2d55', glow: '#ff2d5566', label: 'Cherry', icon: '🍒', weight: 25 },
  golden: { points: 5, color: '#ffd700', glow: '#ffd70066', label: 'Golden', icon: '⭐', weight: 15 },
}

export const POWERUP_TYPES = {
  speed: { color: '#ff6600', glow: '#ff660088', label: '⚡ Speed', duration: 5000, icon: '⚡' },
  slow: { color: '#4d4dff', glow: '#4d4dff88', label: '🐌 Slow-Mo', duration: 6000, icon: '🐌' },
  double: { color: '#ffe600', glow: '#ffe60088', label: '✨ 2x Points', duration: 8000, icon: '✨' },
  shield: { color: '#39ff14', glow: '#39ff1488', label: '🛡️ Shield', duration: 7000, icon: '🛡️' },
}

// Level definitions: level 1–10
// Each level requires 5 food to advance, speed scales up, obstacles added
export const LEVELS = Array.from({ length: 10 }, (_, i) => ({
  level: i + 1,
  speedMultiplier: 1 + i * 0.1,
  newObstacles: i < 1 ? 0 : 2 + Math.floor(i / 2), // obstacles added on entering this level
  hasPortals: i >= 2, // portals from level 3+
  foodToAdvance: 5,
}))

export const COLORS = {
  snake: '#00fff5',
  snakeGlow: '#00fff544',
  snakeHead: '#00ffff',
  food: '#ff2d95',
  foodGlow: '#ff2d9566',
  wall: '#b026ff',
  wallGlow: '#b026ff33',
  obstacle: '#ff6600',
  obstacleGlow: '#ff660033',
  portalA: '#b026ff',
  portalAGlow: '#b026ff66',
  portalB: '#00fff5',
  portalBGlow: '#00fff566',
  grid: '#ffffff08',
  bg: '#0a0a0f',
  trail: '#00fff520',
}
