import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AnimatedNumber } from '../shared';
import type { Lead } from '../../data/leads';

interface ConversionMetricsProps {
  lead: Lead;
}

const ConversionMetrics: React.FC<ConversionMetricsProps> = ({ lead }) => {
  const { conversionMetrics: metrics } = lead;

  const chartData = [
    { name: 'Padrão', value: metrics.standardRate, fill: '#4b5563' },
    { name: 'Adaptada', value: metrics.adaptedRate, fill: '#8b5cf6' },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lead.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="space-y-4"
      >
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
          Métricas de Conversão
        </h3>

        {/* Standard Rate */}
        <div className="bg-gray-900 rounded-xl border border-white/10 p-4">
          <p className="text-xs text-gray-500 mb-1">Taxa Padrão</p>
          <p className="text-2xl font-bold text-gray-400">{metrics.standardRate}%</p>
        </div>

        {/* Adapted Rate */}
        <div className="bg-gray-900 rounded-xl border border-primary-500/30 p-4">
          <p className="text-xs text-primary-400 mb-1">Taxa Adaptada</p>
          <p className="text-2xl font-bold text-primary-400">{metrics.adaptedRate}%</p>
        </div>

        {/* Lift */}
        <div className="bg-green-900/20 rounded-xl border border-green-500/20 p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUp size={16} className="text-green-400" />
            <p className="text-xs text-green-400 font-medium">Lift em Conversão</p>
          </div>
          <p className="text-3xl font-bold text-green-400">
            +<AnimatedNumber value={metrics.lift} />%
          </p>
        </div>

        {/* Mini Chart */}
        <div className="bg-gray-900 rounded-xl border border-white/10 p-4">
          <p className="text-xs text-gray-500 mb-3">Comparativo</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Conversão']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#111827', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 px-1">
          <TrendingUp size={14} className="text-gray-500 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Perfil: <span className="font-medium text-gray-300">{lead.behavioralProfile.decisionStyle}</span>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConversionMetrics;
