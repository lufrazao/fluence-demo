export interface TraitScore {
  label: string;
  value: number; // 0-100
  icon: string;
  color: string; // Tailwind color class
}

export interface PatternInfo {
  icon: string;
  name: string;
  description: string;
}

export interface Lead {
  id: string;
  name: string;
  age: number;
  avatar: string;
  context: string;
  source: string;
  product: string;

  behavioralProfile: {
    decisionStyle: string;
    decisionStyleColor: string;
    riskSensitivity: number; // 0-100
    trustTriggers: string[];
    urgencyResponse: string;
    informationNeed: 'Alto' | 'Médio' | 'Baixo';
    traits: TraitScore[];
    patterns: PatternInfo[];
  };

  standardMessage: {
    title: string;
    body: string;
    cta: string;
  };

  adaptedMessage: {
    title: string;
    body: string;
    cta: string;
    reasoning: string;
    highlights: string[];
  };

  channels: {
    onboarding: string;
    push: string;
    email: string;
    whatsapp: string;
  };

  conversionMetrics: {
    standardRate: number;
    adaptedRate: number;
    lift: number;
  };
}

const STANDARD_MESSAGE = {
  title: 'Solicite seu crédito agora',
  body: 'Taxas competitivas para você. Aproveite nossas condições especiais e faça seu pedido hoje mesmo. Não perca essa oportunidade!',
  cta: 'Solicitar Agora',
};

