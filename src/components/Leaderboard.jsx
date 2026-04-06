import { getLeaderboard } from '../game/stats.js'

export default function Leaderboard({ onClose }) {
  const entries = getLeaderboard()

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      <h2
        className="text-base"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          color: '#ffe600',
          textShadow: '0 0 20px #ffe60088',
        }}
      >
        🏆 TOP SCORES
      </h2>

      {entries.length === 0 ? (
        <p
          className="text-[10px] opacity-50"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          NO SCORES YET
        </p>
      ) : (
        <div className="w-full flex flex-col gap-1">
          <div
            className="flex justify-between text-[7px] opacity-40 px-2 pb-1 border-b"
            style={{ fontFamily: "'Press Start 2P', monospace", borderColor: '#ffffff22' }}
          >
            <span className="w-6">#</span>
            <span className="flex-1">SCORE</span>
            <span className="w-16 text-center">DIFF</span>
            <span className="w-20 text-right">DATE</span>
          </div>
          {entries.map((entry, i) => {
            const date = new Date(entry.date)
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`
            const colors = ['#ffd700', '#c0c0c0', '#cd7f32']
            const color = i < 3 ? colors[i] : '#ffffff66'
            const medals = ['🥇', '🥈', '🥉']
            return (
              <div
                key={i}
                className="flex justify-between items-center text-[8px] px-2 py-1"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color,
                  background: i < 3 ? color + '08' : 'transparent',
                  borderRadius: '4px',
                }}
              >
                <span className="w-6">{i < 3 ? medals[i] : `${i + 1}.`}</span>
                <span className="flex-1" style={{ textShadow: i < 3 ? `0 0 8px ${color}66` : 'none' }}>
                  {entry.score}
                </span>
                <span className="w-16 text-center opacity-70 text-[7px]">{entry.difficulty}</span>
                <span className="w-20 text-right opacity-50 text-[7px]">{dateStr}</span>
              </div>
            )
          })}
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-2 px-4 py-2 rounded border-2 text-[10px] transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
        BACK
      </button>
    </div>
  )
}
