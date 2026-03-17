// Real-time event stream showing behavioral events as they fire
import { motion, AnimatePresence } from 'framer-motion'

const EVENT_COLORS = {
  page_view: 'bg-gray-400',
  search_query: 'bg-blue-400',
  product_view: 'bg-teal-400',
  review_read: 'bg-indigo-400',
  comparison_view: 'bg-purple-400',
  price_alert_set: 'bg-yellow-400',
  add_to_cart: 'bg-green-400',
  remove_from_cart: 'bg-red-400',
  cart_view: 'bg-orange-400',
  begin_checkout: 'bg-amber-400',
  installment_view: 'bg-cyan-400',
  checkout_abandon: 'bg-red-500',
  purchase_complete: 'bg-emerald-500',
}

const EVENT_ICONS = {
  page_view: '👁️',
  search_query: '🔍',
  product_view: '📱',
  review_read: '📖',
  comparison_view: '⚖️',
  price_alert_set: '🔔',
  add_to_cart: '🛒',
  remove_from_cart: '❌',
  cart_view: '📋',
  begin_checkout: '💳',
  installment_view: '🧮',
  checkout_abandon: '🚪',
  purchase_complete: '✅',
}

export default function EventStream({ events, maxVisible = 8 }) {
  const visible = events.slice(0, maxVisible)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Eventos em Tempo Real
        </h3>
        <span className="text-[10px] text-gray-500">{events.length} capturados</span>
      </div>

      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {visible.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-2 py-1.5 px-2 rounded-lg ${
                event.isClimax ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${EVENT_COLORS[event.type] || 'bg-gray-400'}`} />
                <span className="text-xs">{EVENT_ICONS[event.type] || '•'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] ${event.isClimax ? 'text-red-400 font-semibold' : 'text-gray-300'}`}>
                  {event.detail}
                </p>
                <p className="text-[9px] text-gray-500">{event.type}</p>
              </div>
              {event.cartValue && (
                <span className="text-[9px] text-gray-500 flex-shrink-0">
                  R${event.cartValue.toLocaleString('pt-BR')}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <p className="text-[11px] text-gray-600 italic py-4 text-center">
            Aguardando eventos...
          </p>
        )}
      </div>
    </div>
  )
}
