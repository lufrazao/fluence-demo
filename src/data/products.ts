export interface FinancialProduct {
  id: string;
  name: string;
  category: 'credito' | 'investimento' | 'seguro' | 'conta';
  description: string;
  highlights: string[];
}

export const products: FinancialProduct[] = [
  {
    id: 'credito_pessoal',
    name: 'Crédito Pessoal',
    category: 'credito',
    description: 'Crédito com taxas a partir de 1,49% a.m. e aprovação em minutos.',
    highlights: ['Aprovação digital', 'Sem garantia', 'Até 48x', 'CET transparente'],
  },
  {
    id: 'conta_premium',
    name: 'Conta Digital Premium',
    category: 'conta',
    description: 'Conta sem tarifas com rendimento automático de 100% do CDI.',
    highlights: ['Tarifa zero', 'Rendimento automático', 'Cartão internacional', 'Cashback'],
  },
  {
    id: 'cdb_seguro',
    name: 'CDB Seguro',
    category: 'investimento',
    description: 'Investimento de renda fixa com proteção do FGC e liquidez diária.',
    highlights: ['Protegido pelo FGC', 'A partir de R$50', 'Liquidez diária', '110% do CDI'],
  },
  {
    id: 'seguro_vida',
    name: 'Seguro de Vida',
    category: 'seguro',
    description: 'Proteção financeira para você e sua família com coberturas flexíveis.',
    highlights: ['A partir de R$19/mês', 'Sem carência', 'Cobertura personalizável', 'Assistência 24h'],
  },
];
