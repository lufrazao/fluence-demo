import { useState } from 'react'

const PRODUCTS = [
  { id: 1, name: 'Sony WH-1000XM5', price: 2299, originalPrice: 2799, color: 'bg-gray-700', emoji: '🎧', rating: 4.8, reviews: 2431, category: 'Audio', badge: 'Best Seller', installment: '12x R$191.58' },
  { id: 2, name: 'MacBook Air M3', price: 8999, originalPrice: 10499, color: 'bg-slate-800', emoji: '💻', rating: 4.9, reviews: 1893, category: 'Electronics', badge: 'Premium', installment: '12x R$749.92' },
  { id: 3, name: 'Nike Air Max 90', price: 699.9, originalPrice: 899.9, color: 'bg-red-500', emoji: '👟', rating: 4.6, reviews: 3120, category: 'Fashion', installment: '10x R$69.99' },
  { id: 4, name: 'Nespresso Vertuo', price: 549, originalPrice: 749, color: 'bg-amber-700', emoji: '☕', rating: 4.5, reviews: 876, category: 'Home', badge: 'Deal', installment: '10x R$54.90' },
  { id: 5, name: 'Apple Watch SE', price: 2199, originalPrice: 2499, color: 'bg-blue-600', emoji: '⌚', rating: 4.7, reviews: 1654, category: 'Electronics', installment: '12x R$183.25' },
  { id: 6, name: 'Kindle Paperwhite', price: 549, originalPrice: 649, color: 'bg-emerald-700', emoji: '📱', rating: 4.8, reviews: 4231, category: 'Electronics', badge: 'Favorite', installment: '10x R$54.90' },
  { id: 7, name: 'Good Girl CH', price: 459, originalPrice: 599, color: 'bg-pink-600', emoji: '🌸', rating: 4.7, reviews: 1876, category: 'Beauty', badge: 'Deal', installment: '10x R$45.90' },
  { id: 8, name: 'Samsonite Guard IT', price: 329, originalPrice: 399, color: 'bg-gray-600', emoji: '🎒', rating: 4.4, reviews: 542, category: 'Accessories', installment: '6x R$54.83' },
  { id: 9, name: 'JBL Flip 6', price: 599, originalPrice: 799, color: 'bg-teal-600', emoji: '🔊', rating: 4.6, reviews: 2105, category: 'Audio', badge: 'Popular', installment: '10x R$59.90' },
  { id: 10, name: 'Ray-Ban Aviator', price: 789, originalPrice: 950, color: 'bg-yellow-700', emoji: '🕶️', rating: 4.5, reviews: 1322, category: 'Fashion', installment: '10x R$78.90' },
  { id: 11, name: 'Dyson V12', price: 3499, originalPrice: 4199, color: 'bg-violet-600', emoji: '🧹', rating: 4.7, reviews: 987, category: 'Home', badge: 'Premium', installment: '12x R$291.58' },
  { id: 12, name: 'iPad Air M2', price: 5999, originalPrice: 6999, color: 'bg-indigo-600', emoji: '📲', rating: 4.8, reviews: 1543, category: 'Electronics', installment: '12x R$499.92' },
]

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '' },
  { id: 'Electronics', label: '💻 Electronics', icon: '' },
  { id: 'Audio', label: '🎧 Audio', icon: '' },
  { id: 'Fashion', label: '👟 Fashion', icon: '' },
  { id: 'Home', label: '☕ Home', icon: '' },
  { id: 'Beauty', label: '🌸 Beauty', icon: '' },
  { id: 'Accessories', label: '🎒 Accessories', icon: '' },
]

// Export for other screens
export { PRODUCTS }

export default function ShopHome({ onNavigate, onEvent, fluenceEnabled, cartCount }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  const handleProductClick = (product) => {
    onEvent({
      type: 'product_click',
      label: `Viewed ${product.name}`,
      detail: `R$${product.price.toLocaleString()} — product`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    })
    onNavigate('product', product)
  }

  const handleSearch = () => {
    onEvent({
      type: 'search_query',
      label: 'Searched products',
      detail: 'Catalog search',
      time: now(),
    })
  }

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId)
    if (catId !== 'all') {
      onEvent({
        type: 'category_filter',
        label: `Filtered: ${catId}`,
        detail: `category — ${catId}`,
        time: now(),
      })
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 pt-2 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">ShopFlow</h1>
            <p className="text-orange-100 text-[10px]">Discover amazing deals</p>
          </div>
          <button
            onClick={() => onNavigate('cart')}
            className="relative text-white"
          >
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <button
          onClick={handleSearch}
          className="w-full bg-white/20 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2 text-left"
        >
          <span className="text-white/70 text-xs">🔍</span>
          <span className="text-white/60 text-xs">Search products...</span>
        </button>
      </div>

      {/* Category pills — functional filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`flex-shrink-0 text-[10px] px-3 py-1 rounded-full font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 active:bg-orange-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Section title */}
      <div className="px-4 mb-2">
        <h2 className="text-xs font-semibold text-gray-700">
          {activeCategory === 'all' ? '🔥 Popular Products' : `${activeCategory}`}
          <span className="text-gray-400 font-normal ml-1">({filtered.length})</span>
        </h2>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
        {filtered.map(product => (
          <button
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 text-left transition-transform active:scale-[0.98]"
          >
            <div className="relative">
              <div className={`${product.color} rounded-lg h-20 w-full flex items-center justify-center mb-2`}>
                <span className="text-3xl">{product.emoji}</span>
              </div>
              {product.badge && (
                <span className="absolute top-1 right-1 bg-orange-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-bold shadow">
                  {product.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold text-gray-800 truncate">{product.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`text-[8px] ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
              ))}
              <span className="text-[8px] text-gray-400">({product.reviews.toLocaleString()})</span>
            </div>
            <div className="mt-1.5">
              {product.originalPrice > product.price && (
                <span className="text-[8px] text-gray-400 line-through mr-1">
                  R${product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-sm font-bold text-gray-900">R${product.price.toLocaleString()}</span>
            </div>
            <p className="text-[8px] text-gray-400">{product.installment}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}
