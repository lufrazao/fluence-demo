import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Badge } from '../shared';
import { ProgressBar } from '../shared';
import type { Lead } from '../../data/leads';

interface BehavioralProfileProps {
  lead: Lead;
}

const BehavioralProfile: React.FC<BehavioralProfileProps> = ({ lead }) => {
  const { behavioralProfile: profile } = lead;

  const riskColor = profile.riskSensitivity > 70
    ? 'bg-red-500'
    : profile.riskSensitivity > 40
      ? 'bg-amber-500'
      : 'bg-green-500';

  const riskLabel = profile.riskSensitivity > 70
    ? 'Alto'
    : profile.riskSensitivity > 40
      ? 'Médio'
      : 'Baixo';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lead.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 rounded-xl border border-white/10 p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Perfil Comportamental</h2>
            <p className="text-sm text-gray-400 mt-0.5">{lead.name} — {lead.product}</p>
          </div>
          <span className={clsx(
            'text-sm font-bold px-3 py-1.5 rounded-lg',
            profile.decisionStyleColor
          )}>
            {profile.decisionStyle}
          </span>
        </div>

        {/* Risk Sensitivity */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Sensibilidade ao Risco</span>
            <span className="text-sm font-semibold text-white">{profile.riskSensitivity}% — {riskLabel}</span>
          </div>
          <ProgressBar value={profile.riskSensitivity} color={riskColor} />
        </div>

        {/* Trust Triggers */}
        <div className="mb-6">
          <span className="text-sm font-medium text-gray-300 block mb-2">Gatilhos de Confiança</span>
          <div className="flex flex-wrap gap-2">
            {profile.trustTriggers.map((trigger) => (
              <Badge key={trigger} label={trigger} variant="secondary" size="sm" />
            ))}
          </div>
        </div>

        {/* Traits */}
        <div className="mb-6">
          <span className="text-sm font-medium text-gray-300 block mb-3">Traços Comportamentais</span>
          <div className="space-y-3">
            {profile.traits.map((trait, i) => (
              <motion.div
                key={trait.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{trait.label}</span>
                  <span className="text-xs font-semibold text-gray-300">{trait.value}%</span>
                </div>
                <ProgressBar value={trait.value} color={trait.color} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Patterns */}
        <div>
          <span className="text-sm font-medium text-gray-300 block mb-3">Padrões Detectados</span>
          <div className="space-y-2">
            {profile.patterns.map((pattern, i) => (
              <motion.div
                key={pattern.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
              >
                <span className="text-lg">{pattern.icon}</span>
                <div>
                  <span className="text-sm font-semibold text-gray-200">{pattern.name}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{pattern.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BehavioralProfile;
