import { useRef, useEffect } from 'react'

export default function CheckoutScreen({ items, onNavigate, onEvent, fluenceEnabled }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal >= 500 ? 0 : 15
  const total = subtotal + shipping
  const screenEnterTime = useRef(Date.now())

  // Track screen time
  useEffect(() => {
    screenEnterTime.current = Date.now()
    return () => {
      const elapsed = Math.round((Date.now() - screenEnterTime.current) / 1000)
      if (elapsed > 2) {
        onEvent({
          type: 'screen_time',
          label: `Time on checkout: ${elapsed}s`,
          detail: `checkout — ${elapsed}s`,
          time: now(),
        })
      }
    }
  }, [])

  const handleViewInstallments = () => {
    onEvent({
      type: 'installment_view',
      label: 'Viewed installment options',
      detail: `12x R$${(total / 12).toFixed(2)} — checkout`,
      time: now(),
    })
  }

  const handleComplete = () => {
    onEvent({
      type: 'purchase_complete',
      label: 'Purchase completed!',
      detail: `R$${total.toLocaleString()} (${items.length} items)`,
      time: now(),
    })
    onNavigate('home')
  }

  const handleAbandon = () => {
    onEvent({
      type: 'checkout_abandon',
      label: 'ABANDONED checkout',
      detail: `R$${total.toLocaleString()} abandoned`,
      time: now(),
    })
    onNavigate('home')
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-20" style={{ overflowY: 'auto' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 pt-2 pb-3 flex items-center gap-3">
        <button onClick={() => onNavigate('cart')} className="text-white text-lg">←</button>
        <h1 className="text-white font-semibold text-sm flex-1">Checkout</h1>
        <span className="text-white/90 text-[9px] bg-white/20 px-2 py-0.5 rounded-full">
          🔒 Secure
        </span>
      </div>

      <div className="px-4 pt-3 space-y-3">
        {/* Trust badges */}
        <div className="flex justify-center gap-3">
          {[
            { icon: '🔒', label: 'Secure Purchase' },
            { icon: '🛡️', label: 'Buyer Protection' },
            { icon: '📦', label: '30-day Returns' },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-lg">{badge.icon}</span>
              <span className="text-[7px] text-gray-500 font-medium text-center">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Order items */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-800 mb-2">Order Items</p>
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-base">{item.emoji}</span>
              <span className="text-[10px] text-gray-700 flex-1 truncate">{item.name} x{item.qty}</span>
              <span className="text-[10px] font-semibold text-gray-800">R${(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-800 mb-2">💳 Payment</p>

          {/* Card option */}
          <div className="flex items-center gap-2.5 p-2 bg-orange-50 border border-orange-200 rounded-lg mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-800">Credit Card</p>
              <p className="text-[8px] text-gray-500">**** **** **** 4829</p>
            </div>
            <span className="text-xs">💳</span>
          </div>

          {/* Installment options — clickable! Fires installment_view event */}
          <button
            onClick={handleViewInstallments}
            className="w-full bg-blue-50 border border-blue-100 rounded-lg p-2 mb-2 text-left active:bg-blue-100 transition-colors"
          >
            <p className="text-[9px] font-semibold text-blue-700 mb-1.5">📊 View Installment Options</p>
            <div className="space-y-1">
              {[
                { months: 3, interest: 0, monthly: (total / 3).toFixed(2) },
                { months: 6, interest: 0, monthly: (total / 6).toFixed(2) },
                { months: 10, interest: 1.5, monthly: ((total * 1.15) / 10).toFixed(2) },
                { months: 12, interest: 1.9, monthly: ((total * 1.19) / 12).toFixed(2) },
              ].map(opt => (
                <div key={opt.months} className="flex items-center justify-between text-[9px]">
                  <span className="text-gray-600">
                    {opt.months}x R${opt.monthly}
                  </span>
                  {opt.interest === 0 ? (
                    <span className="text-emerald-600 font-bold text-[8px]">interest-free</span>
                  ) : (
                    <span className="text-gray-400 text-[8px]">{opt.interest}%/mês</span>
                  )}
                </div>
              ))}
            </div>
          </button>

          {/* PIX option */}
          <div className="flex items-center gap-2.5 p-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-800">PIX</p>
              <p className="text-[8px] text-gray-500">Instant payment</p>
            </div>
            <span className="text-[7px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
              5% off
            </span>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-800 mb-2">📦 Shipping</p>
          <div className="flex items-center gap-2.5 p-2 bg-gray-50 rounded-lg">
            <span className="text-base">🚚</span>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-800">Standard Delivery</p>
              <p className="text-[8px] text-gray-500">3-5 business days</p>
            </div>
            <span className={`text-[10px] font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
              {shipping === 0 ? 'FREE' : `R$${shipping}`}
            </span>
          </div>
        </div>

        {/* Reassurance */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔄</span>
            <div>
              <p className="text-[10px] font-semibold text-emerald-800">Easy 30-Day Returns</p>
              <p className="text-[8px] text-emerald-600">Free returns, no questions asked</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🏷️</span>
            <div>
              <p className="text-[10px] font-semibold text-emerald-800">Lowest Price Guarantee</p>
              <p className="text-[8px] text-emerald-600">Found it cheaper? We'll match it!</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 space-y-1.5">
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>Subtotal</span>
            <span>R${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `R$${shipping}`}</span>
          </div>
          <div className="border-t border-gray-100 pt-1.5 flex justify-between">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">R${total.toLocaleString()}</span>
              <p className="text-[8px] text-gray-400">ou 6x R${(total / 6).toFixed(2)} interest-free</p>
            </div>
          </div>
        </div>

        {/* Complete Purchase */}
        <button
          onClick={handleComplete}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          🔒 Confirm Purchase
        </button>

        {/* Abandon */}
        <button
          onClick={handleAbandon}
          className="w-full text-gray-400 text-xs py-2 text-center"
        >
          Cancel Order
        </button>

        <p className="text-[8px] text-gray-400 text-center pb-2">
          🔒 SSL 256-bit encryption — Your data is secure
        </p>
      </div>
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}
