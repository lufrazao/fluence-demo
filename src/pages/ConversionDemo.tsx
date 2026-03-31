import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PhoneFrame from '../components/phone/PhoneFrame';
import FintechDemo from '../components/phone/FintechDemo';
import EcommerceDemo from '../components/phone/EcommerceDemo';
import FluencePanel from '../components/panel/FluencePanel';
import { computeSignals, SIGNAL_THRESHOLD } from '../simulation/computeSignals';
import { FINTECH_SIGNALS, FINTECH_TRAITS, FINTECH_PATTERNS, FINTECH_MEMORY, FINTECH_API_OUTPUT } from '../data/fintech';
import { ECOMMERCE_SIGNALS, ECOMMERCE_TRAITS, ECOMMERCE_PATTERNS, ECOMMERCE_MEMORY, ECOMMERCE_API_OUTPUT } from '../data/ecommerce';
import { useSimulation } from '../context/SimulationContext';
import type { AppEvent, VisibleTrait, VisiblePattern } from '../types/simulation';
import type { Product } from '../components/phone/screens/ShopHome';
import type { CartItem } from '../components/phone/screens/CartScreen';

type DemoType = 'fintech' | 'ecommerce';

const DEMO_CONFIG = {
  fintech: { signals: FINTECH_SIGNALS, traits: FINTECH_TRAITS, patterns: FINTECH_PATTERNS, memory: FINTECH_MEMORY, apiOutput: FINTECH_API_OUTPUT },
  ecommerce: { signals: ECOMMERCE_SIGNALS, traits: ECOMMERCE_TRAITS, patterns: ECOMMERCE_PATTERNS, memory: ECOMMERCE_MEMORY, apiOutput: ECOMMERCE_API_OUTPUT },
};

const ConversionDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoType>('fintech');

  // Per-demo isolated events
  const [fintechEvents, setFintechEvents] = useState<AppEvent[]>([]);
  const [ecommerceEvents, setEcommerceEvents] = useState<AppEvent[]>([]);

  // Per-demo isolated screen state
  const [fintechScreen, setFintechScreen] = useState('home');
  const [ecommerceScreen, setEcommerceScreen] = useState('home');

  // E-commerce specific state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [fluenceEnabled, setFluenceEnabled] = useState(true);
  const { updateProfile } = useSimulation();

  // Active demo's events
  const events = activeDemo === 'fintech' ? fintechEvents : ecommerceEvents;
  const setEvents = activeDemo === 'fintech' ? setFintechEvents : setEcommerceEvents;
  const config = DEMO_CONFIG[activeDemo];

  const handleEvent = useCallback((event: AppEvent) => {
    setEvents(prev => [...prev, event]);
  }, [setEvents]);

  const { traitPoints, patternPoints } = useMemo(
    () => computeSignals(events, config.signals),
    [events, config.signals]
  );

  const visibleTraits: VisibleTrait[] = useMemo(() => {
    return Object.entries(config.traits)
      .filter(([key]) => Math.abs(traitPoints[key] || 0) >= SIGNAL_THRESHOLD)
      .map(([key, def]) => {
        const points = traitPoints[key] || 0;
        const confidence = Math.min(Math.abs(points) / def.maxPoints, 0.99);
        const label = points < 0 && def.labelNegative ? def.labelNegative : def.label;
        return { key, label, confidence };
      })
      .sort((a, b) => b.confidence - a.confidence);
  }, [traitPoints, config.traits]);

  const visiblePatterns: VisiblePattern[] = useMemo(() => {
    return Object.entries(config.patterns)
      .filter(([key]) => (patternPoints[key] || 0) >= SIGNAL_THRESHOLD)
      .map(([key, def]) => ({ key, ...def }));
  }, [patternPoints, config.patterns]);

  const detectedPatterns = useMemo(
    () => new Set(visiblePatterns.map(p => p.key)),
    [visiblePatterns]
  );

  // Sync profile to SimulationContext for Comparativo / Impacto pages
  useEffect(() => {
    updateProfile({ visibleTraits, visiblePatterns, detectedPatternKeys: detectedPatterns, events, activeDemo });
  }, [visibleTraits, visiblePatterns, detectedPatterns, events, activeDemo, updateProfile]);

  const handleReset = () => {
    setEvents([]);
    if (activeDemo === 'fintech') {
      setFintechScreen('home');
    } else {
      setEcommerceScreen('home');
      setSelectedProduct(null);
      setCart([]);
    }
  };

  const handleDemoSwitch = (demo: DemoType) => {
    if (demo === activeDemo) return;
    setActiveDemo(demo);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white">Demo Interativo</h1>

          {/* Demo switcher pills */}
          <div className="flex bg-white/5 rounded-full p-0.5 border border-white/10">
            <button
              onClick={() => handleDemoSwitch('fintech')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeDemo === 'fintech'
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              NeoBank
            </button>
            <button
              onClick={() => handleDemoSwitch('ecommerce')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeDemo === 'ecommerce'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ShopFlow
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-gray-400">{fluenceEnabled ? 'Fluence ON' : 'Fluence OFF'}</span>
            <button
              onClick={() => setFluenceEnabled(!fluenceEnabled)}
              className={`relative w-10 h-5 rounded-full transition-colors ${fluenceEnabled ? 'bg-teal-500' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${fluenceEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
          {events.length > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded border border-white/10 hover:border-white/20"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main content: Phone + Panel */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Phone — scaled to fit viewport */}
        <div className="flex items-start justify-center p-4 flex-shrink-0">
          <div className="origin-top-left scale-[0.72] xl:scale-[0.82] 2xl:scale-90">
            <PhoneFrame>
              {activeDemo === 'fintech' ? (
                <FintechDemo
                  fluenceEnabled={fluenceEnabled}
                  onEvent={handleEvent}
                  screen={fintechScreen}
                  onScreenChange={setFintechScreen}
                />
              ) : (
                <EcommerceDemo
                  fluenceEnabled={fluenceEnabled}
                  onEvent={handleEvent}
                  screen={ecommerceScreen}
                  onScreenChange={setEcommerceScreen}
                  selectedProduct={selectedProduct}
                  onSelectProduct={setSelectedProduct}
                  cart={cart}
                  setCart={setCart}
                />
              )}
            </PhoneFrame>
          </div>
        </div>

        {/* Fluence Panel */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <FluencePanel
            events={events}
            traits={visibleTraits}
            patterns={visiblePatterns}
            detectedPatterns={detectedPatterns}
            apiOutput={config.apiOutput}
            memory={config.memory}
            patternPoints={patternPoints}
          />
        </div>
      </div>

      {/* Bottom hint + footer */}
      <div className="flex-shrink-0 px-6 py-2 border-t border-white/5 text-center">
        <p className="text-xs text-gray-500">
          {activeDemo === 'fintech'
            ? 'Interaja com o app bancario para ver a Fluence capturando comportamento em tempo real'
            : 'Navegue pela loja para ver a Fluence capturando sinais de compra em tempo real'}
        </p>
        <p className="text-[10px] text-gray-600 mt-1">Fluence 2026, Todos os Direitos Reservados</p>
      </div>
    </div>
  );
};

export default ConversionDemo;
