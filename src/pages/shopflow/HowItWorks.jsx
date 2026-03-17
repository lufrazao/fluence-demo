// How It Works page — explains the pipeline from event to recovery
import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Captura de Eventos',
    description: 'Cada interação do comprador é capturada em tempo real: cliques, visualizações, tempo na página, adições ao carrinho, buscas.',
    icon: '📡',
    color: '#3B82F6',
    code: 'POST /v1/{tenant}/events/ingest\n{\n  "type": "product_view",\n  "product_id": "sony-wh1000",\n  "duration_ms": 45000\n}',
  },
  {
    number: '02',
    title: 'Extração de Traits',
    description: 'Extractors especializados calculam traços comportamentais: sensibilidade a preço, estilo de decisão, comportamento de carrinho, afinidade por produto.',
    icon: '🧠',
    color: '#8B5CF6',
    code: '// PriceSensitivityExtractor\n{\n  "price_sensitivity": 0.82,\n  "spending_threshold_brl": 500,\n  "confidence": 0.91\n}',
  },
  {
    number: '03',
    title: 'Detecção de Episódios',
    description: 'Detectores identificam padrões significativos: abandono de carrinho, padrão pesquisador, compra por impulso, exploração de categorias.',
    icon: '🔍',
    color: '#EC4899',
    code: '// CartAbandonmentDetector\n{\n  "type": "cart_abandonment",\n  "significance": 0.9,\n  "cart_value": 2299,\n  "friction_step": "payment"\n}',
  },
  {
    number: '04',
    title: 'Montagem de Contexto',
    description: 'O contexto cognitivo completo é montado: traits atuais, histórico de episódios, preferências consolidadas, predições.',
    icon: '🧩',
    color: '#10B981',
    code: 'GET /v1/{tenant}/context/{user}\n→ archetype: "Pesquisador Cauteloso"\n→ abandonment_risk: 0.85\n→ recovery_timing: "4h after"\n→ recovery_key: "price_guarantee"',
  },
  {
    number: '05',
    title: 'Recuperação Personalizada',
    description: 'A estratégia de recuperação é gerada com base no perfil completo: mensagem, tom, timing, oferta — tudo calibrado para aquele comprador.',
    icon: '🎯',
    color: '#F59E0B',
    code: 'POST /v1/{tenant}/ecommerce/\n  {user}/abandonment-recovery\n→ subject: "Menor preço 30 dias"\n→ tone: "informativo"\n→ timing: "4h after"\n→ expected_recovery: 22%',
  },
]

export default function HowItWorks() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold text-white">Como Funciona</h2>
          <p className="text-sm text-gray-400 mt-2">
            Do evento bruto à recuperação personalizada — 5 passos, uma API.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="relative flex gap-4 pl-2"
              >
                {/* Step dot */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 z-10"
                  style={{ backgroundColor: step.color + '20', color: step.color }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div className="glass-card p-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono font-bold" style={{ color: step.color }}>
                      {step.number}
                    </span>
                    <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <pre className="text-[10px] text-gray-500 bg-black/30 rounded-lg p-3 font-mono leading-relaxed overflow-x-auto">
                    {step.code}
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
