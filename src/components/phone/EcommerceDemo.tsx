import React, { useRef, useEffect, useState } from 'react';
import ShopHome from './screens/ShopHome';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import type { AppEvent } from '../../types/simulation';
import type { Product } from './screens/ShopHome';
import type { CartItem } from './screens/CartScreen';

function now() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

interface EcommerceDemoProps {
  fluenceEnabled: boolean;
  onEvent: (event: AppEvent) => void;
  screen: string;
  onScreenChange: (screen: string) => void;
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const EcommerceDemo: React.FC<EcommerceDemoProps> = ({
  fluenceEnabled, onEvent, screen, onScreenChange,
  selectedProduct, onSelectProduct, cart, setCart,
}) => {
  const scrollThresholds = useRef(new Set<number>());
  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    scrollThresholds.current = new Set();
  }, [screen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight <= el.clientHeight) return;
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    for (const threshold of [25, 50, 75, 100]) {
      if (pct >= threshold && !scrollThresholds.current.has(threshold)) {
        scrollThresholds.current.add(threshold);
        onEvent({
          type: 'scroll_depth',
          label: `Rolou ${threshold}% em ${screen}`,
          detail: `${screen} — ${threshold}%`,
          time: now(),
        });
      }
    }
  };

  const nav = (target: string, data?: Product) => {
    if (target === 'product' && data) {
      onSelectProduct(data);
    }
    onScreenChange(target);
    onEvent({ type: 'screen_view', label: `Navegou para ${target}`, detail: target, time: now() });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    onEvent({
      type: 'add_to_cart',
      label: `Adicionou ${product.name}`,
      detail: `R$${product.price}`,
      category: product.category,
      price: product.price,
      productId: product.id,
      productName: product.name,
      time: now(),
    });
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find(p => p.id === productId);
    setCart(prev => prev.filter(p => p.id !== productId));
    if (item) {
      onEvent({ type: 'remove_from_cart', label: `Removeu ${item.name}`, detail: `R$${item.price}`, time: now() });
    }
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(p => p.id === productId ? { ...p, qty } : p));
  };

  const screens: Record<string, React.ReactNode> = {
    home: (
      <ShopHome
        onNavigate={nav}
        onEvent={onEvent}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        searchTrigger={searchTrigger}
      />
    ),
    product: (
      <ProductScreen
        product={selectedProduct}
        onNavigate={nav}
        onEvent={onEvent}
        onAddToCart={addToCart}
      />
    ),
    cart: (
      <CartScreen
        items={cart}
        onNavigate={nav}
        onEvent={onEvent}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
      />
    ),
    checkout: (
      <CheckoutScreen
        items={cart}
        onNavigate={nav}
        onEvent={onEvent}
      />
    ),
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" onScroll={handleScroll}>
        {screens[screen] || screens.home}
      </div>

      {/* Bottom nav */}
      <div className="flex-shrink-0 flex justify-around items-center px-6 py-3 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        {[
          { id: 'home' as const, icon: '🏠', label: 'Inicio' },
          { id: 'search' as const, icon: '🔍', label: 'Busca' },
          { id: 'cart' as const, icon: '🛒', label: 'Carrinho' },
          { id: 'profile' as const, icon: '👤', label: 'Conta' },
        ].map(tab => {
          const badgeCount = tab.id === 'cart' ? cart.reduce((s, i) => s + i.qty, 0) : 0;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'home' || tab.id === 'cart') {
                  nav(tab.id);
                } else if (tab.id === 'search') {
                  if (screen !== 'home') nav('home');
                  setSearchTrigger(t => t + 1);
                } else if (tab.id === 'profile') {
                  onEvent({ type: 'screen_view', label: 'Viu perfil', detail: 'account', time: now() });
                }
              }}
              className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors relative ${
                screen === tab.id ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {badgeCount > 0 && (
                <span className="absolute -top-1 right-0 bg-orange-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {badgeCount}
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EcommerceDemo;
