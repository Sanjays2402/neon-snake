export default function GameOverScreen({ stats, onRestart, onQuit }) {
  if (!stats) return null

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-20"
      style={{ background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(6px)' }}
    >
      <div className="flex flex-col items-center gap-5 p-6">
        <h2
          className="text-2xl"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: '#ff2d95',
            textShadow: '0 0 30px #ff2d9588',
          }}
        >
          GAME OVER
        </h2>

        {stats.newHighScore && (
          <div
            className="text-xs animate-pulse"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: '#ffe600',
              textShadow: '0 0 15px #ffe60088',
            }}
          >
            ⭐ NEW HIGH SCORE! ⭐
          </div>
        )}

        <div
          className="flex flex-col gap-2 text-xs w-56"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <StatRow label="SCORE" value={stats.score} color="#00fff5" />
          <StatRow label="HIGH" value={stats.highScore} color="#ffe600" />
          <StatRow label="FOOD" value={stats.foodEaten} color="#ff2d95" />
          <StatRow label="LENGTH" value={stats.length} color="#39ff14" />
          <StatRow label="TIME" value={formatTime(stats.time)} color="#b026ff" />
          <StatRow label="LEVEL" value={stats.difficulty} color="#ff6600" />
        </div>

        <div className="flex flex-col gap-3 w-48 mt-2">
          <button
            onClick={onRestart}
            className="px-4 py-3 rounded border-2 text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              borderColor: '#00fff566',
              color: '#00fff5',
              background: '#00fff511',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00fff5'
              e.currentTarget.style.boxShadow = '0 0 15px #00fff544'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#00fff566'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onQuit}
            className="px-4 py-3 rounded border-2 text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              borderColor: '#ff2d9566',
              color: '#ff2d95',
              background: '#ff2d9511',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ff2d95'
              e.currentTarget.style.boxShadow = '0 0 15px #ff2d9544'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ff2d9566'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, color }) {
  return (
    <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#ffffff11' }}>
      <span className="opacity-50">{label}</span>
      <span style={{ color, textShadow: `0 0 8px ${color}66` }}>{value}</span>
    </div>
  )
}
