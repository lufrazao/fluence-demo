import type { MetricDef, PatternDef, TraitDef, SignalRule, MemoryData, ApiOutputDef, AppEvent } from '../types/simulation';

export const FINTECH_METRICS: MetricDef[] = [
  { label: 'Taxa de Churn', before: '12%', after: '7.2%', delta: '-40%', unlockedBy: 'anxiety' },
  { label: 'Conversão Crédito', before: '3.1%', after: '7.1%', delta: '+2.3x', unlockedBy: 'hesitancy' },
  { label: 'Tempo de Sessão', before: '2.4m', after: '4.1m', delta: '+71%', unlockedBy: 'struggle' },
  { label: 'NPS Score', before: '34', after: '61', delta: '+79%', unlockedBy: 'cautious' },
];

export const FINTECH_PATTERNS: Record<string, PatternDef> = {
  anxiety: { icon: '\u{1F630}', name: 'Ansiedade Financeira', description: 'Confere saldo com frequencia, evita telas de perda' },
  hesitancy: { icon: '\u{1F914}', name: 'Hesitacao na Decisao', description: 'Iniciou emprestimo, abandonou na pagina de termos' },
  struggle: { icon: '\u{1F613}', name: 'Confusao com Produto', description: 'Multiplos acessos a ajuda em telas de emprestimo' },
  cautious: { icon: '\u{1F6E1}\u{FE0F}', name: 'Perfil Avesso a Risco', description: 'Prefere informacao detalhada antes de agir' },
};

export const FINTECH_TRAITS: Record<string, TraitDef> = {
  anxiety: { label: 'Ansiedade Financeira', maxPoints: 10 },
  decision_speed: { label: 'Velocidade de Decisao: Deliberada', maxPoints: 8 },
  risk: { label: 'Aversao ao Risco: Alta', labelNegative: 'Apetite ao Risco: Agressivo', maxPoints: 10 },
  help_seeking: { label: 'Busca por Ajuda', maxPoints: 8 },
  price_sensitive: { label: 'Sensibilidade a Taxa', maxPoints: 8 },
  engagement: { label: 'Engajamento Digital', maxPoints: 8 },
};

export const FINTECH_SIGNALS: SignalRule[] = [
  // --- Core behavioral signals ---
  { match: { type: 'balance_check' }, traits: { anxiety: 2 }, patterns: { anxiety: 2 } },
  { match: { type: 'help_accessed' }, traits: { help_seeking: 2 }, patterns: { struggle: 2 } },
  { match: { type: 'form_interaction' }, traits: { decision_speed: 1, engagement: 1 }, patterns: {} },
  { match: { type: 'abandonment' }, traits: { decision_speed: 3 }, patterns: { hesitancy: 3, cautious: 2 } },

  // --- Screen views (detail = screen name: invest, loan, help, home) ---
  { match: { type: 'screen_view', detailIncludes: 'invest' }, traits: { price_sensitive: 1 }, patterns: { cautious: 1 } },
  { match: { type: 'screen_view', detailIncludes: 'loan' }, traits: { price_sensitive: 1.5 }, patterns: { hesitancy: 1 } },
  { match: { type: 'screen_view', detailIncludes: 'help' }, traits: { help_seeking: 1 }, patterns: { struggle: 1 } },

  // --- Investment clicks (detail format: "Baixo risk, 12,5% a.a." — PT-BR risk labels) ---
  { match: { type: 'investment_click', detailIncludes: 'baixo' }, traits: { risk: 2.5 }, patterns: { cautious: 2 } },
  { match: { type: 'investment_click', detailIncludes: 'medio' }, traits: { risk: 0.5 }, patterns: {} },
  { match: { type: 'investment_click', detailIncludes: 'muito alto' }, traits: { risk: -1.5 }, patterns: {} },
  { match: { type: 'investment_click', detailIncludes: 'alto' }, traits: { risk: -2 }, patterns: {} },
  { match: { type: 'investment_click' }, traits: { price_sensitive: 1, engagement: 0.5 }, patterns: {} },

  // --- Transactions & clicks ---
  { match: { type: 'transaction_click' }, traits: { anxiety: 1 }, patterns: { anxiety: 0.5 } },
  { match: { type: 'notification_click' }, traits: { anxiety: 1 }, patterns: { anxiety: 0.5 } },
  { match: { type: 'transaction' }, traits: { engagement: 2 }, patterns: {} },
  { match: { type: 'quick_action' }, traits: { engagement: 1 }, patterns: {} },
  { match: { type: 'click' }, traits: { engagement: 0.5 }, patterns: {} },

  // --- Screen time (detail format: "loan (2450ms)") ---
  { match: { type: 'screen_time', detailIncludes: 'loan' }, traits: { decision_speed: 1, price_sensitive: 1 }, patterns: { hesitancy: 1 } },
  { match: { type: 'screen_time', detailIncludes: 'help' }, traits: { help_seeking: 1 }, patterns: { struggle: 1 } },
  { match: { type: 'screen_time', detailIncludes: 'invest' }, traits: { decision_speed: 0.5 }, patterns: { cautious: 1 } },

  // --- Scroll depth ---
  { match: { type: 'scroll_depth' }, traits: { engagement: 0.5 }, patterns: { cautious: 1 } },
];

