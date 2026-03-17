import { useState, useMemo } from 'react'
import PhoneFrame from './components/PhoneFrame'
import FluencePanel from './components/FluencePanel'
import FintechDemo from './components/demos/fintech/FintechDemo'
import TravelDemo from './components/demos/travel/TravelDemo'
import EcommerceDemo from './components/demos/ecommerce/EcommerceDemo'

import { FINTECH_METRICS, FINTECH_PATTERNS, FINTECH_TRAITS, FINTECH_SIGNALS, FINTECH_API_OUTPUT, FINTECH_MEMORY } from './data/fintech'
import { TRAVEL_METRICS, TRAVEL_PATTERNS, TRAVEL_TRAITS, TRAVEL_SIGNALS, TRAVEL_API_OUTPUT, TRAVEL_MEMORY } from './data/travel'
import { ECOMMERCE_METRICS, ECOMMERCE_PATTERNS, ECOMMERCE_TRAITS, ECOMMERCE_SIGNALS, ECOMMERCE_API_OUTPUT, ECOMMERCE_MEMORY } from './data/ecommerce'

const SIGNAL_THRESHOLD = 2

const VERTICALS = {
  fintech: {
    id: 'fintech',
    label: 'NeoBank',
    icon: '🏦',
    gradient: 'from-gray-50 to-gray-100',
    metrics: FINTECH_METRICS,
    patterns: FINTECH_PATTERNS,
    traits: FINTECH_TRAITS,
    signals: FINTECH_SIGNALS,
    apiOutput: FINTECH_API_OUTPUT,
    memory: FINTECH_MEMORY,
  },
  travel: {
    id: 'travel',
    label: 'WanderGo',
    icon: '✈️',
    comingSoon: true,
    gradient: 'from-gray-50 to-blue-50',
    metrics: TRAVEL_METRICS,
    patterns: TRAVEL_PATTERNS,
    traits: TRAVEL_TRAITS,
    signals: TRAVEL_SIGNALS,
    apiOutput: TRAVEL_API_OUTPUT,
    memory: TRAVEL_MEMORY,
  },
  ecommerce: {
    id: 'ecommerce',
    label: 'ShopFlow',
    icon: '🛒',
    gradient: 'from-gray-50 to-orange-50',
    metrics: ECOMMERCE_METRICS,
    patterns: ECOMMERCE_PATTERNS,
    traits: ECOMMERCE_TRAITS,
    signals: ECOMMERCE_SIGNALS,
    apiOutput: ECOMMERCE_API_OUTPUT,
    memory: ECOMMERCE_MEMORY,
  },
}

function computeSignals(events, signalRules) {
  const traitPoints = {}
  const patternPoints = {}
  for (const event of events) {
    for (const rule of signalRules) {
      if (event.type !== rule.match.type) continue
      if (rule.match.labelIncludes && !event.label?.toLowerCase().includes(rule.match.labelIncludes.toLowerCase())) continue
      if (rule.match.detailIncludes && !event.detail?.toLowerCase().includes(rule.match.detailIncludes.toLowerCase())) continue
      for (const [key, val] of Object.entries(rule.traits || {})) {
        traitPoints[key] = (traitPoints[key] || 0) + val
      }
      for (const [key, val] of Object.entries(rule.patterns || {})) {
        patternPoints[key] = (patternPoints[key] || 0) + val
      }
    }
  }
  return { traitPoints, patternPoints }
}

