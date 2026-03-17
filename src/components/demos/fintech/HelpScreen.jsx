import { useState } from 'react'

export default function HelpScreen({ onNavigate, onEvent, fluenceEnabled }) {
  const now = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const [expandedTopic, setExpandedTopic] = useState(null)
  const [searchFocused, setSearchFocused] = useState(false)

  const topics = fluenceEnabled
    ? [
        { icon: '💰', title: 'Understanding Loan Interest Rates', desc: 'Simple explanation of how rates work', badge: 'Suggested', hot: true, answer: 'Our personal loan rate is 1.9% per month (25.4% p.a. CET). This is a fixed rate — your monthly payment stays the same for the entire term. No surprises, no variable rates. For a R$5,000 loan over 12 months, you\'d pay R$468.50/month.' },
        { icon: '🧮', title: 'Loan Calculator Explained', desc: 'See exactly what you\'ll pay monthly', badge: 'For you', hot: true, answer: 'Use our calculator on the Loans page to see exact monthly payments. Pick your amount, choose your term (6-48 months), and see the full breakdown — total cost, interest, and monthly payment. No commitment required.' },
        { icon: '🛡️', title: 'Your Money is Protected', desc: 'How FGC insurance protects your deposits', badge: null, hot: false, answer: 'All deposits up to R$250,000 per CPF are protected by the FGC (Fundo Garantidor de Créditos). This covers your checking account, savings, and CDBs. Your money is safe even if something happens to the bank.' },
        { icon: '📊', title: 'Investment Risk Levels Explained', desc: 'What low/medium/high risk means', badge: null, hot: false, answer: 'Low risk: Government bonds, CDBs — stable returns around 12-13% p.a. Medium risk: Multi-asset funds — potential for 14-16% p.a. with some volatility. High risk: Stocks, crypto — potential for 20%+ but can drop significantly.' },
        { icon: '💳', title: 'Managing Your Credit Score', desc: 'Tips to improve your score', badge: null, hot: false, answer: 'Pay bills on time, keep credit utilization below 30%, avoid opening too many accounts at once, and maintain old credit lines. Your score updates monthly — improvements can take 2-3 months to reflect.' },
      ]
    : [
        { icon: '📱', title: 'How to Use Pix', desc: 'Send and receive instant payments', badge: null, hot: false, answer: 'Pix is free and instant, 24/7. Go to Transfer → Pix, enter the recipient\'s Pix key (CPF, email, phone, or random key), enter the amount, and confirm. Money arrives in seconds.' },
        { icon: '💳', title: 'Card Settings', desc: 'Block, unblock, limits', badge: null, hot: false, answer: 'Go to Cards to manage your card. You can temporarily block/unblock, adjust spending limits, enable/disable international purchases, and set up contactless payments. Changes take effect immediately.' },
        { icon: '💰', title: 'Interest Rates FAQ', desc: 'Common questions about rates', badge: null, hot: false, answer: 'Personal loan: 1.9%/mo fixed. Overdraft: 8%/mo. Credit card revolving: 12%/mo. Savings: 0.5%/mo + TR. CDB: 100-120% CDI. We always show the total cost (CET) upfront.' },
        { icon: '🔒', title: 'Security & Privacy', desc: 'How we protect your data', badge: null, hot: false, answer: 'We use 256-bit encryption, biometric authentication, and real-time fraud monitoring. Your data is never shared with third parties without consent. You can review and download your data anytime in Settings → Privacy.' },
        { icon: '📞', title: 'Contact Support', desc: 'Chat, phone, email', badge: null, hot: false, answer: 'Chat: Available 24/7 in the app. Phone: 0800-123-4567 (Mon-Fri 8am-8pm, Sat 9am-2pm). Email: help@neobank.com.br — responses within 24h. For urgent issues, use chat for fastest resolution.' },
      ]

  return (
    <div className="flex flex-col flex-1 pb-4">
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onNavigate('home')} className="text-white/80 text-sm">← Back</button>
          <h1 className="text-white font-bold">Help Center</h1>
        </div>
        <div
          className={`rounded-xl px-4 py-2.5 flex items-center gap-2 backdrop-blur cursor-pointer transition-colors ${searchFocused ? 'bg-white/20 ring-1 ring-white/40' : 'bg-white/10 active:bg-white/15'}`}
          onClick={() => {
            setSearchFocused(true)
            onEvent({ type: 'click', label: 'Help search tapped', detail: 'help_search', time: now() })
            setTimeout(() => setSearchFocused(false), 1500)
          }}
        >
          <span className="text-white/50">🔍</span>
          <span className={`text-sm transition-colors ${searchFocused ? 'text-white/70' : 'text-white/40'}`}>
            {searchFocused ? 'Type to search...' : 'Search help topics...'}
          </span>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {fluenceEnabled && (
          <div
            className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-start gap-2 cursor-pointer active:bg-teal-100 transition-colors"
            onClick={() => onEvent({ type: 'click', label: 'Personalized help banner tapped', detail: 'personalized_help', time: now() })}
          >
            <span className="text-sm">🎯</span>
            <div>
              <p className="text-xs font-semibold text-teal-800">Personalized for you</p>
              <p className="text-[10px] text-teal-700">Based on your recent activity, these topics may help.</p>
            </div>
          </div>
        )}

        {topics.map((topic, i) => {
          const isExpanded = expandedTopic === i
          return (
            <div
              key={i}
              className={`bg-white rounded-xl shadow-sm border cursor-pointer transition-all duration-200 ${topic.hot ? 'border-violet-200' : 'border-gray-100'} ${isExpanded ? 'ring-1 ring-violet-200 shadow-md' : 'active:bg-gray-50'}`}
              onClick={() => {
                setExpandedTopic(isExpanded ? null : i)
                onEvent({ type: 'help_accessed', label: `Help: ${topic.title}`, detail: topic.title, time: now() })
              }}
            >
              <div className="p-3.5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{topic.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800">{topic.title}</p>
                      {topic.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium flex-shrink-0">{topic.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{topic.desc}</p>
                  </div>
                  <span className={`text-gray-300 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>→</span>
                </div>
              </div>
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-0">
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-600 leading-relaxed">{topic.answer}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="text-[10px] px-3 py-1 rounded-full bg-violet-50 text-violet-600 font-medium active:bg-violet-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEvent({ type: 'click', label: 'Help: Was this helpful? Yes', detail: topic.title, time: now() })
                        }}
                      >👍 Helpful</button>
                      <button
                        className="text-[10px] px-3 py-1 rounded-full bg-gray-50 text-gray-500 font-medium active:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEvent({ type: 'help_accessed', label: 'Help: Need more help', detail: `${topic.title} - need more`, time: now() })
                        }}
                      >Need more help</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
