import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { leads } from '../data/leads';
import type { Lead } from '../data/leads';
import { ProgressBar, Badge } from '../components/shared';
import { useSimulation } from '../context/SimulationContext';
import type { VisiblePattern } from '../types/simulation';

const SIMULATION_ID = '__simulation__';

const Comparativo: React.FC = () => {
  const simulation = useSimulation();
  const [leftId, setLeftId] = useState(leads[0].id);
  const [rightId, setRightId] = useState(leads[1].id);

  const leftLead = leads.find(l => l.id === leftId)!;
  const rightLead = leads.find(l => l.id === rightId)!;

  const leftBlocks =
    leftId === SIMULATION_ID
      ? renderSimulationBlocks(simulation, 'left')
      : renderPersonaBlocks(leftLead, 'left');

  const rightBlocks =
    rightId === SIMULATION_ID
      ? renderSimulationBlocks(simulation, 'right')
      : renderPersonaBlocks(rightLead, 'right');

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Comparativo de Perfis</h1>
        <p className="text-lg text-gray-400">
          Mesmo produto, mesma oferta &mdash; comunicacao completamente diferente
        </p>
      </div>

      {/* Persona selectors */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <PersonaSelector
          label="Usuario A"
          selectedId={leftId}
          otherId={rightId}
          onSelect={setLeftId}
          hasSimulation={simulation.hasProfile}
        />
        <PersonaSelector
          label="Usuario B"
          selectedId={rightId}
          otherId={leftId}
          onSelect={setRightId}
          hasSimulation={simulation.hasProfile}
        />
      </div>

      {/* Side by side — interleaved grid for row alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
        {leftBlocks.map((leftBlock, i) => (
          <React.Fragment key={i}>
            {leftBlock}
            {rightBlocks[i]}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ── Persona Selector ── */

const PersonaSelector: React.FC<{
  label: string;
  selectedId: string;
  otherId: string;
  onSelect: (id: string) => void;
  hasSimulation?: boolean;
}> = ({ label, selectedId, otherId, onSelect, hasSimulation }) => (
  <div>
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
    <div className="flex gap-2 flex-wrap">
      {hasSimulation && (
        <button
          disabled={SIMULATION_ID === otherId}
          onClick={() => onSelect(SIMULATION_ID)}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
            selectedId === SIMULATION_ID
              ? 'border-teal-500/50 bg-teal-500/20 text-teal-400 shadow-sm'
              : SIMULATION_ID === otherId
                ? 'border-white/5 bg-white/5 text-gray-600 cursor-not-allowed'
                : 'border-teal-500/30 bg-teal-500/10 text-teal-400 hover:border-teal-500/50'
          )}
        >
          <Sparkles size={14} />
          <span>Simulacao</span>
        </button>
      )}
      {leads.map(l => (
        <button
          key={l.id}
          disabled={l.id === otherId}
          onClick={() => onSelect(l.id)}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
            l.id === selectedId
              ? 'border-primary-500/50 bg-primary-500/20 text-primary-400 shadow-sm'
              : l.id === otherId
                ? 'border-white/5 bg-white/5 text-gray-600 cursor-not-allowed'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
          )}
        >
          <span>{l.avatar}</span>
          <span>{l.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  </div>
);

/* ── Block renderers ──
   Both return exactly 7 blocks in the same order so they align row-by-row
   in the shared grid-cols-2 layout.
   Order: 1. Header  2. Behavioral  3. Standard msg  4. Arrow  5. Adapted msg  6. Reasoning  7. Lift
*/

function renderPersonaBlocks(lead: Lead, side: string): React.ReactNode[] {
  const { behavioralProfile: profile } = lead;
  const riskColor = profile.riskSensitivity > 70
    ? 'bg-red-500'
    : profile.riskSensitivity > 40
      ? 'bg-amber-500'
      : 'bg-green-500';

  return [
    /* 1. Header card */
    <motion.div
      key={`${side}-header-${lead.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-gray-900 rounded-xl border border-white/10 p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{lead.avatar}</span>
        <div>
          <h3 className="text-lg font-bold text-white">{lead.name}, {lead.age}</h3>
          <p className="text-sm text-gray-400">{lead.context}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-lg', profile.decisionStyleColor)}>
          {profile.decisionStyle}
        </span>
        <Badge label={lead.source} variant="gray" size="sm" />
        <Badge label={lead.product} variant="secondary" size="sm" />
      </div>
    </motion.div>,

    /* 2. Behavioral snapshot */
    <motion.div
      key={`${side}-behavioral-${lead.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="bg-gray-900 rounded-xl border border-white/10 p-5"
    >
      <h4 className="text-sm font-bold text-gray-300 mb-3">Perfil Comportamental</h4>

      {/* Risk bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Sensibilidade ao Risco</span>
          <span className="text-xs font-semibold text-gray-300">{profile.riskSensitivity}%</span>
        </div>
        <ProgressBar value={profile.riskSensitivity} color={riskColor} />
      </div>

      {/* Top 3 traits */}
      <div className="space-y-2.5 mb-4">
        {profile.traits.slice(0, 3).map(trait => (
          <div key={trait.label}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-gray-500">{trait.label}</span>
              <span className="text-xs font-semibold text-gray-300">{trait.value}%</span>
            </div>
            <ProgressBar value={trait.value} color={trait.color} />
          </div>
        ))}
      </div>

      {/* Trust triggers */}
      <div>
        <span className="text-xs text-gray-500 block mb-1.5">Gatilhos de Confiança</span>
        <div className="flex flex-wrap gap-1.5">
          {profile.trustTriggers.map(t => (
            <Badge key={t} label={t} variant="secondary" size="sm" />
          ))}
        </div>
      </div>
    </motion.div>,

    /* 3. Standard message (muted) */
    <motion.div
      key={`${side}-standard-${lead.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="bg-white/5 rounded-xl border border-white/10 p-5 opacity-60"
    >
      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Mensagem Padrão</p>
      <h4 className="text-base font-bold text-gray-400 mb-1">{lead.standardMessage.title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed">{lead.standardMessage.body}</p>
    </motion.div>,

    /* 4. Arrow */
    <div key={`${side}-arrow-${lead.id}`} className="flex justify-center text-primary-400">
      <ArrowRight size={20} className="rotate-90" />
    </div>,

    /* 5. Adapted message (highlighted) */
    <motion.div
      key={`${side}-adapted-${lead.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="bg-gray-900 rounded-xl border-2 border-primary-500 p-5 shadow-lg shadow-primary-500/10 relative"
    >
      <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-bl-lg rounded-tr-xl">
        FLUENCE
      </div>
      <p className="text-xs text-primary-400 uppercase tracking-wider font-semibold mb-2">Mensagem Adaptada</p>
      <h4 className="text-base font-bold text-white mb-2 pr-16">{lead.adaptedMessage.title}</h4>
      <p className="text-sm text-gray-300 leading-relaxed mb-4">{lead.adaptedMessage.body}</p>
      <button className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm">
        {lead.adaptedMessage.cta}
      </button>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {lead.adaptedMessage.highlights.map(h => (
          <span key={h} className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full font-medium">
            {h}
          </span>
        ))}
      </div>
    </motion.div>,

    /* 6. Reasoning */
    <motion.div
      key={`${side}-reasoning-${lead.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="bg-white/5 rounded-xl border border-white/10 p-4"
    >
      <p className="text-xs text-gray-400 italic leading-relaxed">
        {'\u{1F4A1}'} {lead.adaptedMessage.reasoning}
      </p>
    </motion.div>,

    /* 7. Lift metric */
    <motion.div
      key={`${side}-lift-${lead.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="bg-green-900/20 rounded-xl border border-green-500/20 p-4 flex items-center justify-between"
    >
      <div>
        <p className="text-xs text-green-400 font-medium">Conversão</p>
        <p className="text-sm text-gray-400">{lead.conversionMetrics.standardRate}% → <span className="font-bold text-primary-400">{lead.conversionMetrics.adaptedRate}%</span></p>
      </div>
      <div className="flex items-center gap-1 text-green-400">
        <ArrowUp size={18} />
        <span className="text-2xl font-bold">+{lead.conversionMetrics.lift}%</span>
      </div>
    </motion.div>,
  ];
}

/* ── Adapted message generation from detected patterns ── */

const PATTERN_MESSAGES: Record<string, { title: string; body: string; cta: string; reasoning: string; highlights: string[] }> = {
  anxiety: {
    title: 'Seu dinheiro esta seguro e crescendo',
    body: 'Voce tem R$4.231,50 na conta e seus investimentos renderam +R$127,30 este mes. Tudo protegido pelo FGC. Quer ver um resumo completo?',
    cta: 'Ver Resumo Completo',
    reasoning: 'Comportamento de ansiedade financeira detectado (conferencias de saldo frequentes). Mensagem foca em seguranca e estabilidade.',
    highlights: ['Tom tranquilizador', 'Foco em seguranca', 'Sem pressao'],
  },
  hesitancy: {
    title: 'Emprestimo pessoal — sem compromisso',
    body: 'Simule seu emprestimo em 30 segundos. Veja parcelas, taxas e custo total antes de decidir. Sem burocracia, sem surpresas.',
    cta: 'Simular Agora',
    reasoning: 'Hesitacao na decisao detectada (abandono no formulario de emprestimo). Mensagem simplifica o processo e remove barreiras.',
    highlights: ['Sem compromisso', 'Transparencia total', 'Processo simplificado'],
  },
  struggle: {
    title: 'Precisa de ajuda? Estamos aqui',
    body: 'Vimos que voce buscou informacoes sobre taxas e emprestimos. Nosso guia interativo explica tudo em linguagem simples — passo a passo.',
    cta: 'Ver Guia Interativo',
    reasoning: 'Confusao com produto detectada (multiplos acessos a ajuda). Mensagem oferece suporte proativo e explicacoes claras.',
    highlights: ['Suporte proativo', 'Linguagem simples', 'FAQ contextual'],
  },
  cautious: {
    title: 'Compare opcoes lado a lado',
    body: 'Antes de decidir, veja uma comparacao completa: taxas, prazos, riscos e retornos de cada opcao. Toda informacao que voce precisa, sem pressa.',
    cta: 'Comparar Opcoes',
    reasoning: 'Perfil avesso a risco detectado (pesquisa detalhada antes de agir). Mensagem prioriza informacao e transparencia.',
    highlights: ['Comparacao detalhada', 'Sem pressa', 'Informacao completa'],
  },
};

function getAdaptedMessage(patterns: VisiblePattern[]) {
  if (patterns.length === 0) return null;
  const key = patterns[0].key;
  return PATTERN_MESSAGES[key] || null;
}

function renderSimulationBlocks(
  simulation: ReturnType<typeof useSimulation>,
  side: string,
): React.ReactNode[] {
  const { visibleTraits, visiblePatterns } = simulation;
  const adaptedMessage = getAdaptedMessage(visiblePatterns);

  return [
    /* 1. Header card */
    <motion.div
      key={`${side}-header-sim`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-gray-900 rounded-xl border border-white/10 p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-xl">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Perfil da Simulacao</h3>
          <p className="text-sm text-gray-400">Gerado em tempo real no Demo Interativo</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-400">
          Tempo Real
        </span>
        <Badge label="Demo Interativo" variant="gray" size="sm" />
        <Badge label="Simulacao" variant="secondary" size="sm" />
      </div>
    </motion.div>,

    /* 2. Behavioral snapshot */
    <motion.div
      key={`${side}-behavioral-sim`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="bg-gray-900 rounded-xl border border-white/10 p-5"
    >
      <h4 className="text-sm font-bold text-gray-300 mb-3">Perfil Comportamental</h4>

      {visibleTraits.length > 0 ? (
        <div className="space-y-2.5 mb-4">
          {visibleTraits.map(trait => (
            <div key={trait.key}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-gray-500">{trait.label}</span>
                <span className="text-xs font-semibold text-gray-300">{Math.round(trait.confidence * 100)}%</span>
              </div>
              <ProgressBar value={trait.confidence * 100} color="bg-teal-500" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5 mb-4">
          <p className="text-xs text-gray-500 italic">Interaja no Demo Interativo para gerar tracos.</p>
        </div>
      )}

      {visiblePatterns.length > 0 && (
        <div>
          <span className="text-xs text-gray-500 block mb-1.5">Padroes Detectados</span>
          <div className="flex flex-wrap gap-1.5">
            {visiblePatterns.map(p => (
              <Badge key={p.key} label={`${p.icon} ${p.name}`} variant="secondary" size="sm" />
            ))}
          </div>
        </div>
      )}
    </motion.div>,

    /* 3. Standard message (muted) — same as all leads */
    <motion.div
      key={`${side}-standard-sim`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="bg-white/5 rounded-xl border border-white/10 p-5 opacity-60"
    >
      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Mensagem Padrao</p>
      <h4 className="text-base font-bold text-gray-400 mb-1">Solicite seu credito agora</h4>
      <p className="text-sm text-gray-500 leading-relaxed">Taxas competitivas para voce. Aproveite nossas condicoes especiais e faca seu pedido hoje mesmo. Nao perca essa oportunidade!</p>
    </motion.div>,

    /* 4. Arrow */
    <div key={`${side}-arrow-sim`} className="flex justify-center text-primary-400">
      <ArrowRight size={20} className="rotate-90" />
    </div>,

    /* 5. Adapted message (highlighted) */
    adaptedMessage ? (
      <motion.div
        key={`${side}-adapted-sim`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="bg-gray-900 rounded-xl border-2 border-primary-500 p-5 shadow-lg shadow-primary-500/10 relative"
      >
        <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-bl-lg rounded-tr-xl">
          FLUENCE
        </div>
        <p className="text-xs text-primary-400 uppercase tracking-wider font-semibold mb-2">Mensagem Adaptada</p>
        <h4 className="text-base font-bold text-white mb-2 pr-16">{adaptedMessage.title}</h4>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">{adaptedMessage.body}</p>
        <button className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm">
          {adaptedMessage.cta}
        </button>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {adaptedMessage.highlights.map(h => (
            <span key={h} className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full font-medium">
              {h}
            </span>
          ))}
        </div>
      </motion.div>
    ) : (
      <motion.div
        key={`${side}-adapted-sim`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="bg-gray-900 rounded-xl border-2 border-white/10 p-5 opacity-60"
      >
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Mensagem Adaptada</p>
        <p className="text-sm text-gray-500 italic">Interaja no Demo Interativo para ver a mensagem adaptada pela Fluence.</p>
      </motion.div>
    ),

    /* 6. Reasoning */
    <motion.div
      key={`${side}-reasoning-sim`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="bg-white/5 rounded-xl border border-white/10 p-4"
    >
      <p className="text-xs text-gray-400 italic leading-relaxed">
        {adaptedMessage
          ? `\u{1F4A1} ${adaptedMessage.reasoning}`
          : '\u{1F4A1} O raciocinio da Fluence aparecera aqui quando padroes forem detectados.'
        }
      </p>
    </motion.div>,

    /* 7. Lift metric */
    <motion.div
      key={`${side}-lift-sim`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="bg-green-900/20 rounded-xl border border-green-500/20 p-4 flex items-center justify-between"
    >
      <div>
        <p className="text-xs text-green-400 font-medium">Conversao</p>
        <p className="text-sm text-gray-400">
          {adaptedMessage
            ? <>3.2% {'\u2192'} <span className="font-bold text-primary-400">estimado pela Fluence</span></>
            : 'Aguardando perfil...'
          }
        </p>
      </div>
      {adaptedMessage && (
        <div className="flex items-center gap-1 text-green-400">
          <ArrowUp size={18} />
          <span className="text-lg font-bold">+{'\u221E'}</span>
        </div>
      )}
    </motion.div>,
  ];
}

export default Comparativo;
