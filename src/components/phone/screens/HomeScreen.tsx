import React, { useRef, useState } from 'react';
import type { AppEvent } from '../../../types/simulation';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onEvent: (event: AppEvent) => void;
  fluenceEnabled: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onEvent, fluenceEnabled }) => {
  const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const scrollThresholds = useRef(new Set<number>());
  const [expandedTx, setExpandedTx] = useState<number | null>(null);
  const [notifExpanded, setNotifExpanded] = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [balancePulsed, setBalancePulsed] = useState(false);
  const [quickActionToast, setQuickActionToast] = useState<string | null>(null);

  const checkBalance = () => {
    onEvent({ type: 'balance_check', label: 'Saldo conferido', detail: 'R$4.231,50', time: now() });
    setBalancePulsed(true);
    setTimeout(() => setBalancePulsed(false), 1200);
  };

  const handleQuickAction = (label: string, detail: string, navigateTo?: string) => {
    onEvent({ type: 'quick_action', label: `${label} tocado`, detail, time: now() });
    if (navigateTo) {
      onNavigate(navigateTo);
    } else {
      setQuickActionToast(label);
      setTimeout(() => setQuickActionToast(null), 1500);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.target as HTMLDivElement;
    if (el.scrollHeight <= el.clientHeight) return;
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    for (const threshold of [25, 50, 75, 100]) {
      if (pct >= threshold && !scrollThresholds.current.has(threshold)) {
        scrollThresholds.current.add(threshold);
        onEvent({ type: 'scroll_depth', label: `Scrolled ${threshold}% on home`, detail: `${threshold}%`, time: now() });
      }
    }
  };

  const transactions = [
    { icon: '\u{1F6D2}', name: 'Supermercado Pao de Acucar', amount: '-R$ 287,40', color: 'text-red-500', category: 'Mercado', date: 'Hoje, 14:32', method: 'Debito', status: 'Concluido' },
    { icon: '\u{1F4B0}', name: 'Deposito Salario', amount: '+R$ 5.400,00', color: 'text-green-500', category: 'Renda', date: 'Hoje, 08:00', method: 'Deposito direto', status: 'Concluido' },
    { icon: '\u{1F697}', name: 'Uber', amount: '-R$ 23,50', color: 'text-red-500', category: 'Transporte', date: 'Ontem, 19:45', method: 'Credito', status: 'Concluido' },
    { icon: '\u{1F3E0}', name: 'Pagamento Aluguel', amount: '-R$ 1.800,00', color: 'text-red-500', category: 'Moradia', date: '1 Mar, 10:00', method: 'Debito auto.', status: 'Concluido' },
    { icon: '\u{1F4F1}', name: 'Conta Telefone', amount: '-R$ 89,90', color: 'text-red-500', category: 'Utilidades', date: '28 Fev, 06:00', method: 'Debito auto.', status: 'Concluido' },
  ];

  return (
    <div className="flex flex-col flex-1 pb-4 relative" onScroll={handleScroll}>
      {quickActionToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-xs px-4 py-2 rounded-full shadow-lg animate-pulse">
          Abrindo {quickActionToast}...
        </div>
      )}

      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-8 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-violet-200 text-xs">Bom dia</p>
            <p className="text-white text-lg font-bold">Maria</p>
          </div>
          <div
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm cursor-pointer active:bg-white/30 transition-colors"
            onClick={() => onEvent({ type: 'click', label: 'Icone perfil tocado', detail: 'profile', time: now() })}
          >{'\u{1F464}'}</div>
        </div>

        <div
          className={`bg-white/10 rounded-2xl p-4 backdrop-blur cursor-pointer transition-all ${balancePulsed ? 'bg-white/20 scale-[1.02]' : 'active:bg-white/15'}`}
          onClick={checkBalance}
        >
          <div className="flex items-center justify-between">
            <p className="text-violet-200 text-[10px] uppercase tracking-wider">Saldo Total</p>
            {balancePulsed && <span className="text-[10px] text-green-300 animate-pulse">Atualizado agora</span>}
          </div>
          <p className="text-white text-2xl font-bold mt-1">R$ 4.231,50</p>
          <p
            className="text-green-300 text-xs mt-1 cursor-pointer hover:text-green-200"
            onClick={(e) => {
              e.stopPropagation();
              onEvent({ type: 'click', label: 'Crescimento mensal tocado', detail: 'portfolio_summary', time: now() });
              onNavigate('invest');
            }}
          >+R$ 127,30 este mes {'\u2192'}</p>
        </div>
      </div>

      <div className="px-5 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '\u{1F4B8}', label: 'Transferir', detail: 'transfer' },
              { icon: '\u{1F4F1}', label: 'Pix', detail: 'pix' },
              { icon: '\u{1F4B3}', label: 'Cartoes', detail: 'cards' },
              { icon: '\u{1F4CA}', label: 'Investir', detail: 'invest', navigateTo: 'invest' },
            ].map((a, i) => (
              <button key={i} onClick={() => handleQuickAction(a.label, a.detail, (a as any).navigateTo)} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-xl active:bg-violet-100 transition-colors">{a.icon}</div>
                <span className="text-[10px] text-gray-600">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {!notifDismissed && (
          <div
            className={`bg-blue-50 border border-blue-200 rounded-2xl cursor-pointer transition-all duration-200 ${notifExpanded ? 'ring-1 ring-blue-300' : 'active:bg-blue-100'}`}
            onClick={() => {
              if (!notifExpanded) {
                setNotifExpanded(true);
                onEvent({ type: 'notification_click', label: 'Notificacao: Fatura do cartao', detail: 'card_bill_reminder', time: now() });
              }
            }}
          >
            <div className="p-3 flex items-center gap-3">
              <span className="text-lg">{'\u{1F514}'}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-800">Fatura do cartao vence em 3 dias</p>
                <p className="text-[10px] text-blue-600">{notifExpanded ? 'Cartao final •4521' : 'R$ 1.245,80 — toque para ver detalhes'}</p>
              </div>
              {!notifExpanded && <span className="text-blue-400 text-xs">{'\u2192'}</span>}
            </div>
            {notifExpanded && (
              <div className="px-3 pb-3 pt-0">
                <div className="border-t border-blue-200 pt-2 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600">Valor</span>
                    <span className="text-blue-800 font-semibold">R$ 1.245,80</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600">Vencimento</span>
                    <span className="text-blue-800 font-medium">8 Mar, 2026</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600">Pagamento minimo</span>
                    <span className="text-blue-800 font-medium">R$ 186,87</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      className="flex-1 bg-blue-600 text-white text-[10px] font-semibold py-2 rounded-lg active:bg-blue-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEvent({ type: 'transaction', label: 'Fatura paga integralmente', detail: 'R$ 1.245,80', time: now() });
                        setNotifDismissed(true);
                      }}
                    >Pagar Total</button>
                    <button
                      className="flex-1 bg-blue-100 text-blue-700 text-[10px] font-semibold py-2 rounded-lg active:bg-blue-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifDismissed(true);
                        onEvent({ type: 'click', label: 'Notificacao dispensada', detail: 'card_bill_reminder', time: now() });
                      }}
                    >Dispensar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {fluenceEnabled ? (
          <>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{'\u{1F3AF}'}</span>
                <span className="text-sm font-semibold text-emerald-800">Sua Meta de Economia</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">Personalizado</span>
              </div>
              <p className="text-xs text-emerald-700 mb-2">Voce esta no caminho! R$850 economizados para sua reserva de R$2.000.</p>
              <div className="w-full bg-emerald-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '42%' }} />
              </div>
              <p className="text-[10px] text-emerald-600 mt-1">42% completo — otimo progresso, Maria!</p>
            </div>

            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer"
              onClick={() => { onEvent({ type: 'click', label: 'Cartao emprestimo personalizado tocado', time: now() }); onNavigate('loan'); }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-lg">{'\u{1F3E6}'}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Emprestimo Pessoal — no seu ritmo</p>
                  <p className="text-xs text-gray-500">Sem pressa. Veja taxas, sem compromisso.</p>
                </div>
                <span className="text-gray-400">{'\u2192'}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 cursor-pointer active:opacity-90 transition-opacity"
              onClick={() => { onEvent({ type: 'click', label: 'Banner promo tocado', time: now() }); onNavigate('loan'); }}
            >
              <p className="text-white font-bold text-sm">{'\u{1F525}'} TEMPO LIMITADO!</p>
              <p className="text-white/90 text-xs mt-1">Emprestimo pessoal a 1,9%/mes. Solicite AGORA antes que as taxas mudem!</p>
              <button className="mt-2 bg-white text-red-600 text-xs font-bold px-4 py-1.5 rounded-full">SOLICITAR AGORA {'\u2192'}</button>
            </div>

            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => { onEvent({ type: 'click', label: 'Banner investimento tocado', time: now() }); onNavigate('invest'); }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-lg">{'\u{1F4C8}'}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Invista em Crypto</p>
                  <p className="text-xs text-gray-500">Bitcoin subiu 15% essa semana!</p>
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recentes</p>
          {transactions.map((tx, i) => {
            const isExpanded = expandedTx === i;
            return (
              <div
                key={i}
                className={`border-b border-gray-50 last:border-0 cursor-pointer transition-all duration-200 rounded-lg ${isExpanded ? 'bg-gray-50 shadow-sm my-1' : 'active:bg-gray-50'}`}
                onClick={() => {
                  setExpandedTx(isExpanded ? null : i);
                  onEvent({ type: 'transaction_click', label: `Transacao: ${tx.name}`, detail: `${tx.amount} (${tx.category.toLowerCase()})`, time: now() });
                }}
              >
                <div className="flex items-center gap-3 py-2.5 px-1">
                  <span className="text-lg">{tx.icon}</span>
                  <span className="text-xs text-gray-700 flex-1">{tx.name}</span>
                  <span className={`text-xs font-semibold ${tx.color}`}>{tx.amount}</span>
                </div>
                {isExpanded && (
                  <div className="px-1 pb-2.5 pt-0 ml-8">
                    <div className="border-t border-gray-200 pt-2 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Data</span>
                        <span className="text-gray-600">{tx.date}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Categoria</span>
                        <span className="text-gray-600">{tx.category}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Metodo</span>
                        <span className="text-gray-600">{tx.method}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Status</span>
                        <span className="text-emerald-600 font-medium">{tx.status}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