export const FINTECH_MEMORY: MemoryData = {
  userId: 'maria_silva',
  totalSessions: 15,
  firstSeen: '3 Dez, 2024',
  lastSeen: '2 dias atras',
  sessionHistory: [
    { date: '2 dias atras', summary: 'Conferiu saldo 4x, viu pagina de emprestimo, abandonou nos termos', duration: '4m 12s' },
    { date: '5 dias atras', summary: 'Conferiu saldo 2x, navegou fundos de investimento, saiu', duration: '2m 45s' },
    { date: '1 semana atras', summary: 'Conferiu saldo 3x, acessou ajuda sobre taxas de emprestimo', duration: '3m 30s' },
  ],
  persistentTraits: [
    { label: 'Conferencia de saldo', detail: '12 de 15 sessoes', trend: 'estavel', icon: '\u{1F501}' },
    { label: 'Juros de emprestimo', detail: 'Visualizou 3x, nunca solicitou', trend: 'recorrente', icon: '\u{1F504}' },
    { label: 'Saida na pagina de termos', detail: 'Saiu nos termos em todas as 3 visitas', trend: 'bloqueio', icon: '\u{1F6AB}' },
  ],
};

export const FINTECH_API_OUTPUT: ApiOutputDef = {
  userId: 'maria_silva',
  segment: { name: 'Tomador Cauteloso', id: 'cautious-first-time-borrower' },
  predictions: [
    {
      pattern: 'anxiety',
      icon: '\u{26A0}\u{FE0F}',
      label: 'Risco de Churn',
      getValue: (points: number) => {
        const pct = Math.min(Math.round((points / 10) * 100), 95);
        return pct >= 60 ? `Alto (${pct}%)` : pct >= 35 ? `Medio (${pct}%)` : `Baixo (${pct}%)`;
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const balanceChecks = events.filter(e => e.type === 'balance_check').length;
        const notifClicks = events.filter(e => e.type === 'notification_click').length;
        const txClicks = events.filter(e => e.type === 'transaction_click').length;
        const parts: string[] = [];
        if (balanceChecks > 0) parts.push(`conferiu saldo ${balanceChecks}x`);
        if (notifClicks > 0) parts.push(`clicou ${notifClicks} notificacao${notifClicks > 1 ? 'es' : ''}`);
        if (txClicks > 0) parts.push(`revisou ${txClicks} transacao${txClicks > 1 ? 'es' : ''}`);
        if (parts.length > 0) return parts.join(', ') + ' nesta sessao';
        return 'Exibindo padroes de navegacao relacionados a ansiedade';
      },
      historicalContext: 'Conferiu saldo em 12 de 15 sessoes — padrao persistente de ansiedade',
    },
    {
      pattern: 'hesitancy',
      icon: '\u{1F4C9}',
      label: 'Probabilidade de Conversao',
      getValue: (points: number) => {
        const pct = Math.max(100 - Math.min(Math.round((points / 10) * 100), 95), 5);
        return pct <= 30 ? `Baixa (${pct}%)` : pct <= 60 ? `Media (${pct}%)` : `Provavel (${pct}%)`;
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const formEvents = events.filter(e => e.type === 'form_interaction').length;
        const abandonments = events.filter(e => e.type === 'abandonment').length;
        if (abandonments > 0 && formEvents > 0) return `Iniciou formulario, interagiu ${formEvents}x, depois abandonou ${abandonments}x`;
        if (abandonments > 0) return `Abandonou solicitacao de emprestimo ${abandonments}x nesta sessao`;
        if (formEvents > 0) return `Interagiu com formulario de emprestimo ${formEvents}x mas hesitando`;
        return 'Visualizou informacoes de emprestimo sem iniciar solicitacao';
      },
      historicalContext: 'Visualizou pagina de emprestimo 3x entre sessoes, nunca completou solicitacao',
    },
    {
      pattern: 'struggle',
      icon: '\u{1F3AB}',
      label: 'Risco de Ticket de Suporte',
      getValue: (points: number) => {
        return points >= 6 ? 'Alto' : points >= 3 ? 'Medio' : 'Baixo';
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const helpEvents = events.filter(e => e.type === 'help_accessed');
        if (helpEvents.length > 0) {
          const topics = helpEvents.map(e => e.detail).filter(Boolean).slice(0, 2).join(', ');
          return `Acessou ajuda ${helpEvents.length}x${topics ? ` (${topics})` : ''}`;
        }
        return 'Sinais de confusao com produto';
      },
      historicalContext: 'Acessou ajuda sobre taxas anteriormente — ainda confuso com termos',
    },
    {
      pattern: 'cautious',
      icon: '\u{1F50D}',
      label: 'Estilo de Decisao',
      getValue: () => 'Informacao primeiro',
      getCurrentSignal: (events: AppEvent[]) => {
        const screenViews = events.filter(e => e.type === 'screen_view').length;
        const investClicks = events.filter(e => e.type === 'investment_click').length;
        const scrollDepth = events.filter(e => e.type === 'scroll_depth').length;
        const parts: string[] = [];
        if (investClicks > 0) parts.push(`navegou ${investClicks} opcao${investClicks > 1 ? 'es' : ''} de investimento`);
        if (scrollDepth > 0) parts.push(`rolou pelo conteudo`);
        if (screenViews > 2) parts.push(`visitou ${screenViews} telas`);
        if (parts.length > 0) return parts.join(', ') + ' — pesquisando antes de agir';
        return 'Navegando informacoes detalhadas antes de agir';
      },
      historicalContext: 'Sempre sai na pagina de termos — precisa de transparencia total antes de se comprometer',
    },
  ],
  recommendations: [
    { pattern: 'anxiety', do: 'Use mensagens tranquilizadoras e educativas', avoid: 'Linguagem de urgencia, contadores regressivos' },
    { pattern: 'hesitancy', do: 'Mostre calculadora antes do compromisso, simplifique para max 2 passos', avoid: 'Texto juridico denso, fluxos de multiplas etapas' },
    { pattern: 'struggle', do: 'FAQ proativo, tooltips de ajuda contextual nos formularios', avoid: 'Assumir conhecimento do produto, esconder suporte' },
    { pattern: 'cautious', do: 'Taxas transparentes, comparacoes lado a lado', avoid: 'Upsells agressivos, taxas ocultas, bait-and-switch' },
  ],
  communicationStyles: {
    anxiety: {
      tone: 'Tranquilizador e calmo',
      contentPriority: ['Rastreador de meta de economia', 'Alertas de saldo', 'Insights de gastos'],
      avoid: ['Linguagem de urgencia', 'Contadores regressivos', 'Enquadramento de perda'],
    },
    hesitancy: {
      tone: 'Paciente e educativo',
      contentPriority: ['Calculadora de emprestimo', 'Guias passo a passo', 'Previews sem compromisso'],
      avoid: ['Texto juridico denso', 'Formularios de multiplas etapas', 'Taticas de pressao'],
    },
    struggle: {
      tone: 'Solidario e claro',
      contentPriority: ['FAQ contextual', 'Tooltips de ajuda', 'Termos em linguagem simples'],
      avoid: ['Jargao financeiro', 'Assumir conhecimento do produto', 'Esconder suporte'],
    },
    cautious: {
      tone: 'Transparente e informativo',
      contentPriority: ['Comparacoes lado a lado', 'Detalhamento de taxas', 'Explicacoes de risco'],
      avoid: ['Upsells agressivos', 'Taxas ocultas', 'Ofertas enganosas'],
    },
  },
};
