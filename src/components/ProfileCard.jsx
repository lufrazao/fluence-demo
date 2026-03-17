export default function ProfileCard({ traits, patterns }) {
  if (!traits.length && !patterns.length) {
    return (
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Behavioral Profile</h3>
        <p className="text-xs text-gray-500 italic">Profile builds as user interacts...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {traits.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Detected Traits</h3>
          <div className="space-y-2">
            {traits.map((trait, i) => (
              <div key={i} className="animate-fade-in">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{trait.label}</span>
                  <span className="text-teal-400 font-mono">{Math.round(trait.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className="metric-bar bg-gradient-to-r from-teal-500 to-teal-400"
                    style={{ width: `${trait.confidence * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {patterns.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Detected Patterns</h3>
          <div className="space-y-1.5">
            {patterns.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-xs animate-fade-in bg-white/5 rounded-lg px-2.5 py-2">
                <span className="text-lg leading-none">{p.icon}</span>
                <div>
                  <div className="text-gray-200 font-medium">{p.name}</div>
                  <div className="text-gray-500">{p.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
