import { useState } from 'react'

export default function InvestScreen({ onNavigate, onEvent, fluenceEnabled }) {
  const now = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const [expandedFund, setExpandedFund] = useState(null)
  const [invested, setInvested] = useState(null)

  const funds = fluenceEnabled
    ? [
        { name: 'Conservative Fixed Income', rate: '12.5% p.a.', risk: 'Low', badge: '🛡️ Recommended', badgeColor: 'bg-emerald-100 text-emerald-700', desc: 'Stable returns, ideal for your profile', minInvest: 'R$ 100', liquidity: 'Daily', type: 'CDB / Government Bonds', projected: 'R$ 12,625 in 1 year on R$ 100k' },
        { name: 'Inflation-Protected Fund', rate: 'IPCA + 6.2%', risk: 'Low-Med', badge: null, desc: 'Protects your purchasing power', minInvest: 'R$ 500', liquidity: 'D+1', type: 'Treasury IPCA+', projected: 'R$ ~11,200 in 1 year on R$ 100k' },
        { name: 'Balanced Multi-Asset', rate: '14.8% p.a.', risk: 'Medium', badge: null, desc: 'Diversified portfolio approach', minInvest: 'R$ 1,000', liquidity: 'D+3', type: 'Multi-asset fund', projected: 'R$ 14,800 in 1 year on R$ 100k' },
        { name: 'Tech Growth Fund', rate: '22.1% p.a.', risk: 'High', badge: null, desc: 'Higher risk, higher potential', minInvest: 'R$ 5,000', liquidity: 'D+30', type: 'Equity fund', projected: 'R$ 22,100 in 1 year on R$ 100k' },
      ]
    : [
        { name: 'Tech Growth Fund', rate: '22.1% p.a.', risk: 'High', badge: '🔥 Hot', badgeColor: 'bg-red-100 text-red-600', desc: 'Top performer this quarter!', minInvest: 'R$ 5,000', liquidity: 'D+30', type: 'Equity fund', projected: 'R$ 22,100 in 1 year on R$ 100k' },
        { name: 'Crypto Index Fund', rate: '45.3% p.a.', risk: 'Very High', badge: '🚀 Trending', badgeColor: 'bg-orange-100 text-orange-600', desc: 'Bitcoin & Ethereum exposure', minInvest: 'R$ 1,000', liquidity: 'D+1', type: 'Crypto basket', projected: 'R$ 45,300 in 1 year on R$ 100k' },
        { name: 'Conservative Fixed Income', rate: '12.5% p.a.', risk: 'Low', badge: null, desc: 'Government-backed bonds', minInvest: 'R$ 100', liquidity: 'Daily', type: 'CDB / Government Bonds', projected: 'R$ 12,625 in 1 year on R$ 100k' },
        { name: 'Balanced Multi-Asset', rate: '14.8% p.a.', risk: 'Medium', badge: null, desc: 'Diversified approach', minInvest: 'R$ 1,000', liquidity: 'D+3', type: 'Multi-asset fund', projected: 'R$ 14,800 in 1 year on R$ 100k' },
      ]

  return (
    <div className="flex flex-col flex-1 pb-4">
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-2 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onNavigate('home')} className="text-white/80 text-sm">← Back</button>
          <h1 className="text-white font-bold">Investments</h1>
        </div>
        <div
          className="bg-white/10 rounded-xl p-3 backdrop-blur cursor-pointer active:bg-white/15 transition-colors"
          onClick={() => onEvent({ type: 'click', label: 'Portfolio value tapped', detail: 'portfolio_summary', time: now() })}
        >
          <p className="text-violet-200 text-[10px] uppercase">Portfolio Value</p>
          <p className="text-white text-xl font-bold">R$ 12,430.00</p>
          <p className="text-green-300 text-xs">+8.2% this year</p>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {fluenceEnabled && (
          <div
            className="bg-violet-50 border border-violet-200 rounded-xl p-3 flex items-start gap-2 cursor-pointer active:bg-violet-100 transition-colors"
            onClick={() => onEvent({ type: 'click', label: 'Investment suggestion tapped', detail: 'personalized_suggestion', time: now() })}
          >
            <span className="text-sm">💡</span>
            <p className="text-xs text-violet-700">Based on your risk profile, we prioritized stable, lower-risk options that match your investment style.</p>
          </div>
        )}

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Funds</p>
        {funds.map((fund, i) => {
          const isExpanded = expandedFund === i
          const justInvested = invested === i
          return (
            <div
              key={i}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${isExpanded ? 'ring-1 ring-violet-200 shadow-md border-violet-100' : 'border-gray-100 active:bg-gray-50'} cursor-pointer`}
              onClick={() => {
                setExpandedFund(isExpanded ? null : i)
                onEvent({ type: 'investment_click', label: `Viewed ${fund.name}`, detail: `${fund.risk} risk, ${fund.rate}`, time: now() })
              }}
            >
              <div className="p-3.5">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800 flex-1">{fund.name}</p>
                  {fund.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${fund.badgeColor}`}>{fund.badge}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{fund.desc}</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400">Return</p>
                    <p className="text-sm font-bold text-violet-600">{fund.rate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Risk</p>
                    <p className="text-sm font-medium text-gray-700">{fund.risk}</p>
                  </div>
                  {isExpanded && (
                    <>
                      <div>
                        <p className="text-[10px] text-gray-400">Min.</p>
                        <p className="text-sm font-medium text-gray-700">{fund.minInvest}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Liquidity</p>
                        <p className="text-sm font-medium text-gray-700">{fund.liquidity}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-0">
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Fund type</span>
                      <span className="text-gray-700 font-medium">{fund.type}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Projected return</span>
                      <span className="text-gray-700 font-medium">{fund.projected}</span>
                    </div>
                    {justInvested ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center">
                        <p className="text-xs font-semibold text-emerald-700">Investment confirmed!</p>
                        <p className="text-[10px] text-emerald-600">You'll see it in your portfolio shortly.</p>
                      </div>
                    ) : (
                      <button
                        className="w-full bg-violet-600 text-white text-xs font-semibold py-2.5 rounded-lg active:bg-violet-700 transition-colors mt-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setInvested(i)
                          onEvent({ type: 'transaction', label: `Invested in ${fund.name}`, detail: `${fund.risk} risk, ${fund.rate}`, time: now() })
                          setTimeout(() => setInvested(null), 3000)
                        }}
                      >Invest in {fund.name}</button>
                    )}
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
