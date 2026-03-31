import React, { useState, useRef, useEffect } from 'react';
import type { AppEvent } from '../../../types/simulation';
import type { Product } from './ShopHome';

const DESCRIPTIONS: Record<number, string> = {
  1: 'Cancelamento de ruido lider do mercado. 30h de bateria. Driver de 30mm com audio Hi-Res.',
  2: 'Chip M3, 8GB RAM, 256GB SSD. Tela Liquid Retina 13.6". Fino, potente, silencioso.',
  3: 'Classico atemporal com amortecimento Air Max visivel. Conforto o dia todo.',
  4: 'Sistema centrifusion Vertuo. Cafe de qualidade de barista em casa. 4 tamanhos.',
  5: 'Monitoramento de saude, GPS, resistente a agua. Integracao perfeita com iPhone.',
  6: 'Tela antirreflexo de 6.8". A prova d\'agua. 16GB. Semanas de bateria.',
  7: 'Eau de Parfum 80ml. Notas de jasmim, cacau e tonka. Sofisticado e feminino.',
  8: 'Compartimento acolchoado para notebook 15.6". Resistente a agua. Alca ergonomica.',
  9: 'Caixa Bluetooth portatil. IP67 a prova d\'agua. 12h de bateria. Som 360°.',
  10: 'Design aviador iconico. Lentes polarizadas. Protecao UV400.',
  11: 'Aspirador vertical sem fio. Deteccao de poeira a laser. 60min de uso.',
  12: 'Chip M2. Tela Liquid Retina 11". Suporte a Apple Pencil e teclado.',
};

const COMPARISON: Record<number, { label: string; product: string; others: string }[]> = {
  1: [
    { label: 'Cancelamento', product: '★★★★★', others: '★★★☆☆' },
    { label: 'Bateria', product: '30h', others: '20h media' },
    { label: 'Qualidade', product: '★★★★★', others: '★★★★☆' },
  ],
  2: [
    { label: 'Chip', product: 'M3', others: 'i5 media' },
    { label: 'Bateria', product: '18h', others: '10h media' },
    { label: 'Peso', product: '1.24kg', others: '1.6kg media' },
  ],
  3: [
    { label: 'Amortecimento', product: '★★★★★', others: '★★★☆☆' },
    { label: 'Durabilidade', product: '★★★★★', others: '★★★★☆' },
    { label: 'Conforto', product: '★★★★☆', others: '★★★☆☆' },
  ],
  5: [
    { label: 'Sensores', product: '6 sensores', others: '3 media' },
    { label: 'Resist. Agua', product: '50m', others: '30m media' },
    { label: 'Bateria', product: '36h', others: '24h media' },
  ],
};

const REVIEWS: Record<number | 'default', { name: string; stars: number; text: string; time: string }[]> = {
  1: [
    { name: 'Maria S.', stars: 5, text: 'Cancelamento de ruido perfeito! Uso no metro e nao ouco nada.', time: '2 dias atras' },
    { name: 'Lucas R.', stars: 4, text: 'Qualidade excepcional. Preco um pouco alto.', time: '1 semana atras' },
  ],
  2: [
    { name: 'Ana P.', stars: 5, text: 'M3 e insanamente rapido. Bateria dura o dia todo.', time: '3 dias atras' },
    { name: 'Carlos M.', stars: 5, text: 'Melhor notebook que ja tive. Vale cada centavo.', time: '1 semana atras' },
  ],
  default: [
    { name: 'Julia F.', stars: 5, text: 'Produto excelente! Superou minhas expectativas.', time: '2 dias atras' },
    { name: 'Pedro H.', stars: 4, text: 'Otima qualidade. Super recomendo.', time: '1 semana atras' },
  ],
};

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

interface ProductScreenProps {
  product: Product | null;
  onNavigate: (screen: string, data?: Product) => void;
  onEvent: (event: AppEvent) => void;
  onAddToCart: (product: Product) => void;
}

