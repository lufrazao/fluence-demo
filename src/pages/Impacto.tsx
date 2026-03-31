import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, DollarSign, ArrowUpRight, Calculator, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnimatedNumber } from '../components/shared';
import { leads } from '../data/leads';
import { useSimulation } from '../context/SimulationContext';
import { FINTECH_METRICS } from '../data/fintech';
import { ECOMMERCE_METRICS } from '../data/ecommerce';

const chartData = leads.map(l => ({
  name: l.behavioralProfile.decisionStyle,
  'Taxa Padrão': l.conversionMetrics.standardRate,
  'Taxa Adaptada': l.conversionMetrics.adaptedRate,
}));

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const Impacto: React.FC = () => {
  const simulation = useSimulation();

  // ROI Calculator state
  const [monthlyLeads, setMonthlyLeads] = useState(10000);
  const [currentRate, setCurrentRate] = useState(3.2);
  const [avgTicket, setAvgTicket] = useState(2500);

  const roi = useMemo(() => {
    const liftMultiplier = 3.28; // avg adapted/standard across all leads
    const adaptedRate = currentRate * liftMultiplier;
    const currentConversions = monthlyLeads * (currentRate / 100);
    const adaptedConversions = monthlyLeads * (adaptedRate / 100);
    const extraConversions = adaptedConversions - currentConversions;
    const extraRevenue = extraConversions * avgTicket;
    const annualExtraRevenue = extraRevenue * 12;
    const liftPercent = Math.round((liftMultiplier - 1) * 100);

    return {
      adaptedRate: Math.min(adaptedRate, 99),
      currentConversions: Math.round(currentConversions),
      adaptedConversions: Math.round(adaptedConversions),
      extraConversions: Math.round(extraConversions),
      extraRevenueMonthly: extraRevenue,
      annualExtraRevenue,
      liftPercent,
    };
  }, [monthlyLeads, currentRate, avgTicket]);

  const detectedPatterns = simulation.detectedPatternKeys;
  const activeMetrics = simulation.activeDemo === 'ecommerce' ? ECOMMERCE_METRICS : FINTECH_METRICS;
  const demoLabel = simulation.activeDemo === 'ecommerce' ? 'ShopFlow' : 'NeoBank';

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Impacto na Conversão</h1>
        <p className="text-xl text-gray-400">
          Comparando abordagem tradicional com inteligência comportamental.
        </p>
      </div>

      {/* Simulation-driven Business Impact (from Demo Interativo) */}
      {simulation.hasProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Impacto Projetado — {demoLabel}</h2>
              <p className="text-sm text-gray-400">Baseado nos padrões detectados no Demo Interativo</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeMetrics.map((m, i) => {
              const unlocked = detectedPatterns.has(m.unlockedBy);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-xl p-5 text-center transition-all duration-500 ${
                    unlocked
                      ? 'bg-teal-500/10 border-2 border-teal-500/30 shadow-lg shadow-teal-500/5'
                      : 'bg-gray-900 border border-white/10'
                  }`}
                >
                  <div className={`text-2xl font-bold transition-all duration-700 ${unlocked ? 'text-teal-400' : 'text-gray-500'}`}>
                    {unlocked ? m.after : m.before}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 leading-tight">{m.label}</div>
                  {unlocked && m.delta && (
                    <div className="text-sm text-green-400 font-semibold mt-2">{m.delta}</div>
                  )}
                  {!unlocked && (
                    <div className="text-xs text-gray-600 mt-2">
                      Padrão não detectado
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Before / After Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Before */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-white/10">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Abordagem Tradicional</div>
          <h2 className="text-2xl font-bold text-white mb-6">Mensagem Genérica</h2>

          <div className="space-y-4 mb-8">
            {[
              'Mesmo CTA para todos os leads',
              'Ignora perfil comportamental',
              'Tom único independente do contexto',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                <p className="text-gray-400">{item}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <div className="text-3xl font-bold text-gray-500 mb-1">3.2%</div>
            <div className="text-sm text-gray-500">Taxa de Conversão Média</div>
          </div>
        </div>

        {/* After */}
        <div className="bg-gray-900 p-8 rounded-2xl border-2 border-primary-500 shadow-xl shadow-primary-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">FLUENCE</div>

          <div className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4">Com Inteligência Comportamental</div>
          <h2 className="text-2xl font-bold text-white mb-6">Mensagem Adaptada</h2>

          <div className="space-y-4 mb-8">
            {[
              'CTA personalizado por perfil de decisão',
              'Tom adequado ao estilo comportamental',
              'Gatilhos de confiança ativados por perfil',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-green-400 mt-0.5" />
                <p className="text-gray-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary-500/10 rounded-xl p-6 border border-primary-500/20">
            <div className="text-3xl font-bold text-primary-400 mb-1">10.5%</div>
            <div className="text-sm text-primary-400">Taxa de Conversão Média</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 p-6 rounded-xl border border-white/10 text-center"
        >
          <div className="mx-auto w-12 h-12 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            +<AnimatedNumber value={228} />%
          </div>
          <div className="text-sm text-gray-400">Lift Médio em Conversão</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 p-6 rounded-xl border border-white/10 text-center"
        >
          <div className="mx-auto w-12 h-12 bg-violet-900/30 text-violet-400 rounded-full flex items-center justify-center mb-4">
            <ArrowUpRight size={24} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            4.2x
          </div>
          <div className="text-sm text-gray-400">ROI sobre Investimento</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 p-6 rounded-xl border border-white/10 text-center"
        >
          <div className="mx-auto w-12 h-12 bg-blue-900/30 text-blue-400 rounded-full flex items-center justify-center mb-4">
            <DollarSign size={24} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            -<AnimatedNumber value={45} />%
          </div>
          <div className="text-sm text-gray-400">Custo por Aquisição</div>
        </motion.div>
      </div>

      {/* ROI Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl border-2 border-primary-500/30 shadow-lg shadow-primary-500/5 p-8 mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center">
            <Calculator size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Calculadora de ROI</h3>
            <p className="text-sm text-gray-400">Insira os números do seu negócio e veja o impacto projetado</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Leads por mês</label>
            <input
              type="number"
              value={monthlyLeads}
              onChange={e => setMonthlyLeads(Math.max(0, Number(e.target.value)))}
              className="w-full border border-white/10 bg-gray-800 text-white rounded-lg px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Taxa de conversão atual (%)</label>
            <input
              type="number"
              step="0.1"
              value={currentRate}
              onChange={e => setCurrentRate(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-full border border-white/10 bg-gray-800 text-white rounded-lg px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ticket médio (R$)</label>
            <input
              type="number"
              value={avgTicket}
              onChange={e => setAvgTicket(Math.max(0, Number(e.target.value)))}
              className="w-full border border-white/10 bg-gray-800 text-white rounded-lg px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Conversões Hoje</p>
              <p className="text-2xl font-bold text-gray-400">{roi.currentConversions.toLocaleString('pt-BR')}<span className="text-sm font-normal text-gray-500">/mês</span></p>
            </div>
            <div>
              <p className="text-xs text-primary-400 uppercase font-semibold mb-1">Com Fluence</p>
              <p className="text-2xl font-bold text-primary-400">{roi.adaptedConversions.toLocaleString('pt-BR')}<span className="text-sm font-normal text-primary-500">/mês</span></p>
            </div>
            <div>
              <p className="text-xs text-green-400 uppercase font-semibold mb-1">Conversões Extras</p>
              <p className="text-2xl font-bold text-green-400">+{roi.extraConversions.toLocaleString('pt-BR')}<span className="text-sm font-normal text-green-500">/mês</span></p>
            </div>
            <div>
              <p className="text-xs text-green-400 uppercase font-semibold mb-1">Receita Extra Mensal</p>
              <p className="text-2xl font-bold text-green-400">{formatBRL(roi.extraRevenueMonthly)}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Receita Extra Anual Projetada</p>
              <p className="text-4xl font-bold text-green-400">{formatBRL(roi.annualExtraRevenue)}</p>
            </div>
            <div className="bg-green-900/30 rounded-xl px-6 py-3 text-center border border-green-500/20">
              <p className="text-xs text-green-400 font-semibold mb-0.5">Lift Projetado</p>
              <p className="text-3xl font-bold text-green-400">+{roi.liftPercent}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bar Chart — Per-Profile Rates */}
      <div className="bg-gray-900 rounded-2xl border border-white/10 p-8">
        <h3 className="text-lg font-bold text-white mb-2">Conversão por Perfil Comportamental</h3>
        <p className="text-sm text-gray-400 mb-6">Taxa de conversão padrão vs. adaptada para cada estilo de decisão</p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barGap={4}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#111827', color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12, color: '#9ca3af' }} />
            <Bar dataKey="Taxa Padrão" fill="#4b5563" radius={[4, 4, 0, 0]} barSize={28} />
            <Bar dataKey="Taxa Adaptada" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Impacto;
