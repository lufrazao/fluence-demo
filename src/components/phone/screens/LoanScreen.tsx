import React, { useState } from 'react';
import type { AppEvent } from '../../../types/simulation';

interface LoanScreenProps {
  onNavigate: (screen: string) => void;
  onEvent: (event: AppEvent) => void;
  fluenceEnabled: boolean;
}

const LoanScreen: React.FC<LoanScreenProps> = ({ onNavigate, onEvent, fluenceEnabled }) => {
  const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const [step, setStep] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const startApp = (amount: string | null) => {
    setStep(1);
    setSelectedAmount(amount);
    onEvent({ type: 'form_interaction', label: 'Solicitacao de emprestimo iniciada', detail: `valor:${amount || 'nao especificado'}`, time: now() });
  };

  const abandon = () => {
    if (step > 0) {
      onEvent({ type: 'abandonment', label: 'Solicitacao de emprestimo abandonada', detail: `na etapa ${step}`, time: now() });
    }
    setStep(0);
    onNavigate('home');
  };

  const saveForLater = () => {
    onEvent({ type: 'abandonment', label: 'Emprestimo salvo para depois', detail: `na etapa ${step}`, time: now() });
    setStep(0);
    onNavigate('home');
  };

  const faqs = fluenceEnabled
    ? [
        { q: 'As taxas sao fixas?', a: 'Sim — 1,9% ao mes, fixas para todo o periodo. Sua parcela nunca muda.' },
        { q: 'Posso quitar antecipado?', a: 'Com certeza. Sem multa por quitacao antecipada. Voce so paga juros ate a data do pagamento.' },
        { q: 'Quais documentos preciso?', a: 'Apenas seu CPF e comprovante de renda. Pre-preenchemos a maioria das informacoes da sua conta.' },
      ]
    : [
        { q: 'Qual o CET?', a: 'O CET (Custo Efetivo Total) e a taxa anual: 25,4% a.a. Inclui todas as taxas e encargos.' },
        { q: 'Quais os prazos?', a: 'Prazos de 6 a 48 meses. Valores de R$1.000 a R$50.000. Sujeito a aprovacao de credito.' },
        { q: 'Multa por atraso?', a: 'Atrasos incorrem em 2% de multa + 1% de juros ao mes sobre o valor em atraso, mais encargos pro-rata diarios.' },
      ];

  if (step === 0) {
    return (
      <div className="flex flex-col flex-1 pb-4">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => onNavigate('home')} className="text-white/80 text-sm">{'\u2190'} Voltar</button>
            <h1 className="text-white font-bold">Emprestimo Pessoal</h1>
          </div>
        </div>

        <div className="px-5 mt-4 space-y-4">
          {fluenceEnabled ? (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{'\u{1F6E1}\u{FE0F}'}</span>
                  <span className="text-sm font-semibold text-emerald-800">Sem pressao, sem compromisso</span>
                </div>
                <p className="text-xs text-emerald-700">Explore suas opcoes no seu ritmo. Voce pode salvar e voltar quando quiser.</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">Calculadora Simples</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Quanto voce precisa?</p>
                    <div className="flex gap-2">
                      {['R$1.000', 'R$5.000', 'R$10.000', 'R$20.000'].map(a => (
                        <button
                          key={a}
                          onClick={() => startApp(a)}
                          className="flex-1 text-xs py-2 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 active:bg-violet-100 transition-colors"
                        >{a}</button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Estimativa mensal para R$5.000:</p>
                    <p className="text-lg font-bold text-violet-700">R$ 468,50/mes <span className="text-xs font-normal text-gray-500">x 12 meses</span></p>
                    <p className="text-[10px] text-gray-500 mt-1">Taxa: 1,9% a.m. · CET: 25,4% a.a.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <p className="text-sm font-bold text-gray-800 mb-1">Emprestimo Pessoal</p>
                <p className="text-xs text-gray-500 mb-3">Taxas a partir de 1,9% a.m.</p>
                <p className="text-xs text-gray-500">Valor: R$1.000 – R$50.000</p>
                <p className="text-xs text-gray-500">Prazo: 6 – 48 meses</p>
                <p className="text-xs text-gray-500 mb-4">CET: a partir de 25,4% a.a.</p>
                <button onClick={() => startApp(null)} className="w-full bg-violet-600 text-white text-sm font-semibold py-3 rounded-xl active:bg-violet-700 transition-colors">Iniciar Solicitacao {'\u2192'}</button>
              </div>
              <p className="text-[10px] text-gray-400 text-center">Sujeito a aprovacao de credito. Termos e condicoes aplicaveis.</p>
            </>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Perguntas Frequentes</p>
            {faqs.map((faq, i) => {
              const isExpanded = expandedFaq === i;
              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl shadow-sm border mb-2 cursor-pointer transition-all duration-200 ${isExpanded ? 'border-violet-200 ring-1 ring-violet-100' : 'border-gray-100 active:bg-gray-50'}`}
                  onClick={() => {
                    setExpandedFaq(isExpanded ? null : i);
                    onEvent({ type: 'help_accessed', label: `FAQ Emprestimo: ${faq.q}`, detail: faq.q, time: now() });
                  }}
                >
                  <div className="p-3 flex items-center gap-2">
                    <span className="text-sm">{'\u{1F4AC}'}</span>
                    <p className="text-xs font-medium text-gray-700 flex-1">{faq.q}</p>
                    <span className={`text-gray-300 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>{'\u2192'}</span>
                  </div>
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="border-t border-gray-100 pt-2">
                        <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
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
  }

  return (
    <div className="flex flex-col flex-1 pb-4">
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={abandon} className="text-white/80 text-sm">{'\u2190'} Voltar</button>
          <h1 className="text-white font-bold">Solicitacao</h1>
        </div>
        {fluenceEnabled && (
          <div className="flex gap-1">
            {[1, 2].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full ${step >= s ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        )}
        {selectedAmount && (
          <p className="text-violet-200 text-xs mt-2">Valor do emprestimo: {selectedAmount}</p>
        )}
      </div>

      <div className="px-5 mt-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500">Nome Completo</label>
            <div
              className="mt-1 px-3 py-2 border rounded-lg text-sm text-gray-300 bg-gray-50 cursor-pointer active:border-violet-300 transition-colors"
              onClick={() => onEvent({ type: 'form_interaction', label: 'Campo nome focado', detail: 'loan_form:name', time: now() })}
            >Maria Silva</div>
          </div>
          <div>
            <label className="text-xs text-gray-500">CPF</label>
            <div
              className="mt-1 px-3 py-2 border rounded-lg text-sm text-gray-300 bg-gray-50 cursor-pointer active:border-violet-300 transition-colors"
              onClick={() => onEvent({ type: 'form_interaction', label: 'Campo CPF focado', detail: 'loan_form:cpf', time: now() })}
            >{'\u2022\u2022\u2022'}.\u2022\u2022\u2022.\u2022\u2022\u2022-\u2022\u2022</div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Renda Mensal</label>
            <div
              className="mt-1 px-3 py-2 border rounded-lg text-sm text-gray-800 bg-gray-50 cursor-pointer active:border-violet-300 transition-colors"
              onClick={() => onEvent({ type: 'form_interaction', label: 'Campo renda focado', detail: 'loan_form:income', time: now() })}
            >R$ 5.400,00</div>
          </div>

          {!fluenceEnabled && (
            <div
              className="text-[8px] text-gray-400 leading-relaxed max-h-16 overflow-y-auto border rounded p-2 cursor-pointer"
              onClick={() => onEvent({ type: 'form_interaction', label: 'Texto dos termos visualizado', detail: 'loan_terms_scroll', time: now() })}
            >
              Termos: A taxa de custo efetivo total (CET) e calculada conforme Resolucao No. 3.517/2007 do Banco Central do Brasil. O tomador concorda em pagar o valor principal mais juros acumulados...
              <span className="text-gray-500 font-medium"> [mais 12 paragrafos...]</span>
            </div>
          )}

          <button
            onClick={() => {
              if (step < 2) {
                setStep(2);
                onEvent({ type: 'form_interaction', label: 'Formulario emprestimo etapa 2', detail: 'revisao termos', time: now() });
              } else {
                onEvent({ type: 'transaction', label: 'Solicitacao de emprestimo enviada', time: now() });
                setStep(0);
                onNavigate('home');
              }
            }}
            className="w-full bg-violet-600 text-white text-sm font-semibold py-3 rounded-xl active:bg-violet-700 transition-colors"
          >
            {step < 2 ? 'Continuar' : 'Enviar Solicitacao'}
          </button>

          <button onClick={saveForLater} className="w-full text-gray-400 text-xs py-2 active:text-gray-600 transition-colors">
            Salvar para depois
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanScreen;
