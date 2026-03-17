import { useState, useRef, useEffect } from 'react'

const DESCRIPTIONS = {
  1: 'Industry-leading noise cancellation. 30h battery. 30mm driver with Hi-Res audio.',
  2: 'M3 chip, 8GB RAM, 256GB SSD. 13.6" Liquid Retina display. Thin, powerful, silent.',
  3: 'Timeless classic with visible Air Max cushioning. All-day comfort.',
  4: 'Vertuo centrifusion system. Barista-quality coffee at home. 4 cup sizes.',
  5: 'Health monitoring, GPS, water resistant. Seamless iPhone integration.',
  6: 'Anti-glare 6.8" display. Waterproof. 16GB. Weeks of battery life.',
  7: 'Eau de Parfum 80ml. Notes of jasmine, cocoa, and tonka. Sophisticated & feminine.',
  8: 'Padded 15.6" laptop compartment. Water resistant. Ergonomic straps.',
  9: 'Portable Bluetooth speaker. IP67 waterproof. 12h battery. 360° sound.',
  10: 'Iconic aviator design. Polarized lenses. UV400 protection.',
  11: 'Cordless stick vacuum. Laser dust detection. 60min runtime.',
  12: 'M2 chip. 11" Liquid Retina display. Apple Pencil & keyboard support.',
}

const COMPARISON = {
  1: [
    { label: 'Noise Cancel', product: '★★★★★', others: '★★★☆☆' },
    { label: 'Battery', product: '30h', others: '20h avg' },
    { label: 'Sound Quality', product: '★★★★★', others: '★★★★☆' },
  ],
  2: [
    { label: 'Chip', product: 'M3', others: 'i5 avg' },
    { label: 'Battery', product: '18h', others: '10h avg' },
    { label: 'Weight', product: '1.24kg', others: '1.6kg avg' },
  ],
  3: [
    { label: 'Cushioning', product: '★★★★★', others: '★★★☆☆' },
    { label: 'Durability', product: '★★★★★', others: '★★★★☆' },
    { label: 'Comfort', product: '★★★★☆', others: '★★★☆☆' },
  ],
  5: [
    { label: 'Sensors', product: '6 sensors', others: '3 avg' },
    { label: 'Water Resist', product: '50m', others: '30m avg' },
    { label: 'Battery', product: '36h', others: '24h avg' },
  ],
}

const REVIEWS = {
  1: [
    { name: 'Maria S.', stars: 5, text: 'Perfect noise cancellation! I use it on the subway and hear nothing.', time: '2 days ago' },
    { name: 'Lucas R.', stars: 4, text: 'Exceptional quality. Price is a bit high though.', time: '1 week ago' },
  ],
  2: [
    { name: 'Ana P.', stars: 5, text: 'M3 is insanely fast. Battery lasts all day.', time: '3 days ago' },
    { name: 'Carlos M.', stars: 5, text: 'Best laptop I\'ve ever owned. Worth every penny.', time: '1 week ago' },
  ],
  default: [
    { name: 'Julia F.', stars: 5, text: 'Excellent product! Exceeded my expectations.', time: '2 days ago' },
    { name: 'Pedro H.', stars: 4, text: 'Great quality. Highly recommended.', time: '1 week ago' },
  ],
}

