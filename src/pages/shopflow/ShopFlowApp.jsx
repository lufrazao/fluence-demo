// ShopFlow demo shell — tab navigation between demo pages
import { useState } from 'react'
import { motion } from 'framer-motion'
import LiveDemo from './LiveDemo'
import Personas from './Personas'
import HowItWorks from './HowItWorks'
import Impact from './Impact'

const TABS = [
  { id: 'demo', label: 'Demo ao Vivo', icon: '▶' },
  { id: 'personas', label: 'Personas', icon: '👥' },
  { id: 'how', label: 'Como Funciona', icon: '⚙️' },
  { id: 'impact', label: 'Impacto', icon: '📊' },
]

const PAGES = {
  demo: LiveDemo,
  personas: Personas,
  how: HowItWorks,
  impact: Impact,
}

export default function ShopFlowApp({ onBack }) {
  const [activeTab, setActiveTab] = useState('demo')
  const Page = PAGES[activeTab]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-300 text-sm mr-2"
            >
              ←
            </button>
          )}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-orange-500/30">
            S
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">ShopFlow</span>
            <span className="text-xs text-gray-500 ml-2">by Fluence</span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Page content */}
      <Page />
    </div>
  )
}
