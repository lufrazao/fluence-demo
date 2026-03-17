// Product detail screen shown during simulation
import { getProduct } from '../../data/shopflow/products'

export default function ProductDetail({ productId }) {
  const product = getProduct(productId)

  if (!product) {
    return (
      <div className="h-full bg-white flex items-center justify-center text-gray-400 text-sm">
        Carregando produto...
      </div>
    )
  }

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Back nav */}
      <div className="flex items-center px-4 py-2 text-xs text-gray-500">
        <span className="mr-2">←</span>
        <span>Voltar</span>
      </div>

      {/* Product image */}
      <div className="bg-gray-50 py-8 flex items-center justify-center">
        <span className="text-6xl">{product.image}</span>
      </div>

      {/* Product info */}
      <div className="px-4 py-3">
        {product.badge && (
          <span className="text-[9px] px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">
            {product.badge}
          </span>
        )}
        <h2 className="text-base font-bold text-gray-900 mt-1">{product.name}</h2>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-yellow-500">{'★'.repeat(Math.floor(product.rating))}</span>
          <span className="text-[10px] text-gray-500">
            {product.rating} ({product.reviews.toLocaleString()} avaliações)
          </span>
        </div>

        {/* Price */}
        <div className="mt-3">
          {product.originalPrice > product.price && (
            <p className="text-xs text-gray-400 line-through">
              R${product.originalPrice.toLocaleString('pt-BR')}
            </p>
          )}
          <p className="text-xl font-bold text-gray-900">
            R${product.price.toLocaleString('pt-BR')}
          </p>
          <p className="text-[10px] text-green-600">
            ou {product.installment.times}x de R${product.installment.value.toLocaleString('pt-BR')} sem juros
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">{product.description}</p>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-orange-500 text-white text-xs font-semibold py-2.5 rounded-lg">
            Comprar Agora
          </button>
          <button className="flex-1 border border-orange-500 text-orange-500 text-xs font-semibold py-2.5 rounded-lg">
            Adicionar ao Carrinho
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-4 text-[9px] text-gray-400">
          <span>🔒 Compra Segura</span>
          <span>🔄 30 dias devolução</span>
          <span>🚚 Frete grátis</span>
        </div>
      </div>
    </div>
  )
}
