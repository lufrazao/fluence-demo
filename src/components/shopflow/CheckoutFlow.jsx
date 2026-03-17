// Checkout screen — shown briefly before abandon or purchase
export default function CheckoutFlow({ cart }) {
  const items = cart || []
  const total = items.reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">←</span>
          <h2 className="text-sm font-bold text-gray-900">Finalizar Compra</h2>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center gap-1">
          {['Carrinho', 'Entrega', 'Pagamento'].map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                i <= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {i + 1}
              </div>
              <span className="text-[9px] text-gray-500 ml-1">{step}</span>
              {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Items summary */}
      <div className="mx-4 mt-3 bg-white rounded-xl p-3 shadow-sm">
        <h3 className="text-[10px] font-semibold text-gray-500 uppercase mb-2">Resumo do Pedido</h3>
        {items.map((product, i) => (
          <div key={`${product.id}-${i}`} className="flex items-center gap-2 py-1.5">
            <span className="text-lg">{product.image}</span>
            <span className="text-[10px] text-gray-700 flex-1 truncate">{product.name}</span>
            <span className="text-[10px] font-medium text-gray-900">R${product.price.toLocaleString('pt-BR')}</span>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="mx-4 mt-3 bg-white rounded-xl p-3 shadow-sm">
        <h3 className="text-[10px] font-semibold text-gray-500 uppercase mb-2">Pagamento</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] text-gray-700">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-orange-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            </div>
            Cartão de Crédito
          </label>
          <label className="flex items-center gap-2 text-[10px] text-gray-400">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
            PIX (5% de desconto)
          </label>
          <label className="flex items-center gap-2 text-[10px] text-gray-400">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
            Boleto Bancário
          </label>
        </div>
      </div>

      {/* Total */}
      <div className="mx-4 mt-3 bg-white rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between text-sm font-bold text-gray-900">
          <span>Total</span>
          <span>R${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <p className="text-[9px] text-green-600 mt-1">
          12x de R${(total / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
        </p>
      </div>

      {/* CTA */}
      <div className="px-4 py-4">
        <button className="w-full bg-orange-500 text-white text-xs font-bold py-3 rounded-lg shadow-lg shadow-orange-500/20">
          Confirmar Compra
        </button>
        <p className="text-[8px] text-gray-400 text-center mt-2">
          🔒 Pagamento 100% seguro — SSL criptografado
        </p>
      </div>
    </div>
  )
}
