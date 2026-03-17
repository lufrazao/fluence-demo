import { useRef, useState } from 'react'

export default function HomeScreen({ onNavigate, onEvent, fluenceEnabled }) {
  const now = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const scrollThresholds = useRef(new Set())
  const [expandedTx, setExpandedTx] = useState(null)
  const [notifExpanded, setNotifExpanded] = useState(false)
  const [notifDismissed, setNotifDismissed] = useState(false)
  const [balancePulsed, setBalancePulsed] = useState(false)
  const [quickActionToast, setQuickActionToast] = useState(null)

  const checkBalance = () => {
    onEvent({ type: 'balance_check', label: 'Balance checked', detail: 'R$4,231.50', time: now() })
    setBalancePulsed(true)
    setTimeout(() => setBalancePulsed(false), 1200)
  }

  const handleQuickAction = (label, detail, navigateTo) => {
    onEvent({ type: 'quick_action', label: `${label} tapped`, detail, time: now() })
    if (navigateTo) {
      onNavigate(navigateTo)
    } else {
      setQuickActionToast(label)
      setTimeout(() => setQuickActionToast(null), 1500)
    }
  }

  const handleScroll = (e) => {
    const el = e.target
    if (el.scrollHeight <= el.clientHeight) return
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    for (const threshold of [25, 50, 75, 100]) {
      if (pct >= threshold && !scrollThresholds.current.has(threshold)) {
        scrollThresholds.current.add(threshold)
        onEvent({ type: 'scroll_depth', label: `Scrolled ${threshold}% on home`, detail: `${threshold}%`, time: now() })
      }
    }
  }

  const transactions = [
    { icon: '🛒', name: 'Supermercado Pao de Acucar', amount: '-R$ 287.40', color: 'text-red-500', category: 'Groceries', date: 'Today, 14:32', method: 'Debit card', status: 'Completed' },
    { icon: '💰', name: 'Salary Deposit', amount: '+R$ 5,400.00', color: 'text-green-500', category: 'Income', date: 'Today, 08:00', method: 'Direct deposit', status: 'Completed' },
    { icon: '🚗', name: 'Uber', amount: '-R$ 23.50', color: 'text-red-500', category: 'Transport', date: 'Yesterday, 19:45', method: 'Credit card', status: 'Completed' },
    { icon: '🏠', name: 'Rent Payment', amount: '-R$ 1,800.00', color: 'text-red-500', category: 'Housing', date: 'Mar 1, 10:00', method: 'Auto-debit', status: 'Completed' },
    { icon: '📱', name: 'Phone Bill', amount: '-R$ 89.90', color: 'text-red-500', category: 'Utilities', date: 'Feb 28, 06:00', method: 'Auto-debit', status: 'Completed' },
  ]

  return (
    <div className="flex flex-col flex-1 pb-4 relative" onScroll={handleScroll}>
      {/* Quick action toast */}
      {quickActionToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-xs px-4 py-2 rounded-full shadow-lg animate-pulse">
          Opening {quickActionToast}...
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-8 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-violet-200 text-xs">Good morning</p>
            <p className="text-white text-lg font-bold">Maria</p>
          </div>
          <div
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm cursor-pointer active:bg-white/30 transition-colors"
            onClick={() => onEvent({ type: 'click', label: 'Profile icon tapped', detail: 'profile', time: now() })}
          >👤</div>
        </div>

        <div
          className={`bg-white/10 rounded-2xl p-4 backdrop-blur cursor-pointer transition-all ${balancePulsed ? 'bg-white/20 scale-[1.02]' : 'active:bg-white/15'}`}
          onClick={checkBalance}
        >
          <div className="flex items-center justify-between">
            <p className="text-violet-200 text-[10px] uppercase tracking-wider">Total Balance</p>
            {balancePulsed && <span className="text-[10px] text-green-300 animate-pulse">Updated just now</span>}
          </div>
          <p className="text-white text-2xl font-bold mt-1">R$ 4,231.50</p>
          <p
            className="text-green-300 text-xs mt-1 cursor-pointer hover:text-green-200"
            onClick={(e) => {
              e.stopPropagation()
              onEvent({ type: 'click', label: 'Monthly growth tapped', detail: 'portfolio_summary', time: now() })
              onNavigate('invest')
            }}
          >+R$ 127.30 this month →</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '💸', label: 'Transfer', detail: 'transfer' },
              { icon: '📱', label: 'Pix', detail: 'pix' },
              { icon: '💳', label: 'Cards', detail: 'cards' },
              { icon: '📊', label: 'Invest', detail: 'invest', navigateTo: 'invest' },
            ].map((a, i) => (
              <button key={i} onClick={() => handleQuickAction(a.label, a.detail, a.navigateTo)} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-xl active:bg-violet-100 transition-colors">{a.icon}</div>
                <span className="text-[10px] text-gray-600">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="px-5 mt-4 space-y-3">
        {/* Notification banner */}
        {!notifDismissed && (
          <div
            className={`bg-blue-50 border border-blue-200 rounded-2xl cursor-pointer transition-all duration-200 ${notifExpanded ? 'ring-1 ring-blue-300' : 'active:bg-blue-100'}`}
            onClick={() => {
              if (!notifExpanded) {
                setNotifExpanded(true)
                onEvent({ type: 'notification_click', label: 'Notification: Card bill due', detail: 'card_bill_reminder', time: now() })
              }
            }}
          >
            <div className="p-3 flex items-center gap-3">
              <span className="text-lg">🔔</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-800">Card bill due in 3 days</p>
                <p className="text-[10px] text-blue-600">{notifExpanded ? 'Credit card ending in •4521' : 'R$ 1,245.80 — tap to view details'}</p>
              </div>
              {!notifExpanded && <span className="text-blue-400 text-xs">→</span>}
            </div>
            {notifExpanded && (
              <div className="px-3 pb-3 pt-0">
                <div className="border-t border-blue-200 pt-2 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600">Amount due</span>
                    <span className="text-blue-800 font-semibold">R$ 1,245.80</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600">Due date</span>
                    <span className="text-blue-800 font-medium">Mar 8, 2026</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600">Minimum payment</span>
                    <span className="text-blue-800 font-medium">R$ 186.87</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      className="flex-1 bg-blue-600 text-white text-[10px] font-semibold py-2 rounded-lg active:bg-blue-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEvent({ type: 'transaction', label: 'Card bill paid in full', detail: 'R$ 1,245.80', time: now() })
                        setNotifDismissed(true)
                      }}
                    >Pay Full Amount</button>
                    <button
                      className="flex-1 bg-blue-100 text-blue-700 text-[10px] font-semibold py-2 rounded-lg active:bg-blue-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        setNotifDismissed(true)
                        onEvent({ type: 'click', label: 'Notification dismissed', detail: 'card_bill_reminder', time: now() })
                      }}
                    >Dismiss</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {fluenceEnabled ? (
          <>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <span className="text-sm font-semibold text-emerald-800">Your Savings Goal</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">Personalized</span>
              </div>
              <p className="text-xs text-emerald-700 mb-2">You're on track! R$850 saved toward your R$2,000 emergency fund.</p>
              <div className="w-full bg-emerald-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '42%' }} />
              </div>
              <p className="text-[10px] text-emerald-600 mt-1">42% complete — great progress, Maria!</p>
            </div>

            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer"
              onClick={() => { onEvent({ type: 'click', label: 'Personalized loan card tapped', time: now() }); onNavigate('loan') }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-lg">🏦</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Personal Loan — at your pace</p>
                  <p className="text-xs text-gray-500">No rush. See rates, no commitment.</p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 cursor-pointer active:opacity-90 transition-opacity"
              onClick={() => { onEvent({ type: 'click', label: 'Promo banner tapped', time: now() }); onNavigate('loan') }}
            >
              <p className="text-white font-bold text-sm">🔥 LIMITED TIME!</p>
              <p className="text-white/90 text-xs mt-1">Personal loan at 1.9%/mo. Apply NOW before rates change!</p>
              <button className="mt-2 bg-white text-red-600 text-xs font-bold px-4 py-1.5 rounded-full">APPLY NOW →</button>
            </div>

            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => { onEvent({ type: 'click', label: 'Investment banner tapped', time: now() }); onNavigate('invest') }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-lg">📈</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Invest in Crypto</p>
                  <p className="text-xs text-gray-500">Bitcoin up 15% this week!</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Recent transactions */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent</p>
          {transactions.map((tx, i) => {
            const isExpanded = expandedTx === i
            return (
              <div
                key={i}
                className={`border-b border-gray-50 last:border-0 cursor-pointer transition-all duration-200 rounded-lg ${isExpanded ? 'bg-gray-50 shadow-sm my-1' : 'active:bg-gray-50'}`}
                onClick={() => {
                  setExpandedTx(isExpanded ? null : i)
                  onEvent({ type: 'transaction_click', label: `Transaction: ${tx.name}`, detail: `${tx.amount} (${tx.category.toLowerCase()})`, time: now() })
                }}
              >
                <div className="flex items-center gap-3 py-2.5 px-1">
                  <span className="text-lg">{tx.icon}</span>
                  <span className="text-xs text-gray-700 flex-1">{tx.name}</span>
                  <span className={`text-xs font-semibold ${tx.color}`}>{tx.amount}</span>
                </div>
                {isExpanded && (
                  <div className="px-1 pb-2.5 pt-0 ml-8">
                    <div className="border-t border-gray-200 pt-2 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Date</span>
                        <span className="text-gray-600">{tx.date}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Category</span>
                        <span className="text-gray-600">{tx.category}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Method</span>
                        <span className="text-gray-600">{tx.method}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Status</span>
                        <span className="text-emerald-600 font-medium">{tx.status}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
