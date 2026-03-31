import type { MetricDef, PatternDef, TraitDef, SignalRule, MemoryData, ApiOutputDef, AppEvent } from '../types/simulation';

export const ECOMMERCE_METRICS: MetricDef[] = [
  { label: 'Recuperacao de Carrinho', before: '3%', after: '22%', delta: '+633%', unlockedBy: 'price_anxious' },
  { label: 'Ticket Medio', before: 'R$415', after: 'R$580', delta: '+40%', unlockedBy: 'analytical' },
  { label: 'Taxa de Devolucao', before: '18%', after: '11%', delta: '-39%', unlockedBy: 'impulse' },
  { label: 'Recompra', before: '22%', after: '38%', delta: '+73%', unlockedBy: 'indecisive' },
];

export const ECOMMERCE_PATTERNS: Record<string, PatternDef> = {
  analytical: { icon: '\u{1F50D}', name: 'Pesquisador Analitico', description: 'Le avaliacoes, compara especificacoes antes de decidir' },
  indecisive: { icon: '\u{1F504}', name: 'Carrinho Instavel', description: 'Adiciona e remove itens varias vezes' },
  price_anxious: { icon: '\u{1F4B8}', name: 'Ansiedade de Preco', description: 'Abandona carrinho de alto valor no checkout' },
  impulse: { icon: '\u{26A1}', name: 'Comprador Impulsivo', description: 'Decisoes rapidas, pula pesquisa, usa Comprar Agora' },
  product_interest: { icon: '\u{1F3AF}', name: 'Perfil de Interesse', description: 'Padroes de navegacao revelam preferencias de categoria e preco' },
};

export const ECOMMERCE_TRAITS: Record<string, TraitDef> = {
  analytical: { label: 'Estilo de Decisao: Pesquisador', maxPoints: 12 },
  price_sensitive: { label: 'Sensibilidade a Preco', maxPoints: 12 },
  indecisive: { label: 'Indecisao de Compra', maxPoints: 8 },
  quality_driven: { label: 'Prioridade em Qualidade', maxPoints: 10 },
  impulse: { label: 'Compra por Impulso', maxPoints: 10 },
};

