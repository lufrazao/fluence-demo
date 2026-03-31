import React from 'react';
import type { ApiOutputDef, AppEvent } from '../../types/simulation';

interface ApiOutputProps {
  output: ApiOutputDef;
  detectedPatterns: Set<string>;
  events: AppEvent[];
  patternPoints: Record<string, number>;
}

const ApiOutput: React.FC<ApiOutputProps> = ({ output, detectedPatterns, events = [], patternPoints = {} }) => {
  const detected = detectedPatterns || new Set<string>();

  const visiblePredictions = output.predictions
    .filter(p => detected.has(p.pattern))
    .map(p => ({
      ...p,
      value: p.getValue(patternPoints[p.pattern] || 0),
      currentSignal: p.getCurrentSignal(events),
    }));

  const visibleRecommendations = output.recommendations.filter(r => detected.has(r.pattern));
  const hasOutput = visiblePredictions.length > 0;

  const totalPoints = Object.values(patternPoints).reduce((sum, v) => sum + v, 0);
  const segmentConfidence = output.segment.confidence ?? Math.min(totalPoints / 20, 0.99);

  const styles = output.communicationStyles || {};
  const dominantPattern = visiblePredictions.length > 0
    ? visiblePredictions.reduce((best, p) =>
        (patternPoints[p.pattern] || 0) > (patternPoints[best.pattern] || 0) ? p : best
      ).pattern
    : null;
  const dominantStyle = dominantPattern ? styles[dominantPattern] : null;

  if (!hasOutput) {
    return (
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Fluence API Output</h3>
        <div className="text-center py-6">
          <div className="text-2xl mb-2 opacity-40">{'\u{1F4E1}'}</div>
          <p className="text-xs text-gray-500 italic">Interaja com o app para gerar inteligencia comportamental...</p>
          <p className="text-[10px] text-gray-600 mt-1">A Fluence analisara comportamento e enviara insights acionaveis para sua API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fluence API Output</h3>

      <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 animate-fade-in">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-teal-400 uppercase tracking-wider font-semibold">Segmento do Usuario</span>
          <span className="text-[10px] text-teal-400 font-mono">{Math.round(segmentConfidence * 100)}% confianca</span>
        </div>
        <p className="text-sm font-semibold text-white">{output.segment.name}</p>
        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{output.segment.id}</p>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Predicoes</p>
        <div className="space-y-2">
          {visiblePredictions.map((p, i) => (
            <div key={p.pattern} className="bg-white/5 rounded-lg p-2.5 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">{p.icon}</span>
                <span className="text-xs font-semibold text-gray-200">{p.label}</span>
                <span className="ml-auto text-xs font-bold text-amber-400">{p.value}</span>
              </div>
              {p.currentSignal && (
                <div className="flex items-start gap-1.5 mb-1">
                  <span className="text-[9px] px-1 py-px rounded bg-blue-500/20 text-blue-400 font-semibold mt-px flex-shrink-0">AGORA</span>
                  <p className="text-[10px] text-blue-300/80 leading-snug">{p.currentSignal}</p>
                </div>
              )}
              {p.historicalContext && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[9px] px-1 py-px rounded bg-gray-500/20 text-gray-400 font-semibold mt-px flex-shrink-0">HIST</span>
                  <p className="text-[10px] text-gray-400 leading-snug">{p.historicalContext}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {visibleRecommendations.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Recomendacoes para Seu App</p>
          <div className="space-y-2">
            {visibleRecommendations.map((r, i) => (
              <div key={r.pattern} className="bg-white/5 rounded-lg p-2.5 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="text-green-400 text-xs mt-px">{'\u2713'}</span>
                  <p className="text-xs text-green-300">{r.do}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-xs mt-px">{'\u2717'}</span>
                  <p className="text-xs text-red-300/70">{r.avoid}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dominantStyle && (
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 animate-fade-in">
          <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider mb-2">Guia de Estilo de Comunicacao</p>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-gray-500">Tom:</span>
              <span className="text-xs text-white ml-2 font-medium">{dominantStyle.tone}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500">Prioridade de conteudo:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {dominantStyle.contentPriority.map(item => (
                  <span key={item} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-500">Evitar:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {dominantStyle.avoid.map(item => (
                  <span key={item} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400/70">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiOutput;
