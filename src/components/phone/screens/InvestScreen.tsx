import React, { useState } from 'react';
import type { AppEvent } from '../../../types/simulation';

interface InvestScreenProps {
  onNavigate: (screen: string) => void;
  onEvent: (event: AppEvent) => void;
  fluenceEnabled: boolean;
}

const InvestScreen: React.FC<InvestScreenProps> = ({ onNavigate, onEvent, fluenceEnabled }) => {
  const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const [expandedFund, setExpandedFund] = useState<number | null>(null);
  const [invested, setInvested] = useState<number | null>(null);

  const funds = fluenceEnabled
    ? [
        { name: 'Renda Fixa Conservadora', rate: '12,5% a.a.', risk: 'Baixo', badge: '\u{1F6E1}\u{FE0F} Recomendado', badgeColor: 'bg-emerald-100 text-emerald-700', desc: 'Retornos estaveis, ideal para seu perfil', minInvest: 'R$ 100', liquidity: 'Diaria', type: 'CDB / Titulos Publicos', projected: 'R$ 12.625 em 1 ano sobre R$ 100k' },
        { name: 'Fundo Protegido contra Inflacao', rate: 'IPCA + 6,2%', risk: 'Baixo-Med', badge: null, badgeColor: '', desc: 'Protege seu poder de compra', minInvest: 'R$ 500', liquidity: 'D+1', type: 'Tesouro IPCA+', projected: 'R$ ~11.200 em 1 ano sobre R$ 100k' },
        { name: 'Multimercado Equilibrado', rate: '14,8% a.a.', risk: 'Medio', badge: null, badgeColor: '', desc: 'Carteira diversificada', minInvest: 'R$ 1.000', liquidity: 'D+3', type: 'Fundo multimercado', projected: 'R$ 14.800 em 1 ano sobre R$ 100k' },
        { name: 'Fundo de Crescimento Tech', rate: '22,1% a.a.', risk: 'Alto', badge: null, badgeColor: '', desc: 'Maior risco, maior potencial', minInvest: 'R$ 5.000', liquidity: 'D+30', type: 'Fundo de acoes', projected: 'R$ 22.100 em 1 ano sobre R$ 100k' },
      ]
    : [
        { name: 'Fundo de Crescimento Tech', rate: '22,1% a.a.', risk: 'Alto', badge: '\u{1F525} Hot', badgeColor: 'bg-red-100 text-red-600', desc: 'Melhor desempenho do trimestre!', minInvest: 'R$ 5.000', liquidity: 'D+30', type: 'Fundo de acoes', projected: 'R$ 22.100 em 1 ano sobre R$ 100k' },
        { name: 'Fundo Indice Crypto', rate: '45,3% a.a.', risk: 'Muito Alto', badge: '\u{1F680} Em alta', badgeColor: 'bg-orange-100 text-orange-600', desc: 'Exposicao a Bitcoin & Ethereum', minInvest: 'R$ 1.000', liquidity: 'D+1', type: 'Cesta de criptomoedas', projected: 'R$ 45.300 em 1 ano sobre R$ 100k' },
        { name: 'Renda Fixa Conservadora', rate: '12,5% a.a.', risk: 'Baixo', badge: null, badgeColor: '', desc: 'Titulos garantidos pelo governo', minInvest: 'R$ 100', liquidity: 'Diaria', type: 'CDB / Titulos Publicos', projected: 'R$ 12.625 em 1 ano sobre R$ 100k' },
        { name: 'Multimercado Equilibrado', rate: '14,8% a.a.', risk: 'Medio', badge: null, badgeColor: '', desc: 'Abordagem diversificada', minInvest: 'R$ 1.000', liquidity: 'D+3', type: 'Fundo multimercado', projected: 'R$ 14.800 em 1 ano sobre R$ 100k' },
      ];

  return (
    <div className="flex flex-col flex-1 pb-4">
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onNavigate('home')} className="text-white/80 text-sm">{'\u2190'} Voltar</button>
          <h1 className="text-white font-bold">Investimentos</h1>
        </div>
        <div
          className="bg-white/10 rounded-xl p-3 backdrop-blur cursor-pointer active:bg-white/15 transition-colors"
          onClick={() => onEvent({ type: 'click', label: 'Valor carteira tocado', detail: 'portfolio_summary', time: now() })}
        >
          <p className="text-violet-200 text-[10px] uppercase">Valor da Carteira</p>
          <p className="text-white text-xl font-bold">R$ 12.430,00</p>
          <p className="text-green-300 text-xs">+8,2% este ano</p>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {fluenceEnabled && (
          <div
            className="bg-violet-50 border border-violet-200 rounded-xl p-3 flex items-start gap-2 cursor-pointer active:bg-violet-100 transition-colors"
            onClick={() => onEvent({ type: 'click', label: 'Sugestao de investimento tocada', detail: 'personalized_suggestion', time: now() })}
          >
            <span className="text-sm">{'\u{1F4A1}'}</span>
            <p className="text-xs text-violet-700">Com base no seu perfil de risco, priorizamos opcoes estaveis e de menor risco que combinam com seu estilo de investimento.</p>
          </div>
        )}

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fundos Disponiveis</p>
        {funds.map((fund, i) => {
          const isExpanded = expandedFund === i;
          const justInvested = invested === i;
          return (
            <div
              key={i}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${isExpanded ? 'ring-1 ring-violet-200 shadow-md border-violet-100' : 'border-gray-100 active:bg-gray-50'} cursor-pointer`}
              onClick={() => {
                setExpandedFund(isExpanded ? null : i);
                onEvent({ type: 'investment_click', label: `Visualizou ${fund.name}`, detail: `${fund.risk} risk, ${fund.rate}`, time: now() });
              }}
            >
              <div className="p-3.5">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800 flex-1">{fund.name}</p>
                  {fund.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${fund.badgeColor}`}>{fund.badge}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{fund.desc}</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400">Retorno</p>
                    <p className="text-sm font-bold text-violet-600">{fund.rate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Risco</p>
                    <p className="text-sm font-medium text-gray-700">{fund.risk}</p>
                  </div>
                  {isExpanded && (
                    <>
                      <div>
                        <p className="text-[10px] text-gray-400">Min.</p>
                        <p className="text-sm font-medium text-gray-700">{fund.minInvest}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Liquidez</p>
                        <p className="text-sm font-medium text-gray-700">{fund.liquidity}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-0">
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Tipo do fundo</span>
                      <span className="text-gray-700 font-medium">{fund.type}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Retorno projetado</span>
                      <span className="text-gray-700 font-medium">{fund.projected}</span>
                    </div>
                    {justInvested ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center">
                        <p className="text-xs font-semibold text-emerald-700">Investimento confirmado!</p>
                        <p className="text-[10px] text-emerald-600">Voce vera na sua carteira em breve.</p>
                      </div>
                    ) : (
                      <button
                        className="w-full bg-violet-600 text-white text-xs font-semibold py-2.5 rounded-lg active:bg-violet-700 transition-colors mt-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInvested(i);
                          onEvent({ type: 'transaction', label: `Investiu em ${fund.name}`, detail: `${fund.risk} risk, ${fund.rate}`, time: now() });
                          setTimeout(() => setInvested(null), 3000);
                        }}
                      >Investir em {fund.name}</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvestScreen;
