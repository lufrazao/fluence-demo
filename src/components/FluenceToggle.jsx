export default function FluenceToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300"
      style={{
        background: enabled
          ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
          : 'rgba(255,255,255,0.1)',
      }}
    >
      <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${enabled ? 'bg-white/30' : 'bg-white/10'}`}>
        <div
          className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
            enabled ? 'left-5 bg-white' : 'left-1 bg-gray-400'
          }`}
        />
      </div>
      <span className={`text-sm font-semibold ${enabled ? 'text-white' : 'text-gray-400'}`}>
        Fluence {enabled ? 'ON' : 'OFF'}
      </span>
      {enabled && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
    </button>
  )
}
