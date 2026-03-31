import React, { useState } from 'react';
import type { AppEvent } from '../../../types/simulation';

interface HelpScreenProps {
  onNavigate: (screen: string) => void;
  onEvent: (event: AppEvent) => void;
  fluenceEnabled: boolean;
}

const HelpScreen: React.FC<HelpScreenProps> = ({ onNavigate, onEvent, fluenceEnabled }) => {
  const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const topics = fluenceEnabled
    ? [
        { icon: '\u{1F4B0}', title: 'Entendendo Taxas de Emprestimo', desc: 'Explicacao simples de como as taxas funcionam', badge: 'Sugerido', hot: true, answer: 'Nossa taxa de emprestimo pessoal e 1,9% ao mes (25,4% a.a. CET). Esta e uma taxa fixa — sua parcela mensal permanece a mesma durante todo o periodo. Sem surpresas, sem taxas variaveis. Para um emprestimo de R$5.000 em 12 meses, voce pagaria R$468,50/mes.' },
        { icon: '\u{1F9EE}', title: 'Calculadora de Emprestimo Explicada', desc: 'Veja exatamente quanto vai pagar por mes', badge: 'Para voce', hot: true, answer: 'Use nossa calculadora na pagina de Emprestimos para ver parcelas exatas. Escolha o valor, selecione o prazo (6-48 meses), e veja o detalhamento completo — custo total, juros e parcela mensal. Sem compromisso.' },
        { icon: '\u{1F6E1}\u{FE0F}', title: 'Seu Dinheiro esta Protegido', desc: 'Como o FGC protege seus depositos', badge: null, hot: false, answer: 'Todos os depositos ate R$250.000 por CPF sao protegidos pelo FGC (Fundo Garantidor de Creditos). Isso cobre sua conta corrente, poupanca e CDBs. Seu dinheiro esta seguro mesmo se algo acontecer com o banco.' },
        { icon: '\u{1F4CA}', title: 'Niveis de Risco de Investimento', desc: 'O que baixo/medio/alto risco significa', badge: null, hot: false, answer: 'Baixo risco: Titulos publicos, CDBs — retornos estaveis em torno de 12-13% a.a. Medio risco: Fundos multimercado — potencial de 14-16% a.a. com alguma volatilidade. Alto risco: Acoes, crypto — potencial de 20%+ mas pode cair significativamente.' },
        { icon: '\u{1F4B3}', title: 'Gerenciando Seu Score de Credito', desc: 'Dicas para melhorar seu score', badge: null, hot: false, answer: 'Pague contas em dia, mantenha uso do credito abaixo de 30%, evite abrir muitas contas de uma vez, e mantenha linhas de credito antigas. Seu score atualiza mensalmente — melhorias podem levar 2-3 meses para refletir.' },
      ]
    : [
        { icon: '\u{1F4F1}', title: 'Como Usar Pix', desc: 'Envie e receba pagamentos instantaneos', badge: null, hot: false, answer: 'Pix e gratuito e instantaneo, 24/7. Va em Transferir, Pix, insira a chave Pix do destinatario (CPF, email, telefone ou chave aleatoria), insira o valor e confirme. O dinheiro chega em segundos.' },
        { icon: '\u{1F4B3}', title: 'Configuracoes do Cartao', desc: 'Bloquear, desbloquear, limites', badge: null, hot: false, answer: 'Va em Cartoes para gerenciar seu cartao. Voce pode bloquear/desbloquear temporariamente, ajustar limites de gastos, habilitar/desabilitar compras internacionais e configurar pagamento por aproximacao. Alteracoes tem efeito imediato.' },
        { icon: '\u{1F4B0}', title: 'FAQ Taxas de Juros', desc: 'Perguntas comuns sobre taxas', badge: null, hot: false, answer: 'Emprestimo pessoal: 1,9%/mes fixo. Cheque especial: 8%/mes. Rotativo do cartao: 12%/mes. Poupanca: 0,5%/mes + TR. CDB: 100-120% CDI. Sempre mostramos o custo total (CET) antecipadamente.' },
        { icon: '\u{1F512}', title: 'Seguranca e Privacidade', desc: 'Como protegemos seus dados', badge: null, hot: false, answer: 'Usamos criptografia de 256 bits, autenticacao biometrica e monitoramento de fraudes em tempo real. Seus dados nunca sao compartilhados com terceiros sem consentimento. Voce pode revisar e baixar seus dados a qualquer momento em Configuracoes, Privacidade.' },
        { icon: '\u{1F4DE}', title: 'Contatar Suporte', desc: 'Chat, telefone, email', badge: null, hot: false, answer: 'Chat: Disponivel 24/7 no app. Telefone: 0800-123-4567 (Seg-Sex 8h-20h, Sab 9h-14h). Email: ajuda@neobank.com.br — respostas em 24h. Para questoes urgentes, use o chat para resolucao mais rapida.' },
      ];

  return (
    <div className="flex flex-col flex-1 pb-4">
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onNavigate('home')} className="text-white/80 text-sm">{'\u2190'} Voltar</button>
          <h1 className="text-white font-bold">Central de Ajuda</h1>
        </div>
        <div
          className={`rounded-xl px-4 py-2.5 flex items-center gap-2 backdrop-blur cursor-pointer transition-colors ${searchFocused ? 'bg-white/20 ring-1 ring-white/40' : 'bg-white/10 active:bg-white/15'}`}
          onClick={() => {
            setSearchFocused(true);
            onEvent({ type: 'click', label: 'Busca ajuda tocada', detail: 'help_search', time: now() });
            setTimeout(() => setSearchFocused(false), 1500);
          }}
        >
          <span className="text-white/50">{'\u{1F50D}'}</span>
          <span className={`text-sm transition-colors ${searchFocused ? 'text-white/70' : 'text-white/40'}`}>
            {searchFocused ? 'Digite para buscar...' : 'Buscar topicos de ajuda...'}
          </span>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {fluenceEnabled && (
          <div
            className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-start gap-2 cursor-pointer active:bg-teal-100 transition-colors"
            onClick={() => onEvent({ type: 'click', label: 'Banner ajuda personalizada tocado', detail: 'personalized_help', time: now() })}
          >
            <span className="text-sm">{'\u{1F3AF}'}</span>
            <div>
              <p className="text-xs font-semibold text-teal-800">Personalizado para voce</p>
              <p className="text-[10px] text-teal-700">Baseado na sua atividade recente, estes topicos podem ajudar.</p>
            </div>
          </div>
        )}

        {topics.map((topic, i) => {
          const isExpanded = expandedTopic === i;
          return (
            <div
              key={i}
              className={`bg-white rounded-xl shadow-sm border cursor-pointer transition-all duration-200 ${topic.hot ? 'border-violet-200' : 'border-gray-100'} ${isExpanded ? 'ring-1 ring-violet-200 shadow-md' : 'active:bg-gray-50'}`}
              onClick={() => {
                setExpandedTopic(isExpanded ? null : i);
                onEvent({ type: 'help_accessed', label: `Ajuda: ${topic.title}`, detail: topic.title, time: now() });
              }}
            >
              <div className="p-3.5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{topic.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800">{topic.title}</p>
                      {topic.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium flex-shrink-0">{topic.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{topic.desc}</p>
                  </div>
                  <span className={`text-gray-300 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>{'\u2192'}</span>
                </div>
              </div>
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-0">
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-600 leading-relaxed">{topic.answer}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="text-[10px] px-3 py-1 rounded-full bg-violet-50 text-violet-600 font-medium active:bg-violet-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEvent({ type: 'click', label: 'Ajuda: Foi util? Sim', detail: topic.title, time: now() });
                        }}
                      >{'\u{1F44D}'} Util</button>
                      <button
                        className="text-[10px] px-3 py-1 rounded-full bg-gray-50 text-gray-500 font-medium active:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEvent({ type: 'help_accessed', label: 'Ajuda: Preciso de mais ajuda', detail: `${topic.title} - preciso mais`, time: now() });
                        }}
                      >Preciso de mais ajuda</button>
                    </div>
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

export default HelpScreen;
