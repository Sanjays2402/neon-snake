export default function HUD({ score, highScore, difficulty }) {
  return (
    <div
      className="flex justify-between items-center w-full px-2 py-2"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        maxWidth: '600px',
      }}
    >
      <div className="flex gap-4 text-[10px]">
        <span style={{ color: '#00fff5', textShadow: '0 0 8px #00fff566' }}>
          SCORE: {score}
        </span>
        <span style={{ color: '#ffe600', textShadow: '0 0 8px #ffe60066' }}>
          HI: {highScore}
        </span>
      </div>
      <div className="text-[10px] opacity-50">
        ESC ⏸
      </div>
    </div>
  )
}
