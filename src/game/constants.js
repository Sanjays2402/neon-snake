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

export const POWERUP_TYPES = {
  speed: { color: '#ff6600', glow: '#ff660088', label: '⚡ Speed', duration: 5000, icon: '⚡' },
  slow: { color: '#4d4dff', glow: '#4d4dff88', label: '🐌 Slow-Mo', duration: 6000, icon: '🐌' },
  double: { color: '#ffe600', glow: '#ffe60088', label: '✨ 2x Points', duration: 8000, icon: '✨' },
  shield: { color: '#39ff14', glow: '#39ff1488', label: '🛡️ Shield', duration: 7000, icon: '🛡️' },
}

export const COLORS = {
  snake: '#00fff5',
  snakeGlow: '#00fff544',
  snakeHead: '#00ffff',
  food: '#ff2d95',
  foodGlow: '#ff2d9566',
  wall: '#b026ff',
  wallGlow: '#b026ff33',
  grid: '#ffffff08',
  bg: '#0a0a0f',
  trail: '#00fff520',
}
