// Cart screen during simulation — shows items being added/removed
export default function CartView({ cart }) {
  const items = cart || []
  const total = items.reduce((sum, p) => sum + p.price, 0)

  if (items.length === 0) {
    return (
      <div className="h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400">
        <span className="text-4xl mb-2">🛒</span>
        <p className="text-sm">Carrinho vazio</p>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">Carrinho ({items.length})</h2>
      </div>

      <div className="p-3 space-y-2">
        {items.map((product, i) => (
          <div key={`${product.id}-${i}`} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
            <span className="text-2xl">{product.image}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-gray-900 truncate">{product.name}</p>
              <p className="text-[10px] text-gray-400">{product.category}</p>
              <p className="text-xs font-bold text-gray-900">R${product.price.toLocaleString('pt-BR')}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">−</button>
              <span className="text-gray-700 font-medium">1</span>
              <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 mt-2">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Subtotal</span>
          <span>R${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Frete</span>
          <span className="text-green-600">Grátis</span>
        </div>
        <div className="flex items-center justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2">
          <span>Total</span>
          <span>R${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <button className="w-full bg-orange-500 text-white text-xs font-semibold py-2.5 rounded-lg mt-3">
          Finalizar Compra
        </button>
      </div>
    </div>
  )
}
