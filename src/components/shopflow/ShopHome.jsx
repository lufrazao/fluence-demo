// ShopFlow home screen with product grid
import { PRODUCTS, CATEGORIES } from '../../data/shopflow/products'

export default function ShopHome() {
  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">ShopFlow</h1>
            <p className="text-[10px] text-gray-400">Descubra ofertas incríveis</p>
          </div>
          <span className="text-xl">🛍️</span>
        </div>
        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 text-xs text-gray-400">
          <span className="mr-2">🔍</span>
          <span>Buscar produtos...</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {CATEGORIES.slice(0, 5).map((cat, i) => (
          <span
            key={cat}
            className={`text-[10px] px-3 py-1 rounded-full whitespace-nowrap ${
              i === 0
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-2 px-3 pb-4">
        {PRODUCTS.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
          >
            <div className="text-3xl text-center mb-2">{product.image}</div>
            {product.badge && (
              <span className="text-[8px] px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">
                {product.badge}
              </span>
            )}
            <p className="text-[11px] font-medium text-gray-900 mt-1 line-clamp-2 leading-tight">
              {product.name}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] text-yellow-500">★</span>
              <span className="text-[9px] text-gray-500">
                {product.rating} ({product.reviews.toLocaleString()})
              </span>
            </div>
            {product.originalPrice > product.price && (
              <p className="text-[9px] text-gray-400 line-through mt-1">
                R${product.originalPrice.toLocaleString('pt-BR')}
              </p>
            )}
            <p className="text-sm font-bold text-gray-900">
              R${product.price.toLocaleString('pt-BR')}
            </p>
            <p className="text-[8px] text-gray-400">
              {product.installment.times}x R${product.installment.value.toLocaleString('pt-BR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