export const ECOMMERCE_SIGNALS: SignalRule[] = [
  // Product browsing — builds analytical + quality curiosity + product interest profile
  { match: { type: 'product_click' }, traits: { analytical: 1.5, quality_driven: 0.5 }, patterns: { analytical: 1, product_interest: 1.5 } },

  // Deep research actions
  { match: { type: 'review_read' }, traits: { analytical: 2.5, quality_driven: 2 }, patterns: { analytical: 2, product_interest: 1.5 } },
  { match: { type: 'comparison_view' }, traits: { analytical: 3, price_sensitive: 2 }, patterns: { analytical: 2.5, product_interest: 1 } },
  { match: { type: 'price_alert_set' }, traits: { price_sensitive: 3 }, patterns: { price_anxious: 2, product_interest: 1 } },

  // Catalog exploration — search intent reveals behavioral signals
  { match: { type: 'search_query' }, traits: { analytical: 1 }, patterns: { analytical: 0.5, product_interest: 1 } },
  // Price-focused search: "barato", "desconto", "preco", "frete gratis"
  { match: { type: 'search_query', detailIncludes: 'busca por preco' }, traits: { price_sensitive: 3 }, patterns: { price_anxious: 2 } },
  // Quality-focused search: "melhor", "premium", "qualidade", "avaliacao"
  { match: { type: 'search_query', detailIncludes: 'busca por qualidade' }, traits: { quality_driven: 3 }, patterns: { analytical: 1.5 } },
  // Brand/product-specific search: knows exactly what they want
  { match: { type: 'search_query', detailIncludes: 'busca especifica' }, traits: { quality_driven: 2.5, analytical: 1 }, patterns: { analytical: 1.5, product_interest: 2 } },
  // Category search: exploring a segment
  { match: { type: 'search_query', detailIncludes: 'busca por categoria' }, traits: { analytical: 1.5 }, patterns: { product_interest: 2 } },
  // Impulse search: "rapido", "agora", "pronta entrega"
  { match: { type: 'search_query', detailIncludes: 'busca impulsiva' }, traits: { impulse: 3 }, patterns: { impulse: 2.5 } },
  // Generic/broad search: undecided, exploring broadly
  { match: { type: 'search_query', detailIncludes: 'busca generica' }, traits: { indecisive: 1.5 }, patterns: { indecisive: 1 } },
  { match: { type: 'search_query', detailIncludes: 'busca exploratoria' }, traits: { indecisive: 1 }, patterns: { product_interest: 1 } },
  // Dead-end search: frustration/indecision signal
  { match: { type: 'search_query', detailIncludes: 'busca sem resultado' }, traits: { indecisive: 2 }, patterns: { indecisive: 1.5 } },
  { match: { type: 'category_filter' }, traits: { analytical: 1.5, price_sensitive: 0.5 }, patterns: { analytical: 1, product_interest: 1.5 } },

  // Cart interactions
  { match: { type: 'add_to_cart' }, traits: { quality_driven: 2 }, patterns: { product_interest: 2 } },
  { match: { type: 'remove_from_cart' }, traits: { indecisive: 3 }, patterns: { indecisive: 3 } },

  // Impulse — only buy_now triggers
  { match: { type: 'buy_now' }, traits: { impulse: 4 }, patterns: { impulse: 4 } },

  // Cross-sell
  { match: { type: 'cross_sell_click' }, traits: { quality_driven: 1.5, price_sensitive: 1 }, patterns: { product_interest: 1 } },

  // Checkout flow
  { match: { type: 'begin_checkout' }, traits: { price_sensitive: 2 }, patterns: { price_anxious: 1.5 } },
  { match: { type: 'installment_view' }, traits: { price_sensitive: 2.5 }, patterns: { price_anxious: 2 } },
  { match: { type: 'checkout_abandon' }, traits: { price_sensitive: 3, indecisive: 2 }, patterns: { price_anxious: 4, indecisive: 2 } },
  { match: { type: 'purchase_complete' }, traits: { quality_driven: 2 }, patterns: {} },

  // Screen navigation — product views build product interest
  { match: { type: 'screen_view', detailIncludes: 'product' }, traits: { analytical: 0.5 }, patterns: { analytical: 0.5, product_interest: 1 } },
  { match: { type: 'screen_view', detailIncludes: 'cart' }, traits: { price_sensitive: 0.5 }, patterns: { price_anxious: 0.5 } },
  { match: { type: 'screen_view', detailIncludes: 'checkout' }, traits: { price_sensitive: 1 }, patterns: { price_anxious: 1 } },

  // Screen time
  { match: { type: 'screen_time', detailIncludes: 'product' }, traits: { analytical: 1, quality_driven: 1 }, patterns: { analytical: 0.5, product_interest: 0.5 } },
  { match: { type: 'screen_time', detailIncludes: 'checkout' }, traits: { price_sensitive: 1 }, patterns: { price_anxious: 0.5 } },

  // Scroll depth
  { match: { type: 'scroll_depth' }, traits: { analytical: 0.5, quality_driven: 0.5 }, patterns: { analytical: 0.5 } },
];

export const ECOMMERCE_MEMORY: MemoryData = {
  userId: 'lucas_demo',
  totalSessions: 14,
  firstSeen: '10 Jan, 2025',
  lastSeen: '3 horas atras',
  sessionHistory: [
    { date: '3 horas atras', summary: 'Comparou 3 fones, leu 8 avaliacoes, abandonou carrinho de R$2.299', duration: '18m 30s' },
    { date: 'Ontem', summary: 'Pesquisou "fone bluetooth", viu Sony WH-1000XM5, ativou alerta de preco', duration: '12m 15s' },
    { date: '3 dias atras', summary: 'Adicionou MacBook Air ao carrinho, removeu, adicionou Kindle, removeu', duration: '8m 45s' },
  ],
  persistentTraits: [
    { label: 'Leitura de avaliacoes', detail: 'Le em media 6 avaliacoes por produto', trend: 'consistente', icon: '\u{1F501}' },
    { label: 'Comparacao de precos', detail: '4 comparacoes nas ultimas 3 sessoes', trend: 'crescente', icon: '\u{1F4C8}' },
    { label: 'Abandono no checkout', detail: 'Abandonou 3 carrinhos totalizando R$4.230', trend: 'bloqueio', icon: '\u{1F6AB}' },
  ],
};

