import { useRef, useEffect } from 'react'
import ShopHome from './ShopHome'
import ProductScreen from './ProductScreen'
import CartScreen from './CartScreen'
import CheckoutScreen from './CheckoutScreen'

export default function EcommerceDemo({
  fluenceEnabled, onEvent, screen, onScreenChange,
  selectedProduct, onSelectProduct, cart, setCart,
}) {
  const scrollThresholds = useRef(new Set())

  // Reset scroll thresholds when screen changes
  useEffect(() => {
    scrollThresholds.current = new Set()
  }, [screen])

  const handleScroll = (e) => {
    const el = e.target
    if (el.scrollHeight <= el.clientHeight) return
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    for (const threshold of [25, 50, 75, 100]) {
      if (pct >= threshold && !scrollThresholds.current.has(threshold)) {
        scrollThresholds.current.add(threshold)
        onEvent({
          type: 'scroll_depth',
          label: `Scrolled ${threshold}% on ${screen}`,
          detail: `${screen} — ${threshold}%`,
          time: now(),
        })
      }
    }
  }

  const nav = (target, data) => {
    if (target === 'product' && data) {
      onSelectProduct(data)
    }
    onScreenChange(target)
    onEvent({ type: 'screen_view', label: `Navigated to ${target}`, detail: target, time: now() })
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p)
      }
      return [...prev, { ...product, qty: 1 }]
    })
    onEvent({ type: 'add_to_cart', label: `Added ${product.name}`, detail: `R$${product.price}`, category: product.category, price: product.price, productId: product.id, productName: product.name, time: now() })
  }

  const removeFromCart = (productId) => {
    const item = cart.find(p => p.id === productId)
    setCart(prev => prev.filter(p => p.id !== productId))
    if (item) {
      onEvent({ type: 'remove_from_cart', label: `Removed ${item.name}`, detail: `R$${item.price}`, time: now() })
    }
  }

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => prev.map(p => p.id === productId ? { ...p, qty } : p))
  }

  const screens = {
    home: (
      <ShopHome
        onNavigate={nav}
        onEvent={onEvent}
        fluenceEnabled={fluenceEnabled}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
      />
    ),
    product: (
      <ProductScreen
        product={selectedProduct}
        onNavigate={nav}
        onEvent={onEvent}
        fluenceEnabled={fluenceEnabled}
        onAddToCart={addToCart}
      />
    ),
    cart: (
      <CartScreen
        items={cart}
        onNavigate={nav}
        onEvent={onEvent}
        fluenceEnabled={fluenceEnabled}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
      />
    ),
    checkout: (
      <CheckoutScreen
        items={cart}
        onNavigate={nav}
        onEvent={onEvent}
        fluenceEnabled={fluenceEnabled}
      />
    ),
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" onScroll={handleScroll}>
        {screens[screen] || screens.home}
      </div>

      {/* Bottom nav */}
      <div className="flex-shrink-0 flex justify-around items-center px-6 py-3 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'cart', icon: '🛒', label: 'Cart', badge: cart.reduce((s, i) => s + i.qty, 0) },
          { id: 'profile', icon: '👤', label: 'Account' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'home' || tab.id === 'cart') nav(tab.id)
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors relative ${
              screen === tab.id ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.badge > 0 && (
              <span className="absolute -top-1 right-0 bg-orange-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {tab.badge}
              </span>
            )}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}