export default function App() {
  const [activeVertical, setActiveVertical] = useState('fintech')
  const [eventsByVertical, setEventsByVertical] = useState({ fintech: [], travel: [], ecommerce: [] })
  const [screenByVertical, setScreenByVertical] = useState({ fintech: 'home', travel: 'search', ecommerce: 'home' })

  // Ecommerce state
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])

  const v = VERTICALS[activeVertical]
  const events = eventsByVertical[activeVertical]
  const currentScreen = screenByVertical[activeVertical]

  const handleEvent = (event) => {
    setEventsByVertical(prev => ({
      ...prev,
      [activeVertical]: [event, ...prev[activeVertical]].slice(0, 50),
    }))
  }

  const setCurrentScreen = (screen) => {
    setScreenByVertical(prev => ({ ...prev, [activeVertical]: screen }))
  }

  // Signal detection
  const { traitPoints, patternPoints } = useMemo(
    () => computeSignals(events, v.signals),
    [events, v.signals]
  )

  // Dynamic confidence: compute from accumulated points / maxPoints ceiling
  const visibleTraits = useMemo(
    () => Object.entries(v.traits)
      .filter(([key]) => Math.abs(traitPoints[key] || 0) >= SIGNAL_THRESHOLD)
      .map(([key, trait]) => {
        const points = traitPoints[key] || 0
        return {
          ...trait,
          label: points < 0 && trait.labelNegative ? trait.labelNegative : trait.label,
          confidence: trait.maxPoints
            ? Math.min(Math.abs(points) / trait.maxPoints, 0.99)
            : trait.confidence || 0.5,
        }
      }),
    [v.traits, traitPoints]
  )

  const visiblePatterns = useMemo(
    () => Object.entries(v.patterns)
      .filter(([key]) => (patternPoints[key] || 0) >= SIGNAL_THRESHOLD)
      .map(([, pattern]) => pattern),
    [v.patterns, patternPoints]
  )

  const detectedPatternKeys = useMemo(
    () => new Set(
      Object.keys(v.patterns).filter(key => (patternPoints[key] || 0) >= SIGNAL_THRESHOLD)
    ),
    [v.patterns, patternPoints]
  )

  const demoProps = {
    fluenceEnabled: false,
    onEvent: handleEvent,
    screen: currentScreen,
    onScreenChange: setCurrentScreen,
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Fluence"
            className="w-8 h-8 rounded-xl shadow-lg shadow-teal-500/30"
          />
          <span className="text-lg font-bold tracking-tight">Fluence</span>
          <span className="text-xs text-gray-500 ml-1">Behavioral Intelligence Platform</span>
        </div>

        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {Object.values(VERTICALS).map(vert => (
            <button
              key={vert.id}
              onClick={() => !vert.comingSoon && setActiveVertical(vert.id)}
              disabled={vert.comingSoon}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                vert.comingSoon
                  ? 'text-gray-600 cursor-not-allowed opacity-50'
                  : activeVertical === vert.id
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <span>{vert.icon}</span>
              <span>{vert.label}</span>
              {vert.comingSoon && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-500 ml-1">Soon</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content: phone + intelligence panel */}
      <div className="flex-1 flex items-start justify-center gap-8 p-6 overflow-y-auto">
        {/* Phone — the app as users experience it */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live App</span>
          </div>
          <PhoneFrame gradient={v.gradient}>
            {activeVertical === 'fintech' && <FintechDemo key="fintech" {...demoProps} />}
            {activeVertical === 'travel' && <TravelDemo key="travel" {...demoProps} />}
            {activeVertical === 'ecommerce' && (
              <EcommerceDemo
                key="ecommerce"
                {...demoProps}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
                cart={cart}
                setCart={setCart}
              />
            )}
          </PhoneFrame>
        </div>

        {/* Fluence Intelligence Panel */}
        <div className="flex-1 max-w-4xl min-w-[640px]">
          <FluencePanel
            events={events}
            traits={visibleTraits}
            patterns={visiblePatterns}
            metrics={v.metrics}
            detectedPatterns={detectedPatternKeys}
            apiOutput={v.apiOutput}
            memory={v.memory}
            patternPoints={patternPoints}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-3">
        <p className="text-xs text-gray-600">
          Interact with the app to see how Fluence captures behavior and generates actionable intelligence for companies
        </p>
      </div>
    </div>
  )
}
