// Recovery message templates: generic vs Fluence-personalized (PT-BR)

export const GENERIC_RECOVERY = {
  subject: 'Você esqueceu algo no carrinho!',
  headline: 'Volte e finalize sua compra',
  body: 'Os itens no seu carrinho estão te esperando. Não perca!',
  cta: 'Ver Carrinho',
  tone: 'urgente',
  timing: '2h depois',
  expectedRecovery: 0.03, // 3%
}

export const PERSONALIZED_RECOVERY = {
  lucas: {
    subject: 'Lucas, o Sony WH-1000XM5 atingiu o menor preço',
    headline: 'Garantia de menor preço + frete grátis',
    body: 'Sabemos que você pesquisou bastante. O WH-1000XM5 está no menor preço dos últimos 30 dias. Adicionamos frete grátis e garantia de preço por 15 dias — se baixar, devolvemos a diferença.',
    cta: 'Ver Oferta com Garantia de Preço',
    tone: 'informativo',
    timing: '4h depois (horário de pesquisa do Lucas)',
    badges: ['Menor preço 30 dias', 'Garantia de preço 15d', 'Frete grátis'],
    expectedRecovery: 0.22, // 22%
    whyItWorks: 'Ativa a confiança do pesquisador eliminando o risco de preço',
    traitUsed: 'price_sensitivity: 0.82',
  },
  ana: {
    subject: 'Ana, suas escolhas estão fazendo sucesso ✨',
    headline: '3 pessoas compraram o Good Girl na última hora',
    body: 'O perfume que você escolheu é um dos mais vendidos da semana. Já garantiu o seu?',
    cta: 'Garantir Agora',
    tone: 'social',
    timing: '30min depois (janela de impulso)',
    badges: ['Trending', '12 vendidos hoje', 'Últimas unidades'],
    expectedRecovery: 0.18, // 18% (she already bought, but this is the template)
    whyItWorks: 'Ativa o FOMO e validação social — gatilhos do comprador impulsivo',
    traitUsed: 'impulse_score: 0.88',
  },
  carlos: {
    subject: 'Carlos, parcelamento especial para o MacBook Air M3',
    headline: '18x sem juros — exclusivo para você',
    body: 'Sabemos que decisões assim levam tempo. Por isso, preparamos uma condição especial: 18x de R$518,22 sem juros no MacBook Air M3, válida por 48h.',
    cta: 'Simular Parcelamento',
    tone: 'consultivo',
    timing: '24h depois (ritmo de deliberação do Carlos)',
    badges: ['18x sem juros', 'Válido 48h', 'Apple Autorizada'],
    expectedRecovery: 0.25, // 25%
    whyItWorks: 'Remove a barreira financeira com parcelamento e oferece tempo limitado que respeita o ritmo deliberado',
    traitUsed: 'brand_loyalty: 0.91',
  },
}

export const RECOVERY_COMPARISON = {
  generic: {
    sent: 1000,
    opened: 180,
    clicked: 54,
    recovered: 30,
    rate: 0.03,
    revenue: 'R$12.450',
  },
  fluence: {
    sent: 1000,
    opened: 420,
    clicked: 268,
    recovered: 220,
    rate: 0.22,
    revenue: 'R$91.300',
  },
}
