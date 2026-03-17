export default function MetricsCard({ metrics, fluenceEnabled, detectedPatterns = new Set() }) {
  if (!metrics.length) return null

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Projected Business Impact</h3>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m, i) => {
          const unlocked = fluenceEnabled && detectedPatterns.has(m.unlockedBy)
          return (
            <div
              key={i}
              className={`rounded-xl p-3 text-center transition-all duration-500 ${
                unlocked ? 'bg-teal-500/10 ring-1 ring-teal-500/30' : 'bg-white/5'
              }`}
            >
              <div className={`text-xl font-bold transition-all duration-700 ${unlocked ? 'text-teal-400' : 'text-gray-500'}`}>
                {unlocked ? m.after : m.before}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{m.label}</div>
              {unlocked && m.delta && (
                <div className="text-[10px] text-green-400 font-semibold mt-1 animate-fade-in">{m.delta}</div>
              )}
              {!unlocked && m.unlockedBy && (
                <div className="text-[10px] text-gray-600 mt-1">
                  {detectedPatterns.size > 0 || fluenceEnabled ? '🔒' : '—'}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
