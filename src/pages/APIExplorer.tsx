import React, { useState } from 'react';
import { Play, ChevronDown, Server, Database } from 'lucide-react';
import { leads } from '../data/leads';
import { conversionAPI } from '../data/conversionAPI';
import ResponseViewer from '../components/api-explorer/ResponseViewer';
import { clsx } from 'clsx';

const endpoints: { method: string; path: string; label: string; needsId: boolean; fn: (id?: string) => Promise<any> }[] = [
  { method: 'GET', path: '/v1/leads/:id/profile', label: 'Perfil Comportamental', needsId: true, fn: (id) => conversionAPI.getLeadProfile(id!) },
  { method: 'GET', path: '/v1/leads/:id/assessment', label: 'Avaliação Comportamental', needsId: true, fn: (id) => conversionAPI.getBehavioralAssessment(id!) },
  { method: 'GET', path: '/v1/leads/:id/message', label: 'Mensagem Adaptada', needsId: true, fn: (id) => conversionAPI.getAdaptedMessage(id!) },
  { method: 'GET', path: '/v1/conversion/metrics', label: 'Métricas de Conversão', needsId: false, fn: () => conversionAPI.getConversionMetrics() },
];

const APIExplorer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0].id);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number>(200);
  const [time, setTime] = useState<number>(0);

  const handleRun = async () => {
    setLoading(true);
    setResponse(null);
    const start = performance.now();

    try {
      const result = selectedEndpoint.needsId
        ? await selectedEndpoint.fn(selectedLeadId)
        : await selectedEndpoint.fn();

      setResponse(result);
      setStatus(200);
    } catch {
      setResponse({ error: 'Internal Server Error', message: 'Falha ao buscar dados' });
      setStatus(500);
    } finally {
      const end = performance.now();
      setTime(Math.round(end - start));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Request Builder */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">API Explorer</h1>
            <p className="text-gray-400 text-sm">Teste os endpoints de inteligência comportamental para conversão.</p>
          </div>

          <div className="bg-gray-900 rounded-xl border border-white/10 p-6 flex flex-col gap-5 flex-1">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Endpoint</label>
              <div className="relative">
                <select
                  value={selectedEndpoint.path}
                  onChange={(e) => {
                    const ep = endpoints.find(ep => ep.path === e.target.value);
                    if (ep) {
                      setSelectedEndpoint(ep);
                      setResponse(null);
                    }
                  }}
                  className="w-full appearance-none pl-20 pr-10 py-3 border border-white/10 rounded-lg bg-gray-800 text-white font-mono text-sm focus:outline-none focus:border-primary-500 transition-colors"
                >
                  {endpoints.map(ep => (
                    <option key={ep.path} value={ep.path}>{ep.path} — {ep.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r border-white/10 bg-gray-800/50 rounded-l-lg">
                  <span className="font-bold text-green-400 text-xs">{selectedEndpoint.method}</span>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
            </div>

            {selectedEndpoint.needsId && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Parâmetros</label>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">lead_id</label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full border border-white/10 rounded-lg px-4 py-2 bg-gray-800 text-white text-sm font-mono focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.id} ({l.name} — {l.behavioralProfile.decisionStyle})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={handleRun}
                disabled={loading}
                className={clsx(
                  'w-full py-3 rounded-lg font-bold text-white flex items-center justify-center transition-all active:scale-95',
                  loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-900/30'
                )}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Play size={16} className="mr-2 fill-current" />
                )}
                {loading ? 'Processando...' : 'Enviar Requisição'}
              </button>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
              <h4 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-2">
                <Database size={12} className="text-gray-500" />
                Documentação
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Este endpoint retorna {selectedEndpoint.label.toLowerCase()}.
                Use o header <code className="bg-white/10 px-1 py-0.5 rounded text-gray-300">Authorization</code> com sua API key em produção.
                Rate limit: 1000 req/min.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Response */}
        <div className="w-full lg:w-1/2 flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-sm">Response Body</h3>
            {response && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Server size={11} />
                served from us-east-1
              </span>
            )}
          </div>
          <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden border border-white/10 relative min-h-[300px]">
            {!response && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <Server size={28} />
                </div>
                <p className="text-sm">Pronto para enviar requisição</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-3" />
                <p className="text-gray-400 text-sm animate-pulse">Buscando dados...</p>
              </div>
            )}

            {response && (
              <ResponseViewer data={response} status={status} time={time} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIExplorer;
