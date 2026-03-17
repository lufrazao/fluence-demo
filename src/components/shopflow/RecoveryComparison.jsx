// The "money moment" — shows generic vs personalized recovery side by side
import { motion } from 'framer-motion'
import { GENERIC_RECOVERY, PERSONALIZED_RECOVERY, RECOVERY_COMPARISON } from '../../data/shopflow/recoveryTemplates'

function RecoveryCard({ title, data, variant, delay = 0 }) {
  const isPersonalized = variant === 'fluence'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-xl border p-4 ${
        isPersonalized
          ? 'border-teal-500/30 bg-teal-500/5'
          : 'border-gray-700 bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
          isPersonalized
            ? 'bg-teal-500/20 text-teal-400'
            : 'bg-gray-700 text-gray-400'
        }`}>
          {title}
        </span>
      </div>

      {/* Message preview */}
      <div className={`rounded-lg p-3 mb-3 ${isPersonalized ? 'bg-teal-500/10' : 'bg-white/5'}`}>
        <p className="text-[10px] text-gray-400 mb-1">Assunto:</p>
        <p className={`text-[11px] font-medium ${isPersonalized ? 'text-teal-300' : 'text-gray-300'}`}>
          {data.subject}
        </p>
        <p className="text-[10px] text-gray-400 mt-2 mb-1">Mensagem:</p>
        <p className="text-[11px] text-gray-400 leading-relaxed">{data.body}</p>

        {data.badges && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.badges.map(badge => (
              <span key={badge} className="text-[8px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400">
                {badge}
              </span>
            ))}
          </div>
        )}

        <button className={`w-full mt-3 text-[11px] font-semibold py-2 rounded-lg ${
          isPersonalized
            ? 'bg-teal-500 text-white'
            : 'bg-gray-600 text-gray-300'
        }`}>
          {data.cta}
        </button>
      </div>

      {/* Timing */}
      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-2">
        <span>⏱️</span>
        <span>Enviado {data.timing}</span>
      </div>

      {/* Tone */}
      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
        <span>🎯</span>
        <span>Tom: {data.tone}</span>
      </div>

      {/* Why it works (personalized only) */}
      {data.whyItWorks && (
        <div className="mt-3 pt-2 border-t border-teal-500/20">
          <p className="text-[9px] text-teal-500 font-semibold uppercase mb-1">Por que funciona</p>
          <p className="text-[10px] text-gray-400">{data.whyItWorks}</p>
          <p className="text-[9px] text-gray-600 mt-1 font-mono">{data.traitUsed}</p>
        </div>
      )}
    </motion.div>
  )
}

function FunnelStats({ data, label, color }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-white/5 rounded-xl p-3"
    >
      <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">{label}</p>
      <div className="space-y-1.5">
        {[
          { label: 'Enviados', value: data.sent, pct: 100 },
          { label: 'Abertos', value: data.opened, pct: (data.opened / data.sent) * 100 },
          { label: 'Clicados', value: data.clicked, pct: (data.clicked / data.sent) * 100 },
          { label: 'Recuperados', value: data.recovered, pct: (data.recovered / data.sent) * 100 },
        ].map(step => (
          <div key={step.label} className="flex items-center gap-2">
            <span className="text-[9px] text-gray-500 w-16">{step.label}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${step.pct}%` }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <span className="text-[9px] text-gray-400 w-8 text-right">{step.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
        <span className="text-[10px] text-gray-400">Taxa de recuperação</span>
        <span className="text-sm font-bold" style={{ color }}>
          {Math.round(data.rate * 100)}%
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400">Receita recuperada</span>
        <span className="text-[10px] font-semibold" style={{ color }}>
          {data.revenue}
        </span>
      </div>
    </motion.div>
  )
}

export default function RecoveryComparison({ personaId }) {
  const personalized = personaId
    ? PERSONALIZED_RECOVERY[personaId]
    : PERSONALIZED_RECOVERY.lucas

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-sm font-bold text-white">O Momento da Recuperação</h3>
        <p className="text-[11px] text-gray-400 mt-1">
          Mesmo carrinho abandonado. Abordagem completamente diferente.
        </p>
      </div>

      {/* Side by side recovery messages */}
      <div className="grid grid-cols-2 gap-3">
        <RecoveryCard
          title="Sem Fluence"
          data={GENERIC_RECOVERY}
          variant="generic"
          delay={0}
        />
        <RecoveryCard
          title="Com Fluence"
          data={personalized}
          variant="fluence"
          delay={0.2}
        />
      </div>

      {/* Funnel comparison */}
      <div className="grid grid-cols-2 gap-3">
        <FunnelStats
          data={RECOVERY_COMPARISON.generic}
          label="Funil Genérico"
          color="#6B7280"
        />
        <FunnelStats
          data={RECOVERY_COMPARISON.fluence}
          label="Funil Fluence"
          color="#14B8A6"
        />
      </div>

      {/* Impact callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center py-4 px-6 rounded-xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20"
      >
        <p className="text-2xl font-black text-teal-400">7.3x</p>
        <p className="text-xs text-gray-400 mt-1">mais receita recuperada com inteligência comportamental</p>
        <p className="text-[10px] text-gray-500 mt-2">
          3% → 22% taxa de recuperação &nbsp;|&nbsp; R$12.450 → R$91.300 receita
        </p>
      </motion.div>
    </div>
  )
}
