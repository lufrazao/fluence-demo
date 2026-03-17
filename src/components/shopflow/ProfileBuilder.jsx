// Animated profile builder showing traits accumulating in real-time
import { motion, AnimatePresence } from 'framer-motion'

function TraitGauge({ trait, traitKey }) {
  const numericValue = typeof trait.value === 'number' ? trait.value : trait.confidence
  const pct = Math.round(numericValue * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 rounded-lg p-2.5"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-gray-300">{trait.label}</span>
        <motion.span
          key={pct}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-[11px] font-mono font-bold"
          style={{ color: trait.color }}
        >
          {typeof trait.value === 'string' ? trait.value : `${pct}%`}
        </motion.span>
      </div>
      {typeof trait.value === 'number' && (
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: trait.color }}
          />
        </div>
      )}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[8px] text-gray-600">confiança</span>
        <span className="text-[8px] text-gray-500">{Math.round(trait.confidence * 100)}%</span>
      </div>
    </motion.div>
  )
}

function EpisodeBadge({ episode }) {
  const colors = {
    cart_abandonment: 'border-red-500/30 text-red-400',
    purchase_complete: 'border-green-500/30 text-green-400',
    researcher_pattern: 'border-blue-500/30 text-blue-400',
    comparison_pattern: 'border-purple-500/30 text-purple-400',
  }
  const icons = {
    cart_abandonment: '🚪',
    purchase_complete: '✅',
    researcher_pattern: '🔍',
    comparison_pattern: '⚖️',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${colors[episode.type] || 'border-gray-500/30 text-gray-400'}`}
    >
      <span className="text-xs">{icons[episode.type] || '•'}</span>
      <span className="text-[10px]">{episode.detail}</span>
    </motion.div>
  )
}

export default function ProfileBuilder({ profile, archetype, persona }) {
  const traitEntries = Object.entries(profile.traits || {})

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Perfil Comportamental
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-gray-500">
            Confiança geral:
          </span>
          <motion.span
            key={profile.confidence}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-[10px] font-mono font-bold text-teal-400"
          >
            {Math.round(profile.confidence * 100)}%
          </motion.span>
        </div>
      </div>

      {/* Archetype badge */}
      <AnimatePresence>
        {archetype && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5"
          >
            <span className="text-lg">{archetype.icon}</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: archetype.color }}>
                {archetype.name}
              </p>
              <p className="text-[9px] text-gray-500">{archetype.description}</p>
            </div>
            {persona && (
              <div className="ml-auto flex items-center gap-1">
                <span className="text-sm">{persona.avatar}</span>
                <span className="text-[10px] text-gray-400">{persona.name}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trait gauges */}
      <div className="grid grid-cols-2 gap-2">
        <AnimatePresence>
          {traitEntries.map(([key, trait]) => (
            <TraitGauge key={key} traitKey={key} trait={trait} />
          ))}
        </AnimatePresence>
      </div>

      {traitEntries.length === 0 && (
        <p className="text-[11px] text-gray-600 italic text-center py-3">
          Coletando sinais comportamentais...
        </p>
      )}

      {/* Episodes */}
      {profile.episodes?.length > 0 && (
        <div>
          <h4 className="text-[10px] font-semibold text-gray-500 uppercase mb-1.5">Episódios Detectados</h4>
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence>
              {profile.episodes.map((ep, i) => (
                <EpisodeBadge key={`${ep.type}-${i}`} episode={ep} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