export const leads: Lead[] = [
  {
    id: 'joao_conservador',
    name: 'João Conservador',
    age: 28,
    avatar: '🛡️',
    context: 'Primeiro contato via app, nunca contratou crédito digital',
    source: 'App',
    product: 'Crédito Pessoal',

    behavioralProfile: {
      decisionStyle: 'Conservador',
      decisionStyleColor: 'bg-blue-500/20 text-blue-400',
      riskSensitivity: 82,
      trustTriggers: ['Garantias', 'Transparência', 'Credibilidade institucional', 'Sem surpresas'],
      urgencyResponse: 'Rejeita pressão — prefere avaliar com calma',
      informationNeed: 'Alto',
      traits: [
        { label: 'Aversão ao Risco', value: 85, icon: 'Shield', color: 'bg-blue-500' },
        { label: 'Necessidade de Informação', value: 78, icon: 'BookOpen', color: 'bg-violet-500' },
        { label: 'Velocidade de Decisão', value: 22, icon: 'Clock', color: 'bg-amber-500' },
        { label: 'Sensibilidade a Preço', value: 65, icon: 'DollarSign', color: 'bg-green-500' },
        { label: 'Busca por Segurança', value: 91, icon: 'Lock', color: 'bg-indigo-500' },
      ],
      patterns: [
        { icon: '🔍', name: 'Pesquisador Cauteloso', description: 'Lê todos os termos e condições antes de prosseguir' },
        { icon: '⏳', name: 'Decisor Lento', description: 'Múltiplas visitas antes de qualquer ação' },
        { icon: '🛡️', name: 'Buscador de Garantias', description: 'Prioriza selos de segurança e certificações' },
      ],
    },

    standardMessage: { ...STANDARD_MESSAGE },

    adaptedMessage: {
      title: 'Conheça seu crédito com total transparência',
      body: 'Simule sem compromisso e veja exatamente quanto vai pagar em cada parcela. Sem taxas ocultas, sem surpresas. Você tem controle total — cancele a qualquer momento nos primeiros 7 dias.',
      cta: 'Simular com Segurança',
      reasoning: 'Perfil conservador precisa de previsibilidade e controle. Removemos urgência e adicionamos transparência, garantia de cancelamento e linguagem que transmite segurança.',
      highlights: ['Tom: Tranquilizador', 'CTA: Sem compromisso', 'Garantia de cancelamento', 'Sem pressão temporal'],
    },

    channels: {
      onboarding: 'Tela de boas-vindas com simulador simplificado e selo de segurança em destaque',
      push: '"João, sua simulação está salva. Volte quando quiser — sem pressa."',
      email: 'Email educativo com planilha de parcelas e link para FAQ',
      whatsapp: '"Oi João! Sou a Ana, do time de crédito. Posso tirar suas dúvidas quando preferir 😊"',
    },

    conversionMetrics: {
      standardRate: 2.1,
      adaptedRate: 8.4,
      lift: 300,
    },
  },

  {
    id: 'larissa_impulsiva',
    name: 'Larissa Impulsiva',
    age: 24,
    avatar: '⚡',
    context: 'Chegou via anúncio no Instagram, engajamento rápido',
    source: 'Redes Sociais',
    product: 'Conta Digital Premium',

    behavioralProfile: {
      decisionStyle: 'Impulsivo',
      decisionStyleColor: 'bg-orange-500/20 text-orange-400',
      riskSensitivity: 25,
      trustTriggers: ['Rapidez', 'Exclusividade', 'Prova social', 'Recompensa imediata'],
      urgencyResponse: 'Responde bem a escassez e urgência',
      informationNeed: 'Baixo',
      traits: [
        { label: 'Aversão ao Risco', value: 18, icon: 'Shield', color: 'bg-blue-500' },
        { label: 'Necessidade de Informação', value: 25, icon: 'BookOpen', color: 'bg-violet-500' },
        { label: 'Velocidade de Decisão', value: 92, icon: 'Clock', color: 'bg-amber-500' },
        { label: 'Sensibilidade a Preço', value: 35, icon: 'DollarSign', color: 'bg-green-500' },
        { label: 'Busca por Novidade', value: 88, icon: 'Sparkles', color: 'bg-pink-500' },
      ],
      patterns: [
        { icon: '⚡', name: 'Decisor Rápido', description: 'Menos de 30s entre interesse e ação' },
        { icon: '🔥', name: 'Responde a FOMO', description: 'Engaja com contadores e ofertas limitadas' },
        { icon: '📱', name: 'Nativa Digital', description: 'Prefere experiência 100% mobile e fluida' },
      ],
    },

    standardMessage: { ...STANDARD_MESSAGE },

    adaptedMessage: {
      title: '🔥 Últimas vagas: Conta Premium com cashback dobrado',
      body: 'Mais de 12.000 pessoas já abriram a conta esta semana. Ative agora e ganhe cashback em dobro no primeiro mês — oferta válida só até hoje!',
      cta: 'Ativar em 30 Segundos',
      reasoning: 'Perfil impulsivo responde a escassez, prova social e gratificação imediata. Adicionamos urgência real, números sociais e promessa de velocidade no CTA.',
      highlights: ['Tom: Urgente e exclusivo', 'CTA: Velocidade', 'Prova social', 'Escassez temporal'],
    },

    channels: {
      onboarding: 'Fluxo em 3 telas com contador regressivo e cashback em destaque',
      push: '"⚡ Larissa, faltam 2h pro cashback dobrado expirar!"',
      email: 'Email curto com um botão grande e social proof (12k pessoas esta semana)',
      whatsapp: '"Lari, acabei de liberar seu cashback dobrado 🔥 Ativa em 30s aqui"',
    },

    conversionMetrics: {
      standardRate: 4.8,
      adaptedRate: 14.2,
      lift: 196,
    },
  },

  {
    id: 'roberto_analitico',
    name: 'Roberto Analítico',
    age: 35,
    avatar: '📊',
    context: 'Comparando 3 opções de crédito em sites especializados',
    source: 'Comparador Web',
    product: 'Crédito Pessoal',

    behavioralProfile: {
      decisionStyle: 'Analítico',
      decisionStyleColor: 'bg-teal-500/20 text-teal-400',
      riskSensitivity: 55,
      trustTriggers: ['Dados comparativos', 'Transparência de taxas', 'Simulação detalhada', 'Reviews técnicos'],
      urgencyResponse: 'Ignora pressão — decide baseado em dados',
      informationNeed: 'Alto',
      traits: [
        { label: 'Aversão ao Risco', value: 52, icon: 'Shield', color: 'bg-blue-500' },
        { label: 'Necessidade de Informação', value: 95, icon: 'BookOpen', color: 'bg-violet-500' },
        { label: 'Velocidade de Decisão', value: 30, icon: 'Clock', color: 'bg-amber-500' },
        { label: 'Sensibilidade a Preço', value: 88, icon: 'DollarSign', color: 'bg-green-500' },
        { label: 'Orientação a Dados', value: 94, icon: 'BarChart', color: 'bg-teal-500' },
      ],
      patterns: [
        { icon: '📊', name: 'Comparador Serial', description: 'Abriu 3+ abas de concorrentes simultaneamente' },
        { icon: '🔬', name: 'Leitor de Letras Miúdas', description: 'Tempo acima da média em termos e condições' },
        { icon: '📐', name: 'Calculador', description: 'Usa simuladores múltiplas vezes com valores diferentes' },
      ],
    },

    standardMessage: { ...STANDARD_MESSAGE },

    adaptedMessage: {
      title: 'Compare e comprove: CET de 1,49% a.m.',
      body: 'Taxa efetiva total transparente, sem custos ocultos. Simule com diferentes prazos e valores — veja a planilha completa de parcelas, juros e IOF antes de decidir. Nosso CET está entre os 3 menores do mercado (fonte: Banco Central, mar/2026).',
      cta: 'Abrir Simulador Detalhado',
      reasoning: 'Perfil analítico precisa de dados concretos e comparabilidade. Incluímos CET explícito, referência ao Banco Central, e CTA que dá acesso a informação (não à compra).',
      highlights: ['Tom: Factual e transparente', 'CTA: Acesso a dados', 'Fonte externa citada', 'Comparação de mercado'],
    },

    channels: {
      onboarding: 'Tela com tabela comparativa de CET, prazos e parcelas lado a lado',
      push: '"Roberto, atualizamos a comparação de taxas. CET mais baixo do trimestre."',
      email: 'Email com PDF anexo: planilha comparativa de 5 instituições + CET detalhado',
      whatsapp: '"Roberto, segue o comparativo que você pediu. Qualquer dúvida sobre os números, estou aqui."',
    },

    conversionMetrics: {
      standardRate: 3.5,
      adaptedRate: 10.1,
      lift: 189,
    },
  },

  {
    id: 'camila_ansiosa',
    name: 'Camila Ansiosa',
    age: 31,
    avatar: '🌿',
    context: 'Indicação de amiga, primeira experiência com investimento',
    source: 'Indicação',
    product: 'CDB Seguro',

    behavioralProfile: {
      decisionStyle: 'Ansioso',
      decisionStyleColor: 'bg-rose-500/20 text-rose-400',
      riskSensitivity: 93,
      trustTriggers: ['Linguagem simples', 'Suporte humano', 'Garantias do FGC', 'Passos pequenos'],
      urgencyResponse: 'Pressão causa paralisia — precisa de acolhimento',
      informationNeed: 'Médio',
      traits: [
        { label: 'Aversão ao Risco', value: 95, icon: 'Shield', color: 'bg-blue-500' },
        { label: 'Necessidade de Informação', value: 60, icon: 'BookOpen', color: 'bg-violet-500' },
        { label: 'Velocidade de Decisão', value: 15, icon: 'Clock', color: 'bg-amber-500' },
        { label: 'Ansiedade Financeira', value: 88, icon: 'Heart', color: 'bg-rose-500' },
        { label: 'Busca por Suporte', value: 82, icon: 'MessageCircle', color: 'bg-cyan-500' },
      ],
      patterns: [
        { icon: '😰', name: 'Ansiedade Financeira', description: 'Verificou saldo 4x antes de explorar investimentos' },
        { icon: '🔄', name: 'Abandonos Recorrentes', description: 'Iniciou cadastro 2x sem concluir' },
        { icon: '💬', name: 'Busca Apoio Humano', description: 'Clicou em chat/ajuda múltiplas vezes' },
      ],
    },

    standardMessage: { ...STANDARD_MESSAGE },

    adaptedMessage: {
      title: 'Seu primeiro passo — simples e protegido',
      body: 'Comece com apenas R$50 em um investimento protegido pelo FGC (Fundo Garantidor de Créditos). Sem pegadinhas, sem termos complicados. E se tiver qualquer dúvida, nossa equipe está aqui para te acompanhar.',
      cta: 'Entender Como Funciona',
      reasoning: 'Perfil ansioso precisa de acolhimento e passos pequenos. Baixamos a barreira de entrada (R$50), mencionamos proteção do FGC, simplificamos a linguagem e oferecemos suporte humano.',
      highlights: ['Tom: Acolhedor e simples', 'CTA: Educativo, não transacional', 'Barreira baixa (R$50)', 'Suporte humano disponível'],
    },

    channels: {
      onboarding: 'Tour guiado com linguagem simples, selo FGC visível e chat ao vivo integrado',
      push: '"Camila, tudo bem? Guardamos seu progresso. Pode continuar quando se sentir pronta 💚"',
      email: 'Email com vídeo curto: "Como funciona investir R$50 com proteção do FGC"',
      whatsapp: '"Oi Camila! Sou a Julia, sua consultora. Vi que você começou a explorar o CDB. Posso te explicar tudo com calma?"',
    },

    conversionMetrics: {
      standardRate: 1.9,
      adaptedRate: 7.6,
      lift: 300,
    },
  },

  {
    id: 'felipe_pragmatico',
    name: 'Felipe Pragmático',
    age: 40,
    avatar: '💰',
    context: 'Migrando de banco tradicional, busca melhor custo-benefício',
    source: 'Portabilidade',
    product: 'Conta Digital Premium',

    behavioralProfile: {
      decisionStyle: 'Pragmático',
      decisionStyleColor: 'bg-emerald-500/20 text-emerald-400',
      riskSensitivity: 45,
      trustTriggers: ['Economia comprovada', 'ROI claro', 'Benefícios tangíveis', 'Sem burocracia'],
      urgencyResponse: 'Decide rápido se vê benefício concreto',
      informationNeed: 'Médio',
      traits: [
        { label: 'Aversão ao Risco', value: 40, icon: 'Shield', color: 'bg-blue-500' },
        { label: 'Necessidade de Informação', value: 55, icon: 'BookOpen', color: 'bg-violet-500' },
        { label: 'Velocidade de Decisão', value: 68, icon: 'Clock', color: 'bg-amber-500' },
        { label: 'Sensibilidade a Preço', value: 92, icon: 'DollarSign', color: 'bg-green-500' },
        { label: 'Orientação a Resultado', value: 85, icon: 'Target', color: 'bg-emerald-500' },
      ],
      patterns: [
        { icon: '💰', name: 'Otimizador de Custos', description: 'Comparou tarifas detalhadamente antes de clicar' },
        { icon: '🎯', name: 'Focado em Resultado', description: 'Ignorou conteúdo institucional, foi direto a preços' },
        { icon: '⚖️', name: 'Avaliador de Trade-offs', description: 'Pesou prós e contras em diferentes planos' },
      ],
    },

    standardMessage: { ...STANDARD_MESSAGE },

    adaptedMessage: {
      title: 'Economize R$847/ano com a portabilidade',
      body: 'Calculamos com base no seu perfil: você paga ~R$72/mês em tarifas no seu banco atual. Aqui, tarifa zero + rendimento automático de 100% do CDI. Portabilidade em 3 cliques, sem ir a agência.',
      cta: 'Ver Minha Economia',
      reasoning: 'Perfil pragmático decide por números concretos. Personalizamos com cálculo de economia real, comparação direta com banco atual, e CTA que promete resultado tangível.',
      highlights: ['Tom: Direto ao ponto', 'CTA: Resultado concreto', 'Economia calculada', 'Zero burocracia'],
    },

    channels: {
      onboarding: 'Tela de portabilidade com cálculo de economia personalizado e 3 cliques para migrar',
      push: '"Felipe, você economizaria R$72/mês. Portabilidade leva 3 min."',
      email: 'Email com infográfico: "Seu banco vs. nós — economia anual de R$847"',
      whatsapp: '"Felipe, fiz o cálculo da sua economia. R$847/ano. Quer que eu inicie a portabilidade agora?"',
    },

    conversionMetrics: {
      standardRate: 3.8,
      adaptedRate: 12.3,
      lift: 224,
    },
  },
];
