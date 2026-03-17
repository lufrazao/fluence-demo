// Persona profiles page — shows all 3 shopper personas with their behavioral fingerprints
import { motion } from 'framer-motion'
import { PERSONAS, PERSONA_ORDER } from '../../data/shopflow/personas'

function PersonaCard({ persona, index }) {
  const traitEntries = Object.entries(persona.traits)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="glass-card p-5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{persona.avatar}</span>
        <div>
          <h3 className="text-base font-bold text-white">{persona.name}, {persona.age}</h3>
          <p className="text-[11px] text-gray-400">{persona.subtitle}</p>
          <p className="text-[10px] font-semibold mt-0.5" style={{ color: persona.color }}>
            {persona.archetype}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed mb-4">{persona.description}</p>

      {/* Traits */}
      <div className="space-y-2 mb-4">
        {traitEntries.map(([key, trait]) => {
          const isNumeric = typeof trait.value === 'number'
          const pct = isNumeric ? Math.round(trait.value * 100) : null
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-gray-400">{trait.label}</span>
                <span className="text-[10px] font-mono text-gray-300">
                  {isNumeric ? `${pct}%` : trait.value}
                </span>
              </div>
              {isNumeric && (
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: persona.color }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-white/10">
        <div>
          <p className="text-[9px] text-gray-500">Sessões</p>
          <p className="text-xs font-semibold text-gray-300">{persona.stats.sessions}</p>
        </div>
        <div>
          <p className="text-[9px] text-gray-500">Tempo médio</p>
          <p className="text-xs font-semibold text-gray-300">{persona.stats.avgTime}</p>
        </div>
        <div>
          <p className="text-[9px] text-gray-500">Abandonos</p>
          <p className="text-xs font-semibold text-red-400">{persona.stats.cartAbandons}</p>
        </div>
        <div>
          <p className="text-[9px] text-gray-500">Total perdido</p>
          <p className="text-xs font-semibold text-red-400">{persona.stats.totalAbandoned}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Personas() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white">Compradores Reais, Padrões Reais</h2>
          <p className="text-sm text-gray-400 mt-2">
            Três perfis comportamentais distintos — cada um exige uma abordagem de recuperação diferente.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {PERSONA_ORDER.map((id, i) => (
            <PersonaCard key={id} persona={PERSONAS[id]} index={i} />
          ))}
        </div>

        {/* Key insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center py-4 px-6 rounded-xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20"
        >
          <p className="text-sm text-gray-300">
            Um email genérico "Volte e finalize sua compra!" ignora tudo isso.
          </p>
          <p className="text-xs text-teal-400 mt-2 font-semibold">
            Fluence transforma sinais comportamentais em ações personalizadas.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
