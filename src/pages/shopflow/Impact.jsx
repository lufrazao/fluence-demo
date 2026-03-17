// Impact / ROI page — business metrics and KPI improvements
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

const METRICS = [
  {
    label: 'Taxa de Recuperação',
    before: 3,
    after: 22,
    unit: '%',
    improvement: '+633%',
    color: '#14B8A6',
  },
  {
    label: 'Receita Recuperada / 1k emails',
    before: 12450,
    after: 91300,
    unit: 'R$',
    improvement: '7.3x',
    color: '#3B82F6',
  },
  {
    label: 'Taxa de Abertura',
    before: 18,
    after: 42,
    unit: '%',
    improvement: '+133%',
    color: '#8B5CF6',
  },
  {
    label: 'Ticket Médio Recuperado',
    before: 415,
    after: 415,
    unit: 'R$',
    improvement: '=',
    color: '#F59E0B',
  },
]

const CHART_DATA = [
  { name: 'Recuperação', Genérico: 3, Fluence: 22 },
  { name: 'Abertura', Genérico: 18, Fluence: 42 },
  { name: 'Clique', Genérico: 5.4, Fluence: 26.8 },
  { name: 'Conversão', Genérico: 3, Fluence: 22 },
]

const USE_CASES = [
  {
    title: 'E-commerce B2C',
    description: 'Recuperação de carrinho personalizada por perfil comportamental',
    impact: 'R$91k receita recuperada por 1k abandonos',
    icon: '🛒',
  },
  {
    title: 'Marketplace',
    description: 'Recomendações contextuais baseadas em estilo de decisão',
    impact: '+45% conversão de busca para compra',
    icon: '🏪',
  },
  {
    title: 'Assinatura',
    description: 'Prevenção de churn com intervenção no momento certo',
    impact: '-38% taxa de cancelamento',
    icon: '🔄',
  },
]

function MetricCard({ metric, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-4"
    >
      <p className="text-[10px] text-gray-500 uppercase font-semibold">{metric.label}</p>
      <div className="flex items-end gap-3 mt-2">
        <div>
          <p className="text-[9px] text-gray-600">Antes</p>
          <p className="text-lg font-bold text-gray-500">
            {metric.unit === 'R$' ? `R$${metric.before.toLocaleString()}` : `${metric.before}%`}
          </p>
        </div>
        <div className="text-gray-600 mb-1">→</div>
        <div>
          <p className="text-[9px] text-teal-500">Com Fluence</p>
          <p className="text-lg font-bold" style={{ color: metric.color }}>
            {metric.unit === 'R$' ? `R$${metric.after.toLocaleString()}` : `${metric.after}%`}
          </p>
        </div>
      </div>
      <motion.p
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
        className="text-right text-sm font-black mt-1"
        style={{ color: metric.color }}
      >
        {metric.improvement}
      </motion.p>
    </motion.div>
  )
}

export default function Impact() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white">Impacto de Negócio</h2>
          <p className="text-sm text-gray-400 mt-2">
            Resultados simulados baseados em padrões reais de e-commerce brasileiro.
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} metric={m} index={i} />
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 mb-8"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Comparativo de Funil: Genérico vs Fluence
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={CHART_DATA} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} unit="%" />
              <Tooltip
                contentStyle={{
                  background: '#1F2937',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="Genérico" radius={[4, 4, 0, 0]}>
                {CHART_DATA.map((_, i) => (
                  <Cell key={i} fill="#4B5563" />
                ))}
              </Bar>
              <Bar dataKey="Fluence" radius={[4, 4, 0, 0]}>
                {CHART_DATA.map((_, i) => (
                  <Cell key={i} fill="#14B8A6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Use cases */}
        <div className="grid grid-cols-3 gap-4">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass-card p-4"
            >
              <span className="text-2xl">{uc.icon}</span>
              <h4 className="text-sm font-semibold text-white mt-2">{uc.title}</h4>
              <p className="text-[11px] text-gray-400 mt-1">{uc.description}</p>
              <p className="text-[10px] font-semibold text-teal-400 mt-2">{uc.impact}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
