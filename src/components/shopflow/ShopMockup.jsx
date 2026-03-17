// Phone mockup showing the shopping app — renders current screen
import { motion, AnimatePresence } from 'framer-motion'
import ShopHome from './ShopHome'
import ProductDetail from './ProductDetail'
import CartView from './CartView'
import CheckoutFlow from './CheckoutFlow'

const SCREENS = {
  home: ShopHome,
  product: ProductDetail,
  cart: CartView,
  checkout: CheckoutFlow,
}

export default function ShopMockup({ screen, screenProduct, cart, persona, isClimax }) {
  const Screen = SCREENS[screen] || ShopHome

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2 text-[11px] text-gray-500">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span>●●●●○</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* App content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen + (screenProduct || '')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Screen
              productId={screenProduct}
              cart={cart}
              persona={persona}
            />
          </motion.div>
        </AnimatePresence>

        {/* Climax overlay */}
        <AnimatePresence>
          {isClimax && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500/10 border-2 border-red-500/30 rounded-xl pointer-events-none z-30"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around py-2 border-t border-gray-200 bg-white">
        <NavItem icon="🏠" label="Início" active={screen === 'home'} />
        <NavItem icon="🔍" label="Buscar" />
        <NavItem
          icon="🛒"
          label="Carrinho"
          active={screen === 'cart'}
          badge={cart?.length || 0}
        />
        <NavItem icon="👤" label="Perfil" />
      </div>
    </div>
  )
}

function NavItem({ icon, label, active, badge }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 text-[10px] ${active ? 'text-orange-500' : 'text-gray-400'}`}>
      <div className="relative">
        <span className="text-base">{icon}</span>
        {badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-2 w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold"
          >
            {badge}
          </motion.span>
        )}
      </div>
      <span>{label}</span>
    </div>
  )
}