export default function ProductScreen({ product, onNavigate, onEvent, fluenceEnabled, onAddToCart }) {
  const [hasReadReviews, setHasReadReviews] = useState(false)
  const [hasCompared, setHasCompared] = useState(false)
  const [hasPriceAlert, setHasPriceAlert] = useState(false)
  const scrollRef = useRef(null)
  const screenEnterTime = useRef(Date.now())

  // Track screen time on unmount
  useEffect(() => {
    screenEnterTime.current = Date.now()
    setHasReadReviews(false)
    setHasCompared(false)
    setHasPriceAlert(false)
    scrollRef.current = false
    return () => {
      const elapsed = Math.round((Date.now() - screenEnterTime.current) / 1000)
      if (elapsed > 3) {
        onEvent({
          type: 'screen_time',
          label: `Time on product: ${elapsed}s`,
          detail: `product — ${elapsed}s`,
          time: now(),
        })
      }
    }
  }, [product?.id])

  if (!product) return null

  const desc = DESCRIPTIONS[product.id] || 'Premium product with advanced features.'
  const comparison = COMPARISON[product.id] || COMPARISON[1]
  const reviews = REVIEWS[product.id] || REVIEWS.default

  const handleReadReviews = () => {
    setHasReadReviews(true)
    onEvent({
      type: 'review_read',
      label: `Read reviews: ${product.name}`,
      detail: `${product.reviews} reviews — product`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    })
  }

  const handleCompare = () => {
    setHasCompared(true)
    onEvent({
      type: 'comparison_view',
      label: `Compared: ${product.name}`,
      detail: `vs alternatives — product`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    })
  }

  const handlePriceAlert = () => {
    setHasPriceAlert(true)
    onEvent({
      type: 'price_alert_set',
      label: `Price alert: ${product.name}`,
      detail: `R$${product.price} — product`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    })
  }

  const handleAddToCart = () => {
    onAddToCart(product)
  }

  const handleBuyNow = () => {
    onEvent({
      type: 'buy_now',
      label: `Buy now: ${product.name}`,
      detail: `R$${product.price} — instant purchase`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    })
    onNavigate('checkout')
  }

  const handleScroll = (e) => {
    const el = e.target
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    if (pct >= 75 && !scrollRef.current) {
      scrollRef.current = true
      onEvent({
        type: 'scroll_depth',
        label: `Scrolled product: ${pct}%`,
        detail: `product — ${pct}%`,
        time: now(),
      })
    }
  }

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
          <span className="text-xs text-gray-500 ml-1">{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through mr-2">R${product.originalPrice.toLocaleString()}</span>
          )}
          <span className="text-xl font-bold text-gray-900">R${product.price.toLocaleString()}</span>
          <p className="text-[9px] text-emerald-600 font-medium mt-0.5">
            or {product.installment} interest-free
          </p>
        </div>

        <p className="text-xs text-gray-600 mt-2 leading-relaxed">{desc}</p>

        {/* Interactive: Read Reviews button */}
        <button
          onClick={handleReadReviews}
          className={`w-full mt-3 rounded-xl p-2.5 text-left border transition-all ${
            hasReadReviews
              ? 'bg-amber-50 border-amber-200'
              : 'bg-gray-50 border-gray-200 active:bg-amber-50'
          }`}
        >
          <p className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
            📖 {hasReadReviews ? 'Reviews read' : 'Read Reviews'}
            <span className="ml-auto text-[8px] text-gray-400">{product.reviews.toLocaleString()} reviews</span>
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
                    <span className="text-[7px] text-emerald-600 ml-1 font-medium">✓ Verified</span>
                  </div>
                  <p className="text-[9px] text-gray-600 mt-1">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </button>

        {/* Interactive: Compare button */}
        <button
          onClick={handleCompare}
          className={`w-full mt-2 rounded-xl p-2.5 text-left border transition-all ${
            hasCompared
              ? 'bg-blue-50 border-blue-200'
              : 'bg-gray-50 border-gray-200 active:bg-blue-50'
          }`}
        >
          <p className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
            📊 {hasCompared ? 'Comparison' : 'Compare with Similar'}
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
                <span className="text-center font-medium text-orange-500">This product</span>
                <span className="text-center">Others avg</span>
              </div>
            </div>
          )}
        </button>

        {/* Interactive: Price Alert button */}
        <button
          onClick={handlePriceAlert}
          className={`w-full mt-2 rounded-xl p-2.5 text-left border transition-all ${
            hasPriceAlert
              ? 'bg-green-50 border-green-200'
              : 'bg-gray-50 border-gray-200 active:bg-green-50'
          }`}
        >
          <p className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
            🔔 {hasPriceAlert ? 'Price alert active!' : 'Set Price Alert'}
          </p>
          {hasPriceAlert && (
            <p className="text-[9px] text-green-600 mt-1">
              You'll be notified if the price drops below R${product.price.toLocaleString()}
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
          Buy Now — R${product.price.toLocaleString()}
        </button>
        <button
          onClick={handleAddToCart}
          className="w-full bg-white text-orange-500 text-sm font-semibold py-2.5 rounded-xl border-2 border-orange-200 active:scale-[0.98] transition-transform"
        >
          🛒 Add to Cart
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 px-4 mt-3 pb-4">
        <span className="text-[8px] text-gray-400">🔒 Secure Purchase</span>
        <span className="text-[8px] text-gray-400">🔄 30-day returns</span>
        <span className="text-[8px] text-gray-400">🚚 Free shipping</span>
      </div>
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}
