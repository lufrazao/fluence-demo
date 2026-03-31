import React from 'react';
import type { MemoryData } from '../../types/simulation';

interface UserMemoryProps {
  memory: MemoryData;
  hasInteracted: boolean;
}

const UserMemory: React.FC<UserMemoryProps> = ({ memory, hasInteracted }) => {
  if (!hasInteracted) {
    return (
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Memoria do Usuario</h3>
        <p className="text-xs text-gray-500 italic">Aguardando primeira interacao para identificar usuario...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Memoria do Usuario</h3>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">{'\u{1F9E0}'}</span>
          <span className="text-xs font-semibold text-blue-400">Usuario Recorrente Reconhecido</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-white">{memory.totalSessions}</div>
            <div className="text-[10px] text-gray-500">Sessoes</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-white leading-tight">{memory.firstSeen}</div>
            <div className="text-[10px] text-gray-500">Primeira vez</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-white leading-tight">{memory.lastSeen}</div>
            <div className="text-[10px] text-gray-500">Ultima visita</div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Padroes Persistentes (do historico)</p>
        <div className="space-y-1.5">
          {memory.persistentTraits.map((trait, i) => (
            <div key={i} className="flex items-center gap-2 text-xs bg-white/5 rounded-lg px-2.5 py-1.5">
              <span className="text-sm">{trait.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="text-gray-300">{trait.label}</span>
                <span className="text-gray-500 mx-1">{'\u00B7'}</span>
                <span className="text-gray-400">{trait.detail}</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                trait.trend === 'bloqueio' ? 'bg-red-500/20 text-red-400' :
                trait.trend === 'crescente' ? 'bg-amber-500/20 text-amber-400' :
                trait.trend === 'forte intencao' ? 'bg-green-500/20 text-green-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {trait.trend}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sessoes Recentes</p>
        <div className="space-y-1">
          {memory.sessionHistory.map((session, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <div className="flex flex-col items-center mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-teal-400' : 'bg-gray-600'}`} />
                {i < memory.sessionHistory.length - 1 && <div className="w-px h-4 bg-gray-700" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-medium">{session.date}</span>
                  <span className="text-gray-600 font-mono text-[9px]">{session.duration}</span>
                </div>
                <p className="text-gray-500 leading-snug">{session.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserMemory;
