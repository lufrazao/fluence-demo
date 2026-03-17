// Calculates real-time behavioral traits from accumulated events
// Mirrors the backend extractors: price_sensitivity, shopping_style, cart_behavior, product_affinity

export function calculateProfile(events) {
  const profile = {
    traits: {},
    episodes: [],
    confidence: 0,
    eventCount: events.length,
  }

  if (events.length === 0) return profile

  // Accumulate trait points from events
  const points = {}
  for (const event of events) {
    if (event.traits) {
      for (const [key, val] of Object.entries(event.traits)) {
        points[key] = (points[key] || 0) + val
      }
    }
  }

  // Price sensitivity (0-1)
  const priceSignals = (points.price_sensitive || 0)
  const maxPriceSignals = 15
  const priceSensitivity = Math.min(priceSignals / maxPriceSignals, 1)
  if (priceSignals > 0) {
    profile.traits.price_sensitivity = {
      value: priceSensitivity,
      confidence: Math.min(0.5 + priceSignals * 0.05, 0.95),
      label: 'Sensibilidade a Preço',
      color: '#EF4444',
    }
  }

  // Decision style
  const analyticalPts = points.analytical || 0
  const impulsePts = points.impulse || 0
  const deliberatePts = points.deliberate || 0
  const maxStyle = Math.max(analyticalPts, impulsePts, deliberatePts)

  if (maxStyle > 0) {
    let style, label, color
    if (analyticalPts >= impulsePts && analyticalPts >= deliberatePts) {
      style = 'researcher'
      label = 'Estilo: Pesquisador'
      color = '#3B82F6'
    } else if (impulsePts > analyticalPts && impulsePts >= deliberatePts) {
      style = 'impulse'
      label = 'Estilo: Impulsivo'
      color = '#EC4899'
    } else {
      style = 'deliberate'
      label = 'Estilo: Deliberado'
      color = '#10B981'
    }
    profile.traits.decision_style = {
      value: style,
      confidence: Math.min(0.4 + maxStyle * 0.04, 0.95),
      label,
      color,
    }
  }

  // Abandonment risk
  const abandonPts = points.abandonment || 0
  if (abandonPts > 0) {
    profile.traits.abandonment_risk = {
      value: Math.min(abandonPts / 8, 1),
      confidence: Math.min(0.6 + abandonPts * 0.05, 0.95),
      label: 'Risco de Abandono',
      color: '#F59E0B',
    }
  }

  // Indecision
  const indecisivePts = points.indecisive || 0
  if (indecisivePts > 0) {
    profile.traits.indecision = {
      value: Math.min(indecisivePts / 6, 1),
      confidence: Math.min(0.5 + indecisivePts * 0.06, 0.95),
      label: 'Indecisão',
      color: '#8B5CF6',
    }
  }

  // Brand loyalty
  const brandPts = points.brand_loyal || 0
  if (brandPts > 0) {
    profile.traits.brand_loyalty = {
      value: Math.min(brandPts / 8, 1),
      confidence: Math.min(0.5 + brandPts * 0.05, 0.95),
      label: 'Lealdade à Marca',
      color: '#10B981',
    }
  }

  // Impulse score
  if (impulsePts > 0) {
    profile.traits.impulse_score = {
      value: Math.min(impulsePts / 15, 1),
      confidence: Math.min(0.4 + impulsePts * 0.04, 0.95),
      label: 'Score de Impulso',
      color: '#EC4899',
    }
  }

  // Episode detection
  const hasAbandonment = events.some(e => e.type === 'checkout_abandon')
  const hasPurchase = events.some(e => e.type === 'purchase_complete')
  const reviewReads = events.filter(e => e.type === 'review_read').length
  const comparisons = events.filter(e => e.type === 'comparison_view').length

  if (hasAbandonment) {
    const abandonEvent = events.find(e => e.type === 'checkout_abandon')
    profile.episodes.push({
      type: 'cart_abandonment',
      significance: abandonEvent?.cartValue > 2000 ? 0.9 : 0.7,
      detail: `Abandono de R$${abandonEvent?.cartValue?.toLocaleString('pt-BR')}`,
    })
  }

  if (hasPurchase) {
    const purchaseEvent = events.find(e => e.type === 'purchase_complete')
    profile.episodes.push({
      type: 'purchase_complete',
      significance: 0.8,
      detail: `Compra de R$${purchaseEvent?.cartValue?.toLocaleString('pt-BR')}`,
    })
  }

  if (reviewReads >= 3) {
    profile.episodes.push({
      type: 'researcher_pattern',
      significance: 0.6,
      detail: `Leu ${reviewReads} avaliações`,
    })
  }

  if (comparisons >= 1) {
    profile.episodes.push({
      type: 'comparison_pattern',
      significance: 0.5,
      detail: `${comparisons} comparação(ões) de produto`,
    })
  }

  // Overall confidence grows with events
  profile.confidence = Math.min(0.3 + events.length * 0.04, 0.95)

  return profile
}

export function getArchetype(profile) {
  const { traits } = profile
  if (!traits.decision_style) return null

  const style = traits.decision_style.value
  const archetypes = {
    researcher: {
      name: 'Pesquisador Cauteloso',
      icon: '🔍',
      description: 'Analisa tudo antes de decidir',
      color: '#3B82F6',
    },
    impulse: {
      name: 'Comprador Emocional',
      icon: '⚡',
      description: 'Decide por emoção e impulso',
      color: '#EC4899',
    },
    deliberate: {
      name: 'Comprador Metódico',
      icon: '🎯',
      description: 'Processo lento e confiável',
      color: '#10B981',
    },
  }
  return archetypes[style] || null
}
