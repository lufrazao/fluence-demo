const CROSS_SELL = [
  { id: 20, name: 'USB-C Cable', price: 29, emoji: '🔌' },
  { id: 21, name: 'Screen Protector', price: 19, emoji: '🛡️' },
  { id: 22, name: 'Phone Stand', price: 49, emoji: '📱' },
]

const FREE_SHIPPING_THRESHOLD = 500

export default function CartScreen({ items, onNavigate, onEvent, fluenceEnabled, onUpdateQty, onRemove }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const total = subtotal
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const shippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  const handleCheckout = () => {
    onEvent({
      type: 'begin_checkout',
      label: 'Started checkout',
      detail: `R$${total.toLocaleString()} (${items.length} items) — checkout`,
      time: now(),
    })
    onNavigate('checkout')
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 pt-2 pb-3 flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="text-white text-lg">←</button>
        <h1 className="text-white font-semibold text-sm flex-1">My Cart</h1>
        <span className="text-white/80 text-xs">{items.reduce((s, i) => s + i.qty, 0)} items</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
          <span className="text-5xl mb-3">🛒</span>
          <p className="text-sm font-semibold text-gray-700">Your cart is empty</p>
          <p className="text-xs text-gray-400 mt-1 text-center">Explore our products and find something special!</p>
          <button
            onClick={() => onNavigate('home')}
            className="mt-4 bg-orange-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl"
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="px-4 pt-3 space-y-3">
          {/* Free shipping progress */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5">
            {shippingRemaining > 0 ? (
              <>
                <p className="text-[10px] text-emerald-700 font-medium">
                  🚚 Add R${shippingRemaining.toLocaleString()} for FREE SHIPPING!
                </p>
                <div className="w-full bg-emerald-200 rounded-full h-1.5 mt-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-[10px] text-emerald-700 font-semibold">
                🎉 You got FREE SHIPPING!
              </p>
            )}
          </div>

          {/* Cart items */}
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <div className="flex gap-3">
                <div className={`${item.color} rounded-lg w-16 h-16 flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold text-gray-800 truncate pr-2">{item.name}</p>
                    <button
                      onClick={() => {
                        onRemove(item.id)
                        onEvent({
                          type: 'remove_from_cart',
                          label: `Removed ${item.name}`,
                          detail: `R$${item.price}`,
                          time: now(),
                        })
                      }}
                      className="text-gray-300 text-xs hover:text-red-400 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-1.5 py-0.5">
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        className="text-gray-400 text-sm font-bold w-5 h-5 flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold text-gray-700 w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="text-orange-500 text-sm font-bold w-5 h-5 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      R${(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Cross-sell */}
          <div>
            <p className="text-[10px] font-semibold text-gray-700 mb-2">✨ Complete Your Order</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CROSS_SELL.map(cs => (
                <div key={cs.id} className="flex-shrink-0 bg-white rounded-xl p-2 border border-gray-100 w-24 text-center">
                  <span className="text-xl">{cs.emoji}</span>
                  <p className="text-[9px] font-medium text-gray-700 mt-1 truncate">{cs.name}</p>
                  <p className="text-[10px] font-bold text-orange-600">R${cs.price}</p>
                  <button
                    onClick={() => {
                      onEvent({
                        type: 'cross_sell_click',
                        label: `Cross-sell: ${cs.name}`,
                        detail: `R$${cs.price}`,
                        time: now(),
                      })
                    }}
                    className="mt-1 text-[8px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-semibold"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-800">Order Summary</p>
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
              <span>R${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Shipping</span>
              <span className={subtotal >= FREE_SHIPPING_THRESHOLD ? 'text-green-600 font-medium' : ''}>
                {subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : 'R$15'}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-sm font-bold text-gray-900">
                R${(total + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15)).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-transform"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full text-gray-400 text-xs py-2 text-center"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}
