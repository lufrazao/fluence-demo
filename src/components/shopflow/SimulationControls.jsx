// Controls for selecting persona and controlling simulation playback
import { motion } from 'framer-motion'
import { PERSONAS, PERSONA_ORDER } from '../../data/shopflow/personas'

export default function SimulationControls({
  selectedPersona,
  onSelectPersona,
  isRunning,
  onStart,
  onPause,
  onResume,
  onReset,
  progress,
  speed,
  onSpeedChange,
  isComplete,
}) {
  return (
    <div className="space-y-3">
      {/* Persona selector */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Escolha um Comprador
        </h3>
        <div className="flex gap-2">
          {PERSONA_ORDER.map(id => {
            const persona = PERSONAS[id]
            const active = selectedPersona === id
            return (
              <button
                key={id}
                onClick={() => onSelectPersona(id)}
                disabled={isRunning}
                className={`flex-1 p-2.5 rounded-xl border transition-all ${
                  active
                    ? 'border-white/20 bg-white/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-xl">{persona.avatar}</span>
                <p className="text-[11px] font-semibold text-gray-200 mt-1">{persona.name}</p>
                <p className="text-[8px] text-gray-500 leading-tight mt-0.5">{persona.title}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-2">
        {!isRunning && !isComplete && (
          <button
            onClick={onStart}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white text-xs font-semibold rounded-lg hover:bg-teal-400 transition-colors"
          >
            <span>▶</span> Iniciar Simulação
          </button>
        )}
        {isRunning && (
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            <span>⏸</span> Pausar
          </button>
        )}
        {!isRunning && progress > 0 && !isComplete && (
          <button
            onClick={onResume}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white text-xs font-semibold rounded-lg hover:bg-teal-400 transition-colors"
          >
            <span>▶</span> Continuar
          </button>
        )}
        {(progress > 0 || isComplete) && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 text-gray-300 text-xs font-medium rounded-lg hover:bg-white/15 transition-colors"
          >
            <span>↺</span> Reiniciar
          </button>
        )}

        {/* Speed control */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[9px] text-gray-500">Velocidade:</span>
          {[1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`text-[10px] px-2 py-1 rounded ${
                speed === s
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full rounded-full ${isComplete ? 'bg-teal-400' : 'bg-teal-500'}`}
          />
        </div>
      )}

      {isComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] text-teal-400 font-medium text-center"
        >
          Simulação completa — veja o resultado da recuperação abaixo
        </motion.p>
      )}
    </div>
  )
}
