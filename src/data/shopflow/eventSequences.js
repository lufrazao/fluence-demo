// Scripted event sequences for each persona's shopping journey
// Each event has: type, product (id), detail, delay (ms before next), traits contribution

export const LUCAS_JOURNEY = [
  // Session: Lucas researching headphones
  { type: 'page_view', detail: 'Página inicial', delay: 800, screen: 'home' },
  { type: 'search_query', detail: 'Buscou "headphone bluetooth"', delay: 1200, screen: 'home', traits: { analytical: 1 } },
  { type: 'product_view', product: 'headphone-sony-wh1000', detail: 'Visualizou Sony WH-1000XM5', delay: 1500, screen: 'product', traits: { analytical: 2 } },
  { type: 'review_read', product: 'headphone-sony-wh1000', detail: 'Leu 5 avaliações do Sony', delay: 2000, screen: 'product', traits: { analytical: 3, price_sensitive: 1 } },
  { type: 'comparison_view', detail: 'Comparou Sony vs alternativas', delay: 1800, screen: 'product', traits: { analytical: 3, price_sensitive: 2 } },
  { type: 'price_alert_set', product: 'headphone-sony-wh1000', detail: 'Ativou alerta de preço Sony', delay: 1000, screen: 'product', traits: { price_sensitive: 3 } },
  { type: 'product_view', product: 'kindle-paperwhite', detail: 'Visualizou Kindle Paperwhite', delay: 1200, screen: 'product', traits: { analytical: 1 } },
  { type: 'review_read', product: 'kindle-paperwhite', detail: 'Leu reviews do Kindle', delay: 1500, screen: 'product', traits: { analytical: 2 } },
  { type: 'add_to_cart', product: 'headphone-sony-wh1000', detail: 'Adicionou Sony ao carrinho — R$2.299', delay: 1000, screen: 'cart', traits: { price_sensitive: 1 }, cartValue: 2299 },
  { type: 'add_to_cart', product: 'kindle-paperwhite', detail: 'Adicionou Kindle — R$549', delay: 800, screen: 'cart', traits: {}, cartValue: 2848 },
  { type: 'cart_view', detail: 'Revisando carrinho — R$2.848', delay: 1500, screen: 'cart', traits: { price_sensitive: 2 }, cartValue: 2848 },
  { type: 'remove_from_cart', product: 'kindle-paperwhite', detail: 'Removeu Kindle do carrinho', delay: 1200, screen: 'cart', traits: { price_sensitive: 2, indecisive: 2 }, cartValue: 2299 },
  { type: 'begin_checkout', detail: 'Iniciou checkout — R$2.299', delay: 1500, screen: 'checkout', traits: { price_sensitive: 2 }, cartValue: 2299 },
  { type: 'installment_view', detail: 'Consultou parcelamento 12x R$191,58', delay: 1800, screen: 'checkout', traits: { price_sensitive: 3 } },
  { type: 'checkout_abandon', detail: 'ABANDONOU o carrinho no checkout', delay: 2000, screen: 'home', traits: { price_sensitive: 4, abandonment: 5 }, cartValue: 2299, isClimax: true },
]

export const ANA_JOURNEY = [
  // Session: Ana impulse shopping
  { type: 'page_view', detail: 'Página inicial', delay: 600, screen: 'home' },
  { type: 'product_view', product: 'perfume-carolina-herrera', detail: 'Clicou Good Girl imediatamente', delay: 800, screen: 'product', traits: { impulse: 2 } },
  { type: 'add_to_cart', product: 'perfume-carolina-herrera', detail: 'Adicionou Good Girl — R$459', delay: 600, screen: 'cart', traits: { impulse: 3 }, cartValue: 459 },
  { type: 'product_view', product: 'tenis-nike-air-max', detail: 'Viu Nike Air Max 90', delay: 700, screen: 'product', traits: { impulse: 2 } },
  { type: 'add_to_cart', product: 'tenis-nike-air-max', detail: 'Adicionou Nike — R$699,90', delay: 500, screen: 'cart', traits: { impulse: 3 }, cartValue: 1158.9 },
  { type: 'product_view', product: 'smartwatch-apple-watch', detail: 'Viu Apple Watch SE', delay: 600, screen: 'product', traits: { impulse: 2 } },
  { type: 'add_to_cart', product: 'smartwatch-apple-watch', detail: 'Adicionou Watch — R$2.199', delay: 500, screen: 'cart', traits: { impulse: 4 }, cartValue: 3357.9 },
  { type: 'cart_view', detail: 'Revisando carrinho — R$3.357,90', delay: 800, screen: 'cart', traits: {}, cartValue: 3357.9 },
  { type: 'begin_checkout', detail: 'Checkout rápido — R$3.357,90', delay: 600, screen: 'checkout', traits: { impulse: 2 }, cartValue: 3357.9 },
  { type: 'purchase_complete', detail: 'COMPRA CONCLUÍDA — R$3.357,90', delay: 1000, screen: 'home', traits: { impulse: 5 }, cartValue: 3357.9, isClimax: true },
]

export const CARLOS_JOURNEY = [
  // Session: Carlos deliberating on MacBook
  { type: 'page_view', detail: 'Página inicial', delay: 1000, screen: 'home' },
  { type: 'search_query', detail: 'Buscou "macbook air"', delay: 1500, screen: 'home', traits: { deliberate: 1, brand_loyal: 2 } },
  { type: 'product_view', product: 'notebook-macbook-air', detail: 'Visualizou MacBook Air M3', delay: 2000, screen: 'product', traits: { deliberate: 2, brand_loyal: 2 } },
  { type: 'review_read', product: 'notebook-macbook-air', detail: 'Leu 12 avaliações detalhadas', delay: 2500, screen: 'product', traits: { deliberate: 3, brand_loyal: 1 } },
  { type: 'comparison_view', detail: 'Comparou MacBook vs Dell XPS', delay: 2000, screen: 'product', traits: { deliberate: 3 } },
  { type: 'product_view', product: 'mochila-samsonite', detail: 'Visualizou Samsonite Guard IT', delay: 1500, screen: 'product', traits: { deliberate: 1 } },
  { type: 'add_to_cart', product: 'notebook-macbook-air', detail: 'Adicionou MacBook — R$8.999', delay: 1800, screen: 'cart', traits: { deliberate: 1, brand_loyal: 2 }, cartValue: 8999 },
  { type: 'add_to_cart', product: 'mochila-samsonite', detail: 'Adicionou Mochila — R$329', delay: 1000, screen: 'cart', traits: {}, cartValue: 9328 },
  { type: 'cart_view', detail: 'Revisando carrinho — R$9.328', delay: 2000, screen: 'cart', traits: { deliberate: 2, price_sensitive: 2 }, cartValue: 9328 },
  { type: 'installment_view', detail: 'Calculou parcelamento 12x R$777,33', delay: 2500, screen: 'checkout', traits: { deliberate: 2, price_sensitive: 3 } },
  { type: 'begin_checkout', detail: 'Iniciou checkout — R$9.328', delay: 2000, screen: 'checkout', traits: { deliberate: 1 }, cartValue: 9328 },
  { type: 'checkout_abandon', detail: 'Saiu para "pensar melhor"', delay: 2500, screen: 'home', traits: { deliberate: 4, abandonment: 4 }, cartValue: 9328, isClimax: true },
]

export const JOURNEYS = {
  lucas: LUCAS_JOURNEY,
  ana: ANA_JOURNEY,
  carlos: CARLOS_JOURNEY,
}
