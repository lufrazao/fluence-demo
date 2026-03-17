// Three shopper personas for the ShopFlow demo
export const PERSONAS = {
  lucas: {
    id: 'lucas',
    name: 'Lucas',
    age: 28,
    avatar: '👨‍💻',
    title: 'Pesquisador Sensível a Preço',
    subtitle: 'Desenvolvedor, São Paulo',
    color: '#3B82F6', // blue
    description: 'Compara preços obsessivamente. Lê todas as reviews. Abandona o carrinho quando o total ultrapassa R$500.',
    traits: {
      price_sensitivity: { value: 0.82, label: 'Sensibilidade a Preço' },
      decision_style: { value: 'researcher', label: 'Estilo: Pesquisador' },
      cart_abandonment_rate: { value: 0.65, label: 'Taxa de Abandono' },
      spending_threshold: { value: 500, label: 'Limite de Gasto: R$500' },
    },
    archetype: 'Pesquisador Cauteloso',
    recoveryKey: 'price_guarantee', // what converts him
    stats: {
      sessions: 14,
      avgTime: '18min',
      cartAbandons: 6,
      totalAbandoned: 'R$4.230',
    },
  },
  ana: {
    id: 'ana',
    name: 'Ana',
    age: 34,
    avatar: '👩‍🎨',
    title: 'Compradora Impulsiva',
    subtitle: 'Designer, Rio de Janeiro',
    color: '#EC4899', // pink
    description: 'Compra por emoção. Responde a urgência e escassez. Decisões rápidas, mas alto índice de devolução.',
    traits: {
      price_sensitivity: { value: 0.25, label: 'Sensibilidade a Preço' },
      decision_style: { value: 'impulse', label: 'Estilo: Impulsivo' },
      cart_abandonment_rate: { value: 0.15, label: 'Taxa de Abandono' },
      impulse_score: { value: 0.88, label: 'Score de Impulso' },
    },
    archetype: 'Compradora Emocional',
    recoveryKey: 'social_proof',
    stats: {
      sessions: 31,
      avgTime: '4min',
      cartAbandons: 2,
      totalAbandoned: 'R$890',
    },
  },
  carlos: {
    id: 'carlos',
    name: 'Carlos',
    age: 42,
    avatar: '👨‍💼',
    title: 'Deliberador Leal à Marca',
    subtitle: 'Gerente, Curitiba',
    color: '#10B981', // green
    description: 'Confia em marcas conhecidas. Processo de decisão lento e metódico. Prefere parcelamento.',
    traits: {
      price_sensitivity: { value: 0.45, label: 'Sensibilidade a Preço' },
      decision_style: { value: 'deliberate', label: 'Estilo: Deliberado' },
      cart_abandonment_rate: { value: 0.40, label: 'Taxa de Abandono' },
      brand_loyalty: { value: 0.91, label: 'Lealdade à Marca' },
    },
    archetype: 'Comprador Metódico',
    recoveryKey: 'installment_offer',
    stats: {
      sessions: 8,
      avgTime: '25min',
      cartAbandons: 3,
      totalAbandoned: 'R$7.450',
    },
  },
}

export const PERSONA_ORDER = ['lucas', 'ana', 'carlos']

export function getPersona(id) {
  return PERSONAS[id]
}