const CATALOG_BY_CATEGORY: Record<string, { id: number; name: string; price: number }[]> = {
  Audio: [
    { id: 1, name: 'Sony WH-1000XM5', price: 2299 },
    { id: 9, name: 'JBL Flip 6', price: 599 },
  ],
  Electronics: [
    { id: 2, name: 'MacBook Air M3', price: 8999 },
    { id: 5, name: 'Apple Watch SE', price: 2199 },
    { id: 6, name: 'Kindle Paperwhite', price: 549 },
    { id: 12, name: 'iPad Air M2', price: 5999 },
  ],
  Fashion: [
    { id: 3, name: 'Nike Air Max 90', price: 699 },
    { id: 10, name: 'Ray-Ban Aviator', price: 789 },
  ],
  Home: [
    { id: 4, name: 'Nespresso Vertuo', price: 549 },
    { id: 11, name: 'Dyson V12', price: 3499 },
  ],
  Beauty: [{ id: 7, name: 'Good Girl CH', price: 459 }],
  Accessories: [{ id: 8, name: 'Samsonite Guard IT', price: 329 }],
};

const ALL_CATEGORIES = Object.keys(CATALOG_BY_CATEGORY);

export const ECOMMERCE_API_OUTPUT: ApiOutputDef = {
  userId: 'lucas_demo',
  segment: { name: 'Pesquisador Cauteloso', id: 'price-sensitive-researcher', confidence: 0.91 },
  predictions: [
    {
      pattern: 'price_anxious',
      icon: '\u{26A0}\u{FE0F}',
      label: 'Risco de Abandono',
      getValue: (points: number) => {
        const pct = Math.min(Math.round((points / 10) * 100), 95);
        return pct >= 60 ? `Alto (${pct}%)` : pct >= 35 ? `Medio (${pct}%)` : `Baixo (${pct}%)`;
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const abandons = events.filter(e => e.type === 'checkout_abandon').length;
        const checkoutViews = events.filter(e => e.type === 'begin_checkout').length;
        const installmentViews = events.filter(e => e.type === 'installment_view').length;
        const priceAlerts = events.filter(e => e.type === 'price_alert_set').length;
        const parts: string[] = [];
        if (abandons > 0) parts.push(`abandonou checkout ${abandons}x`);
        if (installmentViews > 0) parts.push(`viu opcoes de parcelamento ${installmentViews}x`);
        if (priceAlerts > 0) parts.push(`ativou ${priceAlerts} alerta(s) de preco`);
        if (checkoutViews > 0 && abandons === 0) parts.push('hesitando no checkout');
        if (parts.length > 0) return parts.join(', ');
        return 'Monitorando sinais de sensibilidade a preco';
      },
      historicalContext: 'Abandonou 3 carrinhos totalizando R$4.230 — ansiedade de preco na etapa final',
    },
    {
      pattern: 'analytical',
      icon: '\u{1F50D}',
      label: 'Estilo de Decisao',
      getValue: (points: number) => {
        if (points >= 8) return 'Altamente Analitico';
        if (points >= 4) return 'Pesquisador';
        return 'Explorador';
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const reviews = events.filter(e => e.type === 'review_read').length;
        const comparisons = events.filter(e => e.type === 'comparison_view').length;
        const productViews = events.filter(e => e.type === 'product_click').length;
        const searchEvents = events.filter(e => e.type === 'search_query' && e.detail && !e.detail.includes('Abriu'));
        const searches = searchEvents.length;
        const parts: string[] = [];
        if (reviews > 0) parts.push(`leu ${reviews} avaliacao(es)`);
        if (comparisons > 0) parts.push(`fez ${comparisons} comparacao(es)`);
        if (productViews > 1) parts.push(`viu ${productViews} produtos`);
        if (searches > 0) {
          // Describe search behavior
          const priceSearches = searchEvents.filter(e => e.detail?.includes('busca por preco')).length;
          const qualitySearches = searchEvents.filter(e => e.detail?.includes('busca por qualidade')).length;
          const brandSearches = searchEvents.filter(e => e.detail?.includes('busca especifica')).length;
          const impulseSearches = searchEvents.filter(e => e.detail?.includes('busca impulsiva')).length;
          const searchParts = [`${searches} busca(s)`];
          if (brandSearches > 0) searchParts.push(`${brandSearches} por marca`);
          if (priceSearches > 0) searchParts.push(`${priceSearches} por preco`);
          if (qualitySearches > 0) searchParts.push(`${qualitySearches} por qualidade`);
          if (impulseSearches > 0) searchParts.push(`${impulseSearches} urgente(s)`);
          parts.push(searchParts.join(', '));
        }
        if (parts.length > 0) return parts.join(', ') + ' — pesquisando antes de decidir';
        return 'Navegando e explorando catalogo';
      },
      historicalContext: 'Le em media 6 avaliacoes por produto — precisa de informacao completa antes de decidir',
    },
    {
      pattern: 'indecisive',
      icon: '\u{1F504}',
      label: 'Estabilidade do Carrinho',
      getValue: (points: number) => {
        if (points >= 6) return 'Muito Instavel';
        if (points >= 3) return 'Instavel';
        return 'Estavel';
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const adds = events.filter(e => e.type === 'add_to_cart').length;
        const removes = events.filter(e => e.type === 'remove_from_cart').length;
        const abandons = events.filter(e => e.type === 'checkout_abandon').length;
        if (removes > 0 && adds > 0) return `${adds} adicoes, ${removes} remocao(es) — ciclo de indecisao`;
        if (abandons > 0) return `Abandonou checkout ${abandons}x apos adicionar itens`;
        if (adds > 0) return `${adds} item(ns) adicionado(s) ao carrinho`;
        return 'Sem interacoes com carrinho ainda';
      },
      historicalContext: '5 ciclos de adicao/remocao nas ultimas 3 sessoes — precisa de reforco de confianca',
    },
    {
      pattern: 'impulse',
      icon: '\u{26A1}',
      label: 'Perfil de Impulso',
      getValue: (points: number) => {
        if (points >= 6) return 'Alto';
        if (points >= 3) return 'Moderado';
        return 'Baixo';
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const buyNows = events.filter(e => e.type === 'buy_now').length;
        const purchases = events.filter(e => e.type === 'purchase_complete').length;
        const parts: string[] = [];
        if (buyNows > 0) parts.push(`${buyNows} compra(s) instantanea(s) via "Comprar Agora"`);
        if (purchases > 0) parts.push(`${purchases} compra(s) finalizada(s)`);
        if (parts.length > 0) return parts.join(', ');
        return 'Avaliando perfil de impulso';
      },
      historicalContext: 'Usa "Comprar Agora" para pular carrinho — decisoes rapidas em produtos visuais',
    },
    {
      pattern: 'product_interest',
      icon: '\u{1F3AF}',
      label: 'Afinidade de Categoria',
      getValue: (points: number) => {
        if (points >= 8) return 'Perfil Forte';
        if (points >= 4) return 'Construindo Perfil';
        return 'Sinal Inicial';
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const categoryCounts: Record<string, number> = {};
        for (const e of events) {
          if (e.category && ['product_click', 'category_filter', 'add_to_cart', 'review_read', 'comparison_view', 'buy_now', 'price_alert_set'].includes(e.type)) {
            categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
          }
          // Search events with matched category count toward affinity
          if (e.category && e.type === 'search_query') {
            categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 0.5;
          }
        }
        const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) return 'Coletando dados de navegacao...';
        const top = sorted.slice(0, 3).map(([cat, count]) => `${cat} (${Math.round(count)})`).join(', ');
        return `Top categorias: ${top}`;
      },
      historicalContext: 'Electronics e Audio sao interesses primarios — 70% do tempo de navegacao nestas categorias',
    },
    {
      pattern: 'product_interest',
      icon: '\u{1F4A1}',
      label: 'Produtos Recomendados',
      getValue: (points: number) => {
        if (points >= 6) return `${Math.min(Math.floor(points / 2), 6)} produtos`;
        if (points >= 3) return `${Math.floor(points / 2)} produtos`;
        return 'Coletando dados';
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const viewedIds = new Set<number>();
        const categoryCounts: Record<string, number> = {};
        const viewedCategories = new Set<string>();
        const searchCategories: Record<string, number> = {};
        for (const e of events) {
          if (e.productId) viewedIds.add(e.productId);
          if (e.category && e.type !== 'search_query') {
            viewedCategories.add(e.category);
            categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
          }
          // Search events carry category of matched products — use for recommendations
          if (e.type === 'search_query' && e.category) {
            searchCategories[e.category] = (searchCategories[e.category] || 0) + 1;
            categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 0.5;
          }
        }
        const hasAnySignal = viewedIds.size > 0 || Object.keys(searchCategories).length > 0;
        if (!hasAnySignal) return 'Navegue ou busque produtos para gerar recomendacoes';

        const parts: string[] = [];
        const topCat = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

        // Recommend unseen products from top category
        if (topCat && CATALOG_BY_CATEGORY[topCat]) {
          const unseen = CATALOG_BY_CATEGORY[topCat].filter(p => !viewedIds.has(p.id));
          if (unseen.length > 0) {
            parts.push(`Em ${topCat}: ${unseen.map(p => p.name).join(', ')}`);
          }
        }

        // If user searched for a category they haven't browsed, suggest discovery
        const searchedNotBrowsed = Object.keys(searchCategories).filter(c => !viewedCategories.has(c));
        if (searchedNotBrowsed.length > 0) {
          const discover = searchedNotBrowsed.slice(0, 2).map(c => {
            const top = CATALOG_BY_CATEGORY[c]?.[0];
            return top ? `${top.name} (${c})` : c;
          });
          parts.push(`Interesse via busca: ${discover.join(', ')}`);
        }

        // Cross-sell from unexplored categories
        const allExplored = new Set([...viewedCategories, ...Object.keys(searchCategories)]);
        const unexplored = ALL_CATEGORIES.filter(c => !allExplored.has(c));
        if (unexplored.length > 0) {
          const crossSell = unexplored.slice(0, 2).map(c => {
            const top = CATALOG_BY_CATEGORY[c][0];
            return `${top.name} (${c})`;
          });
          parts.push(`Cross-sell: ${crossSell.join(', ')}`);
        }
        return parts.join(' | ') || 'Viu todos os produtos da categoria principal';
      },
      historicalContext: 'Recomendacoes cross-category aumentam ticket medio em 35% para este segmento',
    },
    {
      pattern: 'product_interest',
      icon: '\u{1F4B0}',
      label: 'Zona de Conforto de Preco',
      getValue: (points: number) => {
        if (points >= 6) return 'Calibrada';
        if (points >= 3) return 'Emergindo';
        return 'Detectando';
      },
      getCurrentSignal: (events: AppEvent[]) => {
        const prices = events
          .filter(e => e.price && ['product_click', 'add_to_cart', 'buy_now', 'review_read', 'comparison_view', 'search_query'].includes(e.type))
          .map(e => e.price!);
        if (prices.length === 0) return 'Coletando dados de preferencia de preco...';
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
        const cartPrices = events.filter(e => e.price && e.type === 'add_to_cart').map(e => e.price!);
        const cartAvg = cartPrices.length > 0 ? Math.round(cartPrices.reduce((s, p) => s + p, 0) / cartPrices.length) : null;
        let result = `Navegacao: R$${min.toLocaleString()}–R$${max.toLocaleString()} (media R$${avg.toLocaleString()})`;
        if (cartAvg) result += ` | Carrinho media: R$${cartAvg.toLocaleString()}`;
        return result;
      },
      historicalContext: 'Faixa ideal R$500–R$2.500 — evite produtos acima de R$3.000 sem parcelamento',
    },
  ],
  recommendations: [
    { pattern: 'analytical', do: 'Tabelas comparativas, especificacoes detalhadas, avaliacoes verificadas', avoid: 'Descricoes vagas, esconder detalhes do produto' },
    { pattern: 'indecisive', do: 'Opcao "Salvar para depois", lembretes gentis do carrinho', avoid: 'Remover itens sem confirmacao, pressao agressiva' },
    { pattern: 'price_anxious', do: 'Garantia de menor preco, parcelamento visivel, frete gratis, devolucao facil', avoid: 'Taxas surpresa no checkout, sem politica de devolucao' },
    { pattern: 'impulse', do: 'Prova social, badges de tendencia, checkout simplificado', avoid: 'Formularios longos, muitas etapas no checkout' },
    { pattern: 'product_interest', do: 'Recomendacoes personalizadas das categorias favoritas, sugestoes no preco ideal, descoberta cross-category', avoid: 'Generico "voce tambem pode gostar", produtos fora da faixa de preco, categorias irrelevantes' },
  ],
  communicationStyles: {
    analytical: {
      tone: 'Informativo e confiavel',
      contentPriority: ['Comparacoes de produtos', 'Avaliacoes verificadas', 'Certificacoes de qualidade'],
      avoid: ['Gatilhos de impulso', 'Contadores regressivos', 'Sugestoes de baixa qualidade'],
    },
    indecisive: {
      tone: 'Gentil e encorajador',
      contentPriority: ['Salvar para depois', 'Lembretes do carrinho', 'Garantia de satisfacao'],
      avoid: ['Pressao para comprar', 'Remover itens sem aviso', 'Linguagem de escassez'],
    },
    price_anxious: {
      tone: 'Transparente e protetor',
      contentPriority: ['Garantia de menor preco', 'Opcoes de parcelamento', 'Politica de devolucao'],
      avoid: ['Taxas ocultas', 'Checkout sem preco total', 'Surpresa no frete'],
    },
    impulse: {
      tone: 'Energetico e social',
      contentPriority: ['Em alta agora', 'Ultimas unidades', 'Checkout em um clique'],
      avoid: ['Formularios longos', 'Muitas etapas', 'Excesso de informacao'],
    },
  },
};
