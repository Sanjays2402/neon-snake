// Stats tracking via localStorage

const STATS_KEY = 'neon-snake-stats'
const LEADERBOARD_KEY = 'neon-snake-leaderboard'

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return {
    totalGames: 0,
    totalFoodEaten: 0,
    longestSnake: 0,
    totalTimePlayed: 0, // seconds
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {
    // ignore
  }
}

export function getStats() {
  return loadStats()
}

export function recordGame(gameResult) {
  const stats = loadStats()
  stats.totalGames++
  stats.totalFoodEaten += gameResult.foodEaten || 0
  stats.longestSnake = Math.max(stats.longestSnake, gameResult.length || 0)
  stats.totalTimePlayed += gameResult.time || 0
  saveStats(stats)
  addLeaderboardEntry(gameResult)
  return stats
}

function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return []
}

function saveLeaderboard(entries) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries))
  } catch {
    // ignore
  }
}

function addLeaderboardEntry(gameResult) {
  const entries = loadLeaderboard()
  entries.push({
    score: gameResult.score || 0,
    date: new Date().toISOString(),
    difficulty: gameResult.difficulty || 'Medium',
    level: gameResult.level || 1,
    foodEaten: gameResult.foodEaten || 0,
    length: gameResult.length || 0,
    time: gameResult.time || 0,
  })
  // Sort descending by score, keep top 10
  entries.sort((a, b) => b.score - a.score)
  saveLeaderboard(entries.slice(0, 10))
}

export function getLeaderboard() {
  return loadLeaderboard()
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_KEY)
  } catch {
    // ignore
  }
}