const ProductScreen: React.FC<ProductScreenProps> = ({ product, onNavigate, onEvent, onAddToCart }) => {
  const [hasReadReviews, setHasReadReviews] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);
  const [hasPriceAlert, setHasPriceAlert] = useState(false);
  const scrollRef = useRef(false);
  const screenEnterTime = useRef(Date.now());

  useEffect(() => {
    screenEnterTime.current = Date.now();
    setHasReadReviews(false);
    setHasCompared(false);
    setHasPriceAlert(false);
    scrollRef.current = false;
    return () => {
      const elapsed = Math.round((Date.now() - screenEnterTime.current) / 1000);
      if (elapsed > 3) {
        onEvent({
          type: 'screen_time',
          label: `Tempo no produto: ${elapsed}s`,
          detail: `product — ${elapsed}s`,
          time: now(),
        });
      }
    };
  }, [product?.id]);

  if (!product) return null;

  const desc = DESCRIPTIONS[product.id] || 'Produto premium com recursos avancados.';
  const comparison = COMPARISON[product.id] || COMPARISON[1];
  const reviews = REVIEWS[product.id] || REVIEWS.default;

  const handleReadReviews = () => {
    setHasReadReviews(true);
    onEvent({
      type: 'review_read',
      label: `Leu avaliacoes: ${product.name}`,
      detail: `${product.reviews} avaliacoes — produto`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    });
  };

  const handleCompare = () => {
    setHasCompared(true);
    onEvent({
      type: 'comparison_view',
      label: `Comparou: ${product.name}`,
      detail: `vs alternativas — produto`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    });
  };

  const handlePriceAlert = () => {
    setHasPriceAlert(true);
    onEvent({
      type: 'price_alert_set',
      label: `Alerta de preco: ${product.name}`,
      detail: `R$${product.price} — produto`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    });
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleBuyNow = () => {
    onEvent({
      type: 'buy_now',
      label: `Comprar agora: ${product.name}`,
      detail: `R$${product.price} — compra instantanea`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    });
    onNavigate('checkout');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    if (pct >= 75 && !scrollRef.current) {
      scrollRef.current = true;
      onEvent({
        type: 'scroll_depth',
        label: `Rolou produto: ${pct}%`,
        detail: `product — ${pct}%`,
        time: now(),
      });
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white pb-20" onScroll={handleScroll} style={{ overflowY: 'auto' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 pt-2 pb-3 flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="text-white text-lg">←</button>
        <h1 className="text-white font-semibold text-sm truncate flex-1">{product.name}</h1>
        <button onClick={() => onNavigate('cart')} className="text-white text-lg">🛒</button>
      </div>

      {/* Product image */}
      <div className={`${product.color} mx-4 mt-3 rounded-2xl h-40 flex items-center justify-center relative`}>
        <span className="text-6xl">{product.emoji}</span>
        {product.badge && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-[8px] px-2 py-1 rounded-full font-bold shadow">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="px-4 pt-3">
        <h2 className="text-base font-bold text-gray-900">{product.name}</h2>
        <div className="flex items-center gap-1 mt-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
          ))}
          <span className="text-xs text-gray-500 ml-1">{product.rating} ({product.reviews.toLocaleString()} avaliacoes)</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through mr-2">R${product.originalPrice.toLocaleString()}</span>
          )}
          <span className="text-xl font-bold text-gray-900">R${product.price.toLocaleString()}</span>
          <p className="text-[9px] text-emerald-600 font-medium mt-0.5">
            ou {product.installment} sem juros
          </p>
        </div>

        <p className="text-xs text-gray-600 mt-2 leading-relaxed">{desc}</p>

        {/* Read Reviews */}
        <button
          onClick={handleReadReviews}
          className={`w-full mt-3 rounded-xl p-2.5 text-left border transition-all ${
            hasReadReviews ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200 active:bg-amber-50'
          }`}
        >
          <p className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
            📖 {hasReadReviews ? 'Avaliacoes lidas' : 'Ler Avaliacoes'}
            <span className="ml-auto text-[8px] text-gray-400">{product.reviews.toLocaleString()} avaliacoes</span>
          </p>
          {hasReadReviews && (
            <div className="mt-2 space-y-1.5">
              {reviews.map((review, i) => (
                <div key={i} className="bg-white rounded-lg p-2 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-semibold text-gray-700">{review.name}</span>
                    <span className="text-[8px] text-gray-400">{review.time}</span>
                  </div>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }, (_, j) => (
                      <span key={j} className={`text-[8px] ${j < review.stars ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                    <span className="text-[7px] text-emerald-600 ml-1 font-medium">✓ Verificado</span>
                  </div>
                  <p className="text-[9px] text-gray-600 mt-1">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </button>

        {/* Compare */}
        <button
          onClick={handleCompare}
          className={`w-full mt-2 rounded-xl p-2.5 text-left border transition-all ${
            hasCompared ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 active:bg-blue-50'
          }`}
        >
          <p className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
            📊 {hasCompared ? 'Comparacao' : 'Comparar com Similares'}
          </p>
          {hasCompared && comparison.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {comparison.map((row, i) => (
                <div key={i} className="grid grid-cols-3 text-[9px] items-center">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="text-center font-semibold text-orange-600">{row.product}</span>
                  <span className="text-center text-gray-400">{row.others}</span>
                </div>
              ))}
              <div className="grid grid-cols-3 text-[8px] text-gray-400 border-t border-gray-200 pt-1">
                <span></span>
                <span className="text-center font-medium text-orange-500">Este produto</span>
                <span className="text-center">Media outros</span>
              </div>
            </div>
          )}
        </button>

        {/* Price Alert */}
        <button
          onClick={handlePriceAlert}
          className={`w-full mt-2 rounded-xl p-2.5 text-left border transition-all ${
            hasPriceAlert ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 active:bg-green-50'
          }`}
        >
          <p className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
            🔔 {hasPriceAlert ? 'Alerta de preco ativo!' : 'Ativar Alerta de Preco'}
          </p>
          {hasPriceAlert && (
            <p className="text-[9px] text-green-600 mt-1">
              Voce sera notificado se o preco cair abaixo de R${product.price.toLocaleString()}
            </p>
          )}
        </button>
      </div>

      {/* Action buttons */}
      <div className="px-4 mt-4 space-y-2">
        <button
          onClick={handleBuyNow}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-transform"
        >
          Comprar Agora — R${product.price.toLocaleString()}
        </button>
        <button
          onClick={handleAddToCart}
          className="w-full bg-white text-orange-500 text-sm font-semibold py-2.5 rounded-xl border-2 border-orange-200 active:scale-[0.98] transition-transform"
        >
          🛒 Adicionar ao Carrinho
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 px-4 mt-3 pb-4">
        <span className="text-[8px] text-gray-400">🔒 Compra Segura</span>
        <span className="text-[8px] text-gray-400">🔄 Devolucao 30 dias</span>
        <span className="text-[8px] text-gray-400">🚚 Frete gratis</span>
      </div>
    </div>
  );
};

export default ProductScreen;
